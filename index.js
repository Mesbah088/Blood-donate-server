const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.sj37ktr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("Blood-Connect");
    const blogsCollection = db.collection("blogs");

    // GET all blogs
    app.get('/blogs', async (req, res) => {
      const blogs = await blogsCollection.find().sort({ createdAt: -1 }).toArray();
      res.send(blogs);
    });

    // POST a new blog
    app.post('/blogs', async (req, res) => {
      const blog = req.body;
      blog.createdAt = new Date();
      const result = await blogsCollection.insertOne(blog);
      res.send(result);
    });

    

    app.get('/', (req, res) => {
      res.send('Blood donation server is running');
    });

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Running app listening on port ${port}`);
});
