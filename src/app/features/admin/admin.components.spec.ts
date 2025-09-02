import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AuthService } from '../auth/services/auth.service';
import { TodoService } from '../todos/services/todo.service';
import { Router } from '@angular/router';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let authServiceMock: Partial<AuthService>;
  let todoServiceMock: Partial<TodoService>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUser: jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' }),
      getAllUsers: jest
        .fn()
        .mockResolvedValue([{ id: 2, name: 'User', email: 'user@example.com', role: 'user' }]),
      deleteUser: jest.fn().mockResolvedValue(true),
    };

    todoServiceMock = {
      getAllTodos: jest
        .fn()
        .mockResolvedValue([
          { id: 1, title: 'Test Todo', status: 'open', priority: 'high', assignedTo: null },
        ]),
      deleteTodo: jest.fn().mockResolvedValue(true),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: TodoService, useValue: todoServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users and todos on init', async () => {
    await component.ngOnInit();
    expect(component.users().length).toBe(1);
    expect(component.todos().length).toBe(1);
  });

  it('should redirect if user is not admin', async () => {
    (authServiceMock.getCurrentUser as jest.Mock).mockResolvedValueOnce({
      id: 2,
      name: 'User',
      email: 'user@example.com',
      role: 'user',
    });
    await component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/todos']);
  });

  it('should delete a user', async () => {
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);

    await component.deleteUser(2);
    expect(authServiceMock.deleteUser).toHaveBeenCalledWith(2);
  });

  it('should delete a todo', async () => {
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);

    await component.deleteTodo(1);
    expect(todoServiceMock.deleteTodo).toHaveBeenCalledWith(1);
  });
});
