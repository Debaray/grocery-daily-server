const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvy8r.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const groceryCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  // perform actions on the collection object

  app.post('/addProducts', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product: ', newProduct)
    groceryCollection.insertOne(newProduct)
      .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  console.log('db connect');
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})