import { Constants } from '../shared/constants';
import { UIDesignerService } from '../services/designer.service';
import { DataSourceService } from '../services/dataSource.service';
import { DataSource } from './datasource';


export interface IDependencyReceiver {    
    notify(x: any):void;
    DependencyPropertyExpression:string;    
}

export interface IDependencySubject {    
    update(x: any):void;
    DependencyPropertyName: string;
}

export class Widget {
    public _dataSource?: Object;    
    public visibleOrder:number;
    public title: string;
    public height:number=100;
    public width:number=100;
    public _tag:any;
    constructor(        
        public typename: string,        
        public _isDroppable:boolean     
    )
    {

        this._dataSource = null;       
        this.title = '';
    }

    css(){
        return ' draggable ';
    }

    load(ds?:DataSource):Promise<any>{        
        console.log('widget data load');
        return Promise.resolve();
    }

    icon(size:number):string
    {   
        if (size==0)
        {
            return 'public/assets/images/'+this.constructor.name+"_small.png";
        }
        else
        {
             return 'public/assets/images/'+this.constructor.name+"_large.png";
        }
    } 

    isReady():boolean{return true;}    
}
export class DataSourcedWidget extends Widget  {    //hack: see layoutdesigner.ts update()
    public dataSourceID: string;
    public _dataFormat: string;
    constructor(        
        typename: string,    
        format:string,    
        _isDroppable:boolean     
    ){
        super(typename, _isDroppable);
         this.dataSourceID = '';
         this._dataFormat = format;
    } 
     setDataSourceID(id:string):Promise<any>{
        this.dataSourceID = id;
        return this.load();
    }

    setDataSource(ds:DataSource){        
        return this.load(ds);
    }  
}
export class DependencyReceiver extends DataSourcedWidget implements IDependencyReceiver {    //hack: see layoutdesigner.ts update()
    notify(x: any):void{}    
    DependencyPropertyExpression:string="";   
    constructor(        
        typename: string,  
        format:string,      
        _isDroppable:boolean     
    ){
        super(typename, format, _isDroppable);
    }    
}
export class ExceptionWidget extends Widget{
    constructor(
            typename: string,         
    ){     
        super('Exception',true );
    }
}

export class Container extends Widget{
    constructor(
         public orientation?:string      
    ){     
        super('Container',true );
        if (!orientation){this.orientation = Constants.HORIZONTAL}
    }

     css(){
        return super.css( )+' droppable ';
    }    
}

export class Label extends Widget{    
    public fontSize: string;
    public fontWeight: string;
    public fontColor: string;
    constructor( ){     
        super('Label',true );
        //set defaults
        this.fontWeight = 'normal';
        this.fontSize = '12pt';
        this.fontColor = '#0a0a0a';
    }
}

export class GridWidget extends DependencyReceiver  {
    constructor(  protected _dataProvider: UIDesignerService,  
    ){     
        super('GridWidget','Tabular',true );
    }    
  
    _isDataReady:boolean;  


    notify(x: any):void{
        //debugger;
        //if depExp and depprop >> load _tag.notify();
        this.load(null, x).then(x=>{

            this._tag.notify();
        });
    }
    update(x: any):void{
        
    }
    
    load(ds?:DataSource, filter?:any):Promise<any>{         
        var that =this;
        let promise= new Promise<any>((resolve,reject)=>{        
                let dataSource:DataSource = null;     
                if (ds!=null){
                    this.dataSourceID = ds.id;
                    dataSource=ds;

                    //if (ds !=null)
                    {
                    that._dataSource = this._dataProvider.generateGridDataSource(dataSource,that.DependencyPropertyExpression);
                    //todo ide promise kellene
                    that._isDataReady = true;
                    
                    resolve(that._dataSource);
                    }
                }
                else if (this.dataSourceID) 
                {
                    var that = this;
                    this._dataProvider.getDsService().get(this.dataSourceID).then(x=>
                        {
                            dataSource=x;
                            that._dataSource = this._dataProvider.generateGridDataSource(dataSource,that.DependencyPropertyExpression,filter);               
                            that._isDataReady = true;                                                         
                            resolve(that._dataSource);                            
                        }                        
                    );            
                }  
                 
         });  
        console.log('FusionWidget data load');
        return promise;
    }
    isReady():boolean{return this._isDataReady;}
}

export class KPIWidget extends DependencyReceiver {
    public fontSize: string;
    public fontWeight: string;
    public fontColor: string;
    public calculation: string = '';
    public upperTreshhold:number=1;
    public upperColor:string='';
    public lowerTreshhold:number=1;
    public lowerColor:string='';

    //public keyAttr:string="",
    public valAttr:string=""
    public _calcResult:number=0;
    public _calcColor='#0a0a0a';

    constructor(  protected _chartDataProvider: UIDesignerService,       
        dataSourceID:string   ){     
        super('KPIWidget','any',true );
        //set defaults
        this.fontWeight = 'normal';
        this.fontSize = '12pt';
        this.fontColor = '#0a0a0a';
    }   
    _isDataReady:boolean;
    notify(x: any):void{
        super.notify(x);

        /*
        this.load(null, x).then(x=>{

            this._tag.notify();
        });
        */
    }
    
