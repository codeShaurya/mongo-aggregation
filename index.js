const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { inspect } = require('util');

const data = require('./data');

const url = 'mongodb://localhost:27017';
const dbName = 'code';
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  const db = client.db(dbName);
  const accounts = db.collection('accounts');
  
  accounts.createIndex({ 'posts.when': -1 })
    .then(() => accounts.insertMany(data))
    .then(() => accounts.aggregate([
      {
        $unwind: {
          path: '$posts',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $match: {
          $or: [
            {
              'posts': undefined
            },
            {
              $and: [
                {
                  'posts.when': {
                    $gte: new Date('Feburary 1, 2018 00:00:00')
                  }
                },
                {
                  'posts.when': {
                    $lt: new Date('March 1, 2018 00:00:00')
                  }
                }
              ]
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$posts.comments',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $group: {
          _id: {
            _id: '$_id',
            name: '$name',
            posts: {
              _id: '$posts._id',
              when: '$posts.when',
              msg: '$posts.msg',
            },
          },
          comments: {
            $first: '$posts.comments',
          },
        }
      },
      {
        $project: {
          comments: {
            $cond: {
              if: {
                $eq: ['$comments', null],
              },
              then: [],
              else: ['$comments'],
            }
          }
        }
      },
      {
        $group: {
          _id: '$_id._id',
          name: { $first: '$_id.name' },
          posts: {
            $push: {
              _id: '$_id.posts._id',
              when: '$_id.posts.when',
              msg: '$_id.posts.msg',
              comments: '$comments',
            },
          },
        }
      },
      {
        $project: {
          name: true,
          posts: {
            $cond: {
              if: {
                $eq: ['$posts', [{ comments: [] }]],
              },
              then: [],
              else: '$posts'
            },
          }
        }
      }
    ])
      .toArray())
    .then(results => {
      console.log(inspect(results, false, null));
    })
    .then(() => accounts.deleteMany({}))
    .then(() => client.close());
});