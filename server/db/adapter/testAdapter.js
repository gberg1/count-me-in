var authAdapter = require('../../auth');
var testData = require('../testData');

var models = require('../models');
var Pledge = models.Pledge;
var User = models.User;
var Post = models.Post;

var db = require('seraph')();
var Q = require('q');
var query = Q.nbind(db.query,db);

var resetData = function(req, res, next) {
  var deleteRels = 'MATCH ()-[r]->() DELETE r';
  var deleteNodes = 'MATCH (n) DELETE n';

  // remove old data
  query(deleteRels)
  .then(function() {
    return query(deleteNodes);
  })
  .then(function() {
    console.log('Removed all data from database');
  })
  .then(function() {
    //register users from testData.users
    var registerPromiseFactory = function(username,password) {
      var mockReq = { body: {}, session: {} };
      mockReq.body.username = username;
      mockReq.body.password = password;

      var deferred = Q.defer();
      var mockSend = function(val) {
        if (val) {
          deferred.resolve(username);
        } else {
          deferred.reject('Could not register user:',username);
        }
      }
      var mockRes = { send: mockSend };

      authAdapter.register(mockReq,mockRes,next);
      return deferred.promise;
    };

    return Q.all(testData.users.map(function(user) {
      return registerPromiseFactory(user.username,user.password)
      .then(function(username) {
        return username;
      });
    }));
  })
  .then(function(users) {
    console.log();
    console.log('Created Users, including FOLLOWS:');
    console.log(users);
  })
  .then(function() {
    //create pledges from testData.pledges
    return Q.all(testData.pledges.map(function(pledge) {
      return Pledge.save(pledge)
      .then(function(pledgeNode) {
        //set up user-pledge subscribes_to relationship
        return Q.all(pledge.subscribers.map(function(username) {
          return User.where({ username: username })
          .then(function(userNode) {
            return Pledge.relate(pledgeNode,'SUBSCRIBES_TO',userNode);
          });
        }));
      })
      .then(function() {
        return pledge.pledgename;
      });
    }));
  })
  .then(function(pledges) {
    console.log();
    console.log('Created Pledges, including SUBSCRIBES_TO:');
    console.log(pledges);
  })
  .then(function() {
    //create posts from testData.posts
    return Q.all(testData.posts.map(function(post) {
      return Post.save(post)
      .then(function(postNode) {
        //set up user-post-pledge posted relationships
        return Q.all([
          postNode,
          User.where({ username: post.username }),
          Pledge.where({ pledgename: post.pledgename })
        ]);
      })
      .spread(function(postNode,user,pledge) {
        return Q.all([
          User.relate(user,'POSTED',postNode),
          Post.relate(postNode,'POSTED_IN',pledge)
        ])
        //set up user-post like relationship
        .then(function() {
          return Q.all([
            postNode,
            Q.all(post.likes.map(function(username) {
              return User.where({ username: username });
            }))
          ]);
        })
        .spread(function(postNode, likedUsers) {
          console.log('likedUsers:',likedUsers);
          return Q.all(likedUsers.map(function(userNode) {
            console.log('liking user:',userNode,postNode);
            return User.relate(userNode,'LIKED',postNode);
          }));
        });
      })
      .then(function() {
        return post.title;
      });
    }));
  })
  .then(function(posts) {
    console.log();
    console.log('Created Posts, including POSTED, POSTED_IN, and LIKED:');
    console.log(posts);
  })
  .then(function() {
    console.log();
    console.log('Finished resetting database');
    res.send('Finished resetting database');
  })
  .catch(next);
};

var fillData = function(req, res, next) {
  var cypher = [
  'CREATE (u1:User {username: "therealest"})',
   'CREATE (u2:User {username: "mengel"})',
   'CREATE (u3:User {username: "nathan"})',
   'CREATE (pl1:Pledge {pledgename: "code", coverimage: "http://groups.engin.umd.umich.edu/CIS/course.des/cis400/javascript/javascript.jpg", lastpost: "I just hacked into the hashing algorithm using a rainbow table!"})',
   'CREATE (pl2:Pledge {pledgename: "piano", coverimage: "http://cdn.roland.com/assets/images/products/gallery/v_piano_front_stand_gal.jpg", lastpost: "I just played piano!"})',
   'CREATE (pl3:Pledge {pledgename: "LoL", coverimage: "https://signup.leagueoflegends.com/theme/signup_theme/img/signup_logo2_clean.png", lastpost: "I just got into Diamond I"})',
   'CREATE (po1:Post {text: "Learn the C Major scale today!", title: "Coding Day 1", aws_url: "http://www.lovethispic.com/uploaded_images/37623-Cute-Dog.jpg"})',
   'CREATE (po2:Post {text: "I love JavaScript!", title: "Coding Day 2", aws_url: "http://thewowstyle.com/wp-content/uploads/2015/04/funny-dog-pics37.jpg"})',
   'CREATE (po3:Post {text: "Just got into Diamond II", title: "League of Legends 1", aws_url: "http://www.nerdist.com/wp-content/uploads/2015/01/League-of-Legends_4.jpg"})',
   'CREATE (po4:Post {text: "GOT INTO DIAMOND III!", title: "League of Legends 2", aws_url: "http://www11.onrpg.com/wp-content/gallery/league-of-legends/league-of-legends-05.jpg"})',
   'CREATE (co1:Comment {text: "Me too!!"})',
   'CREATE (u1)-[:FOLLOWS]->(u2)',
   'CREATE (u1)-[:SUBSCRIBES_TO]->(pl1)',
   'CREATE (u1)-[:SUBSCRIBES_TO]->(pl2)',
   'CREATE (u2)-[:SUBSCRIBES_TO]->(pl1)',
   'CREATE (u3)-[:SUBSCRIBES_TO]->(pl3)',
   'CREATE (u1)-[:POSTED]->(po1)',
   'CREATE (po1)-[:POSTED_IN]->(pl2)',
   'CREATE (u2)-[:POSTED]->(po2)',
   'CREATE (po2)-[:POSTED_IN]->(pl1)',
   'CREATE (u1)-[:LIKED]->(po2)',
   'CREATE (u1)-[:WROTE]->(co1)',
   'CREATE (co1)-[:WRITTEN_IN]->(po2)',
   'CREATE (po3)-[:POSTED_IN]->(pl3)',
   'CREATE (po4)-[:POSTED_IN]->(pl3)',
   'CREATE (u3)-[:POSTED]->(po3)',
   'CREATE (u3)-[:POSTED]->(po4)'
   ].join(' ');

   query(cypher)
   .then(function(result) {
    res.send('Filled database with dummy data');
  })
   .catch(next);
 };

var clearData = function(req, res, next) {
  var cypherRels = 'MATCH ()-[r]->() DELETE r';
  var cypherNodes = 'MATCH (n) DELETE n';

  query(cypherRels)
  .then(function() {
    return query(cypherNodes);
  })
  .then(function() {
    res.send('Removed all data from database');
  })
  .catch(next);
};

 module.exports = {
  resetData: resetData,
  fillData: fillData,
  clearData: clearData
};
