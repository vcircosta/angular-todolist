import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../services/todo.service';
import { ErrorService } from '../../../shared/services/error.service';
import { of, throwError } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoServiceMock: any;
  let errorServiceMock: any;

  beforeEach(waitForAsync(() => {
    todoServiceMock = {
      getAllTodos: jest.fn().mockResolvedValue([]),
      createTodo: jest.fn().mockResolvedValue({}),
      updateTodo: jest.fn().mockResolvedValue({}),
      deleteTodo: jest.fn().mockResolvedValue({}),
    };

    errorServiceMock = {
      showError: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceMock },
        { provide: ErrorService, useValue: errorServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos on init', async () => {
    expect(todoServiceMock.getAllTodos).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading todos', async () => {
    todoServiceMock.getAllTodos.mockRejectedValueOnce('error');
    await component.loadTodos();
    expect(errorServiceMock.showError).toHaveBeenCalledWith('Impossible de charger les todos.');
    expect(component.loading).toBe(false);
  });

  it('should add a new todo', async () => {
    component.newTodo.title = 'Test Todo';
    await component.addTodo();
    expect(todoServiceMock.createTodo).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: '',
      priority: 'medium',
    });
    expect(component.newTodo.title).toBe('');
  });

  it('should not add a todo with empty title', async () => {
    component.newTodo.title = '   ';
    await component.addTodo();
    expect(todoServiceMock.createTodo).not.toHaveBeenCalled();
  });

  it('should handle error when adding todo', async () => {
    todoServiceMock.createTodo.mockRejectedValueOnce('error');
    component.newTodo.title = 'Test Todo';
    await component.addTodo();
    expect(errorServiceMock.showError).toHaveBeenCalledWith('Impossible d’ajouter le todo.');
  });

  it('should update status and reload todos', async () => {
    await component.updateStatus(1, 'done');
    expect(todoServiceMock.updateTodo).toHaveBeenCalledWith(1, { status: 'done' });
    expect(todoServiceMock.getAllTodos).toHaveBeenCalledTimes(2); // initial load + reload
  });

  it('should handle error when updating status', async () => {
    todoServiceMock.updateTodo.mockRejectedValueOnce('error');
    await component.updateStatus(1, 'done');
    expect(errorServiceMock.showError).toHaveBeenCalledWith(
      'Impossible de mettre à jour le statut.',
    );
  });

  it('should delete todo and reload todos', async () => {
    await component.deleteTodo(1);
    expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith(1);
    expect(todoServiceMock.getAllTodos).toHaveBeenCalledTimes(2);
  });

  it('should handle error when deleting todo', async () => {
    todoServiceMock.deleteTodo.mockRejectedValueOnce('error');
    await component.deleteTodo(1);
    expect(errorServiceMock.showError).toHaveBeenCalledWith('Impossible de supprimer le todo.');
  });
});
