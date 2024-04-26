import { Routes } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DataGridComponent } from './data-grid/data-grid.component';

export const routes: Routes = [
  {
    path: '',
    component: DataGridComponent,
    children: [{ path: 'edit/:profileId', component: EditProfileComponent }],
  },
];
