const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app =express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())





// mongo server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ahphq0t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // Connect the client to the server	(optional starting in v4.7)
     
      
      const craftCollection = client.db('craftDB').collection('craft')


      app.get('/craft',async(req,res)=>{
        const cursor =craftCollection.find()
        const result =await cursor.toArray()
        res.send(result)
      })

app.post('/addCraft', async(req, res)=>{
  const info =req.body
  console.log(info)
  const result =await craftCollection.insertOne(info)
  res.send(result)
})
// rechecked
app.put('/addCraft/:id', async(req,res)=>{
  const id = req.params.id
  const filter ={_id: new ObjectId(id)}
  const options ={upsert:true}
  const updatedCraft = req.body
  const craft = {
    $set:{
      image:updatedCraft.image, 
    name:updatedCraft.name, 
    sub_category: updatedCraft.sub_category,
    short_description: updatedCraft.short_description,
    price:updatedCraft.price,
    rating: updatedCraft.rating, 
    customization: updatedCraft.customization, 
    processing_time: updatedCraft.processing_time, 
    stockStatus: updatedCraft.stockStatus, 
    user_name: updatedCraft.user_name, 
    user_email: updatedCraft.user_email
    }
  }
  const result =await craftCollection.updateOne(filter, craft, options )
  res.send(result)
})

app.delete('/craft/:id', async(req,res)=>{
  const id = req.params.id
  const query ={_id: new ObjectId(id)}
  const result = await craftCollection.deleteOne(query)
  res.send(result)
})


app.get("/myProduct/:email", async(req,res)=>{
  console.log(req.params.email);
  const result = await craftCollection.find({email: req.params.email}).toArray()
  res.send(result)
  
})



app.get('/craft/:id', async(req,res)=>{
  const id =req.params.id
  const query ={_id: new ObjectId(id)}
  const result =await craftCollection.findOne(query)
  res.send(result)
})



    // Send a ping to confirm a successful connection

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send ('Art server is running')
})

app.listen(port, ()=>{
    console.log(`Art and Craft server is running on port : ${port}`)
})