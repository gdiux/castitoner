import { environment } from "../../environments/environment"

const base_url = environment.base_url;

export class Wompi{

    constructor(
        public amount_in_cents: number,
        public created_at: Date,
        public currency: string,
        public id: string,
        public merchant: any[],
        public payment_method: any[],
        public payment_method_type: string,
        public redirect_url: string,
        public status: string,
        public status_message: any,
        public reference: string,
        public taxes?: any[]
    ){}

}