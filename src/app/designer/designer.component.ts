import { Component,ElementRef,ViewChild, SimpleChanges,ChangeDetectionStrategy,ViewContainerRef,ComponentFactoryResolver, NgZone  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import {UserService} from '../services/user.service';
import { UIDesignerService } from '../services/designer.service';
import { DataSourceService } from '../services/dataSource.service';
import { RawDashData, DecoratedDashData } from '../models/dashdata';
import { DashMeta } from '../models/dashmeta';
import { Helpers } from '../shared/helpers';
import { Constants } from '../shared/constants';
import { ToolbarComponent } from './toolbar.component';
import { FusionChartsModule } from 'angular2-fusioncharts';
import { ChangeDetectorRef} from '@angular/core';
declare var $:any;
//declare var HACK :boolean;
//declare function runUi(data:any):any;
@Component({   
   
    templateUrl: './designer.component.html',
    styleUrls: ['./designer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    entryComponents: [
        ToolbarComponent
        ]
})

export class DesignerComponent {
    theUser: string;
    _data:DecoratedDashData;
    _root:RawDashData;
    _mode:string;
    @ViewChild('ctlExplorer') explorer:ElementRef;
    @ViewChild('ctlEditor') layoutEditor:ElementRef;
    @ViewChild(ToolbarComponent) adHost: ToolbarComponent;

isInspectorPopupVisible:boolean =false;
isExplorerPopupVisible:boolean=false;
isToolbarPopupVisible:boolean=false;
_me:DesignerComponent;
    constructor(private route: ActivatedRoute, 
                private designerSVC: UIDesignerService,   
                private userSVC: UserService, 
                private dsService: DataSourceService,
                private router: Router ,
                private componentFactoryResolver: ComponentFactoryResolver, 
                private zone:NgZone,
                private changeDetector:ChangeDetectorRef )
    {                 
        this._me=this;
    }
   showHideExplorer(value: boolean){
       this.isExplorerPopupVisible=value;
   }
   showHideToolbar(value: boolean){
       this.isToolbarPopupVisible=value;
   }
   showHideInspector(value: boolean){
       this.isInspectorPopupVisible=value;
   }
    ngOnInit(){
       this.theUser = this.userSVC.loggedInUser;
       let dashboardId = this.route.snapshot.params['id'];
       if (this.route.snapshot.data && this.route.snapshot.data.mode && this.route.snapshot.data.mode==='ro'){
           this._mode = 'Viewer';
       }
       else
       {
        this._mode = 'Designer';
       }
       debugger;
       var that =this;
       
      // let raw =this.designerSVC.get(dashboardId);
      // let meta = new DashMeta('ddd','sss',false,dashboardId);
      /* this.designerSVC.getDashMeta(dashboardId)
       .then(x=>        
            {
                this._data=new DecoratedDashData(x, raw, this.designerSVC );
                this._root = that._data.root();
                that.notify();
            }
       );  */

        this.designerSVC.getDash(dashboardId,this)
       .then(x=>        
            {
                this._data=x ;//new DecoratedDashData(meta, x, this.designerSVC);
                this._root = that._data.root();
                //redirect if it is not owned by the logged in user 
                if (that._data.meta.readOnly){                    
                    if (this.route.snapshot.url[0].path!='viewer'){
                        this.preview(); 
                    }
                }
                this.notify();
                this.runUi();
            }
       );  
     //   this._data=new DecoratedDashData(meta, raw, this.designerSVC );        
     //   this._root = raw;
    }

    ngOnChanges(changes:SimpleChanges){
        console.log('designer.ngOnChanges');
    }

    public notify(){
        this.changeDetector.detectChanges();
        this.zone.run(() => {
            console.log('enabled time travel');
        });
    }  
    public doTheMagic(){
        
        console.log('ezaz');
        this.attachJQEvents();
    }
    attachJQEvents(){
        //debugger;
        console.log('na most');
        var that = this;         
        $(".draggable").draggable({ cursor: "move", revert: "invalid" });                
        $(".draggable").data('context',this);
        $(".droppable").droppable({
            hoverClass: "ui-state-hover",
            greedy: true ,
            accept: ".dbWidget",
            
            drop: function( event:any, ui:any ) {
                debugger;
               if (!ui.draggable.attr('DoNothing')){ 
                    var draggableId = ui.draggable.attr('domId');
                    var droppableId = $(this).attr("domId");	
                    var context =  ui.draggable.data('context');
                    var layoutDescriptor =context._data;					  
                    if (draggableId)
                    {					                                				   
                        layoutDescriptor.move(draggableId, droppableId);                    	   				 
                    }
                    else
                    {
                        var ctlType = ui.draggable.attr("data-ctlType");						   				 
                        var x1=layoutDescriptor.add(droppableId,{type:ctlType});  
                        layoutDescriptor.highlightOne(x1);                       
                    }	
                    //ui.draggable.draggable( "option", "revertDuration", 10);
                    //ui.draggable.draggable( "option", "revert", true );
                    ui.draggable.removeAttr("style");
                                        
                    //HACK	
                    setTimeout(function(){context.notify();},100);                    
                    context.attachJQEvents()
                }else{
                    var x=0;
                   // HACK = false;
                 //layoutDescriptor.render();
                }
            }
            });        		
    }

    runUi(){
        var that = this;
        $(document).ready(function(){            
          that.attachJQEvents();
        });
    }

    save(){
       debugger;       
       this.designerSVC.save(this._data);
       console.log();
    }
    /*openToolbar(){
        $("#dbToolbar").dialog("open");        
        console.log('openToolbar'); 
    }  
    makeToolbar(hidden:boolean){ 
         //debugger;                    
          $('#dbToolbar').dialog({title:'Toolbar', closeOnEscape: true});
          if (hidden){
            $('#dbToolbar').dialog("close");
          }         
          $("#dbToolbar").droppable({
                        hoverClass: "ui-state-hover",
                        greedy: true ,
                        accept: ".dbWidget",
                        //snap: true,
                        drop: function( evt:any, ui:any ) {
                            //debugger;
                            ui.draggable.attr('DoNothing', true);
                            ui.draggable.draggable( "option", "revertDuration", 10);
                            ui.draggable.draggable( "option", "revert", true );
                            evt.preventDefault();
                            evt.stopPropagation();		
                         }
            });        
    }

    openPropertyEditor(hidden:boolean){
        $("#dbObjInspector").dialog("open");
    }

    makePropEditor(hidden:boolean){	
        $("#dbObjInspector").dialog({title:'Properties', closeOnEscape: true});
        if (hidden){
            $( "#dbObjInspector" ).dialog("close");
        }
    }

    makeObjExplorer(hidden:boolean){        
        $('#dbObjExplorer').dialog({title:'Explorer', closeOnEscape: true});
        if (hidden){
            $('#dbObjExplorer').dialog("close");
        }
    }

    openExplorer(){
        $("#dbObjExplorer").dialog("open");  
        //this.attachJQEvents ();
        console.log('openExplorer'); 
    }
    closeExplorer(){         
        $("#dbObjExplorer").dialog("close");  
        //this.attachJQEvents ();
        console.log('closeExplorer'); 
    }
*/

    preview(){
        this._mode='Viewer';
        this.router.navigate(['/viewer/'+this._data.meta.id]);
    }
    design(){
        this._mode='Designer';
        this.router.navigate(['/designer/'+this._data.meta.id]);
    }

}