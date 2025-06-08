import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  currentStep: 'email' | 'password' = 'email';
  userEmail = '';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {}

  onEmailSubmit(): void {
    if (this.loginForm.get('email')?.valid) {
      this.userEmail = this.loginForm.get('email')?.value;
      this.currentStep = 'password';
    }
  }

  onPasswordSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // Simulate login process
      setTimeout(() => {
        this.isLoading = false;
        console.log('Login successful', this.loginForm.value);
        // Handle successful login here
      }, 2000);
    }
  }

  onBackToEmail(): void {
    this.currentStep = 'email';
    this.loginForm.get('password')?.reset();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onGoogleLogin(): void {
    this.isLoading = true;
    
    // Simulate Google login process
    setTimeout(() => {
      this.isLoading = false;
      console.log('Google login successful');
      // Handle Google login here
    }, 2000);
  }

  onBackToRegister(): void {
    // Navigate to register page
    console.log('Navigate to register');
  }

  onForgotPassword(): void {
    // Handle forgot password
    console.log('Forgot password clicked');
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}