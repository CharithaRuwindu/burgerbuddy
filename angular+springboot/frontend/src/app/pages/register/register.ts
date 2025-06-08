import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  @Output() backToSignIn = new EventEmitter<void>();
  @Output() registrationSuccess = new EventEmitter<string>();

  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return { passwordStrength: true };
    }
    
    return null;
  }

  passwordMatchValidator(form: AbstractControl): { [key: string]: any } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    
    switch (fieldName) {
      case 'name':
        if (errors['required']) return 'Name is required';
        if (errors['minlength']) return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (errors['required']) return 'Email is required';
        if (errors['email']) return 'Please enter a valid email address';
        break;
      case 'password':
        if (errors['required']) return 'Password is required';
        if (errors['minlength']) return 'Password must be at least 8 characters';
        if (errors['passwordStrength']) return 'Password must contain uppercase, lowercase, and number';
        break;
      case 'confirmPassword':
        if (errors['required']) return 'Please confirm your password';
        break;
    }

    // Check form-level password mismatch error
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    const hasError = field ? field.invalid && field.touched : false;
    
    // Also check for password mismatch on confirmPassword field
    if (fieldName === 'confirmPassword') {
      return hasError || (this.registerForm.errors?.['passwordMismatch'] && field?.touched);
    }
    
    return hasError;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.registerForm.value as RegisterFormData;

    // Simulate API call
    setTimeout(() => {
      console.log('Register attempt:', formData);
      this.snackBar.open('Account created successfully! Please check your email for verification code.', 'Close', {
        duration: 5000,
        panelClass: ['success-snackbar']
      });
      this.isLoading = false;
      this.registrationSuccess.emit(formData.email);
    }, 1500);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  onBackToSignIn(): void {
    this.backToSignIn.emit();
  }

  onTermsClick(): void {
    // Handle terms of service click
    console.log('Terms of Service clicked');
  }

  onPrivacyClick(): void {
    // Handle privacy policy click
    console.log('Privacy Policy clicked');
  }
}