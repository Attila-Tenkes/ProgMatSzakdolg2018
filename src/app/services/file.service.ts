import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { DashFile } from '../models/dashfile';
import { Constants} from '../shared/constants';
import notify from 'devextreme/ui/notify';

@Injectable()

export class FileService {  
    constructor() {             
    }
    getUserObjRef():firebase.database.Reference{
        let userKey = firebase.auth().currentUser.uid;           
        let userObjRef = firebase.database().ref(Constants.FILE_REF).child(userKey);
        return userObjRef;
    }  
    getSubfolder(file: DashFile):string{
        let subfolder: string = 'images';
         if (file.fileName.toLowerCase().endsWith('.csv')){
            subfolder = 'dataFiles';
        } 
        return subfolder;
    }
    createFile(file: DashFile){
        let subfolder: string = this.getSubfolder(file); 
        let storageRef = firebase.storage().ref();    
        let encoding = 'base64'; 
        let uploadTask:firebase.storage.UploadTask;   
        if (subfolder == 'dataFiles')
        {
            uploadTask = storageRef.child(`${subfolder}/${file.fileName}`).putString(file.contents)                    
        }
        else
        {
            uploadTask = storageRef.child(`${subfolder}/${file.fileName}`).putString(file.contents, 'base64')               
        }   
        uploadTask.then((snapshot) => { 
                let url = snapshot.metadata.downloadURLs[0];
                let dbRef = this.getUserObjRef().child(`${subfolder}`);
                let newFile = dbRef.push();
                newFile.set ({
                    displayName: file.name,
                    desc: file.description,
                    fileName: file.fileName,
                    url: url,                   
                    id: newFile.key
                });         
            })
            .catch ((error)=>{
                notify(`failed upload: ${error}`,"Error",2000);
            });       
    }

    editFile(update: DashFile){
        let subfolder: string = this.getSubfolder(update); ;
        let dbRef = this.getUserObjRef().child(`${subfolder}`).child(update.id)
            .update({
                displayName: update.name,
                desc: update.description
            });         
        notify("File deleted","Success",2000);   
    }

    removeFile(deleteFile: DashFile){
        //debugger;
        let subfolder: string = this.getSubfolder(deleteFile);
        let dbRef = this.getUserObjRef().child(`${subfolder}`).child(deleteFile.id).remove();
        notify("File deleted","Success",2000);      
        let imageRef = firebase.storage().ref().child(`${subfolder}/${deleteFile.fileName}`)
            .delete()
                .then(function() {                    
                    notify(`${deleteFile.fileName} was deleted from Storage`,"Success",2000);
                }).catch(function(error) {                    
                    notify(`Error - Unable to delete ${deleteFile.fileName}`,"Error",2000);
                });
    }

    getFilesOnce( subfolder: string):Promise<DashFile[]>{
        let dbRef = this.getUserObjRef().child(`${subfolder}`);

        let promise =  new Promise<DashFile[]>((resolve,reject)=>{       
                dbRef.once('value')
                .then((snapshot)=> {
                    let tmp: string[] = []
                    let files:DashFile[] = [];
                    if (snapshot.val()){
                        tmp  = snapshot.val();
                        files = Object.keys(tmp).map(key => new DashFile (
                            tmp[key].displayName,
                            tmp[key].desc,
                            tmp[key].fileName,
                            null,                   
                            tmp[key].id,
                            tmp[key].url
                        ));
                    }
                    resolve(files);             
                });           
        });         
        return promise;           
    }

    getImagesOnce( ):Promise<DashFile[]>{
        return this.getFilesOnce('images');          
    }
    getDataFilesOnce( ):Promise<DashFile[]>{
        return this.getFilesOnce('dataFiles');          
    }
    getAllFilesOn(callback: (a:firebase.database.DataSnapshot, b?: string)=>any){
        let dbRef = this.getUserObjRef();
        dbRef.on('value', callback);
    }
    getFiles(callback: (a:firebase.database.DataSnapshot, b?: string)=>any){
        let dbRef = this.getUserObjRef()
        dbRef.on('value', callback);           
    }
}