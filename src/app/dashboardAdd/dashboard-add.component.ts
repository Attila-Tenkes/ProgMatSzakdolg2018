import { Component, Host } from '@angular/core';
import { Router } from '@angular/router';
import { UIDesignerService } from '../services/designer.service';
import { DashMeta } from '../models/dashmeta';
import { DashboardAdminComponent } from '../dashboardAdmin/dashboard-admin.component';

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
        this.dashboard = new DashMeta ( 
            this.name, 
            this.description,  
            false         
        );
        this.designerSVC.createDashMeta(this.dashboard);
        alert(`${this.name} added`);
       // this.router.navigate(['/myDashboards']);
        this._parent.chooseMode('');
    }    

    cancel(){
        //this.router.navigate(['/myDashboards']);
        this._parent.chooseMode('');
    } 

}