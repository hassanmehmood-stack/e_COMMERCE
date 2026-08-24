import { AsyncPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';
import { AuthService } from './services/auth';

@Component({
  imports: [AsyncPipe, RouterOutlet, Footer, Header],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('e-commerce');

  readonly authReady$;

  constructor(private readonly authService: AuthService) {
    this.authReady$ = authService.authReady$;
  }
}
