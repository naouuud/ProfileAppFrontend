import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private searchTerm: string = '';
  private profiles: any[] = [];
  private profilesUpdated = new Subject<any[]>();
  profilesUpdated$ = this.profilesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  alertProfilesUpdated() {
    this.profilesUpdated.next(this.profiles);
  }

  setSearchTerm(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  getProfile(id: string) {
    return this.profiles.find((profile) => String(profile.id) === id);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const fullYear = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${fullYear}-${month}-${day}`;
  }

  populateGrid() {
    if (this.searchTerm === '') {
      this.http
        .get<any[]>('https://profileapp59256.azurewebsites.net/api/Profiles')
        .subscribe((response) => {
          this.profiles = [...response];
          for (const profile of this.profiles) {
            profile.date_of_birth = this.formatDate(profile.date_of_birth);
          }
          this.alertProfilesUpdated();
        });
    } else {
      this.http
        .post<any[]>(
          'https://profileapp59256.azurewebsites.net/api/Profiles/Search',
          JSON.stringify(this.searchTerm),
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
          this.alertProfilesUpdated();
        });
    }
  }

  saveProfile(profile: any) {
    if (profile.Date_of_birth === '') profile.Date_of_birth = null;
    const profileJson = JSON.stringify(profile);
    this.http
      .post(
        'https://profileapp59256.azurewebsites.net/api/Profiles',
        profileJson,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        },
      )
      .subscribe(() => {
        alert('Profile saved');
        this.populateGrid();
      });
  }

  updateProfile(profile: any) {
    const profileJson = JSON.stringify(profile);
    return new Observable((observer) => {
      this.http
        .put(
          'https://profileapp59256.azurewebsites.net/api/Profiles',
          profileJson,
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
          },
        )
        .subscribe(() => {
          this.populateGrid();
          observer.next();
        });
    });
  }

  deleteProfile(id: string) {
    this.http
      .delete(`https://profileapp59256.azurewebsites.net/api/Profiles/${id}`)
      .subscribe(() => {
        alert('Profile deleted');
        this.populateGrid();
      });
  }
}
