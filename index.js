const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");

require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugc3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('tourBD');
        const servicesCollection = database.collection('services');
        const myOrderCollection = database.collection('myOrder');

        const productsCollection = database.collection('products');

        app.post('/bookings', async (req, res) => {


        });
        //add products post api
        app.post('/addProducts', async (req, res) => {
            const product = req.body;
            console.log('hit the post api', product);

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        });
        //Get all Services API
        app.get('/allProducts', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        // Get Single Service API
        app.get('/allProducts/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific product', id);
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.json(product);
        });

        //My Orders Post API
        app.post('/myOrders', async (req, res) => {
            const myOrder = req.body;
            const result = await myOrderCollection.insertOne(myOrder);
            res.json(result);
            console.log(result);
        })


        //My order get api

        app.get("/myOrder/:email", async (req, res) => {
            const query = req.params.email
            console.log(query)
            const result = await myOrderCollection
                .find({
                    email: req.params.email
                })
                .toArray();
            console.log(result)
            res.send(result);
        });

        /// delete order

        app.delete("/delteOrder/:id", async (req, res) => {
            const result = await myOrderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('HelloTour On Bangladesh')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})