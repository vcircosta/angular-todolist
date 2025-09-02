import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { Todo, CreateTodoRequest } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoService],
    });
    service = TestBed.inject(TodoService);

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all todos', async () => {
    const todos = await service.getAllTodos();
    expect(todos.length).toBe(3);
  });

  it('should return a todo by id', async () => {
    const todo = await service.getTodoById(1);
    expect(todo).toBeDefined();
    expect(todo?.title).toBe('Apprendre Angular');
  });

  it('should update a todo', async () => {
    const updated = await service.updateTodo(1, { status: 'done' });
    expect(updated).toBeDefined();
    expect(updated?.status).toBe('done');

    const todos = await service.getAllTodos();
    expect(todos.find((t) => t.id === 1)?.status).toBe('done');
  });

  it('should delete a todo', async () => {
    const deleted = await service.deleteTodo(1);
    expect(deleted).toBe(true);

    const todos = await service.getAllTodos();
    expect(todos.find((t) => t.id === 1)).toBeUndefined();
  });

  it('should return false when deleting non-existent todo', async () => {
    const deleted = await service.deleteTodo(999);
    expect(deleted).toBe(false);
  });

  it('should compute stats correctly', async () => {
    const stats = service.todoStats();
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(1);
    expect(stats.inProgress).toBe(1);
    expect(stats.highPriority).toBe(2);
    expect(stats.completionRate).toBeCloseTo(33.333, 1);
  });
});
