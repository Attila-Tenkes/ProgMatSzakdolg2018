import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './start/app.component';

import { CommonModule }   from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';


import { NavComponent } from './shared/navbar.component';
import { HomeComponent } from './home/home.component';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './shared/app.routing';

import { TruncatePipe } from './shared/trunc.pipe';
import { LoginComponent }    from './login/login.component';
import { SignUpComponent }    from './signUp/sign-up.component';

import { FileService } from './services/file.service';
import { FileAdminComponent }    from './fileAdmin/file-admin.component';
import { FileAddComponent }    from './fileAdd/file-add.component';

import { DataSourceService } from './services/dataSource.service';
import { DataSourceAdminComponent }    from './dataSourceAdmin/dataSource-admin.component';
import { DataSourceAddComponent }    from './dataSourceAdd/dataSource-add.component';

import { DashboardAdminComponent }    from './dashboardAdmin/dashboard-admin.component';
import { DashboardAddComponent }    from './dashboardAdd/dashboard-add.component';
import { UIDesignerService } from './services/designer.service';

import { DesignerComponent } from './designer/designer.component';
//import { ViewerComponent } from './designer/viewer.component';
import { LayoutDesignerComponent } from './designer/layoutDesigner.component';
import { ObjectExplorerComponent } from './designer/objectExplorer.component';
import { ToolbarComponent } from './designer/toolbar.component';
import { ObjectInspectorComponent } from './designer/objectInspector.component';

import { UserService } from './services/user.service';

// Import angular2-fusioncharts
import { FusionChartsModule } from 'angular2-fusioncharts';
 
// Import FusionCharts library
import * as FusionCharts from 'fusioncharts';
// Import FusionCharts Charts module
import * as Charts from 'fusioncharts/fusioncharts.charts';


//DevExtereme
import { DxButtonModule, DxPopupModule } from 'devextreme-angular';
import { DxSelectBoxModule, DxCheckBoxModule, DxListModule, DxDataGridModule, DxDateBoxModule } from 'devextreme-angular';
import { DxScrollViewModule, DxScrollViewComponent}from 'devextreme-angular';

import { SingleSeriesChartComponent } from './components/singleSeriesChart.component';


@NgModule({
    imports: [
        //Angular stuff
        BrowserModule,      
        CommonModule,
        FormsModule,  
        AppRoutingModule,
         // Specify FusionChartsModule as an import 
        // and pass FusionCharts and Charts as a dependency
        FusionChartsModule.forRoot(FusionCharts, Charts),
        
        //devEx controls        
        DxButtonModule,
        DxPopupModule,
        DxSelectBoxModule, DxCheckBoxModule, DxListModule, DxDataGridModule, DxDateBoxModule,
        DxScrollViewModule
    ],
    exports: [       
        TruncatePipe
    ],

    declarations: [
        AppComponent,
        NavComponent,
        HomeComponent,
        ErrorComponent,
        
        DesignerComponent,
        //ViewerComponent,
        LayoutDesignerComponent,
        ObjectExplorerComponent,
        ToolbarComponent,
        ObjectInspectorComponent,
        
        LoginComponent,
        SignUpComponent,
        TruncatePipe,
        FileAdminComponent,
        FileAddComponent,
        DataSourceAdminComponent,
        DataSourceAddComponent,
        DashboardAdminComponent,
        DashboardAddComponent,
        
        //widgets
        SingleSeriesChartComponent,
    ],
    providers: [
        UIDesignerService,
        UserService,    
        FileService,
        DataSourceService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
