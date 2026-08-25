import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../services/product';


@Component({

  selector: 'app-add-product',

  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './add-product.html',

  styleUrl: './add-product.scss',

})

export class AddProduct {


  private fb = inject(FormBuilder);

  private productService = inject(ProductService);



  isLoading = signal(false);

  successMessage = signal('');

  errorMessage = signal('');

  productForm = this.fb.nonNullable.group({

  name: [
    '',
    [
      Validators.required,
      Validators.minLength(2)
    ]
  ],

  price: [
    0,
    [
      Validators.required,
      Validators.min(1)
    ]
  ],

  category: [
    '',
    Validators.required
  ],

  image: [
    '',
    Validators.required
  ],

  stock: [
    0,
    [
      Validators.required,
      Validators.min(0)
    ]
  ],

  description: [
    '',
    [
      Validators.required,
      Validators.minLength(10)
    ]
  ]

});






  async onSubmit() {


    this.successMessage.set('');

    this.errorMessage.set('');


    if(this.productForm.invalid){

      this.productForm.markAllAsTouched();

      return;

    }


    this.isLoading.set(true);



    try {


      const productData = this.productForm.value;


      const productId = await this.productService.addProduct({

        name: productData.name!,

        price: Number(productData.price),

        category: productData.category!,

        image: productData.image!,

        stock: Number(productData.stock),

        description: productData.description!

      });



      console.log(
        "Product Added:",
        productId
      );


      this.successMessage.set(
        "Product created successfully"
      );

      setTimeout(() => this.successMessage.set(''), 4000);


      this.productForm.reset();



    } catch(error){


      console.error(
        "Add Product Error:",
        error
      );


      this.errorMessage.set(
        "Something went wrong"
      );


    }
    finally {


      this.isLoading.set(false);


    }


  }



  get f(){

    return this.productForm.controls;

  }


}