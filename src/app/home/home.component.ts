import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { UserService } from '../services/user.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']    
})
export class HomeComponent implements OnInit {    

    dataSource: string[];
    slideshowDelay = 2000;
    constructor( private userSVC: UserService, private router: Router ){
        let images: string[] = [
            "public/assets/gallery/1.jpg",
            "public/assets/gallery/2.jpg",
            "public/assets/gallery/3.jpg",
            "public/assets/gallery/4.jpg",
            "public/assets/gallery/5.jpg",
         ];
        this.dataSource = images;

    } 

    ngOnInit(){
      
    } 
      
    valueChanged(e:any) {
        this.slideshowDelay = e.value ? 2000 : 0;
    }
}
