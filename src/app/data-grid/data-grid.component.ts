import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProfileService } from '../profile.service';
import { Subscription } from 'rxjs';
import { Profile } from '../profile';

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ProfileFormComponent,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',
})
export class DataGridComponent implements OnInit, OnDestroy {
  profiles: Profile[] = [];
  private profilesSubscription!: Subscription;
  searchForm = this.formBuilder.group({
    searchTerm: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
  ) {}

  // subscription to Subject.asObservabale() to update DataGridComponent.profiles when ProfileService.profiles is updated
  ngOnInit(): void {
    this.profilesSubscription = this.profileService.profilesUpdated$.subscribe(
      // callback function executed when Subject.next() is called, passes data from ProfileService to DataGridComponent
      (profiles) => {
        this.profiles = [...profiles];
      },
    );
  }

  ngOnDestroy(): void {
    this.profilesSubscription.unsubscribe();
  }

  onSearch() {
    const searchTerm = this.searchForm.value.searchTerm;
    // assert that searchTerm is not null as it is initialized as '' (empty string)
    this.profileService.setSearchTerm(searchTerm!);
    this.profileService.populateGrid();
  }

  onDelete(profileId: number) {
    this.profileService.deleteProfile(String(profileId));
  }
}
