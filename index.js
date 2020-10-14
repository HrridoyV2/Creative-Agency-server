const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express()
const = b3nhOkTZHf7HqFoC

app.use(bodyParser.json());
app.use(cors());
const port = 5000
//
    
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Hrridoy:<password>@cluster0.newsi.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

//
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(process.env.PORT || port)
