import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {
  tasks: { text: string; editing: boolean }[] = [];
  newTask = '';

  addTask() {
    const trimmed = this.newTask.trim();
    if (trimmed) {
      this.tasks.push({ text: trimmed, editing: false });
      this.newTask = '';
    }
  }

  removeTask(i: number) {
    this.tasks.splice(i, 1);
  }

  editTask(task: { text: string; editing: boolean }) {
    task.editing = true;
  }

  saveTask(task: { text: string; editing: boolean }, event: any) {
    const trimmed = event.target.value.trim();
    if (trimmed) {
      task.text = trimmed;
    }
    task.editing = false;
  }
}
