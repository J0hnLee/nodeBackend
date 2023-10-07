import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './router';
// 載入 .env 檔案中的環境變數
dotenv.config();
console.log("Hello ts");

const app = express()
app.use(cors(
    {credentials:true,
    }
));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const server=http.createServer(app)
server.listen(8083,()=>{

    console.log('Server running on http://localhost:8083')
})

const MONGO_URL=process.env.MONGO_URL
mongoose.Promise=Promise;
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/',router());

// const { MongoClient, ServerApiVersion } = require('mongodb');
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(MONGO_URL, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
//   async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect();
//       // Send a ping to confirm a successful connection
//       await client.db("admin").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
//   run().catch(console.dir);

