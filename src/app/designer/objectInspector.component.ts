import { Component, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, NgZone, Host} from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import {UserService} from '../services/user.service';
import { UIDesignerService } from '../services/designer.service';
import { FileService } from '../services/file.service';
import { DataSourceService } from '../services/dataSource.service';
import { RawDashData,  DecoratedDashData } from '../models/dashdata';
import { Helpers }from '../shared/helpers';
import { DashFile } from '../models/dashfile';
import { DataSource } from '../models/datasource';
import  * as widgets from '../models/widget';
import { DesignerComponent }from './designer.component'

@Component({   
    selector:'ctlObjectInspector',
    templateUrl: './objectInspector.component.html',
    styleUrls: ['./designer.component.css'] 
})

export class ObjectInspectorComponent implements AfterViewInit{
    @ViewChild('jqueryElement') el:ElementRef;
    @Input() node: RawDashData;
    @Input() root: DecoratedDashData;
    theImageFiles: DashFile[];
    theDataSources:DataSource[];
    theOrientations:string[];

    private _parent: DesignerComponent;
    constructor( private designerSVC: UIDesignerService, private userSVC: UserService,  private fileAdminSVC: FileService,
                private dsSvc:DataSourceService,private zone:NgZone,@Host() parent: DesignerComponent)
    {
        debugger;
        var that = this;
        this._parent=parent;
        this.fileAdminSVC.getImagesOnce().then(x=>{this.theImageFiles=x;});
        this.dsSvc.getDataSourcesOnce().then(x=>{ this.theDataSources=x;});      
        this.theOrientations =['horizontal','vertical'];
    }
    getAvailableDataSources(){
        if (this.root.selected.widget instanceof widgets.DataSourcedWidget && this.theDataSources && this.theDataSources.length>0){
            var format = (<widgets.DataSourcedWidget>this.root.selected.widget)._dataFormat;
            var dss = this.theDataSources.filter( ds => format.indexOf(ds.format)>= 0 || format.indexOf('any')>=0);            
            return  dss;
        }
        return [];        
    }
    onImageDDLChange(selectedImage:any) {
        console.log(selectedImage);
        //todo type check        
       (<widgets.ImageWidget> this.root.selected.widget).imgSrc = selectedImage;
    }
    onOrientationChange(selectedOrientation:any) {
        console.log(selectedOrientation);
        //todo type check        
       (<widgets.Container> this.root.selected.widget).orientation = selectedOrientation;
    }
    
    onDataSourceDDLChange(selectedDS:any) {
        console.log(selectedDS);
        //todo type check        
        if (this.root.selected.widget instanceof widgets.DataSourcedWidget )
        {
            (<widgets.DataSourcedWidget>this.root.selected.widget).setDataSourceID(selectedDS).then(
                ()=>{
                    this._parent.notify();
            });
        }
       // this.root.selected.widget.setDataSource(selectedDS);
    }
    onKey(event: KeyboardEvent)  {

        //todo type check!
        //todo keycode check
        (<widgets.FusionWidget>this.root.selected.widget)._dataSource["depPropName"] = (<widgets.FusionWidget>this.root.selected.widget).DependencyProperty;
    }
    onKey2(event: KeyboardEvent)  {

        //todo type check!
        //todo keycode check
        (<widgets.FusionWidget>this.root.selected.widget)._dataSource["depPropExp"] = (<widgets.FusionWidget>this.root.selected.widget).DependencyExpression;
    }
    onKey3(event: KeyboardEvent)  {

        //todo type check!
        //todo keycode check      
        this.root.sortChildren(this.root.selected);
    }
    onKey4(event: KeyboardEvent)  {
        (<widgets.FusionWidget>this.root.selected.widget).notify('rerender');
    }
    fusionProp(prop:string){       
        return  (prop =='caption' ||prop=='xAxisName');
    }
    ngAfterViewInit(){
        var that = this;
        $(document).ready(function(){
           //that.makePropEditor(true)
        });       
    }

    getProperties(){
        let nodeProp=  Object.getOwnPropertyNames(this.root.selected).filter(
            function(x){
                    return x!=='widget' && x!=='cells'&& x!=='domId'   && x!=='id' &&  x.indexOf("_")!=0;
                   //return x.indexOf("_")!=0;
                }
        );
        return nodeProp;
    }

    getValue(prop:string){
        return this.root.selected[prop];
    }    
    
    getWidgetProperties(){            
        let widgetProp=  Object.getOwnPropertyNames(this.root.selected.widget).filter(
            function(x){                   
                   return x.indexOf("_")!=0;
                }
        );;
        return widgetProp;
    }
    getWidgetValue(prop:string){
        return this.root.selected.widget[prop];
    }
    deleteControl(ctl:any){
        if (ctl && ctl.domId)
        {
            this.root.remove(ctl.domId)
        }
    }
    closePropertyEditor(hidden:boolean){
        $("#dbObjInspector").dialog("close");
    }
    notify(){
        this.zone.run(() => {
            console.log('enabled time travel');
        });
    }
}