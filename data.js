module.exports = [{
  id: 0,
  name: 'A',
  posts: [],
}, {
  id: 1,
  name: 'B',
  posts: [{
    id: 0,
    when: new Date('January 2, 2018 00:00:00'),
    msg: 'Happy New Year from B',
    comments: [],
  }, {
    id: 0,
    when: new Date('Feburary 2, 2018 00:00:00'),
    msg: 'Hello from B',
    comments: [{
      id: 0,
      when: new Date('Feburary 3, 2018 00:00:00'),
      msg: 'Howdy B',
    }, {
      id: 1,
      when: new Date('Feburary 4, 2018 00:00:00'),
      msg: 'Back at you B',
    }, {
      id: 2,
      when: new Date('Feburary 5, 2018 00:00:00'),
      msg: 'Random on B',
    }],
  }, {
    id: 1,
    when: new Date('Feburary 3, 2018 00:00:00'),
    msg: 'Another from B',
    comments: [{
      id: 0,
      when: new Date('January 3, 2018 00:00:00'),
      msg: 'Back at you B another',
    }],
  }],
}, {
  id: 2,
  name: 'C',
  posts: [{
    id: 0,
    when: new Date('Feburary 2, 2018 00:00:00'),
    msg: 'Hello from C',
    comments: [],
  }],
}];

