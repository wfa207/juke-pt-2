'use strict';

juke.controller('AlbumCtrl', function ($scope, $rootScope, $log, AlbumFactory, StatsFactory) {

  // load our initial data
  AlbumFactory.fetchById(0)
  .then(function(album) {
      album.imageUrl = '/api/albums/' + album.id + '/image';
      album.songs.forEach(function (song, i) {
        song.audioUrl = '/api/songs/' + song.id + '/audio';
        song.albumIndex = i;   
      });
      $scope.album = album;
      StatsFactory.totalTime(album)
      .then(function(duration) {
        $scope.fullDuration = duration;
      });
  });


  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing && song === $scope.currentSong) {
      $rootScope.$broadcast('pause');
    } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  $scope.$on('pause', pause);
  $scope.$on('play', play);
  $scope.$on('next', next);
  $scope.$on('prev', prev);

  // functionality
  function pause () {
    $scope.playing = false;
  }
  function play (event, song) {
    $scope.playing = true;
    $scope.currentSong = song;
  };

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; };

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  };
  function next () { skip(1); };
  function prev () { skip(-1); };

});

juke.controller('AlbumsCtrl', function($scope, $rootScope, $log, AlbumFactory) {

  AlbumFactory.fetchAll()
  .then(function(albums) {
    $scope.albums = albums;
    
    albums.forEach(function(album) {
      album.imageUrl = '/api/albums/' + album.id + '/image';
      AlbumFactory.fetchSongs(album)
      .then(function(songs) {
        album.songs = songs;
      })
    });
  });
});