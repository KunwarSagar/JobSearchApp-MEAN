import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../jobs.service';
import { Job } from '../jobs/jobs.component';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.css']
})
export class EditJobComponent implements OnInit {

  editJobForm!: FormGroup;
  job!: Job;

  required: any = {
    title: false,
    description: false
  }

  constructor(private jobService: JobsService, private formBilder: FormBuilder, private route: ActivatedRoute, private router: Router) { }

  initializeForm = (job: Job) => {
    this.job = job;

    this.editJobForm = this.formBilder.group({
      title: job.title,
      salary: job.salary,
      description: job.description,
      experience: job.experience,
      postDate: job.postDate,
      skills: job.skills.join(", "),
      address: job.location.address,
      coordinates: job.location.coordinates.join(",")
    });
  }

  ngOnInit(): void {
    const jobId = this.route.snapshot.params['jobId'];
    this.jobService.getJob(jobId).subscribe(job => {
      this.initializeForm(job);
    });

  }

  editJob(): void {
    const jobData = this.editJobForm.value;

    this.job.title = jobData.title;
    const locationId = this.job.location._id;
    let jobLocation = {
      _id: locationId,
      address: jobData.address,
      coordinates: jobData.coordinates.replace(/^\s+|\s+$/gm, '').split(",").map((c: string) => parseFloat(c))
    }
    this.job.location = jobLocation;
    this.job.skills = jobData.skills.split(",").map((s: string) => s.replace(/^\s+|\s+$/gm, ''));

    this.job.postDate = new Date(jobData.postDate);
    this.job.description = jobData.description;
    this.job.experience = jobData.experience;
    this.job.salary = jobData.salary;

    this.jobService.updateJob(this.job).subscribe({
      next: updatedJob => {
        if (updatedJob != null) {
          this.router.navigate(["jobs/" + updatedJob._id], { state: { jobUpdated: true } });
        }
      },
      error:err => {
        alert("Update failed.")
      },
      complete:()=>{
        // console.log("Successfully updated");
      }
    })
  }

}
