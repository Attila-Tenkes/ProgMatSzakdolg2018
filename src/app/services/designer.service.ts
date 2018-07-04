import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { RawDashData, DecoratedDashData } from '../models/dashdata';
import { DashMeta } from '../models/dashmeta';
import { DependencyExp } from '../models/dependencyexp';
import { Widget,Container, Pie2D, Bar2D, Line2D, MSLine2D, GridWidget,KPIWidget, Label, ImageWidget, DatePicker, Column2D, SingleSeriesFusionWidget, MultiSeriesFusionWidget } from '../models/widget';
import { Constants} from '../shared/constants';
import { DataSource} from '../models/datasource';
import { FusionWidget} from '../models/widget';
import { DataSourceService} from '../services/dataSource.service';
import notify from 'devextreme/ui/notify';
import { UserData } from '../models/user';

@Injectable()

export class UIDesignerService {
     _c:RawDashData=null;
     
     constructor(private _dsService: DataSourceService)
     {}
     public getDsService():DataSourceService{
         return this._dsService;
     }
     _widgets =[ new Container(""),
            new Label(),
            new Bar2D(this,"","","",""),
            new Line2D(this, "","","",""),
            new MSLine2D(this,"", "","",""),
            new Column2D(this, "","","",""),
            new Pie2D(this, "","","",""),
            new GridWidget(this),
            new ImageWidget(),           
            new KPIWidget(this,""),
            new DatePicker()
            ];
    getAllWidgets(){
        return this._widgets;
    }
    getWidget(type:string):Widget{
        return this._widgets[type];
    }

    getUserObjRef():firebase.database.Reference{
        let userKey = firebase.auth().currentUser.uid;           
        let userObjRef = firebase.database().ref(Constants.DASHBOARD_REF).child(userKey);
        return userObjRef;
    }
    save(dashbaord:DecoratedDashData){
         //debugger;
         let dashboardRef = this.getUserObjRef().child(dashbaord.meta.id);
         dashboardRef.update({ raw: dashbaord.toJSON()} )  
            .then((snapshot)=>{
                notify(`successfully saved`,"Success",2000);
            })
            .catch ((error)=>{                
                notify(`failed upload: ${error}`,"Error",2000);
            });
    }
    /*obsolete: */
    getRawDash(id:string, context?:any):Promise<RawDashData>{
        let result = new RawDashData();       
               
        let dbRef = this.getUserObjRef();
        // let raw = dashboardRef.once('value').then();
            let promise =  new Promise<RawDashData>((resolve,reject)=>{
                dbRef.child(id).once('value')
                .then((snapshot)=> {
                    //let x.meta= result.fromJSON(snapshot.val().raw, this, context);
                    var tmp = snapshot.val();
                    if (tmp)
                    {
                        let x= result.fromJSON(snapshot.val().raw, this, context);
                        resolve(x);
                    }
                    else {
                        console.log('getRawDash '+id +' - failed to laod' );
                        reject();
                    }
                });
            });           
            return promise;  
            //return result.fromJSON(raw, this);                         
    } 
     
    getDash(id:string, context?:any):Promise<DecoratedDashData>{
        let raw = new RawDashData(); 
        let meta = new DashMeta(this,'','',false,id);      
               
        let dbRef = this.getUserObjRef();       
        let promise =  new Promise<DecoratedDashData>((resolve,reject)=>{
            dbRef.child(id).once('value')
            .then((snapshot)=> {
                var tmp = snapshot.val();
                if (tmp)
                {
                    meta.name = snapshot.val().name;
                    meta.readOnly = snapshot.val().readOnly;
                    if (snapshot.val().owner){
                        meta.owner =snapshot.val().owner; 
                    }
                    meta.description = snapshot.val().desc;
                    raw = raw.fromJSON(snapshot.val().raw, this, context, meta);
                    let x = new DecoratedDashData(meta, raw, this);
                    resolve(x);
                }
                else{
                    console.log('getDash '+id+' - failed to load');
                    reject();
                }
            });
        });           
        return promise;                                   
    }  

