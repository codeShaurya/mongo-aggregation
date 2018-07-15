const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { inspect } = require('util');

const url = 'mongodb://localhost:27017';
const dbName = 'aggre';
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  const db = client.db(dbName);
  const zips = db.collection('zips');

  zips.createIndex({ city: 1 })
    .then(() => zips.aggregate([
      {
        $group: {
          _id: {
            state: "$state",
            city: "$city"
          },
          pop: { $sum: "$pop" }
        }
      },
      {
        $sort: {
          pop: -1,
        }
      },
      {
        $group: {
          _id: "$_id.state",
          biggestCity: { $first: "$_id.city"} ,
          biggestPop: { $first: "$pop" },
          smallestCity: { $last: "$_id.city" },
          smallestPop: { $last: "$pop" }
        }
      },
      {
        $project: {
          _id: 0,
          biggestCity: { name: "$biggestCity", pop: "$biggestPop" },
          smallestCity: {name: "$smallestCity", pop: "$smallestPop"},
        }
      }
    ])
      .toArray())
    .then(results => {
      console.log(inspect(results, false, null));
    })
    .then(() => client.close());
});