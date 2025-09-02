import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { AUTH_ROUTES } from './auth.routes';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

describe('AUTH_ROUTES', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(AUTH_ROUTES)],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('should have LoginComponent for /login path', () => {
    const route = AUTH_ROUTES.find((r) => r.path === 'login');
    expect(route).toBeDefined();
    expect(route?.component).toBe(LoginComponent);
  });

  it('should have RegisterComponent for /register path', () => {
    const route = AUTH_ROUTES.find((r) => r.path === 'register');
    expect(route).toBeDefined();
    expect(route?.component).toBe(RegisterComponent);
  });

  it('should redirect "" path to /login', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/login');
  }));
});
