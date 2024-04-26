import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  editForm = this.formBuilder.group({
    Id: '',
    Name: '',
    Address: '',
    Date_of_birth: '',
  });
  profileId!: string;
  private routeSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  setProfile() {
    const profile = this.profileService.getProfile(this.profileId);
    this.editForm.setValue({
      Id: profile.id,
      Name: profile.name,
      Address: profile.address,
      Date_of_birth: profile.date_of_birth,
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      this.profileId = params.get('profileId')!;
      this.setProfile();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onSave() {
    const data = this.editForm.value;
    if (data.Date_of_birth === '') data.Date_of_birth = null;
    this.profileService
      .updateProfile(data)
      .subscribe(() => this.router.navigate(['']));
  }
}
