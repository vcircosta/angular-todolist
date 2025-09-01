import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TodosRoutes } from './todos.routes';

import { TodoListComponent } from './components/todo-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(TodosRoutes),
    TodoListComponent,
  ],
})
export class TodosModule {}
