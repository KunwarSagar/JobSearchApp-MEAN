import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JobsService } from '../jobs.service';

export class Job{
  _id!:string;
  title:string;
  salary!:number;
  location! : {
    _id:string,
    address:string,
    coordinates:[number],
  };
  description!:string;
  experience!:string;
  skills!:[string];
  postDate!:Date;
  reviews!:[{
    date:Date,
    review:string,
    reviewedBy:string
  }];
  constructor(_id:string, title:string,salary:number,location:any,description:string,experience:string,skills:[string],postDate:Date){
    this._id = _id;
    this.title = title;
    this.salary = salary;
    this.location = location;
    this.description = description;
    this.experience = experience;
    this.skills = skills;
    this.postDate = postDate;
  }
}

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  jobs:Job[] = [];

  constructor(private jobsService:JobsService) { }

  ngOnInit(): void {
    this.getJobs();

    if(history.state.deleted){
      this.showAlertMessage(environment.ON_DELETE_SUCCESS_MESSAGE, environment.SUCCESS_TYPE);
    }
    if(history.state.jobAdded){
      this.showAlertMessage(environment.ON_JOV_ADD_SUCCESS, environment.SUCCESS_TYPE);
    }
  }
  
  async getJobs():Promise<Job[]>{
    await this.jobsService.getJobs().subscribe(jobs => {
      this.jobs = jobs
     });
    return this.jobs;
  }

  message:any = false;

  showAlertMessage(message:string, type:string):void{
    if(type == environment.FAILED_TYPE && message == environment.ON_DELETE_FAILED_MESSAGE){
      this.message = "<div class='alert alert-danger'>"+environment.ON_DELETE_FAILED_MESSAGE+"</div>";
    }else if(type == environment.SUCCESS_TYPE && message == environment.ON_DELETE_SUCCESS_MESSAGE){
      this.message = "<div class='alert alert-success'>"+environment.ON_DELETE_SUCCESS_MESSAGE+"</div>";
    }else if(type == environment.SUCCESS_TYPE && message == environment.ON_JOV_ADD_SUCCESS){
      this.message = "<div class='alert alert-success'>"+environment.ON_JOV_ADD_SUCCESS+"</div>";
    }

    setTimeout(() => {
      this.message = false;
    }, 3000);
  }

  delete(jobId:string):any{
    this.jobsService.deleteJob(jobId).subscribe({
      next: res => {
        if (res == null) {
        this.getJobs();
        this.showAlertMessage(environment.ON_DELETE_SUCCESS_MESSAGE, environment.SUCCESS_TYPE);
        }
      },
      error:err => {
        this.showAlertMessage(environment.ON_DELETE_FAILED_MESSAGE, environment.FAILED_TYPE);
      },
      complete:()=>{
        // console.log("Deleted");
      }
    });
  }

}
