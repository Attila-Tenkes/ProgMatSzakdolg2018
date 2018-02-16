import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { DataSource } from '../models/datasource';
import { Constants} from '../shared/constants';
@Injectable()

export class DataSourceService {

    createDataSource(con: DataSource){                                                       
            let newCon = this.getUserObjRef().push();
            newCon.set ({
                name: con.name,
                desc: con.description,
                id: newCon.key,
                typename:con.typename,
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
    getUserObjRef():firebase.database.Reference{
        let userKey = firebase.auth().currentUser.uid;           
        let userObjRef = firebase.database().ref(Constants.DATA_SOUURCE_REF).child(userKey);
        return userObjRef;
    }
    editDataSource(update: DataSource){
        let dbRef = this.getUserObjRef().child(update.id)
            .update({
                name: update.name,
                desc: update.description,
                typename:update.typename,
                user:update.user==undefined?null:update.user, 
                pwd:update.pwd==undefined?null:update.pwd,
                file:update.file==undefined?null:update.file,
                url:update.url==undefined?null:update.url,
                csvSeparator:update.csvSeparator==undefined?null:update.csvSeparator,
                csvSkip:update.csvSkip==undefined?null:update.csvSkip
             });
        alert('DataSource updated');       
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
    
        alert('DataSource deleted');       
    }

    getDataSources(callback: (a:firebase.database.DataSnapshot, b?: string)=>any){
        let dbRef = this.getUserObjRef();        
        //todo: caching -> return local copy
       
        dbRef.on('value', callback);   
    }
    getDataSourcesOnce():Promise<DataSource[]>{
        let dbRef = this.getUserObjRef() ;
        let promise =  new Promise<DataSource[]>((resolve,reject)=>{          
                dbRef.once('value')
                .then((snapshot)=> {
                    let tmp: string[] = snapshot.val();               
                    let dss = Object.keys(tmp).map(key => new DataSource (
                        tmp[key].name,
                        tmp[key].desc,
                        tmp[key].typename,
                        tmp[key].id,                   
                        tmp[key].user,
                        tmp[key].pwd,
                        tmp[key].file,
                        tmp[key].url,
                        tmp[key].csvSeparator,
                        tmp[key].csvSkip,
                        ));
                        resolve(dss);            
                });            
        });         
        return promise; 
    }
    get(id:string):Promise<DataSource>{    
        //debugger;   
        let dbRef = this.getUserObjRef().child(id); 
        let promise =  new Promise<DataSource>((resolve,reject)=>{          
                dbRef.once('value')
                .then((snapshot)=> {
                    let tmp: any = snapshot.val();               
                    let ds = new DataSource (
                        tmp.name,
                        tmp.desc,
                        tmp.typename,
                        tmp.id,                   
                        tmp.user,
                        tmp.pwd,
                        tmp.file,
                        tmp.url,
                        tmp.csvSeparator,
                        tmp.csvSkip
                    );
                    resolve(ds);            
                });            
        });         
        return promise;     
    }
}