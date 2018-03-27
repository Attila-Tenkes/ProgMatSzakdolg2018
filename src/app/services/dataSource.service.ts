import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { DataSource } from '../models/datasource';
import { Constants} from '../shared/constants';
import notify from 'devextreme/ui/notify';
@Injectable()

export class DataSourceService {

    createDataSource(con: DataSource){                                                       
            let newCon = this.getUserObjRef().push();
            newCon.set ({
                name: con.name,
                desc: con.description,
                id: newCon.key,
                typename:con.typename,
                format:con.format,
                user:con.user,
                pwd:con.pwd,
                file:con.file,
                url:con.url,
                csvSeparatortor:con.csvSeparator,
                csvSkip:con.csvSkip
            },function(err){              
              if(err) {
                console.warn('error!', err);
              } else {               
                  console.info('data source save succeded!');
                }
            });                       
            //todo error handling        
    }
    getUserObjRef(usr?: string):firebase.database.Reference{
        let userKey = firebase.auth().currentUser.uid;           
        let userObjRef = firebase.database().ref(Constants.DATA_SOUURCE_REF).child(usr?usr:userKey);
        return userObjRef;
    }
    editDataSource(update: DataSource){
        let dbRef = this.getUserObjRef().child(update.id)
            .update({
                name: update.name,
                desc: update.description,
                typename:update.typename,
                format:update.format,
                user:update.user==undefined?null:update.user, 
                pwd:update.pwd==undefined?null:update.pwd,
                file:update.file==undefined?null:update.file,
                url:update.url==undefined?null:update.url,
                csvSeparator:update.csvSeparator==undefined?null:update.csvSeparator,
                csvSkip:update.csvSkip==undefined?null:update.csvSkip
             });
             notify("DataSource updated", "Success", 2000);    
    }

    removeDataSource(deleteDataSource: DataSource){     
        let dbRef = this.getUserObjRef().child(deleteDataSource.id).remove(
            function(err){              
              if(err) {
                console.warn('error!', err);
              } else {                
                  console.info('data source removed succeded!');
                }
            });     
    
            notify("DataSource deleted", "Success", 2000);           
    }

    getDataSources(callback: (a:firebase.database.DataSnapshot, b?: string)=>any){
        let dbRef = this.getUserObjRef();        
        //todo: caching -> return local copy
       
        dbRef.on('value', callback);   
    }
    getDataSourcesOnce():Promise<DataSource[]>{
        let dbRef = this.getUserObjRef() ;
        let promise =  new Promise<DataSource[]>((resolve,reject)=>{      
                let dss:DataSource[] = [];  
                dbRef.once('value')
                .then((snapshot)=> {                       
                    if (snapshot.val()) 
                    {
                        let tmp: string[] = snapshot.val(); 
                        dss = Object.keys(tmp).map(key => new DataSource (
                            tmp[key].name,
                            tmp[key].desc,
                            tmp[key].typename,
                            tmp[key].format,
                            tmp[key].id,                   
                            tmp[key].user,
                            tmp[key].pwd,
                            tmp[key].file,
                            tmp[key].url,
                            tmp[key].csvSeparator,
                            tmp[key].csvSkip,
                            ));                           
                    } 
                    else {
                        console.log('getDataSourcesOnce no data found')                        
                    }    
                    resolve(dss);       
                });            
        });         
        return promise; 
    }
    
    get(id:string, owner?: string):Promise<DataSource>{            
        let dbRef = this.getUserObjRef(owner).child(id); 
        //debugger;
        let promise =  new Promise<DataSource>((resolve,reject)=>{          
                dbRef.once('value')
                .then((snapshot)=> {
                    let tmp: any = snapshot.val();   
                    //debugger; 
                    if (tmp)
                    {           
                        let ds = new DataSource (
                            tmp.name,
                            tmp.desc,
                            tmp.typename,
                            tmp.format,
                            tmp.id,                   
                            tmp.user,
                            tmp.pwd,
                            tmp.file,
                            tmp.url,
                            tmp.csvSeparator,
                            tmp.csvSkip
                        );
                        resolve(ds);   
                    }
                    else 
                    {
                        console.log('data source can not be found');
                        reject();
                    }         
                });            
        }); 
        return promise;                                  
    }
}