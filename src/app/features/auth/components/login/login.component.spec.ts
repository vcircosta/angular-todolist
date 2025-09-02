// login.component.spec.ts
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: Partial<AuthService>;
  let router: Partial<Router>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      setCurrentUser: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate empty form', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should call authService.login on valid form submission', fakeAsync(() => {
    const mockUser = { id: 1, email: 'test@test.com' };
    (authService.login as jest.Mock).mockReturnValue(of(mockUser));

    component.loginForm.setValue({ email: 'test@test.com', password: '123456' });
    component.onSubmit();
    tick();

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
    expect(authService.setCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(router.navigate).toHaveBeenCalledWith(['/todos']);
  }));

  it('should set error message on login failure', fakeAsync(() => {
    const errorMsg = 'Invalid credentials';
    (authService.login as jest.Mock).mockReturnValue(throwError(() => ({ message: errorMsg })));

    component.loginForm.setValue({ email: 'test@test.com', password: '123456' });
    component.onSubmit();
    tick();

    expect(component.error).toBe(errorMsg);
    expect(component.loading).toBe(false);
  }));
});
