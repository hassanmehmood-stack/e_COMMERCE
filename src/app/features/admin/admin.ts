import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/products.type';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin implements OnInit {
  private readonly productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  async ngOnInit(): Promise<void> {
    try {
      this.products.set(await this.productService.getProducts());
    } catch (error) {
      console.error('Load products error:', error);
      this.errorMessage.set('Unable to load products right now.');
    } finally {
      this.isLoading.set(false);
    }
  }
}