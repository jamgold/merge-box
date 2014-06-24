if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to merge-box.";
  };

  Template.hello.users = function() {
    // show all users but the logged-in user
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
  //
  // Meteor.users gets automatically published when a user authenticates
  // and contains the logged in user
  //
  Meteor.publish('users', function(){
    // publish all users
    if(this.userId)
      return Meteor.users.find({_id:{$ne: this.userId}});
    else
      return null;
  });
}
