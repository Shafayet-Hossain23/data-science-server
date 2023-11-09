const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors");
const jwt = require('jsonwebtoken');
require('dotenv').config()


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to the Data Science!')
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cwvxmja.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const usersCollection = client.db("DataScience").collection("userInfo")

        app.post('/users', async (req, res) => {
            const userInfo = req.body
            const result = await usersCollection.insertOne(userInfo)
            res.send(result)
        })
        app.post('/users/popup', async (req, res) => {
            const user = req.body
            // console.log(user)
            const query = {
                email: user.email
            }
            const alreadyAddeduser = await usersCollection.findOne(query)
            if (!alreadyAddeduser) {
                const userCollection = await usersCollection.insertOne(user)
                return res.send(userCollection)
            }
            if (alreadyAddeduser) {
                return res.send(alreadyAddeduser)
            }

        })
    } finally {

    }
}
run().catch(console.dir);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
