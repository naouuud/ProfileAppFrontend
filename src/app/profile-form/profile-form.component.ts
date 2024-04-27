import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
  imports: [ReactiveFormsModule],
})
export class ProfileFormComponent {
  profileForm = this.formBuilder.group<{
    Name: string | null;
    Address: string | null;
    Date_of_birth: string | null;
  }>({
    Name: '',
    Address: '',
    Date_of_birth: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
  ) {}

  onSave() {
    this.profileService.saveProfile(this.profileForm.value);
    this.profileForm.reset();
  }
}
