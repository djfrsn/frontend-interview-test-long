// +_Line - logo idea: it would be a line with a plus representing the core ui
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
      return Posts.find({}); // Return all documents from Mongo "Task" collection
    }
  });

  Template.post.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Posts.update(this._id, {$set: {checked: ! this.checked}});      
    },
    "click .delete": function () {
      Posts.remove(this._id);
    }
  });

}

  

Meteor.methods({
  'fetchJSONData': function() {
    

    var postsResponse = Meteor.http.call("GET","https://raw.githubusercontent.com/djfrsn/frontend-interview-test-long/master/codetest/data/posts.json");
    var usersResponse = Meteor.http.call("GET","https://raw.githubusercontent.com/djfrsn/frontend-interview-test-long/master/codetest/data/users.json");
    console.log(postsResponse);
    console.log(usersResponse);
}
});


Meteor.publish('posts', function(){
  return Posts.find();
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.call("fetchJSONData");
  });
}
