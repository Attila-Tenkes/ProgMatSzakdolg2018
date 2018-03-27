import { Component, Host } from '@angular/core';
import { Router } from '@angular/router';
import { UIDesignerService } from '../services/designer.service';
import { DashMeta } from '../models/dashmeta';
import { DashboardAdminComponent } from '../dashboardAdmin/dashboard-admin.component';
import * as firebase from 'firebase';
import notify from 'devextreme/ui/notify';

@Component({
    selector: 'dashboard-editor',
    templateUrl: './dashboard-add.component.html',
})
export class DashboardAddComponent {
        
    name: string;
    description: string;    
    dashboard: DashMeta;    
    private _parent: DashboardAdminComponent;
    constructor( private designerSVC: UIDesignerService, private router: Router, @Host() parent: DashboardAdminComponent){
        this._parent=parent;
    }
    
    createDashboard(){
        let userKey = firebase.auth().currentUser.uid;      
        this.dashboard = new DashMeta ( 
            this.designerSVC,
            this.name, 
            this.description,  
            false         
        );
        this.dashboard.owner = userKey;
        this.designerSVC.createDashMeta(this.dashboard);        
        notify(`${this.name} added`,"Success",2000);
       // this.router.navigate(['/myDashboards']);
        this._parent.chooseMode('');
    }    

    cancel(){
        //this.router.navigate(['/myDashboards']);
        this._parent.chooseMode('');
    } 

}