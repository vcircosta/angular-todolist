import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { AdminComponent } from './admin.component';
import { ADMIN_ROUTES } from './admin.routes';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('ADMIN_ROUTES', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: '', component: DummyComponent }, ...ADMIN_ROUTES]),
        AdminComponent,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to AdminComponent', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/');
  }));

  it('should have AdminComponent as the component for "" path', () => {
    const route = ADMIN_ROUTES.find((r) => r.path === '');
    expect(route).toBeDefined();
    expect(route?.component).toBe(AdminComponent);
  });
});
