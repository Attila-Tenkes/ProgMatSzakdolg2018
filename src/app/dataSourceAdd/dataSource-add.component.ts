import { Component, Host } from '@angular/core';
import { Router } from '@angular/router';
import { DataSourceService } from '../services/dataSource.service';
import { DataSource } from '../models/datasource';
import { DashFile } from '../models/dashfile';
import { DataSourceAdminComponent } from '../dataSourceAdmin/dataSource-admin.component';
import { FileService } from '../services/file.service';

@Component({
    selector: 'dataSource-editor',
    templateUrl: './dataSource-add.component.html',
})
export class DataSourceAddComponent {
       
    name: string;
    description: string;    
    dataSource: DataSource;    
    typename:string = 'webservice'; //Default
    format:string = 'MultiSeries'; //Default
    user: string=null;
    pwd: string=null;
    fileUrl:string=null;
    webServiceUrl: string=null;
    theFiles: DashFile[];
    csvSeparator: string=null;
    csvSkip: number=null;
    private _parent:  DataSourceAdminComponent;
    constructor( private dataSourceSVC: DataSourceService, private router: Router, private fileAdminSVC: FileService,
                 @Host() parent:  DataSourceAdminComponent )
    {
        this._parent = parent;        
        this.fileAdminSVC.getDataFilesOnce().then(x=>
        {
            this.theFiles=x;
        });
    }
    onFileDDLChange(selectedFile:any) {
        console.log(selectedFile);
        debugger;
        this.fileUrl = selectedFile;
        //todo type check        
      // (<widgets.ImageWidget> this.root.selected.widget).imgSrc = selectedImage;
    }
    
    createDataSource(){       
        this.dataSource = new DataSource( 
            this.name, 
            this.description,  
            this.typename, 
            this.format,
            null,
            this.user,
            this.pwd,
            this.fileUrl,  
            this.webServiceUrl ,
            this.csvSeparator,
            this.csvSkip  
        );
        this.dataSourceSVC.createDataSource(this.dataSource);
        alert(`${this.name} added`);        
        this._parent.chooseMode('');
    }    

    cancel(){
        this._parent.chooseMode('');        
    } 

}