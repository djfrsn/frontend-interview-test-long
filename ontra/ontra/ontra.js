
Posts = new Mongo.Collection("posts");
var groundPosts = new Ground.Collection(Posts);
Users = new Mongo.Collection("users");
var groundUsers = new Ground.Collection(Users);

if (Meteor.isClient) {

  Meteor.subscribe("posts");
  
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
    posts: function () {
      return Posts.find({}); // Return all documents from Mongo "Posts" collection
    }
  });

}

  

Meteor.methods({
  'fetchJSONData': function() {
    
    var postsResponse = Meteor.http.call("GET","https://raw.githubusercontent.com/djfrsn/frontend-interview-test-long/master/codetest/data/posts.json");
    var usersResponse = Meteor.http.call("GET","https://raw.githubusercontent.com/djfrsn/frontend-interview-test-long/master/codetest/data/users.json");
    
    var postsData = JSON.parse(postsResponse.content);

    var usersData = JSON.parse(usersResponse.content);

    console.log(postsData);
    console.log(usersData);

    Posts.insert({
      postsData: postsData,
      date: new Date() // current time
    });

    Users.insert({
      usersData: usersData,
      date: new Date() // current time
    });

  }
});




if (Meteor.isServer) {
  
  Meteor.publish('posts', function(){
    return Posts.find();
  });

  Meteor.startup(function () {
    Meteor.call("fetchJSONData");
  });
  
}
