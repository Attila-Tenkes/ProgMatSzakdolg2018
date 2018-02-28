import { Component, Input, NgZone, Host } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import {UserService} from '../services/user.service';
import { UIDesignerService } from '../services/designer.service';
import { RawDashData, DecoratedDashData } from '../models/dashdata';
import  * as widgets from '../models/widget';
import { Helpers } from '../shared/helpers';
import { Constants } from '../shared/constants';
import { DesignerComponent }from './designer.component'

import { DxDataGridModule, DxDateBoxComponent } from 'devextreme-angular';
@Component({   
    selector:'ctlEditor',
    templateUrl: './layoutDesigner.component.html'    
})

export class LayoutDesignerComponent {
    @Input() node: RawDashData;
    @Input() parent: RawDashData;
    @Input() root: DecoratedDashData;
    public designer:DesignerComponent;
    public dependenyProperties:any[]= []; 
    constructor( private designerSVC: UIDesignerService,   private userSVC: UserService, private router: Router, 
                 private zone:NgZone, @Host() parent: DesignerComponent ){
        this.designer=parent;
    }
  
    notify(){
        this.zone.run(() => {
            console.log('enabled time travel');
        });
       // this.designer.notify();
    }
    selectItem(event:any, node:RawDashData){
       console.log(event); 
       // debugger;     
        this.root.highlightOne( node);
        this.notify();
        event.preventDefault();
		event.stopPropagation();
    }   

    contextMenu(event:any, node:RawDashData)
    {
        console.log(event);  
        if (!this.isViewerMode())
        {
            this.root.highlightOne(node);                
            this.designer.showHideInspector(true);        
        }
        event.preventDefault();
        event.stopPropagation();
    }
    isViewerMode(){
        return  this.designer &&  this.designer._mode && this.designer._mode=='Viewer';
    }
    isFusionChart(widget:widgets.Widget):boolean{      
       return   widget instanceof widgets.FusionWidget;
    }
    isContainer(widget:widgets.Widget):boolean{     
        return   widget instanceof widgets.Container;
    }
    isTable(widget:widgets.Widget):boolean{      
       return   widget instanceof widgets.GridWidget;
    }
    isLabel(widget:widgets.Widget):boolean{      
        return   widget instanceof widgets.Label;
     }
    isDatePicker(widget:widgets.Widget):boolean{      
       return   widget instanceof widgets.DatePicker;
    }
    isKPI(widget:widgets.Widget):boolean{     
        return   widget instanceof widgets.KPIWidget;
    }
    isImage(widget:widgets.Widget):boolean{     
        return   widget instanceof widgets.ImageWidget;
    }
    //RawDashData  Extension methods
    css(node:RawDashData, parent:RawDashData):string  {
        let result = ' dbWidget ';
        if (node)
        {                   
            //custom css
            let cust= node.customCss==null?'':node.customCss;
            //widget specific
            let widgetCss = node.widget.css();   
            let designer = '';   
            if (this.isViewerMode())
            {
                widgetCss=widgetCss.replace('draggable','').replace('droppble','');
            }
            else {
                designer = '-designer';  
                if (node.isHighlighted){
                    result+=' hightlightObj';
                } 
            }
            result += cust +widgetCss;
            if (parent)
            {
                if (parent.widget instanceof widgets.Container)
                {                    
                    if ((<widgets.Container>parent.widget).orientation &&(<widgets.Container>parent.widget).orientation==Constants.HORIZONTAL)
                    {
                        result += 'tdCell tdCell'+designer + ' ';
                    }
                    else
                    {        
                        result += 'tdRow tdRow'+designer + ' ';
                    }

                }
            }    
        }
        return result;
    }
     //todo ezt at kellene rakni az extendedbe
    domID(node:RawDashData):string
    {
        if (node.domId == null || node.domId =='-1' || node.domId =='')
        {
            node.domId= Helpers.NextID()        
        }
        return node.domId;
    }

    selectedValue: string = "nothing";
    selectedKey: string = "nothing";
    onDateChanged(event:any, widget:any)
    {
        debugger;        
        this.dependenyProperties[widget.DependencyPropertyName] = event.value; 
        this.root.visitAll(
                                (node:RawDashData,arg:any)=>{
                                if (node.widget 
                                    && node.widget["DependencyPropertyExpression"]!=undefined 
                                    //&& node.widget instanceof widgets.DependencyReceiver
                                )
                                {                                     
                                     var observer =<widgets.DependencyReceiver> node.widget ;                                     
                                     observer.notify(arg);                                                                                                
                                }                                        
                            },  
                            this.dependenyProperties);                             
    }
    onDataplotClick() {
        var _this = this;
        debugger;
        return (eve:any, arg:any) => {          
            
            _this.selectedValue = arg.displayValue;
            try
            {
                _this.selectedKey = eve.sender.args.dataSource.data[arg.dataIndex].key;
                if (eve.sender.args.dataSource.depPropName ){
                    _this.dependenyProperties[eve.sender.args.dataSource.depPropName]=_this.selectedKey;
                    //console.log(_this.dependenyProperties);
                    _this.root.visitAll(
                                (node:RawDashData,arg:any)=>{
                                if (node.widget 
                                    && node.widget["DependencyPropertyExpression"]!=undefined 
                                    //&& node.widget instanceof widgets.DependencyReceiver
                                )
                                {                                     
                                     var observer =<widgets.DependencyReceiver> node.widget ;                                     
                                     observer.notify(arg);                                                               
                                }                                        
                            },  
                            _this.dependenyProperties);
                }
            }
            catch(err){

            }

        }
    }
    
    events = {
        dataplotClick : this.onDataplotClick()
    }     
}