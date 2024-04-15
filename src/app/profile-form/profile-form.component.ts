import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.css',
  imports: [ReactiveFormsModule, HttpClientModule],
})
export class ProfileFormComponent {
  @Output() finishAdding = new EventEmitter();
  profileForm = this.formBuilder.group({
    Name: '',
    Address: '',
    Date_of_birth: '',
  });

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {}

  onSave() {
    const data = this.profileForm.value;
    if (data.Date_of_birth === '') data.Date_of_birth = null;
    const dataJson = JSON.stringify(this.profileForm.value);
    this.http
      .post(
        'https://profileapp59256.azurewebsites.net/api/Profiles',
        dataJson,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        },
      )
      .subscribe((response) => {
        alert('Profile saved');
        console.log('Added Profile:', response);
        this.profileForm.reset();
        this.finishAdding.emit();
      });
  }
}
