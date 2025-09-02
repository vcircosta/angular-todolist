import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // --- Signal pour l'utilisateur courant ---
  public currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();

  // --- Computed signals ---
  public isLoggedIn = computed(() => this.currentUser() !== null);
  public isAdmin = computed(() => this.currentUser()?.role === 'admin');
  public isAuthenticated = computed(() => !!this.getToken());

  // --- Stockage interne ---
  private users: User[] = [];
  private passwords: { [key: string]: string } = {};

  constructor() {
    // Charger les utilisateurs et mots de passe depuis localStorage
    const savedUsers = localStorage.getItem('users');
    const savedPasswords = localStorage.getItem('passwords');

    if (savedUsers && savedPasswords) {
      this.users = JSON.parse(savedUsers);
      this.passwords = JSON.parse(savedPasswords);
    } else {
      // Création d'utilisateurs par défaut
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

    // Charger l'utilisateur courant si présent
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) this.currentUser.set(JSON.parse(savedUser));

    // --- Effet pour synchroniser currentUser automatiquement ---
    effect(() => {
      if (this.currentUser()) {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser()));
      } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    });
  }

  // --- Authentification ---
  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find((u) => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      this.setCurrentUser(user);
      this.generateToken(user);
      return of(user).pipe(delay(500));
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) return throwError(() => new Error('Cet email est déjà utilisé'));

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
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    this.generateToken(user);
  }

  private generateToken(user: User) {
    const token = btoa(`${user.email}:${new Date().getTime()}`);
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- Gestion des utilisateurs ---
  async getCurrentUser(): Promise<User | null> {
    await this.delay(100);
    return this.currentUser();
  }

  async getAllUsers(): Promise<User[]> {
    await this.delay(200);
    return [...this.users];
  }

  async deleteUser(userId: number): Promise<boolean> {
    await this.delay(200);
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1 || this.users[index].role === 'admin') return false;

    const userEmail = this.users[index].email;
    this.users.splice(index, 1);
    delete this.passwords[userEmail];
    this.syncLocalStorage();
    return true;
  }

  // --- Helpers ---
  private syncLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('passwords', JSON.stringify(this.passwords));
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
