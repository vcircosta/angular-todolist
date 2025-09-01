import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser(); // 🔹 await
    if (user?.role === 'admin') return true;

    this.router.navigate(['/todos']);
    return false;
  }
}
