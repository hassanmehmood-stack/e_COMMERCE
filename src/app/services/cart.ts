import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/products.type';
import { CartItem } from '../models/cart-item.type';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly cartItems = signal<CartItem[]>([]);
  readonly totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0)
  );
  readonly isOpen = signal(false);

  addToCart(product: Product): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);

      if (existingItem) {
        return items.map(item => item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }

      return [...items, {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1
      }];
    });
  }

  removeFromCart(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
  }

  increaseQuantity(productId: string): void {
    this.cartItems.update(items => items.map(item => item.id === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item
    ));
  }

  decreaseQuantity(productId: string): void {
    this.cartItems.update(items => items.flatMap(item => {
      if (item.id !== productId) return [item];
      return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
    }));
  }

  openCart(): void { this.isOpen.set(true); }
  closeCart(): void { this.isOpen.set(false); }
}
