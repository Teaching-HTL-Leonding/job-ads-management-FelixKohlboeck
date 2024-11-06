import { Component, signal } from '@angular/core';
import { JobService } from '../job.service';
import {NgForOf} from '@angular/common';
import {Router} from '@angular/router';

interface Jobs {
  title: string;
  textEN: string;
  id: number;
  translations: { language: string, translatedText: string }[];
}

@Component({
  selector: 'app-job-page',
  standalone: true,
  templateUrl: './job-page.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./job-page.component.css']
})
export class JobPageComponent {
  title = 'job-ads';
  jobAds = signal<Jobs[]>([]);

  constructor(private jobService: JobService, private router: Router) {
    this.getJobs();
  }

  getJobs() {
    this.jobService.getAllJobs().then((response) => {
      this.jobAds.set(response);
    });
  }

  viewJobDetails(id: number) {
    this.router.navigate([`/JobAds/${id}`]); // Navigiert zu JobDetailsComponent mit der Job-ID
  }

  deleteJob(id: number) {
    this.jobService.deleteJobById(id).then(() => {
      // Filtere den gelöschten Job aus der Liste
      const updatedJobs = this.jobAds().filter(job => job.id !== id);
      this.jobAds.set(updatedJobs);
    });
  }
}
