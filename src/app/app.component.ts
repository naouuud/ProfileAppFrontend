import { Component } from '@angular/core';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { DataGridComponent } from './data-grid/data-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProfileFormComponent, DataGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Profile Application';
}
