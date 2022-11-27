const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const jwt = require('jsonwebtoken');
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
      const dataCategoryCollections = client
        .db("marketPortal")
        .collection("CategoryCollections");
      const addCardsCollections = client
        .db("marketPortal")
        .collection("addCards");
      const usersCollections = client.db("marketPortal").collection("users");
      const productsCollections = client
        .db("marketPortal")
        .collection("products");

      app.post("/products", async (req, res) => {
        const products = req.body;
        const result = await productsCollections.insertOne(products);
        res.send(result);
      });
      app.get("/products", async (req, res) => {
        const query = {};
        const products = await productsCollections.find(query).toArray();
        res.send(products);
      });

      app.get("/users", async (req, res) => {
        const query = {};
        const users = await usersCollections.find(query).toArray();
        res.send(users);
      });

      app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await usersCollections.deleteOne(filter);
        res.send(result);
      });

      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await usersCollections.insertOne(user);
        res.send(result);
      });

      app.get("/users/admin/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email };
        const user = await usersCollections.findOne(query);
        res.send({ isAdmin: user?.role === "Admin" });
      });

       app.get("/users/seller/:email", async (req, res) => {
         const email = req.params.email;
         const query = { email };
         const user = await usersCollections.findOne(query);
         res.send({ isSeller: user?.role === "Seller" });
       });

      app.post("/addCards", async (req, res) => {
        const addCard = req.body;
        const result = await addCardsCollections.insertOne(addCard);
        res.send(result);
      });

      app.get("/addCards", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const options = await addCardsCollections.find(query).toArray();
        res.send(options);
      });

      app.get("/categoryOptions", async (req, res) => {
        const query = {};
        const options = await dataCategoryCollections.find(query).toArray();
        res.send(options);
      });

      app.get("/categoryOptions/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const categoryOption = await dataCategoryCollections.findOne(query);
        res.send(categoryOption);
      });

      app.get("/jwt", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const user = await usersCollections.findOne(query);
        if (user) {
          const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
            expiresIn: "2day",
          });
          return res.send({ accessToken: token });
        }

        res.status(403).send({ accessToken: "" });
      });
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

