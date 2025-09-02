import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
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
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow authenticated users', async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({ id: 1, name: 'Test' });

    const result = await guard.canActivate();
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should block unauthenticated users and redirect', async () => {
    (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

    const result = await guard.canActivate();
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
