/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const LoginDesign = require('ui/ui_login');
const Router = require("sf-core/ui/router");
const AlertView = require('sf-core/ui/alertview');
const Network = require('sf-core/device/network');
const Application = require("sf-core/application");

const Login = extend(LoginDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

    this.loginButton.onPress = authenticateToSpotify.bind(this);

  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();

  checkInternetConnection();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
}


function authenticateToSpotify() {

  Router.go('lyric', { searchText : this.searchTextBox.text });
}

function checkInternetConnection() {
  if (Network.connectionType == Network.ConnectionType.None) {
    alert({
      title: "Internet Connection Not Available",
      message: "Spotly requires internet connection to show lyrics",
      buttons: [{
        index: AlertView.ButtonType.POSITIVE,
        text: 'OK',
        onClick: function() {
          Application.exit();
        }
      }]
    });
  }
}



module && (module.exports = Login);
