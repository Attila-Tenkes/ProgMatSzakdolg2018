import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
    selector: 'navi-bar',
    template: `
                <div class="top-bar">
                    <div class="top-bar-title nav-menu"><a [routerLink]="['']">Dashboard Designer</a></div>
                    <div>
                        <ul class="menu">
                            <li class="nav-menu"><a [routerLink]="['/myDashboards']">My Dashboards</a></li>
                            <li class="nav-menu"><a [routerLink]="['/myFiles']">My Files</a></li>
                            <li class="nav-menu"><a [routerLink]="['/myDataSources']">My Data Sources</a></li>                           
                            <li class="nav-menu"><a [routerLink]="['/login']">Login</a></li>
                        </ul>
                    </div>
                </div>                                
               
        
            <div *ngIf = "theUser" class="top-bar-right">
                <ul class="menu">
                    <li class="admin-menu"><a (click)="logout()">Logout</a></li>
                    <li class="admin-menu"><a>{{theUser}} Logged in</a></li>
                </ul>
            </div>
    `,
    styleUrls: ['./navbar.component.css']
})
export class NavComponent implements OnInit { 
    theUser: string; 
    constructor( private userSVC: UserService, private router: Router){}
    ngOnInit(){
        this.theUser = this.userSVC.loggedInUser;
      }
      logout(){
        this.userSVC.logout();
        this.router.navigate(['']);
      }
}