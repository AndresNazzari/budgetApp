import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config({ path: `./.env` });
const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*============================[Database]==========================*/

/*============================[Routes]============================*/

/*============================[Server]============================*/
//Serve static assters in production
if (process.env.NODE_ENV === 'production') {
    //Set Static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server started on port  ${server.address().port}`);
});
server.on('error', (error) => console.log(`Error on server ${error}`));
