import { Component,  Host } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../services/file.service';
import { DashFile } from '../models/dashfile';
import {Constants}from '../shared/constants';
import { FileAdminComponent}from '../fileAdmin/file-admin.component';
import notify from 'devextreme/ui/notify';

@Component({
    selector: 'file-editor',
    templateUrl: './file-add.component.html',
})
export class FileAddComponent {
    
    imgTitle: string;
    contents: string;
    name: string;
    description: string;
    file: DashFile;    
    extensions:string;
    _parent:FileAdminComponent;
    constructor( private fileAdminSVC: FileService, private router: Router, @Host() parent:  FileAdminComponent  ){
        this.extensions = Constants.EXTENSIONS;
        this._parent = parent;
    }

    fileLoad($event: any) {
        let myReader:FileReader = new FileReader();
        let file:File = $event.target.files[0];
        this.imgTitle = file.name; 
        let idx = 0;       
        if (file.name.toLocaleLowerCase().endsWith('.csv'))
        {
            myReader.readAsText(file);
        }
        else{ //ipeg
            idx = 23; 
            myReader.readAsDataURL(file);
        }
       
        myReader.onload = (e: any) => {
            this.contents = e.target.result.substring(idx);
        }
    }

    createFile(){        
        this.file = new DashFile ( 
            this.name, 
            this.description, 
            this.imgTitle, 
            this.contents
        );
        this.fileAdminSVC.createFile(this.file);        
        notify(`${this.name} added`, "Success", 2000);
        //this.router.navigate(['/myFiles']);
         this._parent.chooseMode('');
    }    

    cancel(){
        this._parent.chooseMode('');
        //this.router.navigate(['/myFiles']);
    } 

}