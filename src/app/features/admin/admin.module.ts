import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { ADMIN_ROUTES } from './admin.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ADMIN_ROUTES), AdminDashboardComponent],
})
export class AdminModule {}
