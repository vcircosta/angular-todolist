import { Injectable, signal, computed, effect } from '@angular/core';
import { Todo, CreateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Apprendre Angular',
      description: "Étudier les fondamentaux d'Angular 20+",
      status: 'todo',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Créer un projet',
      description: 'Développer une application TodoList',
      status: 'in-progress',
      priority: 'medium',
      createdBy: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: 3,
      title: "Configurer l'environnement",
      description: 'Installer Node.js, Angular CLI et configurer VS Code',
      status: 'done',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-14'),
    },
  ]);

  // --- Signals computed pour filtrer automatiquement ---
  public todosByStatus = computed(() => ({
    todo: this.todos().filter((t) => t.status === 'todo'),
    'in-progress': this.todos().filter((t) => t.status === 'in-progress'),
    done: this.todos().filter((t) => t.status === 'done'),
  }));

  public todosByPriority = computed(() => ({
    high: this.todos().filter((t) => t.priority === 'high'),
    medium: this.todos().filter((t) => t.priority === 'medium'),
    low: this.todos().filter((t) => t.priority === 'low'),
  }));

  public todoStats = computed(() => {
    const allTodos = this.todos();
    const completed = allTodos.filter((t) => t.status === 'done').length;
    return {
      total: allTodos.length,
      completed,
      pending: allTodos.filter((t) => t.status === 'todo').length,
      inProgress: allTodos.filter((t) => t.status === 'in-progress').length,
      highPriority: allTodos.filter((t) => t.priority === 'high').length,
      completionRate: allTodos.length > 0 ? (completed / allTodos.length) * 100 : 0,
    };
  });

  constructor() {
    // --- Effet automatique pour sauvegarder les todos dans localStorage
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
      console.log(`🔄 Todos sauvegardés (${this.todos().length} items)`);
    });

    // Charger les todos depuis localStorage si existants
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos.set(JSON.parse(savedTodos));
    }
  }

  // --- Méthodes CRUD ---
  async getAllTodos(): Promise<Todo[]> {
    return this.todos();
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    return this.todos().find((t) => t.id === id);
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description || '',
      status: 'todo',
      priority: todoData.priority,
      assignedTo: todoData.assignedTo,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.update((current) => [...current, newTodo]);
    return newTodo;
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    let updatedTodo: Todo | undefined;
    this.todos.update((current) =>
      current.map((t) => {
        if (t.id === id) {
          updatedTodo = { ...t, ...updates, updatedAt: new Date() };
          return updatedTodo;
        }
        return t;
      }),
    );
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<boolean> {
    let deleted = false;
    this.todos.update((current) => {
      const filtered = current.filter((t) => t.id !== id);
      deleted = filtered.length < current.length;
      return filtered;
    });
    return deleted;
  }
}
