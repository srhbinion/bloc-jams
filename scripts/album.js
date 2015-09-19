var $ = jQuery;

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentVolume = 80;

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;

/**
 * Creates a song row on the playlist table
 * @param  {Number} songNumber  - Integer representing the songs order in the album
 * @param  {String}  songName   - Name of the song
 * @param  {Number} songLength - Integer Duration of song in milliseconds
 * @return {Object}             - jQuery object representing an album table row
 */
var createSongRow = function (songNumber, songName, songLength) {

    var template =
     '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>';

    var $row = $(template);

    /**
     * Sets the play or pause buttons of the active song. Triggers start and stop of audio file.
     */
    var clickHandler = function () { 
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
            updateSeekBarWhileSongPlays();

            var $volumeFill = $(".volume .fill");
            var $volumeThumb = $(".volume .thumb");
            $volumeThumb.css({left: currentVolume + "%"});

            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();
        
        // Switch from Pause -> Play button to pause currently playing song.
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $(".left-controls .play-pause").html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $(".left-controls .play-pause").html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
        }
    };

    /**
     * Activates play or pause button with cursor action of hover
     * @param  {String} event - Looks for song number representing the song in the album order
     * @return {Number}      - An Integer that makes play and pause buttons visible if sting matches
     */
    var onHover = function (event) {
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
     * @return {Number}      - An Integer that makes play and pause buttons disapear if sting no longer matches
     */
    var offHover = function (event) {
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
var setCurrentAlbum = function(album) {
    
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
var trackIndex = function (album, song) {
     return album.songs.indexOf(song);
 };

/**
 * Retreves the song number cell for the supplied track number
 * @param  {Number} number  - Integer represening the song's position withing the album
 * @return {String}         - jQuery object representing the song number cell
 */
var getSongNumberCell = function (number) {
    var element = $(".song-item-number[data-song-number=\"" + number + "\"]");
    return element;
};

/**
 * Set the currently selected song and use the buzz API to play music.
 * @param {Number} songNumber - 
 */
var setSong = function(songNumber) {
    if(currentSoundFile) {
        currentSoundFile.stop();
        updateSeekBarWhileSongPlays();
    }

    currentlyPlayingSongNumber = parseInt(songNumber, 10);
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
 * Change the position in a song to a specified time.
 * @param  {Number} time - Time 
 */
var seek = function (time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

/**
 * Set the sound volume of the music.
 * @param {Number} volume - Set a number 1-100 for the sound level.
 */
var setVolume = function(volume) {
    if(currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

/**
 * Gets and updates the UI with the corrent information about song play status. Sets song number cyles thought the music file.
 * @return {Number} - Index position of the information within an object.
 */
var nextSong = function () {
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
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
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

/**
 * Gets and updates the UI with the corrent information about the music play status. Sets song number cyles thought the music file.
 * @return {Number} - Index position of the information within an object. 
 */
var previousSong = function () {
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
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

/**
 * Changes song file that is displayed in the DOM
 */
var updatePlayerBarSong = function () {
    $(".left-controls .play-pause").html(playerBarPauseButton);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $(".left-controls .play-pause").html(playerBarPauseButton);
};

/**
 * Changes the icons on the player bar to match the song. 
 * Toggle between the playing and pausing songs.
 */
var togglePlayFromPlayerBar = function() {
    // if a song is pause AND the play button is clicked:
    if (currentSoundFile.isPaused && playerBarPlayButton === true) {
        // change the song number cell
        setSong(songNumber);
        // change the HTML of the player bar's play to pause
        $(this).html(pauseButtonTemplate);
        updatePlayerBarSong();
        // play the song
        currentSoundFile.play();
    // if the song is playing and the pause button is clicked
    } else if (currentlyPlayingSongNumber === true && playerBarPauseButton === true) {
        //change the HTML of the player bar's play to pause
        $(this).html(playButtonTemplate);
        updatePlayerBarSong();
        //change the song number from pause to play button
        setSong();
        // Pause song
        currentSoundFile.pause(); 
    }       
};
/**
 * Binds the seek bar to the time in the file.
 * @return {Number} Time in seconds.
 */
var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile) {
        // Bind the timeip event to the current song file
        currentSoundFile.bind("timeupdate", function(event){
            // method for calculating the fill bar ratio. Returns time in seconds.
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $(".seek-control .seek-bar");

            updateSeekPercentage($seekBar, seekBarFillRatio);

        });
    }
};

/**
 * Update progress bar
 * @param  {Object} $seekBar         - jQuery object that alters the volumen and playback bar
 * @param  {Number} seekBarFillRatio - Determine the size of the values
 */
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;

    // Makes sure our percentage is not greater than 100
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    // convert percentahe to a string
    var percentageString = offsetXPercent + "%";
    $seekBar.find(".fill").width(percentageString);
    $seekBar.find(".thumb").css({left: percentageString});
    
};

/**
 * Makes the seek bar draggable. 
 * Allows seek bar to mve with the playing music.
 */
var setupSeekBars = function() {
    var $seekBars = $(".player-bar .seek-bar");

     $seekBars.click(function(event) {
        //pageX hold the horizontal coordinate at the event occured
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // equasion to figure out the length of the total bar
        var seekBarFillRatio = offsetX / barWidth;
        // calling and passing the function
        if ($(this).parent().attr("class") == "seek-control") {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });

    // select element with thumb and attach a function
    $seekBars.find(".thumb").mousedown(function(event) {
        // attach the parent to the seekbar
        var $seekBar = $(this).parent();

        // Takes a string and wrapps the event in a method. Allows us to drag after mousing down
        $(document).bind("mousemove.thumb", function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr("class") == "seek-control") {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        $(document).bind("mouseup.thumb", function() {
            $(document).unbind("mousemove.thumb");
            $(document).unbind("mouseup.thumb");
        });

    });

};

/**
 * First items to load on page
 */
$(document).ready(function () { 
    var $previousButton = $(".left-controls .previous");
    var $nextButton = $(".left-controls .next");
    var $playPause = $(".left-controls .play-pause");

    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPause.click(togglePlayFromPlayerBar);
    
});