import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'todos',
    canActivate: [authGuard], // 🔹 Protection par AuthGuard
    loadChildren: () => import('./features/todos/todos.module').then((m) => m.TodosModule),
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // 🔹 Protection par AuthGuard + AdminGuard
    loadChildren: () => import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
