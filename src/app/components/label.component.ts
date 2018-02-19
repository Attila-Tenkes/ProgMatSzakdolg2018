import { Component,Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service';
import { Label } from '../models/widget';

@Component({
    selector: 'ctlLabel',
    template: `                        
    <span [ngStyle]="setStyles()"> {{widget.title}} </span>
    `  
})             
export class LabelComponent  {   
    @Input() widget: Label; 
     
    setStyles() {
        let styles = {
          'color': this.widget.fontColor,
          'font-weight': this.widget.fontWeight,
          'font-size':this.widget.fontSize 
        };
        return styles;
      }
  
    constructor( ){       
    }    
}