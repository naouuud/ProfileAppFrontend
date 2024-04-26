import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profiles: any[] = [];
  private profilesUpdated = new Subject<void>();
  profilesUpdated$ = this.profilesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getProfiles() {
    return this.profiles;
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
        this.searchProfiles('');
      });
  }

  // separate functionality (more aptly named updateLocalData or so)
  searchProfiles(searchTerm: string) {
    if (searchTerm === '')
      return this.http
        .get<any[]>('https://profileapp59256.azurewebsites.net/api/Profiles')
        .subscribe((response) => {
          this.profiles = [...response];
          for (const profile of this.profiles) {
            profile.date_of_birth = this.formatDate(profile.date_of_birth);
          }
          this.profilesUpdated.next();
        });
    else {
      return this.http
        .post<any[]>(
          'https://profileapp59256.azurewebsites.net/api/Profiles/Search',
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
          this.profilesUpdated.next();
        });
    }
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
          this.searchProfiles('');
          observer.next();
        });
    });
  }

  deleteProfile(id: string) {
    this.http
      .delete(`https://profileapp59256.azurewebsites.net/api/Profiles/${id}`)
      .subscribe(() => {
        alert('Profile deleted');
        this.searchProfiles('');
      });
  }
}
