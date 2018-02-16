export class Helpers  {
    
    static NextID ():string{
        let d = new Date();
        let n = d.getTime();
        return '_' +n.toString()+ Math.random().toString(36).substr(2, 9);
    }

};