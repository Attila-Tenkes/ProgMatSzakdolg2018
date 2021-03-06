import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { UIDesignerService } from '../services/designer.service';
import { DashMeta } from '../models/dashmeta';
import { UserData } from '../models/user';
import { Constants} from '../shared/constants';

import { DxSelectBoxModule, DxCheckBoxModule, DxListModule } from 'devextreme-angular';
import DxDataSource  from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import notify from 'devextreme/ui/notify';

@Component({
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})

export class DashboardAdminComponent implements OnInit {
    theUser: string;
    menuChoice: string;
    theDashboards: DashMeta[];
    formDisplay: boolean = true;
    singleDashboard: DashMeta;
    showUsers:boolean = false;
    allUsers: UserData[]; 
    allUsersExceptLoggedIn: UserData[];    
    isUserPopupVisible:boolean=false;
    selectedItems: any[] = [];
    userKey:string;    


    ShowHidePopup(value: boolean, dash?:any){      
        this.singleDashboard = dash;
        this.selectedItems = [];
        var that = this;
        //get readers
        if (this.singleDashboard && value==true){
            dash.refreshReaders( 
                function(items:any){
                    that.selectedItems=items;                                                           
                });            
        }
        this.isUserPopupVisible=value;
    }

    constructor( 
        private userSVC: UserService, 
        private router: Router, 
        private designerSVC: UIDesignerService
    ){
        var that = this;       
        this.userKey = this.userSVC.authUser.uid;              
        userSVC.getAllUsers(function(snapshot) {
                let tmp: string[] = snapshot.val();
                that.allUsers = Object.keys(tmp).map(key =>
                     new UserData(
                         key, 
                         tmp[key].name
                        )
                    );                        
                    that.allUsersExceptLoggedIn = that.allUsers.filter(usr=>usr.id!=that.userKey);
            }); 
         
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
        this.getDashboards();
    }

    getDashboards(){        
        /*this.designerSVC.getDashMetas().then(
            items=>
            {                
                this.theDashboards=items;
            }
        );   */
        var that = this;        
        this.designerSVC.getDashMetas( function(snapshot) {
            let tmp: string[] = snapshot.val();                  
            that.theDashboards = Object.keys(tmp).map(key => 
                new DashMeta(that.designerSVC,tmp[key].name, tmp[key].desc,
                    tmp[key].readOnly,tmp[key].id,
                    tmp[key].owner?tmp[key].owner:'unknown'));             
        });       
    }
    
    shareDashboard(theDashboard?: DashMeta){
        //debugger;
        this.isUserPopupVisible = false;
        this.shareDataSource(theDashboard, this.selectedItems);
        //todo userSvc.callSave
    }

    shareDataSource(update: DashMeta, readers: UserData[]){    
      var db = null;
      this.designerSVC.getRawDash(update.id,this)
       .then(raw=>        
            {           
                //debugger;                
                var users = readers.filter(reader => reader.id!=this.userKey);       
                //var uids = Object.keys(users).map(key => users[key].id);   
                  console.log('Debug: users: '+users);
                this.designerSVC.updateReaders(update, raw,  users, this.allUsersExceptLoggedIn);                   
            }
       );
       notify("Successfully saved!", "Success", 2000);                                  
    }
        

    editDashboard(theDashboard: DashMeta){
        this.singleDashboard= theDashboard;
        this.formDisplay = false;
    }

    designDashboard(theDashboard: DashMeta){
        this.router.navigate(['/designer/'+theDashboard.id]);
    }

    viewDashboard(theDashboard: DashMeta){
        this.router.navigate(['/viewer/'+theDashboard.id]);
    }
    
    cancelEdit(){
        this.formDisplay = true;
    }

    updateDashboard(singleDashboard: DashMeta){
        this.designerSVC.editDashMeta(singleDashboard);
        this.formDisplay = true;
    }

    deleteDashboard(singleDashboard: DashMeta){
        let verify = confirm(`Are you sure you want to delete this dashboard?`)       
        if (verify == true) {
            this.designerSVC.removeDashMeta(singleDashboard);            
            this.router.navigate(['/myDashboards']);
        } else {
            notify("Nothing deleted!", "Info", 2000);
        }
    } 

    selectedUsers(){        
        let readers:UserData[] = [];
        //var res:string = '';
        for(var i:number=0;i< this.selectedItems.length;i++) {
            readers =readers.concat(this.allUsers.filter(usr=>usr.id==this.selectedItems[i]));
            // res+=this.allUsers.filter(usr=>usr.id==this.selectedItems[i].id).name;
        };
        return readers.map(function(x:UserData){return x.name}).join(", ");
    }

    shareTitle(){
        if (this.singleDashboard){
            return 'Share: ' +this.singleDashboard.name;
        }
        else return 'Share';
    }
}