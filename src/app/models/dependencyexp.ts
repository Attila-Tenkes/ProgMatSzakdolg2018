enum Ternary {
    true,
    false,
    unknown,    
}
export class DependencyExp {
    private expTree={};
    constructor(
        public exp: string,
        public filters: any
    ){       
        if (exp!=null &&exp.length>0 && filters!=null)
        {
            this.expTree = this.buildTree(exp);
        }
    }

    private buildTree(exp: string):any{
        var indexAnd = exp.indexOf(' and ');
        var indexOr  =exp.indexOf(' or ');
        var index = -1;
        var lop=''; var aop = '';
        var offset = 5;
        if (indexAnd>-1  && indexOr<0)
        {
            index = indexAnd;
            lop = '&&';
        }
        else if ( indexAnd<0  && indexOr>-1)
        {
            index = indexOr;
            lop='||';
            offset = 4;
        }  
        else if ( indexAnd>-1  && indexOr>-1)
        {
            if (indexOr<indexAnd )
            {
                 index = indexOr;
                 lop='||';
                 offset = 4;
            } 
            else{
                 index = indexAnd;
                 lop='&&';
            }            
        }             
        else {
            offset = 4;            
            if ( exp.indexOf(' ge ')>-1)
            {
                index = exp.indexOf(' ge ');aop = '>=';
            }
            else if (exp.indexOf(' gt ')>-1){index = exp.indexOf(' gt ');aop = '>';offset=3;}
            else if (exp.indexOf(' le ')>-1){index = exp.indexOf(' le ');aop = '<='}
            else if (exp.indexOf(' lt ')>-1){index = exp.indexOf(' lt ');aop = '<';offset=3;}
            else if (exp.indexOf(' eq ')>-1){index = exp.indexOf(' eq ');aop = '=='}
            else if (exp.indexOf(' ne ')>-1){index = exp.indexOf(' ne ');aop = '!='}
        }

        var subtree={}
        if (index>-1)
        {
            if (lop.length>0){
        
                subtree["logicalOperator"]=lop;
                subtree["left"]= this.buildTree(exp.substr(0, index));
                subtree["right"]= this.buildTree(exp.substr(index+offset));
            } 
            else
            {
                subtree["arithmenticOperator"]=aop;
                var paramName = exp.substr(0, index).trim();
                var operand = this.opValue(paramName);               
                subtree["left"]=operand;
                subtree["lValue"]=paramName!==operand;

                paramName=exp.substr( index+offset).trim();
                operand = this.opValue(paramName);
                subtree["right"]=operand;
                subtree["rValue"]=paramName!==operand;
            }
        }
        return subtree;              
    }
    private opValue(param:string):any{
        var val = param;
        if (this.filters){
            if (param.startsWith('@')){
                //can be found?
                var temp = this.filters[param];   
                if (temp!=undefined){
                    val = temp;
                }                               
            }
        }
        return val;
    }
   
    private evaluateLeaf(node:any, dataRow: any):Ternary{
        var left = null;
        var right =null;
        if (node.rValue && 
            node.left.startsWith('{') && 
            node.left.endsWith('}') 
            )
        {
            left = dataRow[node.left.substring(1,node.left.length-1)];
            right = node.right;
        }
        else if  (node.lValue &&
            node.right.startsWith('{') && 
            node.right.endsWith('}') 
            )
        { 
            left = dataRow[node.right.substring(1,node.right.length-1)];
            right = node.left;
        }

        if (left!=null && right!=null)
        {
            if (node.arithmenticOperator==">"){

                return left>right?Ternary.true:Ternary.false;
            }
            else if (node.arithmenticOperator==">="){
                return left>=right?Ternary.true:Ternary.false;
            }
            if (node.arithmenticOperator=="<"){
                return left<right?Ternary.true:Ternary.false;
            }
            else if (node.arithmenticOperator=="<="){
                return left<=right?Ternary.true:Ternary.false;
            }
            if (node.arithmenticOperator=="!="){
                return left!=right?Ternary.true:Ternary.false;
            }
            else if (node.arithmenticOperator=="=="){
                return left==right?Ternary.true:Ternary.false;
            }
        }
        else {
            return Ternary.unknown;
        }
    }
    private evaluateNode(node:any, dataRow: any):Ternary{
        if (node.logicalOperator=="&&"){            
            let left:Ternary =this.evaluateNode(node.left,dataRow);   
            let right:Ternary;   
            if (left==Ternary.unknown) {
                right=this.evaluateNode(node.right,dataRow); 
                return right;
            }     
            else if (left==Ternary.true){
                 right=this.evaluateNode(node.right,dataRow); 
                 var res = right==Ternary.unknown? Ternary.true: right;
                 return res;
            }
            else return Ternary.false;           
        }
        else if (node.logicalOperator=="||"){           
            let left:Ternary =this.evaluateNode(node.left,dataRow);   
            let right:Ternary;   
            if (left==Ternary.unknown) {
                right=this.evaluateNode(node.right,dataRow); 
                return right;
            }     
            else if (left==Ternary.true){
                return Ternary.true;                
            }
            else {
                 right=this.evaluateNode(node.right,dataRow); 
                 var res = right==Ternary.unknown? Ternary.false: right;
                 return res;
            } 
        }
        else {
            return this.evaluateLeaf(node, dataRow);
        }

    }
    protected Evaluate(dataRow: any):Boolean{
        var res = this.evaluateNode(this.expTree, dataRow);
        return res == Ternary.unknown ||res == Ternary.true;
    }
    public isMatch(dataRow:any):Boolean{
        if (this.expTree){
            return this.Evaluate(dataRow);
        }
        return true;
    }
}