import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { ErrorService } from '../../../shared/services/error.service';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, HighlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-list.component.html',
  styles: [],
})
export class TodoListComponent {
  todoService = inject(TodoService);
  errorService = inject(ErrorService);

  newTodo = { title: '', description: '', priority: 'medium' as const };
  addingTodo = false;
  loading = true;

  statuses = ['todo', 'in-progress', 'done'] as const;

  constructor() {
    this.loadTodos();
  }

  async loadTodos() {
    this.loading = true;
    try {
      await this.todoService.getAllTodos();
    } catch {
      this.errorService.showError('Impossible de charger les todos.');
    } finally {
      this.loading = false;
    }
  }

  async addTodo() {
    if (!this.newTodo.title.trim()) return;

    this.addingTodo = true;
    try {
      await this.todoService.createTodo({ ...this.newTodo });
      this.newTodo = { title: '', description: '', priority: 'medium' };
    } catch {
      this.errorService.showError('Impossible d’ajouter le todo.');
    } finally {
      this.addingTodo = false;
    }
  }

  async updateStatus(id: number, status: 'todo' | 'in-progress' | 'done') {
    try {
      await this.todoService.updateTodo(id, { status });
      await this.loadTodos();
    } catch {
      this.errorService.showError('Impossible de mettre à jour le statut.');
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.todoService.deleteTodo(id);
      await this.loadTodos();
    } catch {
      this.errorService.showError('Impossible de supprimer le todo.');
    }
  }

  trackByTodoId(index: number, todo: Todo): string {
    return todo.id.toString();
  }
}
