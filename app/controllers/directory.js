var _args = arguments[0] || {}, //Any passed in arguments will fall into this property
    App = Alloy.Globals.App,  // reference to the App singleton object
    $FM = require('favoritesmgr'),
    users = null,
    indexes = [];


function init() {

    // access to app/lib/userData/data.json
    var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + "userData/data.json");

    // populate the users variable
    users = JSON.parse(file.read().text).users;

    // using underscore.js (included in this package default) and sort based on lastName
    users = _.sortBy(users, function(user) {
      return user.lastName
    });

    if (users) {
        indexes = [];
        var sections = [];

        // group the data by first letter of last name  (use underscore.js for _.groupBy)
        var userGroups = _.groupBy(users, function(item) {
            return item.lastName.charAt(0);
        });

        // iterate (using underscore.js)
        _.each(userGroups, function(group) {
            // take the group data that is passed into the function, and parse/transform it for use in the ListView
            // templates as defined in the directory.xml file
            var dataToAdd = preprocessForListView(group);

            // if no data, return
            if (dataToAdd.length < 1) return;


            // create index. take last name of first character (ex A, O, E) and pushed to array
            indexes.push({
                index: indexes.length,
                title: group[0].lastName.charAt(0)
            });


            // create the ListViewSection header view
            var sectionHeader = Ti.UI.createView({
                backgroundColor: "#ececec",
                width: Ti.UI.FILL,
                height: 30
            });

            // create sectionLabel
            var sectionLabel = Ti.UI.createLabel({
                text: group[0].lastName.charAt(0),
                left: 20,
                font: {
                  fontSize: 20
                },
                color: "#666"
            });

            // add label to sectionHeader
            sectionHeader.add(sectionLabel);


            // create new list section and set sectionHeader as headerView
            var section = Ti.UI.createListSection({
                headerView: sectionHeader
            });

            section.items = dataToAdd;

            //push to array sections
            sections.push(section);
        });



    }
} // END OF init()




// convert an array of data from a json file into a format that can be added to the ListView
var preprocessForListView = function(rawData) {
  console.log("preprocessForListView!!!!");


  // if this user is favorite, we will use favorite template so wi need to flag this
  if (_args.restrictToFavorites) {
      rawData = _.filter(rawData, function(item) {
        return $FM.exists(item.id);
      });
  }


  return _.map(rawData, function(item) {

      var isFavorite = $FM.exists(item.id);

      return {
          template: isFavorite ? "favoriteTemplate" : "userTemplate",
          properties: {
              searchableText: item.firstName + ' ' + item.lastName + ' ' + item.company + ' ' + item.email,
              user: item,
              editActions: [
                  {title: isFavorite ? "- Favorite" : "+ Favorite", color: isFavorite ? "#C41230" : "#038BC8" }
              ],
              canEdit:true
          },
          userName: {text: item.firstName + " " + item.lastName},
          userCompany: {text: item.company},
          userPhoto: {image: item.photo},
          userEmail: {text: item.email}
      };
  });
};




var onSearchChange, onSearchFocus, onSearchCancel;


var onBookmarkClick = function onClick(e) {
  // Open this same controller into a new page, pass the flag to restrict the list only to favorite contacts and force the title
  Alloy.Globals.Navigator.open("directory", {restrictToFavorites : true, title : "Favorites", displayHomeAsUp : true});
};


var onSearchChange = function onChange(e) {
  $.listView.searchText = e.source.value;

};


if (OS_IOS) {

  // when SearchBar gains focus, hide the bookmark icon and shows cancel button instead
  onSearchFocus = function onFocus(e) {
    $.searchBar.showBookmark = false;
    $.searchBar.showCancel = true;
  }

  // when cancel button is clicked, hide cancel button and show bookmark
  onSearchCancel = function onCancel(e) {
    if (!_args.restrictToFavorites) {
      $.searchBar.showBookmark = true;
      $.searchBar.showCancel = false;
    }
    $.searchBar.blur();
  }
}

init();
