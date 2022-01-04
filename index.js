
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const app = express();

//MIDDLEWARE added
app.use(cors());
app.use(express.json());

// API added
app.get("/", async (req, res) => {
  res.send("server is cholse!");
});

//URI


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmd33.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {



//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmd33.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmd33.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//DB CONNECTION added 
//env file added extra
async function run() {
  try {
    await client.connect();
    const database = client.db("wish-board");
    const user_collection = database.collection("users");
    const product_collection = database.collection("products");
    const order_collection = database.collection("orders");
    const review_collection = database.collection("review");

    // post api added
    app.post("/users", async (req, res) => {
      const result = await user_collection.insertOne(req.body);
      res.json(result);
    });

    // post api added here
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const result = await user_collection.findOne({ email: email });
      res.json(result);
    });

    // post api added here
    app.put("/addAdmin", async (req, res) => {
      const email = req.body.email;
      const result = await user_collection.updateOne(
        { email },
        {
          $set: { role: "admin" },
        }
      );
      res.json(result);
    });

    //load: get api added here
    app.get("/products", async (req, res) => {
      const result = await product_collection.find({}).toArray();
      res.json(result);
    });


    // post api added here
    app.post("/placeorder", async (req, res) => {
      const order = req.body;
      order.status = "Pending";
      delete order._id;
      const result = await order_collection.insertOne(order);
      res.json(result);
    });

    // load: get api added here
    app.get("/placeorder/:id", async (req, res) => {
      const result = await product_collection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });




    //- get all  api here
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      let result;
      if (email) {
        result = await order_collection.find({ email }).toArray();
      } else {
        result = await order_collection.find({}).toArray();
      }
      res.json(result);
    });

    //put api added here
    app.put("/updateOrderStatus", async (req, res) => {
      const id = req.body.id;
      const status = req.body.status;
      const result = await order_collection.updateOne(
        { _id: ObjectId(id) },
        {
          $set: { status: status },
        }
      );
      res.json(result.modifiedCount);
    });

    //update product here
    app.put("/updateProduct", async (req, res) => {
      const id = req.query.id;
      const product = req.body;
      const result = await product_collection.updateOne(
        { _id: ObjectId(id) },
        {
          $set: product,
        }
      );
      res.json(result);
    });


    app.delete("/placeorder/:id", async (req, res) => {
      const result = await order_collection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
    //added here post of add review
    app.post("/addReview", async (req, res) => {
      const result = await review_collection.insertOne(req.body);
      res.json(result);
    });

    // add product here
    app.post("/addProduct", async (req, res) => {
      const result = await product_collection.insertOne(req.body);
      res.json(result);
    });


    //add review here

    app.get("/reviews", async (req, res) => {
      const result = await review_collection.find({}).toArray();
      res.json(result);
    });

    // delete product here
    app.delete("/deleteProduct/:id", async (req, res) => {
      const result = await product_collection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });


    app.get("/updateOne/:id", async (req, res) => {
      const result = await product_collection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });
  } finally {

  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`server is running on port ${port}`));
