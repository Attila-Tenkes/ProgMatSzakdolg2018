import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { UserService } from '../services/user.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']    
})
export class HomeComponent implements OnInit {    

    constructor( private userSVC: UserService, private router: Router ){} 

    ngOnInit(){
      
    } 

}
