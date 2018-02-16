import { Constants} from '../shared/constants';
import { Helpers} from '../shared/helpers';
import { Widget, Container , WidgetFact, ImageWidget} from '../models/widget';
import { DashMeta} from '../models/dashmeta';
import { UIDesignerService } from '../services/designer.service';
import { DataSourceService } from '../services/dataSource.service';

export class UserData {
        public name?: string;
        public id?: string;         
   
    constructor( id?: string,
        name?: string      
    ){
        this.name=  name || '';
        this.id= id|| '';              
    } 

    
}

