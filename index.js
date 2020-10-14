const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.newsi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 5000
//
    

client.connect(err => {
  const collection = client.db(`${process.env.DB_NAME}`).collection("Orders");
  console.log("DB connected");
});

//
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(process.env.PORT || port)
