import * as firebase from 'firebase';

export class DataSource {
    constructor(
        public name: string,
        public description: string,      
        public typename:string,          
        public id?: string,
        public user?: string,
        public pwd?: string,
        public file?: string,
        public url?: string,
        public csvSeparator?: string,
        public csvSkip?: number
    ){}

    public load(callback: (a:any)=>any):void{
        if (this.file){           
            var httpsReference = firebase.storage().refFromURL(this.file+'?cors');
            var that = this;
            var xhr = new XMLHttpRequest();
            //async case
            //  xhr.responseType = 'text';
            /*  xhr.onload = function(event) {
                //that["result"] = xhr.response;  
                //debugger;              
                callback(xhr.response);
            };*/
            xhr.open('GET', this.file,false); //sync call
            xhr.send();      
            callback(xhr.responseText);        
        }
    }
    public get(){

    }
    public filter(){}

}