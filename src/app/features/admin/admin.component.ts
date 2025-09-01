import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { TodoService } from '../todos/services/todo.service';
import { User } from '../auth/models/user.model';
import { Todo } from '../todos/models/todo.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Interface d'Administration</h1>
        <p class="text-gray-600 mt-2">Gérez les utilisateurs et les tickets</p>
      </div>

      <!-- Navigation Admin -->
      <div class="mb-8">
        <nav class="flex space-x-4">
          <button
            (click)="activeTab.set('users')"
            [class.bg-blue-600]="activeTab() === 'users'"
            [class.text-white]="activeTab() === 'users'"
            [class.text-gray-700]="activeTab() !== 'users'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Utilisateurs
          </button>
          <button
            (click)="activeTab.set('tickets')"
            [class.bg-blue-600]="activeTab() === 'tickets'"
            [class.text-white]="activeTab() === 'tickets'"
            [class.text-gray-700]="activeTab() !== 'tickets'"
            class="px-4 py-2 rounded-md font-medium hover:bg-blue-700 hover:text-white transition-colors"
          >
            Tickets
          </button>
        </nav>
      </div>

      <!-- Onglet Utilisateurs -->
      <div *ngIf="activeTab() === 'users'" class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
        </div>
        <div class="p-6">
          <div *ngIf="users().length > 0; else noUsers">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users()">
                  <td>{{ user.name }} ({{ user.email }})</td>
                  <td>{{ user.role | titlecase }}</td>
                  <td>
                    <button
                      *ngIf="user.role !== 'admin'"
                      (click)="deleteUser(user.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                    <span *ngIf="user.role === 'admin'" class="text-gray-400">Admin protégé</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noUsers>
            <p class="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
          </ng-template>
        </div>
      </div>

      <!-- Onglet Tickets -->
      <div *ngIf="activeTab() === 'tickets'" class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Gestion des Tickets</h2>
        </div>
        <div class="p-6">
          <div *ngIf="todos().length > 0; else noTodos">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th>Ticket</th>
                  <th>Statut</th>
                  <th>Priorité</th>
                  <th>Assigné à</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let todo of todos()">
                  <td>{{ todo.title }}</td>
                  <td>{{ todo.status | titlecase }}</td>
                  <td>{{ todo.priority | titlecase }}</td>
                  <td>{{ todo.assignedTo || 'Non assigné' }}</td>
                  <td>
                    <button
                      (click)="deleteTodo(todo.id)"
                      class="text-red-600 hover:text-red-900 mr-3"
                    >
                      Supprimer
                    </button>
                    <button (click)="assignTodo(todo)" class="text-blue-600 hover:text-blue-900">
                      Assigner
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noTodos>
            <p class="text-gray-500 text-center py-8">Aucun ticket trouvé</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private todoService = inject(TodoService);
  private router = inject(Router);

  activeTab = signal<'users' | 'tickets'>('users');
  users = signal<User[]>([]);
  todos = signal<Todo[]>([]);

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser(); // 🔹 await
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/todos']);
      return;
    }

    await this.loadUsers();
    await this.loadTodos();
  }

  async loadUsers() {
    try {
      const users = await this.authService.getAllUsers();
      this.users.set(users);
    } catch (err) {
      console.error('Erreur loadUsers:', err);
    }
  }

  async loadTodos() {
    try {
      const todos = await this.todoService.getAllTodos();
      this.todos.set(todos);
    } catch (err) {
      console.error('Erreur loadTodos:', err);
    }
  }

  async deleteUser(userId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      const success = await this.authService.deleteUser(userId);
      if (success) await this.loadUsers();
    } catch (err) {
      console.error('Erreur deleteUser:', err);
    }
  }

  async deleteTodo(todoId: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ?')) return;
    try {
      const success = await this.todoService.deleteTodo(todoId);
      if (success) await this.loadTodos();
    } catch (err) {
      console.error('Erreur deleteTodo:', err);
    }
  }

  assignTodo(todo: Todo) {
    console.log('Assigner le ticket:', todo);
    // TODO: ajouter logique assignation
  }
}
