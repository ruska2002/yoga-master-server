const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const PORT = process.env.PORT  || 3000;

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mnjc0kb.mongodb.net/?appName=Cluster0`;

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
    await client.connect();

    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("carts");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("appliedClasses");

    // classes routes here
    app.post('/new-class', async (req, res) => { 
      const newClass = req.body; 
      //newClass.availableSeats = parseInt(newClass.availableSeats);
      const result = await classesCollection.insertOne(newClass);
      res.send(result) })

    console.log("MongoDB connected successfully");

    // get all classes
    app.get("/classes", async(req, res) => {
      const query = {status: "approved"};
      const result = await classesCollection.find().toArray();
      res.send(result);
    })

    // get classes by instructor email
    app.get("/classes/:email", async(req, res) => {
      const email = req.params.email;
      const query = {instructorEmail: email}
      const result = await classesCollection.find(query).toArray()
      res.send(result)    
    })

    // manage classes
    app.get("/classes-manage", async(req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    })

    // update classes status and reason
    app.put("/change-status/:id", async(req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const reason = req.body.reason;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateDoc = {
        $set:{
          status: status,
          reason: reason,
        },
      };
      const result = await classesCollection.updateOne(filter,updateDoc, options)
      res.send(result);
    })

    //get approved classes
    app.get("/approved-classes", async (req, res) => {
      const query = {status: "approved"}
      const result = await classesCollection.find(query).toArray()
      res.send(result) 
    })

    //get single class details
    app.get('/class/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await classesCollection.findOne(query);
      res.send(result);
    })

    // updates class details (all data)
    app.put ("/update-class/:id", async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true}; 
      const updateDoc = {
        $set:{
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status: 'pending',
        },  
      }
      const result = await classesCollection.updateOne(filter, updateDoc, options)
      res.send(result);

    })

    //Cart routes
    app.post('/add-to-cart', async(req, res) => {
      const newCartItem = req.body
      const result = await cartCollection.insertOne(newCartItem)
      res.send(result);
    })

    //get cart item by id
    app.get('/cart-item/:id', async (req, res) => {
      const id = req.params.id;
      const email = req.query.email;

      const query = {
        classId: id,
        userMail: email
      };

      const projection = { classId: 1 };

      const result = await cartCollection.findOne(query, { projection: projection });
      res.send(result);
    });

    // cart info by user email
    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email;
      const query = {userMail: email};
      const projection = {classId: 1};
      const carts = await cartCollection.find(query, {projection: projection})
      const classIds = carts.map((cart) => new ObjectId(cart.classId))
      const query2 = {_id: {$in: classIds}};
      const result = await classesCollection.fins(query2).toArray();
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {}
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello, Yoga Master");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});