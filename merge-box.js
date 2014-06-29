
if (Meteor.isClient) {
  Others = new Meteor.Collection('others');//, {connection: null});
  Session.setDefault('subscribed_others', false);

  Template.hello.greeting = function () {
    return "Welcome to merge-box.";
  };
  Template.hello.subscribed_others = function() {
    return Session.get('subscribed_others') ? 'subscribed' : '';
  };
  Template.hello.users = function() {
    // show all users but the logged-in user
    return Meteor.users.find();//{_id:{$ne:Meteor.userId()}});
  };
  Template.hello.others = function() {
    // show all users but the logged-in user
    return Others.find();
  };
  //
  // https://github.com/meteor/meteor/issues/2057
  // Automatically stop computations when template is destroyed
  //
  Template.hello.rendered = function() {
    this.comp = Deps.autorun(function(){
      Meteor.subscribe('users', function(){
        console.log('subscribed users');
        // Others.remove({});
        // Meteor.users.find({_id:{$ne: Meteor.userId()}}).forEach(function(u){
        //   Others.insert(u);
        // });
      });

      Meteor.subscribe('others', function() {
        console.log('subscribed others');
        Session.set('subscribed_others', 'subscribed');
      });
    });
  };

  Template.hello.destroyed = function() {
    if(this.comp)
      this.comp.stop();
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      Others.remove({});
      Meteor.users.find({_id:{$ne: Meteor.userId()}}).forEach(function(u){
        Others.insert(u);
      });
    }
  });


  Meteor.startup(function(){
    Session.set('subscribed_others', false);
  });
}

if (Meteor.isServer) {
  Others = new Meteor.Collection('others', {connection: null});

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

  Meteor.publish('others', function(){
    if(this.userId)
    {
      Others.remove({});
      Meteor.users.find({_id:{$ne: this.userId}}).forEach(function(u){
        Others.insert(u);
      });
      console.log('published others '+Others.find().count());
      return Others.find();
    }
    else
    {
      console.log('no others published');
      return null;
    }
  });
}