    load(ds?:DataSource, filter?:any):Promise<any>{         
        var that =this;        
        let promise= new Promise<any>((resolve,reject)=>{        
                let dataSource:DataSource = null;     
                if (ds!=null){
                    this.dataSourceID = ds.id;
                    dataSource=ds;

                    //if (ds !=null)
                    {
                    //that._dataSource = this._chartDataProvider.generateChartDataSource(dataSource, that["keyAttr"],that["valAttr"], that.DependencyPropertyName,that.DependencyPropertyExpression);
                    //todo ide promise kellene
                    that._isDataReady = true;
                    
                    resolve(that._dataSource);
                    }
                }
                else if (this.dataSourceID) 
                {
                    var that = this;
                    this._chartDataProvider.getDsService().get(this.dataSourceID).then(x=>
                        {
                            dataSource=x;
                           // that._dataSource = this._chartDataProvider.generateKPIDataSource(dataSource,that["keyAttr"],that["valAttr"],that.DependencyPropertyName,that.DependencyPropertyExpression,filter);               
                            that._dataSource = x;
                           
                            that._isDataReady = true;  
                            
                           ///* var rows:any[] = dataSource.get();
                            var acc = 0;
                            var min = 0;
                            var max = 0;
                            var cnt =0;
                            
                            dataSource.load(function(rows:any){
                                cnt = rows.length;  
                                min = rows[0][that.valAttr];  
                                max = rows[0][that.valAttr];      
                                for (var i=0;i<rows.length;i++){
                                    acc += rows[i][that.valAttr];
                                    if (min>rows[i][that.valAttr]){
                                        min = rows[i][that.valAttr];
                                    }
                                    if (max<rows[i][that.valAttr]){
                                        max = rows[i][that.valAttr];
                                    }
                                }

                                let avg :number = acc/cnt;
                                if (that.calculation == 'avg'){
                                    that._calcResult=avg;
                                }
                                else if (that.calculation == 'min'){
                                    that._calcResult=min;
                                }
                                else if (that.calculation == 'max'){
                                    that._calcResult=max;
                                }
                                else if (that.calculation == 'cnt'){
                                    that._calcResult=cnt;
                                }
                                if (that._calcResult>that.upperTreshhold){
                                    that._calcColor = that.upperColor;
                                }
                                else if (that._calcResult<that.lowerTreshhold){
                                    that._calcColor = that.lowerColor;
                                }
                                else{                               
                                    that._calcColor = that.fontColor;
                                }
                            });

                            resolve(that._dataSource);                            
                        }                        
                    );            
                }  

            //keyAttr
            //var valAttr = 'cost';
               
         });  
        console.log('KPI data load');
        return promise;
    }
    isReady():boolean{return this._isDataReady;}
}

export class DatePicker extends Widget implements IDependencySubject {
    constructor( 
    ){     
        super('DatePicker',true );
    }
    DependencyPropertyName:string="";
    update(x: any):void{
        
    }
}

export class ImageWidget extends Widget{
    
    constructor( public imgSrc?:string
    )
    {     
        super('ImageWidget',true );
    }  
}

export class FusionWidget extends DependencyReceiver implements IDependencySubject{
    _fcType:string;
    _isDataReady:boolean;  
    DependencyPropertyName:string="";    
    constructor( 
        typename:string,  
        format:string,         
        protected _chartDataProvider: UIDesignerService,       
        dataSourceID:string      
    ){
        super(typename, format, false);
        this._fcType=typename;
        this._isDataReady = false;
        this.dataSourceID = dataSourceID;
    }
    notify(x: any):void{
        //debugger;
//if depExp and depprop >> load _tag.notify();
        this.load(null, x).then(x=>{

            this._tag.notify();
        });
    }
    update(x: any):void{
        
    }
    load(ds?:DataSource, filter?:any):Promise<any>{         
        var that =this;
        let promise= new Promise<any>((resolve,reject)=>{        
                let dataSource:DataSource = null;     
                if (ds!=null){
                    this.dataSourceID = ds.id;
                    dataSource=ds;

                    //if (ds !=null)
                    {
                    that._dataSource = this._chartDataProvider.generateChartDataSource(dataSource, that["keyAttr"],that["valAttr"], that.DependencyPropertyName,that.DependencyPropertyExpression);
                    //todo ide promise kellene
                    that._isDataReady = true;
                    
                    resolve(that._dataSource);
                    }
                }
                else if (this.dataSourceID) 
                {
                    var that = this;
                    this._chartDataProvider.getDsService().get(this.dataSourceID).then(x=>
                        {
                            dataSource=x;
                            that._dataSource = this._chartDataProvider.generateChartDataSource(dataSource,that["keyAttr"],that["valAttr"],that.DependencyPropertyName,that.DependencyPropertyExpression,filter);               
                            that._isDataReady = true;                                                         
                            resolve(that._dataSource);                            
                        }                        
                    );            
                }  
                 
         });  
        console.log('FusionWidget data load');
        return promise;
    }
    isReady():boolean{return this._isDataReady;}
}

