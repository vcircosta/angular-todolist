import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- ajouter
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">TodoList App</h1>
        <nav>
          <ul class="flex space-x-4">
            <ng-container *ngIf="authService.currentUser() as user; else guestLinks">
              <li><a routerLink="/todos" class="hover:text-blue-200">Todos</a></li>
              <li *ngIf="user.role === 'admin'">
                <a routerLink="/admin" class="hover:text-blue-200">Admin</a>
              </li>
              <li>
                <button (click)="logout()" class="hover:text-blue-200">Logout</button>
              </li>
            </ng-container>

            <ng-template #guestLinks>
              <li><a routerLink="/auth/login" class="hover:text-blue-200">Login</a></li>
              <li><a routerLink="/auth/register" class="hover:text-blue-200">Register</a></li>
            </ng-template>
          </ul>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
