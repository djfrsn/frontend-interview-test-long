// +_Line - logo idea: it would be a line with a plus representing the core ui
Posts = new Mongo.Collection("posts");
var groundPosts = new Ground.Collection(Posts);

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




if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
