var createSongRow = function (songNumber, songName, songLength) {
    
    var template =
     '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>';
    
    var $row = $(template);
  
    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
    // Revert to song # for currently song because user started new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
                currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
        } 

        else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $(".left-controls .play-pause").html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        };
    };

    var onHover = function(event) {
        var songNumberCell = $(this).find(".song-item-number");
        var songNumber = parseInt(songNumberCell.attr("data-song-number"));
        console.log(".song-item-number");


        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var songNumberCell = $(this).find(".song-item-number");
        var songNumber = parseInt(songNumberCell.attr("data-song-number"));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
            
            console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        };
    };

    // #1 call this to find an element
    $row.find(".song-item-number").click(clickHandler);

    // #2 combines the event in a callback
    $row.hover(onHover, offHover);

    // #3 return row, created with the event listeners attached
    return $row;

};

var setCurrentAlbum = function (album) {
    currentAlbum = album;

    var $albumTitle = $(".album-view-title");
    var $albumArtist = $(".album-view-artist");
    var $albumReleaseInfo = $(".album-view-release-info");
    var $albumImage = $(".album-cover-art");
    var $albumSongList = $(".album-view-song-list");

    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + " " + album.label);
    $albumImage.attr("src", album.albumArtUrl);

    $albumSongList.empty();

     // #4
    for (i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
         $albumSongList.append($newRow);
    };
};

var trackIndex = function (album, song) {
     return album.songs.indexOf(song);
 };

var getSongNumberCell = function(number) {
    console.log(number);
    var element = $('.song-item-number[data-song-number="' + number + '"]');
    return element;
};

var nextSong = function () {
    //gets song number.Conditional Operator assigns value to condition.
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    //set up a counter to increase
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    //wraps the song index to the beginnging
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    //initiates the counter to currently playing song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    //update player bar
    $(".currently-playing .song-name").text(currentSongFromAlbum.name);
    $(".currently-playing .artist-name").text(currentAlbum.name);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $(".left-controls .play-pause").html(playerBarPauseButton);
    
    //update html
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function () {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    };
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    $(".currently-playing .song-name").text(currentSongFromAlbum.name);
    $(".currently-playing .artist-name").text(currentAlbum.name);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $(".left-controls .play-pause").html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function () {
    $(".left-controls .play-pause").html(playerBarPauseButton);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $(".left-controls .play-pause").html(playerBarPauseButton);
};
    
//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//global variable holding albums
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $(".left-controls .previous");
var $nextButton = $(".left-controls .next");

//First Load
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);

});