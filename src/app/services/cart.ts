import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/products.type';
import { CartItem } from '../models/cart-item.type';

@Injectable({ providedIn: 'root' })

export class CartService {
  private readonly storageKey = 'cart';

  readonly cartItems = signal<CartItem[]>([]);
  
  readonly totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0)
  );
  readonly isOpen = signal(false);

  constructor() {
    this.cartItems.set(this.loadCart());
  }

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
    this.saveCart();
  }

  removeFromCart(productId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== productId));
    this.saveCart();
  }

  increaseQuantity(productId: string): void {
    this.cartItems.update(items => items.map(item => item.id === productId
      ? { ...item, quantity: item.quantity + 1 }
      : item
    ));
    this.saveCart();
  }

  decreaseQuantity(productId: string): void {
    this.cartItems.update(items => items.flatMap(item => {
      if (item.id !== productId) return [item];
      return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
    }));
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems.set([]);

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.warn('Unable to clear cart storage:', error);
    }
  }

  openCart(): void { this.isOpen.set(true); }
  closeCart(): void { this.isOpen.set(false); }

  private loadCart(): CartItem[] {
    try {
      if (typeof localStorage === 'undefined') {
        return [];
      }

      const storedCart = localStorage.getItem(this.storageKey);

      if (!storedCart) {
        return [];
      }

      const parsedCart: unknown = JSON.parse(storedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart.filter((item): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.image === 'string' &&
        typeof item.price === 'number' &&
        Number.isFinite(item.price) &&
        typeof item.quantity === 'number' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
      );
    } catch (error) {
      console.warn('Unable to restore cart from storage:', error);
      return [];
    }
  }

  private saveCart(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems()));
      }
    } catch (error) {
      console.warn('Unable to save cart to storage:', error);
    }
  }
}
