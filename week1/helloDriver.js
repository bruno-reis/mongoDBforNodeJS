var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/video',  (err, db) =>  {

  assert.equal(null, err);
  console.log("Connect to server OK");

  db.collection('movies').find({}).toArray( (err, docs) => {

    docs.forEach( doc => console.log(doc.title))

    db.close()

  });

  console.log("Called find()");
});
