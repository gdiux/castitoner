import { Pedido } from "../models/pedido.model";

export interface LoadPedidos{
    ok: boolean;
    total: number;
    pedidos: Pedido[];
}