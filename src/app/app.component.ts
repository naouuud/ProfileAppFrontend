import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileForm } from './profile-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProfileForm],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Profile App';
}
