import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ProfileFormComponent,
    EditProfileComponent,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',
})
export class DataGridComponent implements OnInit, OnDestroy {
  profiles: any[] = [];
  private profilesSubscription!: Subscription;
  searchForm = this.formBuilder.group({
    searchTerm: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
  ) {}

  // subscription to update DataGridComponent.profiles when ProfileService.profiles is updated
  ngOnInit(): void {
    this.profilesSubscription = this.profileService.profilesUpdated$.subscribe(
      () => {
        this.profiles = [...this.profileService.getProfiles()];
      },
    );
  }

  ngOnDestroy(): void {
    this.profilesSubscription.unsubscribe();
  }

  onSearch() {
    const searchTerm = this.searchForm.value.searchTerm || '';
    this.profileService.searchProfiles(searchTerm);
  }

  onDelete(profileId: string) {
    this.profileService.deleteProfile(profileId);
  }
}
