import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
    selector: 'navi-bar',
    template: `
            <div class='nav-header ' >
                <div class="top-bar">
                    <div class="top-bar-title">                       
                        <a [routerLink]="['']">Dashboard Designer</a>                       
                    </div>  
                   
                </div>
                    
                <div class="top-bar top-bar-menu">    
                    <div class="top-bar-left">                   
                        <div *ngIf = "theUser" class="top-bar-right">
                            <ul class="menu">
                                <li class="nav-menu"><a [routerLink]="['/myDashboards']">Dashboards</a></li>
                                <li class="nav-menu"><a [routerLink]="['/myFiles']">Files</a></li>
                                <li class="nav-menu"><a [routerLink]="['/myDataSources']">Data Sources</a></li>                           
                                <li class="nav-menu"><a (click)="logout()">Logout</a></li>
                            
                            </ul>
                        </div> 
                    </div>   
                    <div *ngIf = "!theUser" class="top-bar-right">
                        <ul class="menu">                                
                            <li class="nav-menu"><a [routerLink]="['/login']">Login</a></li>
                        </ul>
                    </div>
                    <div class="top-bar-right">
                        {{Welcome}} {{theUser}}
                    </div> 
                </div>                                                        
            </div>
            
    `,
    styleUrls: ['./navbar.component.css']
})
export class NavComponent implements OnInit { 
    theUser: string; 
    Welcome:string;
    constructor( private userSVC: UserService, private router: Router){}
    ngOnInit(){
        this.theUser = this.userSVC.loggedInUser;        
        this.Welcome = this.theUser?"Welcome":"";        
    }
    
    logout(){        
        this.userSVC.logout();       
    }      
}