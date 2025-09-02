import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: Partial<AuthService>;
  let router: Partial<Router>;

  beforeEach(() => {
    authService = {
      getCurrentUser: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should allow admin users', async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({ role: 'admin' });

    const canActivate = await guard.canActivate();
    expect(canActivate).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should block non-admin users and redirect', async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({ role: 'user' });

    const canActivate = await guard.canActivate();
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
  });

  it('should block if no user is returned and redirect', async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

    const canActivate = await guard.canActivate();
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
  });
});
