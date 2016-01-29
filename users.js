

var _ = require("underscore-node");
//var users = require('../data/users.json').users;

var user = {"userid":"google", "password":"goolge"};
module.exports = {
  findByTag: function() {
    var tags = Array.prototype.slice.call(arguments);
    var userWithTag = _.find(users, function(user) {
      return tags.reduce(function(match, tag) {
        return match && (user.tags || []).indexOf(tag) !== -1;
      }, true);
    });

    if (!userWithTag) {
      throw new Error("No users with tags " + tags.join("/"));
    }
    return userWithTag;
  },
  findByGroup: function() {
    var group = Array.prototype.slice.call(arguments);
    console.log("find user by group: " + group);
    var groups = [];
    _.each(users, function (user) {
      if (user.group==group) {
        groups.push(user);
      }
    });
    if (!groups) {
      throw new Error("Unidentified group" + group.join("/"));
    }
    return groups;
  }
}
