// +_Line - logo idea: it would be a line with a plus representing the core ui
Posts = new Mongo.Collection("posts");
var groundPosts = new Ground.Collection(Posts);
Users = new Mongo.Collection("users");
var groundUsers = new Ground.Collection(Users);

if (Meteor.isClient) {

  Template.body.events({
    "submit .ontra": function (event) {    
    // This function is called when the new task form is submitted

    var text = event.target.text.value;

    Posts.insert({
      text: text,
      createdAt: new Date() // current time
    });

    // Clear Form
    event.target.text.value = "";

    // Prevent default form submit
    return false
    }
  });
  
  Template.body.helpers({
  
    posts: function () {
      return Posts.find({}, {sort: {createdAt: -1}}); // Return all documents from Mongo "Task" collection
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

  HTTP.get(Meteor.absoluteUrl("posts.json"), function(err, result) {
    console.log(result.data + " awesome");
    Posts.insert({
      content: result.data,
      createdAt: new Date() // current time
    });
  });
  HTTP.get(Meteor.absoluteUrl("users.json"), function(err, result) {
    console.log(result.data + " awesome");
    Users.insert({
      content: result.data,
      createdAt: new Date() // current time
    });
  });


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
