import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    EditProfileComponent,
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',
})
export class DataGridComponent {
  profiles: any[] = [];
  searchForm = this.formBuilder.group({
    searchTerm: '',
  });
  toEdit:
    | {
        Id: string;
        Name: string;
        Address: string;
        Date_of_birth: string;
      }
    | undefined;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {}

  formatDate(dateString: string | null): string {
    if (!dateString) return 'null';
    const date = new Date(dateString);
    const fullYear = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${fullYear}-${month}-${day}`;
  }

  onSearch() {
    const searchTerm = this.searchForm.value.searchTerm;
    if (searchTerm === '') this.getAll();
    else {
      this.http
        .post<any[]>(
          'https://localhost:7025/api/Profiles/Search',
          JSON.stringify(searchTerm),
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
          },
        )
        .subscribe((response) => {
          this.profiles = [...response];
          for (const profile of this.profiles) {
            profile.date_of_birth = this.formatDate(profile.date_of_birth);
          }
        });
    }
  }

  getAll() {
    this.http
      .get<any[]>('https://localhost:7025/api/Profiles')
      .subscribe((response) => {
        this.profiles = [...response];
        for (const profile of this.profiles) {
          profile.date_of_birth = this.formatDate(profile.date_of_birth);
        }
      });
  }

  editProfile(id: string) {
    document.querySelector(`#row-${id}`);
    this.toEdit = {
      Id: id,
      Name: document.querySelector(`#row-${id} .name`)?.textContent || '',
      Address: document.querySelector(`#row-${id} .address`)?.textContent || '',
      Date_of_birth:
        document.querySelector(`#row-${id} .dob`)?.textContent || '',
    };
  }

  cancelEdit() {
    this.toEdit = undefined;
  } // respond to output

  deleteProfile(id: string) {
    this.http
      .delete(`https://localhost:7025/api/Profiles/${id}`)
      .subscribe(() => this.onSearch());
  }
}
