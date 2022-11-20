import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { depInySetup, container } from './dep-inyection-setup.js';
import server from './server.js';
import cors from 'cors';
import express from 'express';

/*============================[Database]==========================*/

const app = await server(express, cors, depInySetup, container);

const PORT = process.env.PORT || 3000;

//se exporta appServer pára poder eventualmente hacer appServer.close() en los tests
export const appServer = app.listen(PORT, () => {
    console.log(`🚀 Server started on port  ${PORT}`);
});
app.on('error', (error) => console.log(`Error on server ${error}`));

export default app;