export class SingleSeriesFusionWidget extends FusionWidget{
    keyAttr:string="";
    valAttr:string="";
 constructor(   
        typename:string,    
        _chartDataProvider: UIDesignerService, 
        dataSourceID:string,
        keyAttr:string="",
        valAttr:string=""
    ){
      
        super(typename,'SingleSeries',_chartDataProvider,dataSourceID);
        this.keyAttr = keyAttr;
        this.valAttr = valAttr;
    }
}

export class MultiSeriesFusionWidget extends FusionWidget{
     constructor(  
        typename:string,      
        _chartDataProvider: UIDesignerService,     
        dataSourceID:string,
        keyAttr:string,
        valAttr:string  
    ){
        super(typename,'MultiSeries',_chartDataProvider,dataSourceID);
    }
}

export class Pie2D extends SingleSeriesFusionWidget{
    constructor(    
        _chartDataProvider: UIDesignerService,            
        dataSourceID:string,
        keyAttr:string,
        valAttr:string    
        
    ){
        super('Pie2D',_chartDataProvider,dataSourceID,keyAttr,valAttr);
    }
}

export class Line2D extends SingleSeriesFusionWidget{
    constructor(    
        _chartDataProvider: UIDesignerService,      
        dataSourceID:string,
        keyAttr:string,
        valAttr:string    
    ){
        super('Line2D',_chartDataProvider,dataSourceID,keyAttr,valAttr);
        this._fcType='line';
    }
}

export class MSLine2D extends MultiSeriesFusionWidget{
    constructor(    
        _chartDataProvider: UIDesignerService,      
        dataSourceID:string,
        keyAttr:string,
        valAttr:string    
    ){
        super('MSLine2D',_chartDataProvider,dataSourceID,keyAttr,valAttr);
        this._fcType='msline';
    }
}
export class Column2D extends SingleSeriesFusionWidget{
    constructor(   
        _chartDataProvider: UIDesignerService,                 
        dataSourceID:string,
         keyAttr:string,
        valAttr:string    
    ){
        super('Column2D', _chartDataProvider,dataSourceID,keyAttr,valAttr);
    }
}

export class Bar2D extends SingleSeriesFusionWidget{
    
    constructor(        
        _chartDataProvider: UIDesignerService,        
        dataSourceID:string,
        keyAttr:string,
        valAttr:string    
    ){
        super('Bar2D', _chartDataProvider,dataSourceID,keyAttr,valAttr);    
    }  
}

export class WidgetFact
{
    static createWidget(json:any, chartDataProvider: UIDesignerService, context?:any ):Widget {
        
        let result:Widget;
        if(json.type == 'Container'){
            result= new Container(json.orientation);
        }
        else if(json.type == 'DatePicker'){
            result= new DatePicker();
        }
        else if (json.type == 'Pie2D'){
            result=new Pie2D(chartDataProvider, json.dataSourceID, json.keyAttr,json.valAttr);                                
            //result.load().then(x=>{console.log(x);});   
        }
        else if (json.type == 'Line2D'){
            result=new Line2D(chartDataProvider, json.dataSourceID,json.keyAttr,json.valAttr);                                        
        }
        else if (json.type == 'MSLine2D'){
            result=new MSLine2D(chartDataProvider, json.dataSourceID,json.keyAttr,json.valAttr);                                        
        }
        else if (json.type == 'Bar2D'){            
            result=new Bar2D(chartDataProvider, json.dataSourceID,json.keyAttr,json.valAttr);                                                
        }
          else if (json.type == 'Column2D'){            
            result=new Column2D(chartDataProvider, json.dataSourceID,json.keyAttr,json.valAttr);                                                            
        }
        else if (json.type == 'Label'){
            result=new Label();           
        }
        else if (json.type == 'GridWidget'){
            result=new GridWidget(chartDataProvider);
        }
        else if (json.type == 'KPIWidget'){
            result=new KPIWidget(chartDataProvider,  json.dataSourceID);
        }
        else if (json.type == 'ImageWidget'){
            result=new ImageWidget();
            (<ImageWidget>result).imgSrc = json.imgSrc;
        }               
        else{
            result = new ExceptionWidget( 'Invalid widget type')
        }
        if (json.dataSourceID){
            (<DataSourcedWidget>result).dataSourceID = json.dataSourceID?json.dataSourceID:'';
        }
        result.height = json.height?json.height:100;
        result.width = json.width?json.width:100;        
        result.title =json.title||''; 
        result._tag = context;     
        result.visibleOrder =   json.visibleOrder?json.visibleOrder:0;
        result.load().then(x=>
            {             
                if (x && result._tag){
                    result._tag.notify();
                }
            });
        return result;
    }
} 