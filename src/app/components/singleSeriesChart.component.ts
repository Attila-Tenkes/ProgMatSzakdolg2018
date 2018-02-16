import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
    selector: 'singleSeriesChart',
    template: `                
        
           <span>ide jon az X es Y tendgely tulajdonsgai</span>
    `  
})
export class SingleSeriesChartComponent implements OnInit { 
    theUser: string; 
    constructor( private userSVC: UserService, private router: Router){}
    ngOnInit(){
        this.theUser = this.userSVC.loggedInUser;
      }
    
}