import { Component,Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../services/user.service';
import { ImageWidget } from '../models/widget';

@Component({
    selector: 'ctlImage',
    template: `                            
    <img [ngStyle]="setStyles()" class="mini-img" [src]= "widget.imgSrc" [width]="width()" [height]="height()" [alt]="alt()">
    `  
})             
export class ImageComponent  {   
    @Input() widget: ImageWidget; 
     
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