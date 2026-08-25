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
  deletingProductId = signal<string | null>(null);
  successMessage = signal('');
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

  async deleteProduct(id: string): Promise<void> {
    const confirmed = window.confirm('Are you sure you want to delete this product?');

    if (!confirmed) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');
    this.deletingProductId.set(id);

    try {
      await this.productService.deleteProduct(id);
      this.products.update(products => products.filter(product => product.id !== id));
      this.successMessage.set('Product deleted successfully');
      setTimeout(() => this.successMessage.set(''), 3500);
    } catch (error) {
      console.error('Delete product error:', error);
      this.errorMessage.set('Unable to delete this product right now.');
    } finally {
      this.deletingProductId.set(null);
    }
  }
}