import { TestBed } from '@angular/core/testing';
import { TodosModule } from './todos.module';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoListComponent } from './components/todo-list.component';

describe('TodosModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosModule, RouterTestingModule],
    }).compileComponents();
  });

  it('should create the module', () => {
    const module = TestBed.inject(TodosModule);
    expect(module).toBeTruthy();
  });

  it('should import TodoListComponent as standalone component', () => {
    const fixture = TestBed.createComponent(TodoListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
