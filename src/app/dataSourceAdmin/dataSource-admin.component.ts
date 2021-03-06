import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { DataSourceService } from '../services/dataSource.service';
import { DataSource } from '../models/datasource';
import { DashFile } from '../models/dashfile';
import { FileService } from '../services/file.service';
import notify from 'devextreme/ui/notify';

@Component({
  templateUrl: './dataSource-admin.component.html',
  styleUrls: ['./dataSource-admin.component.css']
})

export class DataSourceAdminComponent implements OnInit {
    theUser: string;
    menuChoice: string;
    theDataSources: DataSource[];
    formDisplay: boolean = true;
    singleDataSource: DataSource;
    theFiles: DashFile[];
    constructor( 
        private userSVC: UserService, 
        private router: Router, 
        private dataSourceSVC: DataSourceService,
        private fileAdminSVC: FileService
    )
    {
        this.fileAdminSVC.getDataFilesOnce().then(x=>this.theFiles=x);
    }

    logout(){
        this.userSVC.logout();
        this.router.navigate(['']);
    }

    chooseMode(mode: string){
        this.menuChoice = mode;
    }

    ngOnInit(){
        this.theUser = this.userSVC.loggedInUser;
        this.getDataSources();
    }

    getDataSources(){    
        var that = this;        
        this.dataSourceSVC.getDataSources( function(snapshot) {
                let tmp: string[] = snapshot.val();
                that.theDataSources = Object.keys(tmp).map(key =>
                     new DataSource(
                         tmp[key].name, 
                         tmp[key].desc,
                         tmp[key].typename,
                         tmp[key].format,                         
                         tmp[key].id, 
                         tmp[key].user,
                         tmp[key].pwd,
                         tmp[key].file,
                         tmp[key].url,
                         tmp[key].csvSeparator,
                         tmp[key].csvSkip));
            });        
    }

    editDataSource(theDataSource: DataSource){
        this.singleDataSource= theDataSource;
        this.formDisplay = false;
    }
    onFileDDLChange(selectedFile:any) {        
        //debugger;
        this.singleDataSource.file = selectedFile;      
    }
    cancelEdit(){
        this.formDisplay = true;
    }

    updateDataSource(singleProd: DataSource){
        this.dataSourceSVC.editDataSource(singleProd);
        this.formDisplay = true;
    }

    deleteDataSource(singleProd: DataSource){
        let verify = confirm(`Are you sure you want to delete this data source?`)
        if (verify == true) {
            this.dataSourceSVC.removeDataSource(singleProd);
            this.router.navigate(['/myDataSources']);
        } else {            
            notify('Nothing deleted!',"Info",2000);
        }
    }
    
    isTestPopupVisible:boolean=false;
    testResult:any;
    test(){     
      var that = this;
      if (this.singleDataSource){
            this.singleDataSource.load(function(x:any){           
            //debugger;    
            if (x){ 
                try{
                    var obj = JSON.parse(x);
                    that.testResult= JSON.stringify(obj,undefined,4); 
                }
                catch (err){
                    that.testResult= x; 
                }
                
            }  
            else {
                that.testResult = 'Failed to load';
            }                          
        },true)  ;
        }     
    }

    ShowHidePopup(show:boolean, ds?:DataSource){    
        this.isTestPopupVisible = show; 
        this.testResult = "connecting....."; 
        if (show==true){  
            if (ds){
                this.singleDataSource=ds;
            }
            this.test();
        }        
    }
     
}