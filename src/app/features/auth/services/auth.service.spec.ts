import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully with correct credentials', async () => {
    const credentials: LoginRequest = { email: 'admin@example.com', password: 'admin123' };
    const user = await firstValueFrom(service.login(credentials));

    expect(user.email).toBe(credentials.email);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getToken()).toBeTruthy();
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should logout correctly', () => {
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should delete a user', async () => {
    const initialUsers = await service.getAllUsers();
    const userToDelete = initialUsers.find((u) => u.role !== 'admin');
    if (!userToDelete) fail('No deletable user found');

    const result = await service.deleteUser(userToDelete.id);
    expect(result).toBe(true);

    const remainingUsers = await service.getAllUsers();
    expect(remainingUsers.some((u) => u.id === userToDelete.id)).toBe(false);
  });

  it('should not delete an admin', async () => {
    const initialUsers = await service.getAllUsers();
    const admin = initialUsers.find((u) => u.role === 'admin');
    if (!admin) fail('No admin found');

    const result = await service.deleteUser(admin.id);
    expect(result).toBe(false);
  });

  it('should get the current user', async () => {
    const credentials: LoginRequest = { email: 'admin@example.com', password: 'admin123' };
    await firstValueFrom(service.login(credentials));

    const currentUser = await service.getCurrentUser();
    expect(currentUser).toBeTruthy();
    expect(currentUser!.email).toBe('admin@example.com');
  });
});
