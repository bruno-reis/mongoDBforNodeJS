const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected");

  const query = {"permalink": {"$exists": true, "$ne": null}};
  const projection = {"permalink": 1, "updated_at": 1};

  const cursor = db.collection('companies').find(query);
  cursor.project(projection);
  cursor.sort({"permalink": 1});
  cursor.limit(1000);
  cursor.skip(1000);

  // let numToRemove = 0;
  let markedForRemoval = [];

  let previous = {"permalink": "", "updated_at": ""};

  cursor.forEach(
    doc => {
      if ( (doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at) ) {
        console.log(doc.permalink);

        // numToRemove += 1;
        // let filter = {"_id": doc._id};
        markedForRemoval.push(doc._id);

        // db.collection('companies').deleteOne(filter, (err, res) => {
        //   assert.equal(err, null);
        //   console.log(res.result);
        // })
      }
      previous = doc;
    },
    err => {
      assert.equal(err, null);

      const filter = {"_id": {"$in": markedForRemoval}};

      db.collection('companies').deleteMany(filter, (err, res) => {
        console.log(res.result);
        console.log(markedForRemoval.length + " documents removed");

        return db.close();
      });
    }
  );

});

