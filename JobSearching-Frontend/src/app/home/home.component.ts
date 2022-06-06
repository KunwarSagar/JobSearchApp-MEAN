import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('searchForm')
  searchForm!:NgForm;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  search():void{

    const searchString = this.searchForm.value.searchQuery;
    this.router.navigate(["jobs"], {queryParams:{'searchString':searchString}});
  }
}
