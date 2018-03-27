import * as firebase from 'firebase';

export class DataSource {
    constructor(
        public name: string,
        public description: string,      
        public typename:string, 
        public format:string,//SingeleSeries, MultiSeries, Tabular         
        public id?: string,
        public user?: string,
        public pwd?: string,
        public file?: string,
        public url?: string,
        public csvSeparator?: string,
        public csvSkip?: number
    ){}

    public load(callback: (a:any)=>any, asyncMode?:boolean):void{    
        asyncMode=asyncMode?asyncMode:false;
        if (this.url) {
            var that = this;
            var xhr = new XMLHttpRequest();           
            if (asyncMode){
                xhr.onload = function(event) {                               
                    callback(xhr.response);
                };
                xhr.onerror = function (error) {
                    callback(xhr.response);
                };
                xhr.open('GET', this.url);
                xhr.send();     
            }
            else
            {
                xhr.open('GET', this.url,asyncMode); //sync call
                xhr.send();      
                callback(JSON.parse(xhr.responseText)); 
            }
        } 
        else if (this.file){           
            var httpsReference = firebase.storage().refFromURL(this.file+'?cors');
            var that = this;
            var xhr = new XMLHttpRequest();
            if (asyncMode){
                xhr.onload = function(event) {                               
                    callback(xhr.responseText);
                };
                xhr.onerror = function(event) {                               
                    callback(xhr.responseText);
                };
                xhr.open('GET', this.file);
                xhr.send();     
            }
            else
            {
                xhr.open('GET', this.file,asyncMode); //sync call
                xhr.send();      
                callback(xhr.responseText); 
            }                 
        }
    }
    public get():any{

    }
    public filter(){}

}
