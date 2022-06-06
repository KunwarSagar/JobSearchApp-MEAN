import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobsService } from '../jobs.service';
import { Job } from '../jobs/jobs.component';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.css']
})
export class AddJobComponent implements OnInit {

  addJobForm!: FormGroup;

  constructor(private jobService: JobsService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.addJobForm = this.formBuilder.group({
      title: "",
      salary: 0,
      description: "",
      experience: "",
      postDate: "",
      skills: "",
      address: "",
      coordinates: ""
    });
  }

  required: any = {
    title: false,
    description: false
  }

  addJob(): any {
    const jobData = this.addJobForm.value;
    const jobLocation = {
      address: jobData.address,
      coordinates: jobData.coordinates.replace(/^\s+|\s+$/gm, "").split(",").map((c: string) => parseFloat(c))
    }

    const skills = jobData.skills.split(",").map((s:string) => s.replace(/^\s+|\s+$/gm,'') );
    const date = new Date(jobData.postDate);

    let job = new Job("", jobData.title, jobData.salary, jobLocation, jobData.description, jobData.experience, skills, date);

    this.jobService.addJob(job).subscribe({
      next:addedJob => {
        if(addedJob!= null){
          this.router.navigate(["jobs"], { state: { jobAdded: true } })
        }
      },
      error:err => {
        alert("Job add failed");
      },
      complete:()=>{
        // console.log("Job added");
      }
    });
  }
}
