import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss'
})
export class CartSidebar {
  readonly cartService = inject(CartService);

  close(): void { this.cartService.closeCart(); }
}
