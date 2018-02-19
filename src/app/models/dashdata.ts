import { Constants} from '../shared/constants';
import { Helpers} from '../shared/helpers';
import { Widget, Container , WidgetFact, ImageWidget,DataSourcedWidget, SingleSeriesFusionWidget, Label, KPIWidget} from '../models/widget';
import { DashMeta} from '../models/dashmeta';
import { UIDesignerService } from '../services/designer.service';
import { DataSourceService } from '../services/dataSource.service';

export class RawDashData {
        public name?: string;
        public description?: string;   
        public customCss?: string;            
        public domId?: string;        
        public isHighlighted?: boolean;//is current node selected       
        public widget?: Widget;  
        public cells?:RawDashData[];       
    constructor();
    constructor( name?: string,
        description?: string,       
        customCss?: string,             
        domId?: string,        
        isHighlighted?: boolean,       
        widget?: Widget,    
        cells?:RawDashData[]       
    ){
        this.name=  name || '';
        this.description= description|| '';       
        this.customCss= customCss|| '';               
        this.domId= domId||'-1';        
        this.isHighlighted = isHighlighted|| false;       
        this.widget= widget||null;  
        this.cells= cells||[];
    } 

    fromJSON(json: any, dataService:UIDesignerService,context?: any):any{
           this.name = json.name?json.name:'';
           this.description = json.description?json.description:'';
           this.customCss = json.customCss?json.customCss:'';                     
           this.domId = json.domId?json.domId:'';
           this.widget = WidgetFact.createWidget(json, dataService, context); 
           
           if (json.DependencyPropertyName){this.widget["DependencyPropertyName"] = json.DependencyPropertyName;}
           if (json.DependencyPropertyExpression){this.widget["DependencyPropertyExpression"] = json.DependencyPropertyExpression;}   
           if (json.keyAttr){this.widget["keyAttr"] = json.keyAttr;}
           if (json.valAttr){this.widget["valAttr"] = json.valAttr;}
           if (json.fontWeight){this.widget["fontWeight"] = json.fontWeight;}
           if (json.fontSize){this.widget["fontSize"] = json.fontSize;}      
           if (json.fontColor){this.widget["fontColor"] = json.fontColor;}
           if (json.upperTreshhold){this.widget["upperTreshhold"] = json.upperTreshhold;}
           if (json.upperColor){this.widget["upperColor"] = json.upperColor;}
           if (json.lowerTreshhold){this.widget["lowerTreshhold"] = json.lowerTreshhold;}      
           if (json.lowerColor){this.widget["lowerColor"] = json.lowerColor;}
                      
           this.cells= [];
           if (json.cells)
           {
            for (let i=0;i<json.cells.length;i++){
                let x:RawDashData = new RawDashData();
                this.cells.push(x.fromJSON(json.cells[i], dataService,context));              
            }
            //sort cells
            this.cells = this.cells.sort(function(a, b) {
                return a.widget.visibleOrder - b.widget.visibleOrder;
              })
           }  
           return this;     
    }  
    toJSON():any{
      let result:any = {
            name: this.name,
            description : this.description,
            customCss : this.customCss,          
            domId : this.domId,                            
            type:this.widget.typename,
            height:this.widget.height,
            width:this.widget.width,
            title:this.widget.title,
            cells:[],
            visibleOrder:this.widget.visibleOrder
          };
//todo ezt az if-ezest  oop-san kene megcsinalni
            if ( this.widget instanceof Container){
                result.orientation=(<Container>this.widget).orientation;
            }
            else if ( this.widget instanceof ImageWidget){
                result.imgSrc=(<ImageWidget>this.widget).imgSrc;
            }
            else if ( this.widget instanceof Label ){
                result.fontSize=(<Label>this.widget).fontSize;
                result.fontWeight=(<Label>this.widget).fontWeight;
                result.fontColor=(<Label>this.widget).fontColor;
            }
            else if (this.widget instanceof KPIWidget){
                result.fontSize=(<KPIWidget>this.widget).fontSize;
                result.fontWeight=(<KPIWidget>this.widget).fontWeight;
                result.fontColor=(<KPIWidget>this.widget).fontColor;
                result.upperTreshhold=(<KPIWidget>this.widget).upperTreshhold;
                result.upperColor=(<KPIWidget>this.widget).upperColor;
                result.lowerTreshhold=(<KPIWidget>this.widget).lowerTreshhold;
                result.lowerColor=(<KPIWidget>this.widget).lowerColor;
            }
            if ( this.widget instanceof DataSourcedWidget){
                result.dataSourceID = this.widget.dataSourceID;
            }
            if ( this.widget instanceof SingleSeriesFusionWidget){
                result.keyAttr = this.widget["keyAttr"];
                result.valAttr = this.widget["valAttr"];
            }
            if ( this.widget.hasOwnProperty("DependencyPropertyName")){           
                result.DependencyPropertyName = this.widget["DependencyPropertyName"]
            }

            if ( this.widget.hasOwnProperty("DependencyPropertyExpression")){           
                result.DependencyPropertyExpression = this.widget["DependencyPropertyExpression"]
            }
            for (let i=0;i<this.cells.length;i++)
            {                
                result.cells.push(this.cells[i].toJSON());              
            }

        return result; 
    }
    showClearfix(){
        return this.widget instanceof Container && this.widget.orientation && this.widget.orientation==Constants.HORIZONTAL;
    } 
}

