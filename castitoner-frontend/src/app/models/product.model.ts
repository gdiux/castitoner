import { environment } from "../../environments/environment"

// MODELS
import { Kit } from "./kits.model";
import { Department } from './department.model';

const base_url = environment.base_url;

interface _departamento{
    _id: string;
    name: string;
}

export class Product {

    constructor(
        public code: string,
        public name: string,
        public type: string,
        public cost: number,
        public gain: number,
        public price: number,
        public wholesale: number,
        public img: string | 'no-image',
        public department: _departamento,
        public pid: string,
        public kit?: Kit[],
        public stock?: number,
        public min?: number,
        public max?: number,
        public bought?: number,
        public sold?: number,
        public returned?: number,
        public damaged?: number,
        public expiration?: Date,
        public status?: boolean,
        public visibility?: boolean,
        public low?: boolean,
        public out?: boolean,
        public _id?: string
    ){}

    /** ================================================================
    *   GET IMAGE
    ==================================================================== */    
    get getImage(){
        
        if (this.img) {            
            return `${base_url}/uploads/products/${this.img}`;
        }else{
            return `${base_url}/uploads/products/no-image`;
        }
    }

};