    generateChartDataSource(widget:FusionWidget, dataSource:DataSource,labelAttr:string,keyAttr:string,valAttr:string, depPropName?:any, depPropExp?:any, filter?:any):any
    {     
        debugger;  
        if (dataSource.format == "SingleSeries"  && dataSource.url) //single series Webservice
        {                       
            var chartData:any =  {
                "depPropName":depPropName,
                "depPropExp":depPropExp,
                "chart": {
                    "caption": widget.caption,
                    "xAxisName": widget.xAxisName,
                    "yAxisName": widget.yAxisName,                    
                    "subCaption": "",   
                    "drawAnchors":(<SingleSeriesFusionWidget>widget).drawAnchors               
                }                
            };        
            if ((<SingleSeriesFusionWidget>widget).labelStep >-1){                
                chartData.chart.labelStep = (<SingleSeriesFusionWidget>widget).labelStep;               
            } 
            if (depPropExp.length>0){
                var de = new DependencyExp(depPropExp,filter);
            }
            dataSource.load(function(x:any){
                chartData.data = [];
                for (var i=0;i<x.length;i++){
                    var isMatch = !de || de.isMatch(x[i]);
                    if (isMatch && keyAttr && keyAttr.length>0 && valAttr && valAttr.length>0)
                    { 
                        chartData.data.push({                    
                                            "label": x[i][labelAttr],
                                            "value": x[i][valAttr], //todo
                                            "key":x[i].key,
                                            "showValue": (<SingleSeriesFusionWidget>widget).showValue    
                                        }
                        );
                    }
                }
            });
            return chartData;  
        }       
        else if ( dataSource.format == "MultiSeries" && dataSource.url) //multi series WebService
        {          
            var chartData:any =  {
                "depPropName":depPropName,
                "depPropExp":depPropExp,
                "chart": {
                    "caption": widget.caption,
                    "xAxisName": widget.xAxisName,
                    "yAxisName": widget.yAxisName,    
                },
                "categories": [
                    {
                        "category": [ ]
                    }
                ],
                "dataset": []
            };
            dataSource.load(function(x:any){ 
                var de:DependencyExp = null;
                if (depPropExp.length > 0){
                    de= new DependencyExp(depPropExp,filter);
                }               
                for (var i=0;i<x.length;i++){               
                    var ds:any = {
                        "seriesname":x[i].seriesname, 
                        "data":[]
                    };
                    for (var j=0; j<x[i].values.length;j++)
                    {
                        var isMatch = !de || de.isMatch(x[i].values[j]);
                        if (isMatch && keyAttr && keyAttr.length>0 && valAttr && valAttr.length>0)
                        {
                            ds.data.push({"value":x[i].values[j][valAttr]});
                          
                        }
                        if (i==0)
                        {
                            chartData.categories[0].category.push({"label":x[i].values[j][labelAttr]})
                        }
                    }
                    if (ds.data.length>0){
                        chartData.dataset.push(ds);        
                    }
                }
            });
            return chartData
        }
        else if (dataSource.file)//multiseries CSV
        {
            var chartData:any =  {  
                "depPropName":depPropName,
                "depPropExp":depPropExp,
                "chart": {
                    "caption": widget.caption,
                    "xAxisName": widget.xAxisName,
                    "yAxisName": widget.yAxisName,    
                },
            };
            var that = this;
            if (widget instanceof SingleSeriesFusionWidget){
              
                chartData.chart.labelStep = (<SingleSeriesFusionWidget>widget).labelStep;                             
                chartData.chart.drawAnchors =(<SingleSeriesFusionWidget>widget).drawAnchors ;
                dataSource.load(function(x:any){
                    chartData.data = [];
                    var data = that.csvJSON(x, true,  dataSource.csvSkip, dataSource.csvSeparator);                  
                    var de:DependencyExp = null;
                    if (depPropExp.length > 0){
                        de= new DependencyExp(depPropExp,filter);
                    }
                    for (var i=0;i<data.rows.length;i++){    
                        //apply filter
                        var isMatch = !de || de.isMatch(data.rows[i]);
                        if (isMatch && keyAttr && keyAttr.length>0 && valAttr && valAttr.length>0)
                        {  
                            if (data.rows[i][valAttr])
                            {                                                           
                                chartData.data.push(
                                    {
                                        "label":data.rows[i][labelAttr]!=undefined && data.rows[i][labelAttr] instanceof Date?data.rows[i][labelAttr].toLocaleDateString():data.rows[i][labelAttr],
                                        "value":data.rows[i][valAttr].replace(/"/g, '').replace(/'/g, ''),
                                        "key":  data.rows[i][keyAttr],
                                        "showValue":(<SingleSeriesFusionWidget>widget).showValue 
                                    }
                                );    //todo ha nincs neki id-ja akkor value                      
                            }   
                        }        
                    }

                }
                );
            } 
            else  if (widget instanceof MultiSeriesFusionWidget){                                  
                chartData.categories = [
                    {
                        "category": [ ]
                    }
                ];
                chartData.dataset= [
                    {
                        "seriesname": "",
                        "data": [ ]
                    },          
                ];
                dataSource.load(function(x:any){
                    //debugger;
                    var data = that.csvJSON(x, true,  dataSource.csvSkip, dataSource.csvSeparator);
                    chartData.dataset[0].sriesname=data.headers[labelAttr];
                    var de:DependencyExp = null;
                    if (depPropExp.length > 0){
                        de= new DependencyExp(depPropExp,filter);
                    }
                    for (var i=0;i<data.rows.length;i++){    
                        //apply filter
                        var isMatch = !de || de.isMatch(data.rows[i]);
                        if (isMatch && keyAttr && keyAttr.length>0 && valAttr && valAttr.length>0)
                        {  
                            if (data.rows[i][valAttr])
                            {                            
                                chartData.categories[0].category.push({"label":data.rows[i][labelAttr]});
                                chartData.dataset[0].data.push(
                                    {"value":data.rows[i][valAttr].replace(/"/g, '').replace(/'/g, ''),
                                    "key":  data.rows[i][keyAttr]});    //todo ha nincs neki id-ja akkor value                      
                            }   
                        }        
                    }                
                })
            }
            //todo create JSON for fusion 
            return chartData;
        };
    }

    generateGridDataSource(dataSource:DataSource, depPropExp?:any, filter?:any):any
    {     
           // debugger;                          
            var result:any = {}; result.rows=[];                   
            var that = this;
            var de = new DependencyExp(depPropExp,filter);
            //todo: cache?
            if (dataSource.format == "SingleSeries"  && dataSource.url) //single series Webservice
            {  
              
                dataSource.load(function(x:any){                 
                    if (depPropExp.length > 0){
                        de= new DependencyExp(depPropExp,filter);
                    }
                    debugger;
                    var data = x;
                    var filterdData: any[] = new Array<any>();  
                    for (var i=0;i<data.length;i++){  
                        if (de.isMatch(data[i]))
                        {    
                            filterdData.push(data[i]);
                        }
                    }  
                    result.rows = filterdData;// data.rows;
                    result.columns = data.columns; 
                });
            }
            else
            {
                dataSource.load(function(x:any){                
                    var data = that.csv2Objects(x, true, dataSource.csvSkip, dataSource.csvSeparator, function(obj:any){return de.isMatch(obj)});  
                    // apply filter
                    var filterdData: any[] = new Array<any>();  
                    for (var i=0;i<data.rows.length;i++){  
                        if (de.isMatch(data.rows[i]))
                        {    
                            filterdData.push(data.rows[i]);
                        }
                    }  
                    result.rows = filterdData;// data.rows;
                    result.columns = data.columns;                                 
                })   
            }                     
            return result;    
    }

    csvJSON(csv:string, hasHeaderRow:boolean, skipRows:number,colSeparator:string):any{
        var lines=csv.split("\n");
        var rows : any[] = new Array<any>();        
        var headers=lines[0].split(colSeparator);
        for(var i=0;i<headers.length;i++){
            headers[i]=headers[i].trim().replace(/"/g, '').replace(/'/g, '');
        }
        var result = {
            rows: rows,
            headers:headers
        }
        for(var i=skipRows;i<lines.length;i++){
            var obj = {};
            var currentline=lines[i].split(colSeparator);        
            for(var j=0;j<headers.length;j++){
                if (headers[j].indexOf('Date')>=0){
                    obj[headers[j]]= new Date(currentline[j]);
                }
                else
                {
                    obj[headers[j]]= currentline[j];
                }
            } 
            	 
            rows.push(obj);    //currentLine       
        }
        return result;
    }
    csv2Objects(csv:string, hasHeaderRow:boolean, skipRows:number,colSeparator:string, predicate:any):any{
        var lines=csv.split("\n");
        var rows : any[] = new Array<any>();        
        var headers=lines[0].split(colSeparator);  
        var columns = "[";
        var sep="";
        for(var i=0;i<headers.length;i++){
            //remove: whitespaces and " and '
            headers[i]=headers[i].trim().replace(/"/g, '').replace(/'/g, '');
            columns += sep + "'"+headers[i]+"'";
            sep =",";
        }
        columns += "]";
        
        var result = {
            rows: rows,
            headers:headers,
            columns:columns
        }     
        for(var i=skipRows;i<lines.length;i++){

            var obj = {};  
            if (lines[i]  !=   '' )
            {
                var currentline=lines[i].split(colSeparator);   
            
                for(var j=0;j<headers.length;j++){
                    if (headers[j].indexOf('Date')>=0){
                        obj[headers[j]]= new Date(currentline[j]);
                    }
                    else
                    {
                        obj[headers[j]]= currentline[j].trim().replace(/"/g, '').replace(/'/g, '');
                    }
                }  
                            
                rows.push(obj);     
            }                  
        }
        return result;
    }
    createDashMeta(con: DashMeta){                                   
            let dbRef = this.getUserObjRef();
            let newDash = dbRef.push();
            newDash.set ({
                name: con.name,
                desc: con.description,
                readOnly:con.readOnly,
                id: newDash.key,
                raw:{
                    name:"",
                    readOnly:false,
                    customCss : "",         
                    description : "",       
                    height : 100,          
                    title : "Empty dashboard",
                    type : "Container",
                    orientation : "vertical"          
                }
            });         
            //todo error handling        
    }
    getDashMetas_promiseVersion():Promise<DashMeta[]>{
        let dbRef = this.getUserObjRef();
        let result:DashMeta[] = [];
        var that = this;
        let promise =  new Promise<DashMeta[]>((resolve,reject)=>{
            dbRef.once('value')
            .then((snapshot)=> {                
                if (snapshot.val()){
                    let tmp: string[] = snapshot.val();                    
                    result = Object.keys(tmp).map(key => new DashMeta(that, tmp[key].name, tmp[key].desc,tmp[key].readOnly,
                        tmp[key].id, tmp[key].owner?tmp[key]:'unknown'));
                    
                }
               else {
                   console.log('getDashMetas_promiseVersion - no data found');                 
               }
               resolve(result);
            });
        });           
        return promise;
    }
    getDashMetas(callback: (a:firebase.database.DataSnapshot, b?: string)=>any){
        let dbRef = this.getUserObjRef()        
        //todo: caching -> return local copy
       
        dbRef.on('value', callback);   
    }
    getDashMeta(id: string):Promise<DashMeta>{
       // debugger;
        let result:DashMeta = null;
        let dbRef = this.getUserObjRef(); 
        var that = this;    
        let promise =  new Promise<DashMeta>((resolve,reject)=>{
            dbRef.child(id).once('value')
            .then((snapshot)=> {
                if (snapshot.name){
                    new DashMeta(that, snapshot.name, snapshot.description,snapshot.readOnly, id,
                    snapshot.owner?snapshot.owner:'unkown')
                    resolve(result);
                }
                else{
                    console.log('getDashMeta' + id + ' - failed to load');
                    reject();
                }
            });
        });           
        return promise;                    
    }

    editDashMeta(update: DashMeta){
        let userKey = firebase.auth().currentUser.uid; 
        let dbRef = this.getUserObjRef().child(update.id)
            .update({
                name: update.name,
                desc: update.description,
                readOnly:false,
                owner:userKey
             });         
        notify('Dashboard updated',"Success",2000);    
    }
    getReaders(meta:DashMeta,callback:any){
        let dbRef = this.getUserObjRef().child(meta.id).once('value')
        .then((snapshot)=> {
            let keys = snapshot.val();
            debugger;
            if (keys && keys.readers)
            {                
                meta.readerkeys = keys.readers;
                /*for(var i=0;i<keys.readers.length;i++){  
                    meta.readerkeys.push (keys.readers[i]);                                                   
                }    */             
                if (callback)callback(meta.readerkeys);
            }                                             
        }); 
    }
    updateReaders(update: DashMeta, raw:RawDashData, users:any[], allUsers:any[]){
        let dbRef = this.getUserObjRef().child(update.id)
        .update({
            readers:users
            });
        
        Object.keys(allUsers).map(key =>
        {                                   
            let readerKey = allUsers[key].id;
            let userObjRef = firebase.database().ref(Constants.DASHBOARD_REF).child(readerKey);

            if (users.indexOf(readerKey)>-1)
            {
                let userKey = firebase.auth().currentUser.uid;           
                
                //make copies?
                userObjRef.child(update.id).update(
                    { id:update.id, 
                        name:update.name, 
                        desc:update.description,
                        readOnly:true, 
                        owner: userKey,
                        raw: raw.toJSON()
                    }
                );
            }
            else
            {
                //revoke
                userObjRef.child(update.id).remove();
            }                        
        });     
        console.log('updateReaders executed');       
    }
    removeDashMeta(deleteDash: DashMeta){
        let dashRef  =this.getUserObjRef().child(deleteDash.id);
        dashRef.child('readers')
        .once('value')
        .then((snapshot)=> {
            let keys = snapshot.val();
            if (keys)
            {
                for(var i=0;i<keys.length;i++){                 
                    let userObjRef = firebase.database().ref(Constants.DASHBOARD_REF).child( keys[i]);                
                    //remove replicas       
                    userObjRef.child(deleteDash.id).remove(); 
                } 
            }               
            notify("Dashboard deleted","Success",2000);                                
        });                      
        let dbRef = dashRef.remove();                 
    }

    
}