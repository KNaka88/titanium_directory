var _args = arguments[0] || {}, //Any passed in arguments will fall into this property
    App = Alloy.Globals.App,  // reference to the App singleton object
    // $FM = require('favoritesmgr'),
    users = null,
    indexes = [];


function init() {


}

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
