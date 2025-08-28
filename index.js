const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
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

    // Collections
    const blogsCollection = db.collection("blogs");
    const usersCollection = db.collection("users");

    // -------- Blogs Routes --------
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

    // -------- Users Routes --------
    // GET all users
    app.get('/users', async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    // GET single user by id
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      res.send(user);
    });

    // POST a new user
    app.post('/users', async (req, res) => {
      const user = req.body;
      user.createdAt = new Date();
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // UPDATE a user
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedUser };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // DELETE a user
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Root route
    app.get('/', (req, res) => {
      res.send('Blood donation server is running 🚀');
    });

  } finally {
    // await client.close(); // keep connection alive
  }
}

run().catch(console.dir);

// Start Server
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
