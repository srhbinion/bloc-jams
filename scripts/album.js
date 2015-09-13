var createSongRow = function (songNumber, songName, songLength) {
    
    var template =
        '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;
    
    var $row = $(template);
};
  
var clickHandler = function () {
    var songNumber = $(this).attr('data-song-number');
    
    if (currentlyPlayingSongNumber !== null) {
// Revert to song # for currently song because user started new song.
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
    
    if (currentlyPlayingSongNumber !== songNumber) {
// Switch from Play -> Pause button to indicate new song is playing.
    $(this).html(pauseButtonTemplate);
        currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    } 
    
    else if (currentlyPlayingSongNumber === songNumber) {
// Switch from Pause -> Play button to pause currently playing song.
        $(this).html(playButtonTemplate);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
    }
};

var onHover = function (event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');
    
    
    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
    }
};
    
var offHover = function (event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');

    if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
    }
};
  
// #1 call this to find an element
$row.find('.song-item-number').click(clickHandler);
    
// #2 combines the event in a callback
$row.hover(onHover, offHover);
 
// #3 return row, created with the event listeners attached
return $row;

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
 
    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
 
    $albumSongList.empty();
 
     // #4
    for (i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
         $albumSongList.append($newRow);
    }
};

var updatePlayerBarSong = function() {
    $(".current-playing .song-name").text(currentSongFromAlbum.name);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".current-playing .artist-song-mobile").text(currentSongFromAlbum.name + "-" + currentAlbum.artist);
};
    
    
    
//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentAlbum = null;

//globa; variable holding albums
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

//First Load
$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
});