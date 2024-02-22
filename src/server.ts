import fastify from "fastify";
import { TransactionRoutes } from "./routes/transactions";


const app = fastify();

app.register(TransactionRoutes, {
    prefix: 'transactions',
});

app.listen({
    port: 3333,

}).then(() => {
    console.log("Server Running")
})