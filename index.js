const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());

// brandShop
// cgDuv1HdnQQ4W9Ii



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqhoysn.mongodb.net/?retryWrites=true&w=majority`;


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


    const productCollection = client.db('productDB').collection('products')


    app.get('/products' , async (req, res) =>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      const result = await productCollection.insertOne(newProducts);
      res.send(result);
    });






















    
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Brand shop Server is running");
  });
  
  app.listen(port, () => {
    console.log(`brand shop server is running on Port ${port}`);
  });