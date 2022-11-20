import { createTables } from './src/config/createTables.js';
export default async (express, cors, depInySetup, container) => {
    /*============================[Config]==========================*/

    await depInySetup();

    await createTables(container.resolve('db'));

    const server = express();

    // const corsOptions = {
    //     origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    //     credentials: true, //access-control-allow-credentials:true
    //     optionSuccessStatus: 200,
    // };
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    /*============================[Routes]============================*/
    server.use('/api/user', container.resolve('userRoute'));
    server.use('/api/category', container.resolve('categoryRoute'));
    server.use('/api/income', container.resolve('incomeRoute'));
    server.use('/api/expense', container.resolve('expenseRoute'));

    return server;
};
