import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../model/product.model';
import { AuthentificationService } from '../services/authentification.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  // ! : cette variable n'est pas encore initialisée
  products!: Array<Product>;
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  errorMessage!: string;
  searchFormGroup!: FormGroup;
  currentAction: string = 'all';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    public authService: AuthentificationService,
    private router: Router
  ) {}
  // j'appel la methode getAllprod qui v a me retourné immédiatmeent un objet de type
  // observable  je suis subscribe vers cette objet subscribe ,des que la donnée arrive je la récupere

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null),
    });

    this.handleGetPageProducts();
  }

  handleGetPageProducts() {
    this.productService
      .getPageProducts(this.currentPage, this.pageSize)
      .subscribe({
        // next: tout ce passe bien
        next: (data) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          this.errorMessage = err;
        },
      });
  }

  // handleGetAllProducts() {
  //   this.productService.getAllProducts().subscribe({
  //     // next: tout ce passe bien
  //     next: (data) => {
  //       this.products = data;
  //     },
  //     error: (err) => {
  //       this.errorMessage = err;
  //     },
  //   });
  // }

  handleDeleteProducts(p: Product) {
    let conf = confirm('ar you sure');
    if (conf === false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next: (data) => {
        let index = this.products.indexOf(p);
        this.products.splice(index, 1);
      },
    });
  }

  handleSetPromotion(p: Product) {
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next: (data) => {
        p.promotion = !promo;
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  handleSearchProducts() {
    this.currentAction = 'search';
    this.currentPage = 0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productService
      .searchProduct(keyword, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
        },
      });
  }

  gotoPage(i: number) {
    this.currentPage = i;
    if (this.currentAction != 'all') {
      this.handleSearchProducts();
    } else {
      this.handleGetPageProducts();
    }
  }

  handleNewProduct() {
    this.router.navigateByUrl('/admin/newProduct');
  }

  handleEditProduct(p: Product) {
    this.router.navigateByUrl('/admin/editProduct/' + p.id);
  }
}
