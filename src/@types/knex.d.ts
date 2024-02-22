import { Knex } from "knex";

declare module 'knex/types/tables' {
    
    export interface Tables{

        transactions: {
            
            id: string,
            title: string,
            amount: number,
            createdAt: string,
            session_id?: string
        },
    }
}