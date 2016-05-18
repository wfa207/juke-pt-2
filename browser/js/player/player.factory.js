'use strict';
/*
		-------------------
		Factory Town
		-------------------
*/

function getData(res) { return res.data; };

/*
----------------------------------------------------------
*/

juke.factory('AlbumFactory', function($http, $log, StatsFactory){
  var albumObj = {};

	albumObj.fetchAll = function() {
	  	return $http.get('/api/albums/').then(getData);
	};
  
  albumObj.fetchById = function(idx) {
  	return this.fetchAll()
	  .then(function (albums) {
	    return $http.get('/api/albums/' + albums[idx].id); // temp: get one
	  })
	  .then(getData);
  };

  albumObj.fetchSongs = function(album) {
  	return $http.get('/api/albums/' + album.id)
  	.then(getData)
  	.then(function(albumData) {
  		return albumData.songs;
  	});
  }

  return albumObj;

});

juke.factory('StatsFactory', function ($q) {
  var statsObj = {};

  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;

      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }

      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });

      resolveOrRecur();

    });
  };

  return statsObj;
});

juke.factory('PlayerFactory', function($log) {
	var playerObj = {};

	playerObj.getCurrentSong = function() {};
	playerObj.isPlaying = function() {};

  playerObj.pause = function pause (scope) {
    audio.pause();
    scope.playing = false;
  }

  playerObj.play = function play (event, song, scope) {
    // stop existing audio (e.g. other song) in any case
    pause();
    scope.playing = true;
    // resume current song
    if (song === $scope.currentSong) return audio.play();
    // enable loading new song
    scope.currentSong = song;
    audio.src = song.audioUrl;
    audio.load();
    audio.play();
  }

  playerObj.next = function (rootScope) { pause(); rootScope.$broadcast('next'); };
  playerObj.prev = function (rootScope) { pause(); rootScope.$broadcast('prev'); };

	return playerObj;
});