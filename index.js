const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()
require('dotenv').config();


app.use(express.json())
app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.usnai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        const minionCollection = client.db("DB").collection("minion")

        app.post('/minion', async (req, res) => {
            const { Name, Age, Color } = req.body;
            if (!Name || !Age || !Color) return res.status(400).json({ "message": "Please post with the minion that have Name, Age and Color properties" })
            try {
                const result = await minionCollection.insertOne(req.body);
                res.send(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })

        app.get('/minion', async (req, res) => {
            const result = await minionCollection.find({}).toArray();
            res.send(result)
        })

        app.patch('/minion/:id', async (req, res) => {
            const { id } = req.params;
            const { Name, Age, Color } = req.body;
            if (!Name || !Age || !Color) return res.status(400).json({ "message": "Please update with the minion that have Name, Age and Color properties" })
            try {
                const result = await minionCollection.updateOne({ _id: ObjectId(id) }, { $set: req.body })
                res.send(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })

        app.delete('/minion/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await minionCollection.deleteOne({ _id: ObjectId(id) })
                res.send(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })

    } finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running with ' + port)
})

app.listen(port, () => {
    console.log('Yay server is running');
})