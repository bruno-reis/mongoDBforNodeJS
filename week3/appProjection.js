const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected");

  const query = {"category_code": "biotech"};
  const projection = {"name": 1, "category_code": 1, "_id": 0};

  const cursor = db.collection('companies').find(query);
  cursor.project(projection);

  cursor.forEach(
    doc => {
      console.log(`${doc.name} is a ${doc.category_code} company.`);
      console.log(doc);
    },
    err => {
      assert.equal(err, null);
      db.close();
    }
  );

});

