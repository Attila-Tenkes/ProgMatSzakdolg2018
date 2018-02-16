import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { ErrorComponent } from '../error/error.component';
import { LoginComponent }    from '../login/login.component';
import { SignUpComponent }    from '../signUp/sign-up.component';

import { FileAdminComponent } from '../fileAdmin/file-admin.component';
import { DataSourceAdminComponent } from '../dataSourceAdmin/dataSource-admin.component';
import { DashboardAdminComponent } from '../dashboardAdmin/dashboard-admin.component';
import { DesignerComponent } from '../designer/designer.component';
//import { ViewerComponent } from '../designer/viewer.component';
import { UserService } from '../services/user.service';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'designer', component: DesignerComponent, canActivate: [UserService] },           
            { path: 'myFiles', component: FileAdminComponent, canActivate: [UserService]},
            { path: 'myDataSources', component: DataSourceAdminComponent,canActivate: [UserService] },
            { path: 'myDashboards', component: DashboardAdminComponent, canActivate: [UserService] },
            { path: 'designer/:id', component: DesignerComponent, canActivate: [UserService]},
            { path: 'viewer/:id', component: DesignerComponent, canActivate: [UserService], data:{mode:'ro'} },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignUpComponent },
            { path: '' , component: HomeComponent},
            { path: '**' , component: ErrorComponent }
        ])    
    ],
    exports: [
        RouterModule
    ],
    declarations: [
      
    ]
})
export class AppRoutingModule {}

