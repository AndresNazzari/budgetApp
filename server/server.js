import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import path from 'path';
import express from 'express';
import cors from 'cors';
import { createTables } from './config/createTables.js';
import { createDatabase } from './config/createDatabase.js';

import { setup, container } from './di-setup.js';
setup();

/*============================[Config]==========================*/

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*============================[Database]==========================*/
await createDatabase();
await createTables();

/*============================[Routes]============================*/
app.use('/api/user', container.resolve('userRoute'));
app.use('/api/category', container.resolve('categoryRoute'));
app.use('/api/income', container.resolve('incomeRoute'));
app.use('/api/expense', container.resolve('expenseRoute'));

/*============================[Server]============================*/
const PORT = process.env.PORT || 3000;

//Serve static assters in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server started on port  ${server.address().port}`);
});
server.on('error', (error) => console.log(`Error on server ${error}`));
