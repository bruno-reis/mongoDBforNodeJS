const MongoClient = require('mongodb').MongoClient,
  commandLineArgs = require('command-line-args'),
  assert = require('assert');

const options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', (err, db) => {

  assert.equal(err, null);
  console.log("Successfully connected");

  const query = queryDocument(options);
  const projection = projectionDocument(options);

  const cursor = db.collection('companies').find(query)
  cursor.project(projection);
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

  let query = {};

  if("overview" in options) query.overview =
    { "$regex": options.overview, "$options": "i" };

  if("milestones" in options) query["milestones.source_description"] =
    {"$regex": options.milestones, "$options": "i"};

  return query;

}

function projectionDocument(options) {
  const projection = {
    "_id": 0,
    "name": 1,
    "founded_year": 1,
    "overview": 1
  };

  if("overview" in options) projection.overview = 1;

  if("milestones" in options) projection["milestones.source_description"] = 1;

  return projection;
}

function commandLineOptions() {
  const cli = commandLineArgs([
    { name: "overview", alias: "o", type: String},
    { name: "milestones", alias: "m", type: String}

  ]);

  const options = cli.parse();

  if (Object.keys(options).length < 1) {
    console.log(cli.getUsage({
      title: "Usage",
      description: "The 1st two options below are required. The rest are optional"
    }));
    process.exit();
  }

  return options;

}


