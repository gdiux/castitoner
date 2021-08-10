import { environment } from "../../environments/environment"
import { Product } from './product.model';
import { Carrito } from './carrito.model';

const base_url = environment.base_url;

export class Pedido{

    constructor(
        public pedido: number,
        public client: string,
        public user: string,
        public products: Carrito[],
        public amount: number,
        public payments: string,
        public ciudad: string,
        public departamento: string,
        public direccion: string,
        public telefono: string,
        public comentario: string,
        public estado: string,
        public status: boolean,
        public fecha: Date,
    ){}

}