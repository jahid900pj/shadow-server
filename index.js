const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// middle ware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('shadow with you')
})
// flow-shadow
// rS7KDKARwSw4cf4H



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6l0by.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

// const doctorsCollections = client.db('doctorsPortal').collection('doctors')
// app.post('/users', async (req, res) => {
//     const user = req.body;
//     const result = await usersCollections.insertOne(user)
//     res.send(result)
// })
async function run() {
    try {
        // await client.connect()
        // console.log('Db connected'.yellow)

        const postCollections = client.db('Flow-shadow').collection('posts')

        // Add post 
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollections.insertOne(post)
            res.send(result)
        })

        // get post
        app.get('/posts', async (req, res) => {
            const query = {}
            const posts = await postCollections.find(query).toArray()
            res.send(posts)
        })
        // app.get('/bikeCollections/:category_id', async (req, res) => {
        //     const id = req.params.category_id
        //     const query = { category_id: id }
        //     const result = await bikeCollections.find(query).toArray()
        //     res.send(result)
        // })

        // detail post 
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await postCollections.find(query).toArray()
            res.send(result)
        })







    }
    finally {

    }
}

run().catch()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})