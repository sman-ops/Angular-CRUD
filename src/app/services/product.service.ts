import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ! : cette variable n'est pas encore initialisée
  private products!: Array<Product>;

  constructor() {
    this.products = [
      { id: UUID.UUID(), name: 'Computer', price: 6500, promotion: true },
      { id: UUID.UUID(), name: 'Pinter', price: 6000, promotion: false },
      { id: UUID.UUID(), name: 'Smarphone', price: 5500, promotion: true },
    ];
    for (let i = 0; i < 10; i++) {
      this.products.push({
        id: UUID.UUID(),
        name: 'Computer',
        price: 6500,
        promotion: true,
      });
      this.products.push({
        id: UUID.UUID(),
        name: 'Pinter',
        price: 6000,
        promotion: false,
      });
      this.products.push({
        id: UUID.UUID(),
        name: 'Computer',
        price: 6500,
        promotion: true,
      });
    }
  }
  // return an object de type Observable contain array of products
  public getAllProducts(): Observable<Product[]> {
    // return an object de type observable
    return of(this.products);
  }
  public getPageProducts(page: number, size: number): Observable<PageProduct> {
    let index = page * size;
    let totalPages = ~~(this.products.length / size);
    if (this.products.length % size != 0) totalPages++;
    let pageProducts = this.products.slice(index, index + size);
    return of({
      page: page,
      size: size,
      totalPages: totalPages,
      products: pageProducts,
    });
  }

  public deleteProduct(id: string): Observable<boolean> {
    this.products = this.products.filter((p) => p.id != id);
    return of(true);
  }

  public setPromotion(id: string): Observable<boolean> {
    let product = this.products.find((p) => p.id === id);
    if (product != undefined) {
      product.promotion = !product.promotion;
      return of(true);
    } else return throwError(() => new Error('Porduct not found'));
  }
  // return an object observable contain list of product
  public searchProduct(
    keyword: string,
    page: number,
    size: number
  ): Observable<PageProduct> {
    let result = this.products.filter((p) => p.name.includes(keyword));
    let index = page * size;
    let totalPages = ~~(result.length / size);
    if (this.products.length % size != 0) totalPages++;
    let pageProducts = result.slice(index, index + size);
    return of({
      page: page,
      size: size,
      totalPages: totalPages,
      products: pageProducts,
    });
  }

  public addNewProduct(product: Product): Observable<Product> {
    // genérateur aléatoire
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
  }

  public getProduct(id: string): Observable<Product> {
    let product = this.products.find((p) => p.id === id);
    if (product === undefined)
      return throwError(() => new Error('Product not found'));
    return of(product);
  }

  getErrorMessage(filedName: string, error: ValidationErrors) {
    if (error['required']) {
      return filedName + 'is required';
    } else if (error['minlength']) {
      return (
        filedName +
        'should have at least' +
        error['minlength']['requiredLength'] +
        'characters'
      );
    } else return '';
  }

  public updateProduct(product: Product): Observable<Product> {
    this.products = this.products.map((p) =>
      p.id === product.id ? product : p
    );
    return of(product);
  }
}