export class DecoratedDashData{
    private _rawData : RawDashData;
    public meta:DashMeta;
    public selected?: RawDashData; //store a reference in the root to the selected node!
    lookupNode(node:RawDashData, predicate:(node:RawDashData)=>boolean):RawDashData{		
			if (predicate(node )){
				return node;
			}else {
				if (node.cells){
					var i =0;
					var found = null;
					
					while ( i<node.cells.length && found==null)
					{
						found =this.lookupNode(node.cells[i], predicate);						
						i++;
					}
					return found;
				}
				return null;
			}		
	}
    lookupParentNode(parent:RawDashData, node:RawDashData, id:string):RawDashData{			  
        if (node.domId==id){
            return parent
        }
        else {
            if (node.cells)
            {
                var i =0;
                var found = null;
                
                while ( i<node.cells.length && found==null)
                {
                    found =this.lookupParentNode(node, node.cells[i], id);						
                    i++;
                }
                return found;
            }
            return null;
        }		
    }

    visitAll(visitor:(node:RawDashData, x:any)=>void,  arg:any):void{
        this.visit(this._rawData, visitor,arg);		
    }
    visit(node:RawDashData, visitor:(node:RawDashData, x:any)=>void,arg:any){
            
			visitor(node, arg);		            
			if (node.cells){
                var i =0;
                var found = null;                
                while ( i<node.cells.length)
                {
                    this.visit(node.cells[i], visitor ,arg);						
                    i++;
                }               
            }			
    }
    constructor(meta:DashMeta, descriptior:RawDashData, private dataService: UIDesignerService)
	{	 
        this.meta =meta;
		this._rawData=descriptior;
    }			 
    root():RawDashData{
        return this._rawData;
    }
   
    get(perdicate:(node:RawDashData)=>boolean):RawDashData
    {
        return this.lookupNode(this._rawData,perdicate);
    }
    sortChildren(node:RawDashData)
    {
        debugger;
        //var node = this.lookupNode(this._rawData, x=>x.domId == itemToMove);
        if (node){
            var parent = this.lookupParentNode(this._rawData, this._rawData, node.domId);                       
            parent.cells = parent.cells.sort(function(a, b) {
                return a.widget.visibleOrder - b.widget.visibleOrder;
              });            
        }
    }
    add(parentDomId:string, props:any):RawDashData{		
        debugger;
        var parentNode = this.lookupNode(this._rawData,x=>x.domId == parentDomId );
        if (parentNode){	
            if (!parentNode.cells)	
            {
                parentNode.cells = [];
            }
            let newControl = new RawDashData();
            newControl.domId = Helpers.NextID();
            newControl.widget = WidgetFact.createWidget({type:props.type}, this.dataService);
            newControl.widget.visibleOrder = parentNode.cells.length;
            parentNode.cells.push(newControl )	;
            return  newControl;
        }				
    }
    move(itemToMove:string, to:string)
    {
        var node = this.lookupNode(this._rawData, x=>x.domId == itemToMove);
        if (node){
            var oldParent = this.lookupParentNode(this._rawData, this._rawData, itemToMove);                       
            var newParent = this.lookupNode(this._rawData, x=>x.domId ==to);
            if (newParent.domId!=oldParent.domId)
            {
                //remove from old
                var ind=oldParent.cells.indexOf(node);                
                oldParent.cells.splice(ind,1);
                //add to new
                if (!newParent.cells)	
                {
                    newParent.cells = [];
                }
                newParent.cells.push(node)	;
            }
        }
    }
    remove(domId:string){
        var node = this.lookupNode(this._rawData, x=>x.domId == domId);
        if (node){
            var parentNode =this. lookupParentNode(this._rawData,this._rawData,domId );
            if (parentNode)
            {	
                var ind=parentNode.cells.indexOf(node);
                parentNode.cells.splice(ind,1);								 
            }					
        }				
    }
    unhighlightAll(node:RawDashData){
        node.isHighlighted=false;
        if (node.cells)
        {
            var i =0;                       
            while ( i<node.cells.length )
            {
                this.unhighlightAll(node.cells[i]);						
                i++;
            }    
        }
         this.selected=null;
    }
    select(domId:string){
         var node = this.lookupNode(this._rawData, x=>x.domId == domId); 
         this.highlightOne(node);
    }
    highlightOne(node:RawDashData){
        //debugger;
        this.unhighlightAll(this._rawData);
        node.isHighlighted=true;  
        this.selected=node;
    }
    update(domId:string, callback:any){
        var item = this.lookupNode(this._rawData,x=>x.domId==domId );
        if (item){
            if (callback)callback(item);			  
        }								
    }

    toJSON():any{      
        return this._rawData.toJSON();
    }
}


