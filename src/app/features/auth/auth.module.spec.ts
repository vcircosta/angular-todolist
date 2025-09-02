import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthModule } from './auth.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

describe('AuthModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthModule],
      providers: [
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
      ],
    }).compileComponents();
  });

  it('should create the module', () => {
    const module = TestBed.inject(AuthModule);
    expect(module).toBeTruthy();
  });

  it('should create LoginComponent and RegisterComponent', () => {
    const loginFixture = TestBed.createComponent(LoginComponent);
    expect(loginFixture.componentInstance).toBeTruthy();

    const registerFixture = TestBed.createComponent(RegisterComponent);
    expect(registerFixture.componentInstance).toBeTruthy();
  });
});
