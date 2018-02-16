export class DashFile {
    constructor(
        public name: string,
        public description: string,
        public fileName: string,
        public contents: any,
        public id?: string,
        public url?:string
    ){}

}