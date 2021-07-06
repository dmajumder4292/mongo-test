const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({extended: true}))

var db;

MongoClient.connect('mongodb://127.0.0.1:27017/mongoTest',{
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
    db = client.db();
})

app.put('/',(req, res) => {
    const cursor = db.collection('col1').find().toArray()
        .then(results => {
            console.log(results)
            let query = {
                user_id: results[0]._id.toString()
            };
            console.log(query)
            const innerCursor = db.collection('col2').find(query).toArray()
                .then(addr => {
                    let queryObj = {
                        "name": results[0].name
                    }
                    let updateObj = {
                        $set: {
                            "eth_addr": addr[0].eth_addr
                        }
                    }
                    db.collection('col1').update(queryObj, updateObj);
                    res.send("Updated")
                })
        })
})

app.listen(3000,() => {
    console.log('Listening on port 3000');
})