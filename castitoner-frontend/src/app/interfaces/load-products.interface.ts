import { Product } from '../models/product.model';

export interface LoadProducts{
    total: number;
    products: Product[];
}

export interface LoadProduct{
    ok: boolean;
    product: Product;
}

export interface LoadCost{
    costo: number;
    precio: number;
}