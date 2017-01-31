const MongoClient = require('mongodb').MongoClient,
  commandLineArgs = require('command-line-args'),
  assert = require('assert');

const options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected");

  const query = queryDocument(options);
  const projection = {
    "_id": 0, "name": 1, "founded_year": 1, "number_of_employees": 1
  };

  const cursor = db.collection('companies').find(query);
  cursor.project(projection);
  cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);
  cursor.skip(options.skip);
  cursor.limit(options.limit);

  let numMatches = 0;

  cursor.forEach(
    doc => {
      numMatches = numMatches + 1;
      console.log(doc);
    },
    err => {
      assert.equal(err, null);
      console.log(`Our query was: ${JSON.stringify(query)}`);
      console.log(`Matching Documents: ${numMatches}`);
      return db.close();
    }
  );
});

function queryDocument(options) {

  console.log(options);

  let query = {
    "founded_year": {
      "$gte": options.firstYear,
      "$lte": options.lastYear
    }
  };

  if("employees" in options) query.number_of_employees = { "$gte": options.employees };

  return query;
}

function commandLineOptions() {
  const cli = commandLineArgs([
    { name: "firstYear", alias: "f", type: Number},
    { name: "lastYear", alias: "l", type: Number},
    { name: "employees", alias: "e", type: Number},
    { name: "skip", type: Number, defaultValue: 0},
    { name: "limit", type: Number, defaultValue: 2000}
  ]);

  const options = cli.parse();

  if (!(("firstYear" in options) && ("lastYear" in options))) {
    console.log(cli.getUsage({
      title: "Usage",
      description: "The 1st two options below are required. The rest are optional"
    }));
    process.exit();
  }

  return options;

};


