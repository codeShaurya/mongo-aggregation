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
        $sort: {
          city: 1
        }
      },
      {
        $group: {
          _id: {
            state: "$state",
            city: "$city"
          },
          pop: {$sum : "$pop"}
        }
      },
      {
        $group: { 
          _id: "$_id.state", 
          avgCityPop: { 
            $avg: "$pop" 
          } 
        }
      }
    ])
      .toArray())
    .then(results => {
      console.log(inspect(results, false, null));
    })
    .then(() => client.close());
});