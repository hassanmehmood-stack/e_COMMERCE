import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss'
})
export class EditProduct implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  private productId = '';

  readonly productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    image: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  async ngOnInit(): Promise<void> {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.productId) {
      await this.router.navigate(['/admin']);
      return;
    }

    try {
      const product = await this.productService.getProduct(this.productId);

      if (!product) {
        this.errorMessage.set('Product not found.');
        return;
      }

      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock,
        description: product.description
      });
    } catch (error) {
      console.error('Load product error:', error);
      this.errorMessage.set('Unable to load this product right now.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateProduct(): Promise<void> {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.productForm.invalid || !this.productId) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    try {
      const product = this.productForm.getRawValue();
      await this.productService.updateProduct(this.productId, {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock)
      });

      this.successMessage.set('Product updated successfully');
      setTimeout(() => this.router.navigate(['/admin']), 1200);
    } catch (error) {
      console.error('Update product error:', error);
      this.errorMessage.set('Unable to update this product right now.');
    } finally {
      this.isSaving.set(false);
    }
  }

  get f() {
    return this.productForm.controls;
  }
}
