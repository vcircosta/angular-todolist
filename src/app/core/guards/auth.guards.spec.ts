import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('authGuard', () => {
  let authService: Partial<AuthService>;
  let router: Partial<Router>;

  beforeEach(() => {
    authService = {
      getToken: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('should allow authenticated users', () => {
    (authService.getToken as jest.Mock).mockReturnValue('token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/protected' } as any),
    );

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should block unauthenticated users and redirect', () => {
    (authService.getToken as jest.Mock).mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/protected' } as any),
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/protected' },
    });
  });
});
