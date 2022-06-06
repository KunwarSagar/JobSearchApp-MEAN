import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JobsService } from '../jobs.service';
import { Job } from '../jobs/jobs.component';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  job!: Job;

  constructor(private route: ActivatedRoute, private jobService: JobsService, private router: Router) {
    this.job = new Job("", "", 0, {}, "", "", [""], new Date());
  }

  ngOnInit(): void {
    const jobId = this.route.snapshot.params['jobId'];
    this.jobService.getJob(jobId).subscribe(job => this.job = job);

    if (history.state.jobUpdated) {
      alert("Succesfully updated");
    }
  }

  edit(): void {
    this.router.navigate(["/jobs/" + this.job._id + "/edit"]);
  }

  delete(): void {
    this.jobService.deleteJob(this.job._id).subscribe({
      next: res => {
        if (res == null) {
          this.router.navigate(["/jobs"], { state: { deleted: true } });
        }
      },
      error:err => {
          alert(environment.ON_DELETE_FAILED_MESSAGE);
      },
      complete:()=>{
        // console.log("Deleted");
      }
    });
  }
}
