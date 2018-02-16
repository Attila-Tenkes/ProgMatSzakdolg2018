import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { FileService } from '../services/file.service';
import { DashFile } from '../models/dashfile';

@Component({
  templateUrl: './file-admin.component.html',
  styleUrls: ['./file-admin.component.css']
})

export class FileAdminComponent implements OnInit {
    theUser: string;
    menuChoice: string;
    theFiles: DashFile[];
    formDisplay: boolean = true;
    singleFile: DashFile;

    constructor( 
        private userSVC: UserService, 
        private router: Router, 
        private fileAdminSVC: FileService
    ){}

    logout(){
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    chooseMode(mode: string){
        this.menuChoice = mode;
    }

    ngOnInit(){
       this.theUser = this.userSVC.loggedInUser;
        this.getFiles();
    }

    getFiles(){
        /*debugger;
        this.theFiles = new Array<DashFile>();
        let dbRef = firebase.database().ref('files/');
        var that=this;
        dbRef.on('value', function(snapshot){
            
           var all = snapshot.val();
           var dataFiles = all.dataFiles;
           var images = all.images;
           that.theFiles = [];
           Object.keys(dataFiles).map(key =>that.theFiles.push( new DashFile (
                     dataFiles[key].displayName,
                     dataFiles[key].desc,
                     dataFiles[key].fileName,
                     null,
                     dataFiles[key].id,                   
                     dataFiles[key].url
                    )));
            Object.keys(images).map(key => that.theFiles.push(new DashFile (
                     images[key].displayName,
                     images[key].desc,
                     images[key].fileName,
                     null,
                     images[key].id,                   
                     images[key].url
                    )));
        })    */
        var that=this;
        this.fileAdminSVC.getFiles(function(snapshot){
            
           var all = snapshot.val();
           var dataFiles = all.dataFiles;
           var images = all.images;
           that.theFiles = [];
           Object.keys(dataFiles).map(key =>that.theFiles.push( new DashFile (
                     dataFiles[key].displayName,
                     dataFiles[key].desc,
                     dataFiles[key].fileName,
                     null,
                     dataFiles[key].id,                   
                     dataFiles[key].url
                    )));
            Object.keys(images).map(key => that.theFiles.push(new DashFile (
                     images[key].displayName,
                     images[key].desc,
                     images[key].fileName,
                     null,
                     images[key].id,                   
                     images[key].url
                    )));
        })       
          /*  var that = this;
            this.fileAdminSVC.getImages().then(
                files=>
                files.forEach(function(x){that.theFiles.push(x)}));   
            this.fileAdminSVC.getDataFiles().then(files=>files.forEach(function(x){that.theFiles.push(x)}));  */     
    }

    editFile(theFile: DashFile){
        this.singleFile = theFile;
        this.formDisplay = false;
    }

    cancelEdit(){
        this.formDisplay = true;
    }

    updateFile(singleFile: DashFile){
        this.fileAdminSVC.editFile(singleFile);
        this.formDisplay = true;
    }

    deleteFile(singleFile: DashFile){
        let verify = confirm(`Are you sure you want to delete this file?`)
        if (verify == true) {
            this.fileAdminSVC.removeFile(singleFile);
            this.router.navigate(['/myFiles']);
        } else {
            alert('Nothing deleted!');
        }
    }


     
}