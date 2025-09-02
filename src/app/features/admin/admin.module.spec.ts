import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminModule } from './admin.module';
import { AdminDashboardComponent } from './components/admin-dashboard.component';

describe('AdminModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModule, RouterTestingModule],
    }).compileComponents();
  });

  it('should compile AdminDashboardComponent', () => {
    const fixture = TestBed.createComponent(AdminDashboardComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(AdminDashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Admin Dashboard');
  });
});
