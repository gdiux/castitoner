import { environment } from "../../environments/environment"
import { Product } from './product.model';

const base_url = environment.base_url;

export class Carrito{

    constructor(
        public product:any,
        public img: string,
        public price: number,
        public qty: number,
        public name: string,
    ){}

}