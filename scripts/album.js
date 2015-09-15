var $ = jQuery;

var currentAlbum, currentSongFromAlbum, currentSoundFile, $previousButton, $nextButton, createSongRow, setCurrentAlbum, trackIndex, getSongNumberCell, setSong, nextSong, previousSong, currentlyPlayingSongNumber, updatePlayerBarSong, currentVolume, setVolume;

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentVolume = 80;

/**
 * Creates a song row on the playlist table
 * @param  {Number} songNumber  - Integer representing the songs order in the album
 * @param  {String}  songName   - Name of the song
 * @param  {Number} songLength - Integer Duration of song in milliseconds
 * @return {Object}             - jQuery object representing an album table row
 */
createSongRow = function (songNumber, songName, songLength) {
    var template, $row, clickHandler, onHover, offHover;

    template = "<tr class=\"album-view-song-item\">" 
    + "<td class=\"song-item-number\" \"data-song-number=\"" 
    + songNumber + ">" + songNumber + "</td>" + "<td class=\"song-item-title\">" 
    + songName + "</td>" + "<td class=\"song-item-duration\">" 
    + songLength + "</td>" + "</tr>";

    $row = $(template);

    /**
     * Sets the play or pause buttons of the active song
     */
    clickHandler = function () { 
        var songNumber, currentlyPlayingCell;

        songNumber = parseInt($(this).attr("data-song-number"), 10);
        // Revert to song # for currently song because user started new song.
        if (currentlyPlayingSongNumber !== null) {       
            
            currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        // Switch from Play -> Pause button to indicate new song is playing.
        if (currentlyPlayingSongNumber !== songNumber) {
            setSong(songNumber);
            currentSoundFile.play();

            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();
        
        // Switch from Pause -> Play button to pause currently playing song.
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        };
    };

    /**
     * Activates play or pause button with cursor action of hover
     * @param  {String} event - Looks for song number representing the song in the album order
     * @return {Number}      - An Integer that makes play and pause buttons visible if sting matches
     */
    onHover = function (event) {
        var songNumberCell, songNumber;
        songNumberCell = $(this).find(".song-item-number");
        songNumber = parseInt(songNumberCell.attr("data-song-number"), 10);

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    /**
     * Deactivates play or pause button when cursor action is not hovering
     * @param  {String} event - Looks for a song number representing the song in the album order
     * @return {Number}      - Integer makes play and pause buttons disapear if sting no longer matches
     */
    offHover = function (event) {
        var songNumberCell, songNumber;
        songNumberCell = $(this).find(".song-item-number");
        songNumber = parseInt(songNumberCell.attr("data-song-number"), 10);

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);

            console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        }
    };

    // Call this to find an element
    $row.find(".song-item-number").click(clickHandler);

    // Combines the event in a callback
    $row.hover(onHover, offHover);

    // Return row, created with the event listeners attached
    return $row;
};

/**
 * Displays a list of all the songs in an album. 
 * Updates the album UI with the new album information.
 * Updates the "currentalbum" property.
 * @param {Object} album - Object literal representing the album
 */ 
setCurrentAlbum = function(album) {
    var $albumTitle, $albumArtist, $albumReleaseInfo, $albumImage, $albumSongList;
    
    currentAlbum = album;

    $albumTitle = $(".album-view-title");
    $albumArtist = $(".album-view-artist");
    $albumReleaseInfo = $(".album-view-release-info");
    $albumImage = $(".album-cover-art");
    $albumSongList = $(".album-view-song-list");

    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + " " + album.label);
    $albumImage.attr("src", album.albumArtUrl);

    $albumSongList.empty();

     // For loop to add rows
    var i;
    for (i = 0; i < album.songs.length; i++) {
        $albumSongList.append(
            createSongRow(i + 1, album.songs[i].name, album.songs[i].length)
        );
    } 
};

/**
 * Returns the index of the song within the album's song array.
 * @param  {Object} album - Object litteral representing the album.
 * @param  {Object} song  - Object litteral representing the song.
 * @return {Number}       - Integer representing the index poitision withing the "song" property of the "album".
 */
trackIndex = function (album, song) {
     return album.songs.indexOf(song);
 };
/**
 * Retreves the song number cell for the supplied track number
 * @param  {Number} number  - Integer represening the song's position withing the album
 * @return {String}         - jQuery object representing the song number cell
 */
getSongNumberCell = function (number) {
    var element = $(".song-item-number[data-song-number=\"" + number + "\"]");
    return element;
};
/**
 * Set the curently selected song and modifty the displaying uniform.
 * @param {Number} songNumber - 
 */
setSong = function(songNumber) {
    if(currentSoundFile) {
        currentSoundFile.stop();
    }

    setSong = parseInt(songNumber, 10);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    // Assign a Buzz object. Pass audio file though current song from Album object.
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        // Mp3 to start playing ASAP.
        formats: ["mp3"],
        preload: true
    });

    setVolume(currentVolume);
};
/**
 * Set the sound volume of the music.
 * @param {Number} volume - Set a number 1-100 for the sound level.
 */
setVolume = function(volume) {
    if(currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

nextSong = function () {
    //gets song number.Conditional Operator assigns value to condition.
    var getLastSongNumber = function (index) {
        return index === 0 ? currentAlbum.songs.length : index;
    };

    //set up a counter to increase
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    //wraps the song index to the beginnging
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    //initiates the counter to currently playing song
    currentlyPlayingSongNumber(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();

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

previousSong = function () {
    var getLastSongNumber = function (index) {
        return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    currentlyPlayingSongNumber(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();

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

updatePlayerBarSong = function () {
    $(".left-controls .play-pause").html(playerBarPauseButton);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $(".left-controls .play-pause").html(playerBarPauseButton);
};



/**
 * First items to load on page
 */
$(document).ready(function () {
    $previousButton = $(".left-controls .previous");
    $nextButton = $(".left-controls .next");

    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});