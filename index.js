const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload')
const fs = require('fs-extra');
const admin = require('firebase-admin')
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.newsi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());

//
  

var serviceAccount = require("./assignment-11-ac534-firebase-adminsdk-gsmb3-786fed5024.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://assignment-11-ac534.firebaseio.com"
});

//
const port = 5000
//
    

client.connect(err => {
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("Orders");
  const reviewsCollection = client.db(`${process.env.DB_NAME}`).collection("Reviews");
  const servicesCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  const adminsCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
  //
    app.post('/addService', (req, res) => {
      const file = req.files.file;
      const title = req.body.title;
      const description = req.body.description;
      // const filePath = `${__dirname}/service/${file.name}`;
      // file.mv(filePath, err => {
      //   if(err){
      //     console.log(err);
      //     return res.status(5000).send({msg: 'Failed to upload Image'})
      //   }
        // const newImg = fs.readFileSync(filePath);
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        const image = {
          // contentType: req.files.file.mimetype,
          contentType: file.mimetype,
          // size: req.files.file.size,
          size: file.size,
          img: Buffer.from(encImg, 'base64')
        };
        servicesCollection.insertOne({title, description, image})
        .then(result => {
          // fs.remove(filePath, error => {
          //   if(error){
          //     console.log(error) 
          //      res.status(5000).send({msg: 'Failed to upload Image'})
          //   }
            res.send(result.insertedCount > 0)
          // })
          
        })
      // })
    })
  //
  app.post('/makeAdmin', (req, res) => {
    const admin = req.body;
    adminsCollection.insertOne(admin)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  //
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({email: email})
    .toArray((err, admins) => {
      res.send(admins.length > 0)
      
    })
  })
  //
    app.get('/services', (req, res) => {
      servicesCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })
  //
  app.get('/reviews', (req, res) => {
    reviewsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  //
    app.post('/orders', (req, res) => {
      const order = req.body;
      ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })
  //
    app.get('/orders', (req, res) => {
      ordersCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })
  //
    app.patch('/update/:id', (req, res) => {
      ordersCollection.updateOne( {_id: ObjectId(req.params.id)}, 
      {
        $set: {status: req.body.status}
      })
      .then(result => {
        res.send(result.modifiedCount > 0);
      })
    })
  //
  app.post('/reviews', (req, res) => {
    const review = req.body;
    reviewsCollection.insertOne(review)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })
  //
  app.get('/reviews', (req, res) => {
    reviewsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  //
  app.get('/orders', (req, res) => {
    const bearer = req.headers.authorization;
    if(bearer && bearer.startsWith('Bearer ')){
      const idToken = bearer.split(' ')[1];
      admin.auth().verifyIdToken(idToken)
      .then(function(decodedToken) {
        const tokenEmail = decodedToken.email;
        const queryEmail = req.query.email;
        if(tokenEmail == queryEmail){
          ordersCollection.find({email: req.query.email})
          .toArray((err, documents) => {
          res.send(documents)
    })
        }
      }).catch(function(error) {
        // Handle error
      });
    }
  //
    
  //
  


    
  })
  //
  console.log("DB connected");
});

//
app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(process.env.PORT || port)
