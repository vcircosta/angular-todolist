import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TodoListComponent } from './components/todo-list.component';
import { TodosRoutes } from './todos.routes';

@Component({ template: '' })
class DummyComponent {}

describe('TodosRoutes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          ...TodosRoutes,
          { path: 'dummy', component: DummyComponent },
        ]),
        TodoListComponent,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to TodoListComponent for "" path', fakeAsync(() => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/');
  }));

  it('should have TodoListComponent as the component for "" path', () => {
    const route = TodosRoutes.find((r) => r.path === '');
    expect(route).toBeDefined();
    expect(route?.component).toBe(TodoListComponent);
  });
});
