import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnChanges {
  @Output() finishEditing = new EventEmitter();
  @Input() selectedProfile:
    | {
        Id: string;
        Name: string;
        Address: string;
        Date_of_birth: string;
      }
    | undefined;
  editForm = this.formBuilder.group({
    Id: '',
    Name: '',
    Address: '',
    Date_of_birth: '',
  });

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {}

  ngOnChanges(): void {
    this.selectedProfile && this.editForm.setValue(this.selectedProfile);
  }

  onSave() {
    const data = this.editForm.value;
    if (data.Date_of_birth === '') data.Date_of_birth = null;
    const dataJson = JSON.stringify(this.editForm.value);
    this.http
      .put('https://profileapp59256.azurewebsites.net/api/Profiles', dataJson, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .subscribe(() => {
        this.finishEditing.emit();
      });
  }
}
