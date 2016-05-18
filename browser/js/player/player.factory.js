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

juke.factory('PlayerFactory', function($http, $log){
  var playerObj = {};

  playerObj.fetchAlbums = function() {
  	var output = $http.get('/api/albums/')
  	.then(getData)
	  .then(function (albums) {
	    return $http.get('/api/albums/' + albums[0].id); // temp: get one
	  })
	  .then(getData)
	  .then(function (album) {
	    album.imageUrl = '/api/albums/' + album.id + '/image';
	    album.songs.forEach(function (song, i) {
	      song.audioUrl = '/api/songs/' + song.id + '/audio';
	      song.albumIndex = i;   
    	});
    	return album;
	  })
	  .catch($log.error); // $log service can be turned on and off; also, pre-bound

	  return output;
  };

  return playerObj;
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