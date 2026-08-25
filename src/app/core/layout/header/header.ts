import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../services/cart';

@Component({
  imports: [RouterLink,RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  readonly cartService = inject(CartService);

  openCart(): void {
    this.cartService.openCart();
  }
}
