import { FastifyInstance } from "fastify";

import { z } from 'zod';

import { knex } from "../database";
import { randomUUID } from 'node:crypto';

export async function TransactionRoutes( app: FastifyInstance ){

    app.get('/', async () => {

        const transactions = await knex('transactions').select();

        return {
            transactions
        };
    });

    
    app.post('/', async ( request, reply ) => {
        
        const createTransactionSchema = z.object({

            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        });

        const { title, amount, type } = createTransactionSchema.parse(request.body);

        await knex('transactions').insert({

            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1 ,
        });

        return reply.status(201).send()
    });
}