var db;

if (process.env.NODE_ENV === 'production') {
  var url = require('url').parse(process.env.GRAPHENEDB_URL)
  db = require('seraph')({
    server: url.protocol + '//' + url.host,
    user: url.auth.split(':')[0],
    pass: url.auth.split(':')[1]
  });
} else {
  db = require('seraph')();
}

var Comment = require('seraph-model')(db, 'Comment');

Comment.schema = {
  text: { type: String, required: true }
};
Comment.fields = Object.keys(Comment.schema);
Comment.useTimestamps();

module.exports = Comment;

