
  Posts = new Mongo.Collection("Posts");
  Users = new Mongo.Collection("Users");
  

if (Meteor.isClient) {
  
  Meteor.subscribe("postsStream");

  console.log('POSTS DATA = ' + Posts.find().fetch());
  console.log('USERS DATA = ' + Users.find().fetch());
  
  Template.body.events({
    "submit .ontra": function (event) {    
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Posts.insert({
      content: text,
      date: new Date() // current time
    });

    // Clear Form
    event.target.text.value = "";

    // Prevent default form submit
    return false
    }
  });
  
  Template.body.helpers({
    posts: function() {
      return Posts.find();
    }
  });

  Template.post.helpers({
    username: function() {
      return Users.findOne({_id: this.userId}).username;
    }
  });
  
}

  

Meteor.methods({
  'fetchJSONData': function() {
    
    var postsResponse = Meteor.http.call("GET","https://raw.githubusercontent.com/djfrsn/frontend-interview-test-long/master/codetest/data/posts.json");
    var usersResponse = Meteor.http.call("GET","https://raw.githubusercontent.com/djfrsn/frontend-interview-test-long/master/codetest/data/users.json");
    
    var postsData = JSON.parse(postsResponse.content);

    var usersData = JSON.parse(usersResponse.content);

    postsData.forEach(function (post) {

      post.date = new Date()
      post.comments.date = new Date()
      post._id = String(post.id)
      delete post.id
      post.userId = string(post.userId)
      Posts.insert(post)
    });

    usersData.forEach(function (user) {

      user.date = new Date()
      user._id = String(user.id)
      delete user.id
      Users.insert(user)
    });

  }
});



if (Meteor.isServer) {

  Meteor.publishComposite('postsStream', {
    find: function() {
      return Posts.find({});
    },
    children: [
      {
        find: function (post) {
          console.log("%j", post.userId);
          console.log("%j", Users.findOne({ _id: post.userId }));
          return Users.find({ _id: post.userId });
        }
      }
    ]
  });

  Meteor.startup(function () {
    if (Posts.find().count() === 0) {
      Meteor.call("fetchJSONData");
    }
  });
  
  console.log('POSTS DATA = %j', Posts.find().fetch());
  console.log('USERS DATA = %j', Users.find().fetch());

}
