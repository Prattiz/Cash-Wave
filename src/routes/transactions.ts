import { FastifyInstance } from "fastify";

import { z } from 'zod';

import { knex } from "../database";
import { randomUUID } from 'node:crypto';

import { checkIfSessionIdExists } from "../middlewares/checkIfSessionIdExists";

export async function TransactionRoutes( app: FastifyInstance ){

     // -- POST FUNCTION -->
    
     app.post('/', async ( request, reply ) => {
        
        const createTransactionSchema = z.object({

            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        });

        const { title, amount, type } = createTransactionSchema.parse(request.body);

        let sessionId = request.cookies.sessionId;

        if(!sessionId){

            sessionId = randomUUID();

            reply.cookie('sessionId', sessionId, {

                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        }

        await knex('transactions').insert({

            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1 ,
            session_id: sessionId
        });

        return reply.status(201).send()
    });


    // -- GET FUNCTIONS -->

    app.get('/', { preHandler: [ checkIfSessionIdExists ]}, async ( request, reply ) => {

        const { sessionId } = request.cookies;

        const transactions = await knex('transactions')
            .where('session_id', sessionId)
            .select();

        return {
            transactions
        }
    });

    app.get('/:id', { preHandler: [ checkIfSessionIdExists ]}, async ( request ) => {

        const getTransactionParamsSchema = z.object({
            
            id: z.string().uuid(),
        });

        const { id } = getTransactionParamsSchema.parse(request.params);

        const { sessionId } = request.cookies;

        const transactions = await knex('transactions')
            .where({
                session_id: sessionId,
                id
            }).first();

        return {
            transactions,
        }
    });

    app.get('/summary', { preHandler: [ checkIfSessionIdExists ]}, async ( request ) => {

        const { sessionId } = request.cookies;

        const summary = await knex('transactions')
            .where('session_id', sessionId)
            .sum('amount', {as: 'sum amount'})
            .first();
        

        return {
            summary,
        }
    });
}