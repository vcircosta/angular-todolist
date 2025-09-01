// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  private returnUrl: string = '/todos'; // valeur par défaut

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, // 🔹 pour récupérer returnUrl
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // 🔹 Récupérer le returnUrl depuis les query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/todos';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.errors?.['required']) return 'Ce champ est requis';
    if (control?.errors?.['email']) return 'Email invalide';
    if (control?.errors?.['minlength']) return 'Mot de passe trop court (6 caractères minimum)';
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (user) => {
        this.loading = false;
        this.authService.setCurrentUser(user);

        // 🔹 Redirection après login vers returnUrl
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message || 'Échec de la connexion';
      },
    });
  }
}
