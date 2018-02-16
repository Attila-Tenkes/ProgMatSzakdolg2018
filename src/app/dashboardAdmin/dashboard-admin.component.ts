import { Component, OnInit } from '@angular/core';
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
            that.theDashboards = Object.keys(tmp).map(key => new DashMeta(tmp[key].name, tmp[key].desc,tmp[key].readOnly,tmp[key].id));             
        });       
    }
    
    shareDashboard(theDashboard?: DashMeta){
        debugger;
        this.isUserPopupVisible = false;
        this.shareDataSource(theDashboard, this.selectedItems);
        //todo userSvc.callSave
    }

    shareDataSource(update: DashMeta, readers: UserData[]){    
      var db = null;
      this.designerSVC.get(update.id,this)
       .then(raw=>        
            {           
                debugger;                
                var users = readers.filter(reader => reader.id!=this.userKey);       
                var uids = Object.keys(users).map(key => users[key].id);     
                this.designerSVC.updateReaders(update, raw,  uids, this.allUsersExceptLoggedIn);
                //todo move it into service
              /*  Object.keys(this.allUsersExceptLoggedIn).map(key =>
                {           
                    //if (this.allUsers[key].id!==this.userKey) {
                        let userObjRef = firebase.database().ref(Constants.DASHBOARD_REF).child( this.allUsersExceptLoggedIn[key].id);

                        if (uids.indexOf(this.allUsers[key].id)>-1)
                        {
                            //make copies?
                            userObjRef.child(update.id).update(
                                { id:update.id, name:update.name, desc:update.description,readOnly:true, raw: x.toJSON()}
                            );
                        }
                        else
                        {
                            //revoke
                            userObjRef.child(update.id).remove();
                        }
                    //}
                });      */       
            }
       );
        
                          
        alert('shared');       
    }
        

    editDashboard(theDashboard: DashMeta){
        this.singleDashboard= theDashboard;
        this.formDisplay = false;
    }

    designDashboard(theDashboard: DashMeta){
        this.router.navigate(['/designer/'+theDashboard.id]);
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
            alert('Nothing deleted!');
        }
    }     
}