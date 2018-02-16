import { Component, Input, Host, ViewChild, ElementRef, NgZone} from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import {UserService} from '../services/user.service';
import { UIDesignerService } from '../services/designer.service';
import { RawDashData, DecoratedDashData} from '../models/dashdata';
import {Helpers}from '../shared/helpers';
import { DesignerComponent }from './designer.component'

@Component({   
    selector:'ctlExplorer',
    templateUrl: './objectExplorer.component.html'    
})

export class ObjectExplorerComponent {
  //  @ViewChild('dbObjExplorer') el:ElementRef;
    @Input() node: RawDashData;
    @Input() root: DecoratedDashData;   
    @Input() designer: DesignerComponent;   
    constructor( private designerSVC: UIDesignerService,   private userSVC: UserService ){

    }

    showProperties(event:any, node:RawDashData){
        console.log('objExp.showProperties');
    }

    selectItem(event:any, node:RawDashData){
        console.log(event); 
        //$( "#dbObjInspector" ).dialog("open");  
        this.root.highlightOne(node);              
        event.preventDefault();
		event.stopPropagation();
    }

    contextMenu(event:any, node:RawDashData)
    {
        console.log(event);      
        this.root.highlightOne(node);      
        this.designer.showHideInspector(true);
        event.preventDefault();
		event.stopPropagation();
    }

    css(node:RawDashData):string  {
        let c='navItem'; 
        if (node.isHighlighted){
            c+=' hightlightObj';
        }
        return c;
    }

    //todo ezt at kellene rakni az extendedbe
    domID(node:RawDashData):string
    {
        if (node.domId == null ||node.domId  =='-1' )
        {
            node.domId= Helpers.NextID()        
        }
        return node.domId;
    }   

}