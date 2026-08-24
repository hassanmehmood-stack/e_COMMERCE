import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { name, email, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords match nahi ho rahe';
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.signup(name, email, password);
      this.router.navigate(['/products']);
    } catch (error: any) {
      this.errorMessage = this.getFriendlyError(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  private getFriendlyError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ye email pehle se register hai';
      case 'auth/invalid-email':
        return 'Email sahi format mein nahi hai';
      case 'auth/weak-password':
        return 'Password kam se kam 6 characters ka hona chahiye';
      default:
        return 'Kuch masla ho gaya, dobara try karo';
    }
  }

  get f() {
    return this.signupForm.controls;
  }
}