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

	playerObj.fetchAll = function() {
	  	return $http.get('/api/albums/').then(getData);
	};
  
  playerObj.fetchById = function() {
  	return this.fetchAll()
	  .then(function (albums) {
	    return $http.get('/api/albums/' + albums[0].id); // temp: get one
	  })
	  .then(getData);
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