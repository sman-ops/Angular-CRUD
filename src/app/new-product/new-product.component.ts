import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  productFormGroup!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productFormGroup = this.fb.group({
      name: this.fb.control(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
      price: this.fb.control(null, [Validators.required]),
      promotion: this.fb.control(null, [Validators.required]),
    });
  }
  handleAddProduct() {
    // to get the value from the inputs
    // console.log(this.productFormGroup.value);
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
}
