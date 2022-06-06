import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Job } from './jobs/jobs.component';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private baseURL = environment.API_BASE_URL;

  constructor(private http: HttpClient) { }

  public getJobs(queryParams = { searchString: "", count: 0, offset: 0 }): Observable<Job[]> {

    let url = this.baseURL + "jobs";

    if (queryParams.searchString != "" || queryParams.count > 0 || queryParams.offset > 0) {
      if (queryParams.searchString != "") {
        url += "?searchString=" + queryParams.searchString;
        if(queryParams.count > 0){
          url += "&count=" + queryParams.count;
          if(queryParams.offset > 0){
            url += "&offset=" + queryParams.offset;
          }
        }else{
          if(queryParams.offset > 0){
            url += "&offset=" + queryParams.offset;
          }
        }
      }else{
        if(queryParams.count > 0){
          url += "?count=" + queryParams.count;
          if(queryParams.offset > 0){
            url += "&offset=" + queryParams.offset;
          }
        }else{
          if(queryParams.offset > 0){
            url += "?offset=" + queryParams.offset;
          }
        }
      }
    }

    return this.http.get<Job[]>(url);
  }

  public getJob(jobId: string): Observable<Job> {
    return this.http.get<Job>(this.baseURL + "jobs/" + jobId);
  }

  public deleteJob(jobId: string): Observable<void> {
    return this.http.delete<void>(this.baseURL + "jobs/" + jobId);
  }

  public addJob(job: Job): Observable<Job> {
    return this.http.post<Job>(this.baseURL + "jobs", job, { headers: this.getHeaders() });
  }

  public updateJob(job: Job): Observable<Job> {
    return this.http.put<Job>(this.baseURL + "jobs/" + job._id, job, { headers: this.getHeaders() });
  }

  getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
}
