import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isLoading.set(true);

    try {
      const userData = await this.authService.login(email, password);
      
    

      this.successMessage.set('You are successfully logged in!');
      this.loginForm.reset();

      setTimeout(() => {
        if (userData?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      }, 3000);

    } catch (error: any) {
      console.error('Login error:', error);
      const code =
        error?.code ||
        error?.error?.error?.message ||
        error?.error?.message ||
        error?.message ||
        '';

      this.errorMessage.set(this.getFriendlyError(code));
      this.isLoading.set(false);
    }
  }

  private getFriendlyError(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/too-many-requests':
        return 'Too many attempts, please try again later';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters';

      case 'INVALID_LOGIN_CREDENTIALS':
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD':
        return 'Incorrect email or password';
      case 'INVALID_EMAIL':
        return 'Please enter a valid email address';
      case 'USER_DISABLED':
        return 'This account has been disabled';
      case 'EMAIL_EXISTS':
        return 'This email is already registered';
      case 'WEAK_PASSWORD':
        return 'Password must be at least 6 characters';

      default:
        return 'Something went wrong, please try again';
    }
  }

  get f() {
    return this.loginForm.controls;
  }
}