
import { Component, Input,ElementRef,ViewChild,ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import {UserService} from '../services/user.service';
import { UIDesignerService } from '../services/designer.service';
import { Widget } from '../models/widget';
import { Helpers } from '../shared/helpers';
import { RawDashData,  DecoratedDashData } from '../models/dashdata';
declare var $:any;
@Component({   
    selector:'ctlToolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./designer.component.css'],
})

export class ToolbarComponent {
    widgets:Array<Widget>;
    @Input() node: RawDashData;
    @Input() root: DecoratedDashData;
    constructor( private designerSVC: UIDesignerService,   private userSVC: UserService,
    public viewContainerRef: ViewContainerRef ){
        this.initWidgetList();
    }
    ngAfterViewInit(){
        var that = this;
        $(document).ready(function(){
          //  that.makeToolbar(true);            
        });
    }
  /*  ngOnChanges(){
        var that = this;
        $(document).ready(function(){
            that.makeToolbar(false);
        });
    }*/
    initWidgetList(){
        this.widgets=this.designerSVC.getAllWidgets();
    }
    onItemClicked(event:any, widget:any){
        console.log(event); 
        console.log(widget); 
       // this.initWidgetList();
       
        //debugger;
    }
    onDrag(event:any, widget:any){     
        console.log(event); 
        console.log(widget);  
         event.preventDefault();
        event.dataTransfer.setData("widget", widget);
        event.dataTransfer.dropEffect = "copy"      
    }
   /*  makeToolbar(hidden:boolean){                     
          $('#dbToolbar').dialog({title:'Toolbar', closeOnEscape: true});
          if (hidden){
            $('#dbToolbar').dialog("close");
          }         
          $("#toolbarContainer").droppable({
                        hoverClass: "ui-state-hover",
                        greedy: true ,
                        accept: ".dbWidget",
                      //  snap: true,
                        drop: function( evt:any, ui:any ) {
                            //debugger;
                            ui.draggable.attr('DoNothing', true);
                            ui.draggable.draggable( "option", "revertDuration", 10);
                            ui.draggable.draggable( "option", "revert", true );
                            evt.preventDefault();
                            evt.stopPropagation();		
                         }
            });        
    }*/

    closeToolbar(){
        $("#dbToolbar").dialog("close");        
        console.log('closeToolbar'); 
    }
}