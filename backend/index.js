const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const stripe = require("stripe")(process.env.PAYMENT_KEY);
const PORT = process.env.PORT  || 3000;
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors({
  origin: ['https://yoga-master-server-mu.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json())



// SET TOKEN 
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if(!authorization){
    return res.status(401).send({message: 'Invalid authorization'})

  }
  const token = authorization?.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if(err){
      return res.status(403).send({message: 'Forbidden access'})
    }
    req.decoded = decoded;
    next()
  })
}

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
    const database = client.db("yoga-master");
    const usersCollection = database.collection("users");
    const classesCollection = database.collection("classes");
    const cartCollection = database.collection("carts");
    const paymentCollection = database.collection("payments");
    const enrolledCollection = database.collection("enrolled");
    const appliedCollection = database.collection("appliedClasses");
    const instructorsCollection = database.collection("instructors");
    const instructorApplicationsCollection = database.collection("instructorApplications");

    await client.connect();

      const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded?.email;

    if (!email) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).send({ message: "Forbidden access" });
    }

    next();

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
};;
  
      const verifyInstructor = async (req, res, next) => {
          const email = req.decoded.email;
          const user = await usersCollection.findOne({ email });

          if (!user) {
            return res.status(404).send({ message: "User not found" });
          }

          if (user.role !== 'instructor' && user.role !== 'admin') {
            return res.status(401).send({ message: "Unauthorized access" });
          }

          next()
        }
      app.post('/api/set-token', (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '24h' })
        res.send({ token })
      })


      app.post('/login', async (req, res) => {
          const { email, password } = req.body;

          const user = await usersCollection.findOne({ email });

          if (!user) {
            return res.status(400).send({ message: "User not found" });
          }

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
          }

          const token = jwt.sign(
            { email: user.email, role: user.role },
            process.env.ACCESS_SECRET,
            { expiresIn: "24h" }
          );

          res.send({
            token,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
      });

    //routes for users
   app.post('/new-user', async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare new user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      gender,
      role: "user",
      createdAt: new Date()
    };

    // Insert into DB
    const result = await usersCollection.insertOne(newUser);

    // Create JWT token
    const token = jwt.sign(
      { email: newUser.email, role: newUser.role },
      process.env.ACCESS_SECRET,
      { expiresIn: "24h" }
    );

    // Send response in consistent structure
    res.send({
      token,
      user: {
        _id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Registration failed" });
  }
});



    app.get('/users', async (req, res) => {
      const result = await usersCollection.find({}).toArray()
      res.send(result)
    })
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

      
    app.get('/user/:email', verifyJWT, async (req, res) => {
            const email = req.decoded.email;
            const query = { email: email };
            const result = await usersCollection.findOne(query);
            res.send(result);
    })
  // Delete a user

    app.delete('/delete-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.send(result);
    })

         // UPDATE USER
    app.put('/update-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.option,
                    address: updatedUser.address,
                    phone: updatedUser.phone,
                    about: updatedUser.about,
                    photoUrl: updatedUser.photoUrl,
                    skills: updatedUser.skills ? updatedUser.skills : null,
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
    // classes routes here
    app.post('/new-class',verifyJWT, verifyInstructor, async (req, res) => { 
      const newClass = req.body; 
      newClass.availableSeats = parseInt(newClass.availableSeats);
      const result = await classesCollection.insertOne(newClass);
      res.send(result) })

    console.log("MongoDB connected successfully");

    // get all classes
    app.get("/classes", async(req, res) => {
      const query = {status: "approved"};
      const result = await classesCollection.find(query).toArray();
      res.send(result);
    })

    // get classes by instructor email
    app.get("/classes/:email",verifyJWT, verifyInstructor, async(req, res) => {
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
    app.put("/change-status/:id", verifyJWT, verifyAdmin, async(req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      // console.log(req.body)
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
    app.put ("/update-class/:id",verifyJWT, verifyInstructor, async (req, res) => {
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

 
app.post('/add-to-cart', verifyJWT, async (req, res) => {
  const { classId } = req.body;
  const email = req.decoded.email; // userMail

  if (!classId) return res.status(400).send({ message: "classId missing" });

  // prevent duplicates
  const exists = await cartCollection.findOne({ classId, userMail: email });
  if (exists) {
    console.log(`User ${email} already has class ${classId} in cart`);
    return res.status(200).send({ message: "Already in cart" });
  }

  const newCartItem = { classId, userMail: email, createdAt: new Date() };
  const result = await cartCollection.insertOne(newCartItem);



  res.send(result);
});

app.get('/cart', verifyJWT, async (req, res) => {
  const email = req.decoded.email;

  // Find all cart items for this user
  const carts = await cartCollection.find({ userMail: email }).toArray();
  const classIds = carts.map(c => new ObjectId(c.classId));

  // Get class details
  const classesInCart = await classesCollection.find({
    _id: { $in: classIds }
  }).toArray();

  res.send(classesInCart);
});



app.delete('/delete-cart-item/:id', verifyJWT, async (req, res) => {
  const id = req.params.id;
  const email = req.decoded.email;

  const query = { classId: id, userMail: email };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
});
    //payment routes
    app.post('/create-payment-intent',verifyJWT, async (req, res) => {
      const {price} = req.body;
      const amount = parseInt(price) * 100;
       const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"]
       })
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
    })

    //post payment info to db
    app.post('/payment-info', verifyJWT, async (req, res) => {
      const paymentInfo = {
    ...req.body,
    date: new Date(), 
    };
      
      const classesId = paymentInfo.classesId;

      const classObjects = await classesCollection.find({
      _id: { $in: classesId.map(id => new ObjectId(id)) }
      }).toArray();
      paymentInfo.classNames = classObjects.map(c => c.name);

      const userEmail = paymentInfo.userEmail;
      const singleClassId = req.query.classId;
      let query;

      if (singleClassId) {
        query = { classId: singleClassId, userMail: userEmail };
      } else {
        query = { classId: { $in: classesId } };
      }

      const classesQuery = {
        _id: { $in: classesId.map(id => new ObjectId(id)) }
      };

      const updatedDoc = {
        $inc: {
          totalEnrolled: 1,
          availableSeats: -1
        }
      };

      const updatedResult = await classesCollection.updateMany(classesQuery, updatedDoc);
      
      const newEnrolledData = {
        userEmail: userEmail,
        classesId: classesId.map(id => new ObjectId(id)),
        transactionId: paymentInfo.transactionId,
      };

      const enrolledResult = await enrolledCollection.insertOne(newEnrolledData);
      const deletedResult = await cartCollection.deleteMany(query);
      const paymentResult = await paymentCollection.insertOne(paymentInfo);

      res.send({ paymentResult, deletedResult, enrolledResult, updatedResult });
    });


    //get payment history
    app.get("/payment-history/:email", verifyJWT, async (req, res) => {
    const email = req.params.email;

  
    if (email !== req.decoded.email) {
      return res.status(403).send({ message: "Forbidden" });
    }

    const query = { userEmail: email };
    const result = await paymentCollection
      .find(query)
      .sort({ date: -1 })
      .toArray();

    res.send(result);
    });

    //enrollment Routes
    app.get('/popular-classes', async(req, res) => {
      const result = await classesCollection
        .find({ status: "approved" })
        .sort({ totalEnrolled: -1 })
        .limit(3)  
        .toArray();
      res.send(result);
    })

    // GET all instructor applications (admin only)
    app.get("/instructor-applications", verifyJWT, verifyAdmin, async (req, res) => {
      try {
        const result = await instructorApplicationsCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send({ message: "Server error" });
      }
    });


    // Accept: update role to instructor + delete application
app.patch("/instructor-applications/:id/accept", verifyJWT, async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  // 1. Get application FIRST before deleting ← KEY FIX
  const application = await instructorApplicationsCollection.findOne({ _id: new ObjectId(id) });

  // 2. Update user role
  await usersCollection.updateOne({ email }, { $set: { role: "instructor" } });

  // 3. Get user data
  const user = await usersCollection.findOne({ email });

  // 4. Add to instructors collection
  const alreadyInstructor = await instructorsCollection.findOne({ email });
  if (!alreadyInstructor) {
    await instructorsCollection.insertOne({
      name: application.name || user.name,
      email: user.email,
      photoUrl: application.photoUrl || user.photoUrl || null,
      specialization: application.specialization,
      yoga: application.answer,
      yearsOfExperience: application.yearsOfExperience,
      role: "instructor",
      createdAt: new Date()
    });
  }

  // 5. Delete application LAST ← after we've used the data
  await instructorApplicationsCollection.deleteOne({ _id: new ObjectId(id) });
  
  res.send({ message: "Accepted" });
});
    // Reject: just delete the application
    app.delete("/instructor-applications/:id/reject", verifyJWT, async (req, res) => {
      const { id } = req.params;
      await instructorApplicationsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send({ message: "Rejected" });
    });



    app.get('/popular-instructor', async (req, res) => {
      const pipeline = [
        {
          $group: {
            _id: "$instructorEmail",
            totalEnrolled: {$sum : "$totalEnrolled"}
          }
        },
        {
          $lookup:{
            from: "users",
            localField: "_id",
            foreignField: "email",
            as: "instructor"
          }
        },
        {
          $project:{
            _id: 0,
            instructor: {
              $arrayEleAt: ["$instructor", 0]
            },
            totalEnrolled: 1

        }
      },
      {
        $sort: {
          totalEnrolled: -1
        }
      },
      {
        $limit: 6
      }
      ];
      const result = await classesCollection.aggregate(pipeline).toArray();
      res.send(result);

      })

    // Admins stats 
    app.get('/admin-stats', verifyJWT, verifyAdmin, async (req, res) => {
    try {

    const approvedClasses = await classesCollection.countDocuments({ status: 'approved' });

    const pendingClasses = await classesCollection.countDocuments({ status: 'pending' });

    const instructors = await usersCollection.countDocuments({ role: 'instructor' });

    const totalClasses = await classesCollection.countDocuments();

    const totalEnrolled = await enrolledCollection.countDocuments();

    const result = {
      approvedClasses,
      pendingClasses,
      instructors,
      totalClasses,
      totalEnrolled,
    };

    res.send(result);

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
  });
    //Get allInstructor
  app.get('/instructors', async (req, res) => {
    try {
      const collections = await database.listCollections().toArray();
      // console.log("Collections:", collections);

      const result = await instructorsCollection.find().toArray();
      // console.log("Instructors:", result);

      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    }
  });



  app.get('/enrolled-classes/:email', verifyJWT, async(req, res) => {
      const email = req.params.email;
      const query = {userEmail: email};
      const pipeline = [
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: "classes",
                        localField: "classesId",
                        foreignField: "_id",
                        as: "classes"
                    }
                },
                {
                    $unwind: "$classes"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "classes.instructorEmail",
                        foreignField: "email",
                        as: "instructor"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        classes: 1,
                        instructor: {
                            $arrayElemAt: ["$instructor", 0]
                        }
                    }
                }

            ]
            const result = await enrolledCollection.aggregate(pipeline).toArray();
            // const result = await enrolledCollection.find(query).toArray();
            res.send(result);
    })
  // appliend for instructors
  app.post('/ass-instructor', async(req, res) => {
    const data = req.body;
    const result = await instructorApplicationsCollection.insertOne(data)
    res.send(result)
  })  
  app.get('/applied-instructors/:email',   async (req, res) => {
            const email = req.params.email;
            const result = await instructorApplicationsCollection.findOne({email});
            res.send(result);
        });

    
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