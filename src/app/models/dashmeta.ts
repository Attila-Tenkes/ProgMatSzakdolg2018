import { UIDesignerService } from '../services/designer.service';
import { UserData } from '../models/user';
export class DashMeta {    
    constructor(
        private designerSVC: UIDesignerService,
        public name: string,
        public description: string, 
        public readOnly:boolean,               
        public id?: string,
        public owner?:string
    ){}   
    readerkeys:string[];
    refreshReaders(callback:any){
        this.designerSVC.getReaders(this, callback);
    }
}