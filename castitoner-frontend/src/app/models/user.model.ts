import { environment } from "../../environments/environment"

const base_url = environment.base_url;

export class User {    

    constructor(
        public email: string,
        public name: string,
        public cid: string,
        public valid: boolean,
        public img?: string,
        public cedula?: string,
        public phone?: string,
        public city?: string,
        public department?: string,
        public address?: string,
        public mayoreo?: boolean,
        public credit?: boolean,
        public contratista?: boolean,
    ){}

    /** ================================================================
    *   GET IMAGE
    ==================================================================== */    
    get getImage(){        
        
        if (this.img) {            
            return `${base_url}/uploads/user/${this.img}`;
        }else{
            return `${base_url}/uploads/user/no-image`;
        }
    }

};