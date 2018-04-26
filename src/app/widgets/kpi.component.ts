import { Component,Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { KPIWidget } from '../models/widget';

@Component({
    selector: 'ctlKPI',
    template: `                        
    <span [ngStyle]="setStyles()"> {{widget.label}} {{widget._calcResult}} </span>
    `  
})             
export class KPIComponent  {   
    @Input() widget: KPIWidget; 
     
    setStyles() {
        let styles = {
          'color': this.widget._calcColor,
          'font-weight': this.widget.fontWeight,
          'font-size':this.widget.fontSize 
        };
        return styles;
      }
  
    constructor( ){       
    }    
}