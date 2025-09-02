// register.component.spec.ts
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: Partial<AuthService>;
  let router: Partial<Router>;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate empty form', () => {
    component.registerForm.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    expect(component.registerForm.invalid).toBe(true);
  });

  it('should detect password mismatch', () => {
    component.registerForm.setValue({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: 'abcdef',
    });
    expect(component.registerForm.errors?.['mismatch']).toBeTruthy();
    expect(component.getFieldError('confirmPassword')).toBe(
      'Les mots de passe ne correspondent pas',
    );
  });

  it('should call authService.register on valid form submission', fakeAsync(() => {
    const mockUser = { id: 1, name: 'Test' };
    (authService.register as jest.Mock).mockReturnValue(of(mockUser));

    component.registerForm.setValue({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });

    component.onSubmit();
    tick();

    expect(authService.register).toHaveBeenCalledWith({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    });
    expect(component.loading()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  }));

  it('should set error message on registration failure', fakeAsync(() => {
    const errorMsg = 'Email déjà utilisé';
    (authService.register as jest.Mock).mockReturnValue(throwError(() => ({ message: errorMsg })));

    component.registerForm.setValue({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });

    component.onSubmit();
    tick();

    expect(component.error()).toBe(errorMsg);
    expect(component.loading()).toBe(false);
  }));
});
