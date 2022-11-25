const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pqymyou.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    
    try{
        const dataCategoryCollections = client.db("marketPortal").collection("CategoryCollections");


        app.get('/categoryOptions', async (req, res) =>{
            const query = {};
            const options = await dataCategoryCollections.find(query).toArray();
            res.send(options);
        });

        app.get('/categoryOptions/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const categoryOption = await dataCategoryCollections.findOne(query);
            res.send(categoryOption); 
        });

        // app.get('/categoryOptions/:id', async (req, res) =>{

        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)};
        //     const categorys = await dataCategoryCollections.findOne(query);
        //     res.send(categorys); 

        // });
    }

    finally{

    }
}
run().catch(console.log);

// ---------------end----------------- 
app.get('/', async (req, res) =>{
    res.send('market-server-running');
})

app.listen(port, () => console.log(`Market running on ${port}`));

