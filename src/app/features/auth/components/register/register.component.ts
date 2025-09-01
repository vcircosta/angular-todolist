import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  error = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch },
    );
  }

  passwordsMatch(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.errors?.['required']) return 'Ce champ est requis';
    if (control?.errors?.['email']) return 'Email invalide';
    if (control?.errors?.['minlength'])
      return 'Le mot de passe doit contenir au moins 6 caractères';
    if (field === 'confirmPassword' && this.registerForm.errors?.['mismatch'])
      return 'Les mots de passe ne correspondent pas';
    return '';
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading.set(true);
    this.error.set('');

    // Exclure confirmPassword avant l'envoi
    const { confirmPassword, ...userData } = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Échec de l’inscription');
      },
    });
  }
}
