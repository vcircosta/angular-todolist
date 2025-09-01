import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { adminRoutes } from './admin.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(adminRoutes), AdminDashboardComponent],
})
export class AdminModule {}
