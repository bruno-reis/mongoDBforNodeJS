const MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected");

  const query = {"category_code": "biotech"};
  const cursor = db.collection('companies').find(query);

  cursor.forEach(
    doc => console.log(`${doc.name} is a ${doc.category_code} company.`),
    err => {
      assert.equal(err, null);
      db.close();
    }
  );
  
});

