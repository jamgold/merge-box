if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to merge-box.";
  };

  Template.hello.users = function() {
    return Meteor.users.find({_id:{$ne:Meteor.userId()}});
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Meteor.subscribe('users');
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish('users', function(){
    if(this.userId)
      return Meteor.users.find({_id:{$ne: this.userId}});
    else
      return null;
  });
}
