import { Routes } from '@angular/router';
import {JobPageComponent} from './job-page/job-page.component';
import {JobDetailsComponent} from './job-details/job-details.component';

export const routes: Routes = [
  {path: 'JobAds', component: JobPageComponent},
  {path: '', redirectTo: 'JobAds', pathMatch: 'full'},
  { path: 'JobAds/:id', component: JobDetailsComponent },
];
