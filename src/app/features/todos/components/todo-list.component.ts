import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, HighlightDirective],
  templateUrl: './todo-list.component.html',
  styles: [],
})
export class TodoListComponent implements OnInit {
  todos = signal<Todo[]>([]);
  loading = signal(true);
  addingTodo = signal(false);

  statuses: Todo['status'][] = ['todo', 'in-progress', 'done'];

  newTodo = {
    title: '',
    description: '',
    priority: 'medium' as const,
  };

  constructor(private todoService: TodoService) {}

  async ngOnInit() {
    await this.loadTodos();
  }

  async loadTodos() {
    try {
      this.loading.set(true);
      const todos = await this.todoService.getAllTodos();
      this.todos.set(todos);
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async addTodo() {
    if (!this.newTodo.title.trim()) return;

    this.addingTodo.set(true);
    try {
      await this.todoService.createTodo({ ...this.newTodo });
      await this.loadTodos();
      this.newTodo.title = '';
      this.newTodo.description = '';
    } catch (error) {
      console.error("Erreur lors de l'ajout du todo:", error);
    } finally {
      this.addingTodo.set(false);
    }
  }

  async updateStatus(id: number, status: Todo['status']) {
    try {
      await this.todoService.updateTodo(id, { status });
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.todoService.deleteTodo(id);
      await this.loadTodos();
    } catch (error) {
      console.error('Erreur lors de la suppression du todo:', error);
    }
  }

  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter((todo) => todo.status === status);
  }

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }
}
