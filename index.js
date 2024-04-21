const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//! middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jjame0030:zGS6q2rphN46W7C7@cluster0.2ncikoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        //! https://www.mongodb.com/docs/drivers/node/v4.1/usage-examples/insertOne/#example
        const database = client.db("usersDB");
        const userCollection = database.collection("users");

        app.get('/users', async (req, res) => {
            //! https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //! create a route for post
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user backend =', user);
            const result = await userCollection.insertOne(user);

            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SIMPLE CURD IS RUNNING...');
})

app.listen(port, () => {
    console.log(`port no: ${port}`);
})