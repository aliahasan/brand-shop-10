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
    const cartCollection = client.db('cartDB').collection('cartItem')


    
    app.get('/cartProducts' , async (req, res)=>{
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
      
    })


    app.post('/cartProducts', async (req, res) =>{
      const cartProduct = req.body
      const result = await cartCollection.insertOne(cartProduct)
      res.send(result)
      
    })

  

    app.delete('/cartProducts/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: id};
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })
    


    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      const result = await productCollection.insertOne(newProducts);
      res.send(result);
    });


    app.get('/products' , async (req, res) =>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    

    app.get('/products/:id' , async(req, res) =>{
      const id = req.params.id;
      const query = {_id:  new ObjectId(id)}
      const result =await productCollection.findOne(query)
      res.send(result)
      
    })

    
    app.get('/products/:id' , async(req, res) =>{
      const id = req.params.id;
      const query = {_id:  new ObjectId(id)}
      const result =await productCollection.findOne(query)
      res.send(result)
      
    })

    app.put('/products/:id' , async(req, res) =>{
      const id = req.params.id;
      const filter = {_id:  new ObjectId(id)}
      const options = {upsert:true}
      const updateProduct =req.body
      const updateItem = {
        $set:{
            name:updateProduct.name,
            brand:updateProduct.brand,
            type:updateProduct.type,
            price:updateProduct.price,
            rating:updateProduct.rating,
            description:updateProduct.description,
            photo:updateProduct.photo
        }
      }
     
      const result = await productCollection.updateOne(filter,updateItem, options)
      res.send(result)
      
    })

   
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