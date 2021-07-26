import { environment } from "../../environments/environment"

const base_url = environment.base_url;

export class User {    

    constructor(
        public email: string,
        public name: string,
        public img?: string,
        public uid?: string,
        public status?: boolean,
        public cedula?: string,
        public phone?: string,
        public address?: string,
        public city?: string,
        public department?: string,
        public zip?: string,
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