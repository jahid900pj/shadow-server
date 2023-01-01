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



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6l0by.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    // console.log('token vvv', req.headers.authorization)
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).send('unauthorize access')
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access1' })
        }
        req.decoded = decoded
        next()
    })

}



async function run() {
    try {
        // await client.connect()
        // console.log('Db connected')

        const postCollections = client.db('Flow-shadow').collection('posts')
        const reviewCollection = client.db('Flow-shadow').collection('review')
        const aboutCollection = client.db('Flow-shadow').collection('about')

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

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollections.findOne(query)
            // console.log(user)
            // res.send({ accessToken: "token" })
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '12h' });
                // console.log(process.env.ACCESS_TOKEN)
                return res.send({ accessToken: token })
            }

        })

        // detail post 
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await postCollections.find(query).toArray()
            res.send(result)
        })


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        app.get('/addReviews', verifyJWT, async (req, res) => {
            let query = {}
            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)

        })

        app.get('/reviews', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)

        })














    }
    finally {

    }
}

run().catch()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})