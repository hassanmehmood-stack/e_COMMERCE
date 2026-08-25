import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../models/products.type';
import { CartService } from '../../services/cart';

@Component({

  selector: 'app-products',

  standalone: true,

  imports: [],

  templateUrl: './products.html',

  styleUrl: './products.scss',

})

export class Products {


  private productService = inject(ProductService);
  private cartService = inject(CartService);


  products = signal<Product[]>([]);
  successMessage = signal('');

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.successMessage.set('Product added to cart');
    setTimeout(() => this.successMessage.set(''), 3500);
  }



  async ngOnInit() {

    const data = await this.productService.getProducts();

    this.products.set(data);

    console.log(
      "Products:",
      this.products()
    );

  }


}