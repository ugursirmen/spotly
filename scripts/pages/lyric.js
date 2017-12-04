/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const LyricDesign = require('ui/ui_lyric');
const Router = require("sf-core/ui/router");
const Http = require("sf-core/net/http");

const Lyric = extend(LyricDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

    this.backButton.onPress = goBack;

  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow, params) {
  superOnShow();

  var http = new Http();

  const page = this;

  var searchText = params.searchText;

  var searcParams = searchText.split(":");

  var artist = ''
  var track = ''

  if (searcParams && searcParams.length > 1) {

    var artistWords = searcParams[0].split(' ');

    for (var i = 0; i < artistWords.length; i++) {
      artist += artistWords[i];

      if (i != artistWords.length - 1) {
        artist += '_';
      }
    }

    var trackWords = searcParams[1].split(' ');

    for (var i = 0; i < trackWords.length; i++) {
      track += trackWords[i];

      if (i != trackWords.length - 1) {
        track += '_';
      }
    }
  }
  else {
    page.lyricLabel.text = 'Enter the search params correctly (artist:track), please go back and search again';
    return;
  }

  console.log('artist: ' + artist);

  console.log('track: ' + track);


  http.request({
    'url': 'https://lyrics.wikia.com/wiki/' + artist + ':' + track,
    'method': 'GET',
    onLoad: function(response) {

      var body = response.body.toString();

      var matches = body.match(/<div class='lyricbox'>(.*?)<\/div>/);

      if (matches) {
        var lyrics = matches[0];

        if (lyrics) {
          lyrics = lyrics.replace("<div class='lyricbox'>", "")
            .replace("<div class='lyricsbreak'></div>", "");
          //.replace(/<br\s*\/?>/gi,"\n");
          page.lyricLabel.htmlText = lyrics;
        }
        else {
          page.lyricLabel.text = 'No lyrics found, please go back and search again';
        }
      }
      else {
        page.lyricLabel.text = 'No lyrics found, please go back and search again';
      }

    },
    onError: function(e) {
      page.lyricLabel.text = 'Failed to searching lyrics, please go back and search again';
    }
  });



}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
}

function goBack() {
  Router.go("login")
}

module && (module.exports = Lyric);
