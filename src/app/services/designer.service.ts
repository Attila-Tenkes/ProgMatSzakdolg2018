import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { RawDashData, DecoratedDashData } from '../models/dashdata';
import { DashMeta } from '../models/dashmeta';
import { DependencyExp } from '../models/dependencyexp';
import { Widget,Container, Pie2D, Bar2D, Line2D,GridWidget,KPIWidget, Label, ImageWidget, DatePicker, Column2D } from '../models/widget';
import { Constants} from '../shared/constants';
import { DataSource} from '../models/datasource';
import { DataSourceService} from '../services/dataSource.service';
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
            new Bar2D(this,"","",""),
            new Line2D(this, "","",""),
            new Column2D(this, "","",""),
            new Pie2D(this, "","",""),
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
  /*  createDashDesc(dbDesc: RawDashData){
        let dbRef = firebase.database().ref(Constants.DASHBOARD_REF);                
    }*/
    getUserObjRef():firebase.database.Reference{
        let userKey = firebase.auth().currentUser.uid;           
        let userObjRef = firebase.database().ref(Constants.DASHBOARD_REF).child(userKey);
        return userObjRef;
    }
    save(dashbaord:DecoratedDashData){
         debugger;
         let dashboardRef = this.getUserObjRef().child(dashbaord.meta.id);
         dashboardRef.update({ raw: dashbaord.toJSON()})  
            .catch ((error)=>{
                alert(`failed upload: ${error}`);
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
                let x= result.fromJSON(snapshot.val().raw, this, context);
                resolve(x);
                });
            });           
            return promise;  
            //return result.fromJSON(raw, this);                         
    } 
     
    getDash(id:string, context?:any):Promise<DecoratedDashData>{
        let raw = new RawDashData(); 
        let meta = new DashMeta('','',false,id);      
               
        let dbRef = this.getUserObjRef();       
        let promise =  new Promise<DecoratedDashData>((resolve,reject)=>{
            dbRef.child(id).once('value')
            .then((snapshot)=> {
                meta.name = snapshot.val().name;
                meta.readOnly = snapshot.val().readOnly;
                meta.description = snapshot.val().desc;
            raw = raw.fromJSON(snapshot.val().raw, this, context);
            let x = new DecoratedDashData(meta, raw, this);
            resolve(x);
            });
        });           
        return promise;                                   
    }

    editDashDesc(dbDesc: RawDashData){
      /*  let dbRef = firebase.database().ref('products/').child(update.id)
            .update({
                name: update.name,
                desc: update.description,
                price: update.price
            });
        alert('product updated');   */    
    }

    removeDashDesc(dbDesc: RawDashData){
      /*  let dbRef = firebase.database().ref('products/').child(deleteProduct.id).remove();
        alert('product deleted');
        let imageRef = firebase.storage().ref().child(`product_images/${deleteProduct.imgTitle}`)
            .delete()
                .then(function() {
                    alert(`${deleteProduct.imgTitle} was deleted from Storage`);
                }).catch(function(error) {
                    alert(`Error - Unable to delete ${deleteProduct.imgTitle}`);
                });*/
    }

    generateChartDataSource(dataSource:DataSource,keyAttr:string,valAttr:string, depPropName?:any, depPropExp?:any, filter?:any):any
    {     
        //debugger;  
        if (dataSource.name == "sampleColumn2D"||dataSource.name =="sampleBar2D")
        {
           
            //todo  var rows = dataSource.get();
            var chartData:any =  {
                "depPropName":depPropName,
                "depPropExp":depPropExp,
                "chart": {
                    "caption": "",
                    "subCaption": "",                     
                },                 
            }; 
            dataSource.load(function(x:any){
                chartData.data = [];
                for (var i=0;i<x.length;i++){
                    chartData.data.push({                    
                                        "label": x[i].label,
                                        "value": x[i].cost,
                                        "key":x[i].key
                                    }
                    );
                }
            });
            return chartData;  
        }
        else if (dataSource.name == "samplePie2D")
        { 
             var de = new DependencyExp(depPropExp,filter);
            
            if ( de.isMatch({key:1})){
                 return  {
                "depPropName":depPropName,
                "depPropExp":depPropExp,
                "chart": {
                   "caption": "",
                    "subCaption": "",                  
                },
                "data": [{
                    "label": "FOM",
                    "value": "880000"
                }]
            };   
        }
         else if ( de.isMatch({key:2})){
                 return  {
                "depPropName":depPropName,
                "depPropExp":depPropExp,
                "chart": {
                   "caption": "",
                    "subCaption": "",                  
                },
                "data": [{
                    "label": "Fixed",
                    "value": "730000"
                }]
            };   
            }
            else
            return  {
                "depPropName":depPropName,
                "depPropExp":depPropExp,
                "chart": {
                   "caption": "",
                    "subCaption": "",                  
                },
                "data": [{
                    "label": "FOM",
                    "value": "880000"
                }, {
                    "label": "Fixed",
                    "value": "730000"
                }, {
                    "label": "other",
                    "value": "590000"
                }]
            };   
        } 
        else if (  dataSource.name =="sampleLine2D" )
        {
            return  { 
                    "depPropName":depPropName,
                    "depPropExp":depPropExp, 
                    "chart": {
                                    "caption": "",
                              },
                    "categories": [
                        {
                            "category": [
                                {
                                    "label": " "
                                },
                                {
                                    "label": " "
                                },
                                {
                                    "label": " "
                                },               
                                {
                                    "label": " "
                                },
                                {
                                    "label": "  "
                                },
                                {
                                    "label": " "
                                },
                                {
                                    "label": " "
                                }
                            ]
                        }
                    ],
                    "dataset": [
                        {
                            "seriesname": "Bakersfield Central",
                            "data": [
                                    {
                                        "value": "23123"
                                    },
                                    {
                                        "value": "20233"
                                    },
                                    {
                                        "value": "18507"
                                    },
                                    {
                                        "value": "9110"
                                    },
                                    {
                                        "value": "15529"
                                    },
                                    {
                                        "value": "14803"
                                    },
                                    {
                                        "value": "12002"
                                    }
                                ]
                        },
                        {
                            "seriesname": "Los Angeles Topanga",
                            "data": [
                                {
                                    "value": "13400"
                                },
                                {
                                    "value": "8800"
                                },
                                {
                                    "value": "22800"
                                },
                                {
                                    "value": "14400"
                                },
                                {
                                    "value": "15800"
                                },
                                {
                                    "value": "19800"
                                },
                                {
                                    "value": "21800"
                                }
                            ]
                        }
                ]
            }
        }
        else
        {
            //itt tudni kell, h single vagy multiseries lesz
            var chartData:any =  {  
                    "depPropName":depPropName,
                    "depPropExp":depPropExp,
                    "chart": {
                        "caption": "",
                    },
                    "categories": [
                        {
                            "category": [ ]
                        }
                    ],
                    "dataset": [
                        {
                            "seriesname": "",
                            "data": [ ]
                        },          
                    ]};
                    var that = this;
            dataSource.load(function(x:any){
                debugger;
                var data = that.csvJSON(x, true,  dataSource.csvSkip, dataSource.csvSeparator);
                chartData.dataset[0].sriesname=data.headers[keyAttr];
                var de = new DependencyExp(depPropExp,filter);
                for (var i=0;i<data.rows.length;i++){    
                    //apply filter
                    if (de.isMatch(data.rows[i]))
                    {  
                        if (data.rows[i][valAttr])
                        {                            
                            chartData.categories[0].category.push({"label":data.rows[i][keyAttr]});
                            chartData.dataset[0].data.push(
                                {"value":data.rows[i][valAttr].replace(/"/g, '').replace(/'/g, ''),
                                "key":  data.rows[i][keyAttr]});    //todo ha nincs neki id-ja akkor value                      
                        }   
                    }        
                }
              
            })
            
            //todo create JSON for fusion 
            return chartData;
        };
    }
    generateGridDataSource(dataSource:DataSource, depPropExp?:any, filter?:any):any
    {     
            //debugger;                          
            var result:any = {}; result.rows=[];                   
            var that = this;
            var de = new DependencyExp(depPropExp,filter);
            //todo: cache?
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
                    	 
            rows.push(obj);                       
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
        let promise =  new Promise<DashMeta[]>((resolve,reject)=>{
            dbRef.once('value')
            .then((snapshot)=> {
                let tmp: string[] = snapshot.val();
                //todo if tmp is null?
               result = Object.keys(tmp).map(key => new DashMeta(tmp[key].name, tmp[key].desc,tmp[key].readOnly,tmp[key].id));
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
        let promise =  new Promise<DashMeta>((resolve,reject)=>{
            dbRef.child(id).once('value')
            .then((snapshot)=> {
               new DashMeta(snapshot.name, snapshot.description,snapshot.readOnly, id)
               resolve(result);
            });
        });           
        return promise;                    
    }

    editDashMeta(update: DashMeta){
        let dbRef = this.getUserObjRef().child(update.id)
            .update({
                name: update.name,
                desc: update.description,
                readOnly:update.readOnly
             });
        alert('dashboard updated');       
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
                //make copies?
                userObjRef.child(update.id).update(
                    { id:update.id, 
                        name:update.name, 
                        desc:update.description,
                        readOnly:true, 
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
            for(var i=0;i<keys.length;i++){                 
                let userObjRef = firebase.database().ref(Constants.DASHBOARD_REF).child( keys[i]);                
                //remove replicas       
                userObjRef.child(deleteDash.id).remove(); 
            } 
            alert('dashboard deleted');                                    
        });                      
        let dbRef = dashRef.remove();                 
    }

    
}