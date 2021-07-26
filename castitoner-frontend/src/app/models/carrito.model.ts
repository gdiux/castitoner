import { environment } from "../../environments/environment"
import { Product } from './product.model';

const base_url = environment.base_url;

export class Carrito{

    constructor(
        public product:string,
        public name?: string,
        public price?: number,
        public qty?: number,
        public img?: string
    ){}

}