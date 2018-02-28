import { Component,Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service';
import { ImageWidget, FusionWidget } from '../models/widget';

@Component({
    selector: 'ctlChart',
    template: `                            
    <fusioncharts
        width="{{widget.width}}"
        height="{{widget.height}}"
        type="{{widget._fcType}}"
        dataFormat="JSON"
        [dataSource]="widget._dataSource"
        [events]="events">                                                
    </fusioncharts> 
    `  
})             
export class ChartComponent  {   
    @Input() widget: FusionWidget; 
     
    setStyles() {
        let styles = {            
        };
        return styles;
      }
      height() {        
        return this.widget.height;
      }
      width() {        
        return this.widget.width;
      }
      alt() {        
        return this.widget.title;
      }
    constructor( ){       
    }    
}