import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 🔹 Signal public pour le template
  public currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  private users: User[] = [];
  private passwords: { [key: string]: string } = {};

  constructor() {
    // 🔹 Charger les utilisateurs depuis localStorage ou initialiser avec les mocks
    const savedUsers = localStorage.getItem('users');
    const savedPasswords = localStorage.getItem('passwords');

    if (savedUsers && savedPasswords) {
      this.users = JSON.parse(savedUsers);
      this.passwords = JSON.parse(savedPasswords);
    } else {
      // utilisateurs de test initiaux
      this.users = [
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        { id: 2, name: 'Normal User', email: 'user@example.com', role: 'user' },
      ];
      this.passwords = {
        'admin@example.com': 'admin123',
        'user@example.com': 'user123',
      };
      this.syncLocalStorage();
    }

    // 🔹 Charger l'utilisateur connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      this.setCurrentUser(user);
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user',
    };

    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;

    this.syncLocalStorage();
    this.setCurrentUser(newUser);

    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // 🔹 Synchronise users et passwords avec localStorage
  private syncLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('passwords', JSON.stringify(this.passwords));
  }

  // 🔹 Récupérer l'utilisateur connecté (synchrone ou async)
  async getCurrentUser(): Promise<User | null> {
    // Simuler un petit délai
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.currentUser();
  }

  // 🔹 Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...this.users]; // retourner une copie
  }

  // 🔹 Supprimer un utilisateur par ID
  async deleteUser(userId: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) return false;

    // Empêcher de supprimer un admin
    if (this.users[index].role === 'admin') return false;

    const userEmail = this.users[index].email; // 🔹 stocker avant splice
    this.users.splice(index, 1);
    delete this.passwords[userEmail];

    this.syncLocalStorage();
    return true;
  }
}
