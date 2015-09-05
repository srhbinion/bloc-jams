//Example Album
var albumPicasso = {
    name: "The Colors",
    artist: "Pablo Picasso",
    label: "Cubism",
    year: "1881",
    albumArtUrl: "assets/images/album_covers/01.png",
    songs: [
        {name: "Blue", length: "4:26"},
        {name: "Green", length: "3:14"},
        { name: "Red", length: "5:01" },
        { name: "Pink", length: "3:21"},
        { name: "Magenta", length: "2:15"}
    ]
};
 
 // Another Example Album
var albumMarconi = {
    name: "The Telephone",
    artist: "Guglielmo Marconi",
    label: "EM",
    year: "1909",
    albumArtUrl: "assets/images/album_covers/20.png",
    songs: [
        { name: "Hello, Operator?", length: "1:01" },
        { name: "Ring, ring, ring", length: "5:01" },
        { name: "Fits in your pocket", length: "3:21"},
        { name: "Can you hear me now?", length: "3:14" },
        { name: "Wrong phone number", length: "2:15"}
    ]
};

var createSongRow = function (songNumber, songName, songLength) {
    
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';
 
    return template;
 
};

var setCurrentAlbum = function (album) {
    
    var albumTitle = document.getElementsByClassName("album-view-title")[0];
    var albumArtist = document.getElementsByClassName("album-view-artist")[0];
    var albumReleaseInfo = document.getElementsByClassName("album-view-release-info")[0];
    var albumImage = document.getElementsByClassName("album-cover-art")[0];
    var albumSongList = document.getElementsByClassName("album-view-song-list")[0];
 
     // #2
    albumTitle.firstChild.nodeValue = album.name;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute("src", album.albumArtUrl);
 
     // #3
    albumSongList.innerHTML = '';
 
     // #4
    for (i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    }
 
};

// look up the DOM tree to select a parent element. 
//document.body.parentElement; - Returns the <html> element
var findParentByClassName = function (element, targetClass) {
    
    var currentParent = element.parentElement;
    
    if (currentParent.className !== targetClass) {
        currentParent = currentParent.parentElement
        return currentParent;
     
    //check if parent element exhists   
    } else if (element.parentElement !== targetClass) {
        alert "No parent found with that class name.";
    
    //check if parent element exhists with a given class name
    } if else (element.parentElement !== currentParent) {
        alert "No parent found!";
    }
};

var getSongItem = function (element) {
    
    // No breaks in this switch statement?
    switch (element.className) {
        case "album-song-button":
        case "ion-play":
        case "ion-pause":    
            return findParentByClassName(element, "song-item-number");
        case "album-view-song-item":
            return element.querySelector(".song-item-number");
        case "song-item-title":
        case "song-item-duration":
            return findParentByClassName(element, "album-view-song-item").querySelector(".song-item-number");
        case "song-item-number":
            return element;
        default:
            return;
    }
            
};

//switch play button to pause button
var clickHandler = function (targetElement) {
    var songItem = getSongItem(targetElement);
    
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute("data-song-number");
    } else if (currentlyPlayingSong === songItem.getAttribute("data-song-number")) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute("data-song-number")) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute("data-song-number");
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute("data-song-number");
     }
};
 
//Elements we'll be adding listeners to:
var songListContainer = document.getElementsByClassName("album-view-song-list")[0];

var songRows = document.getElementsByClassName("album-view-song-item");

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

//pause button template
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//Store state of playing songs
var currentlyPlayingSong = null;


window.onload = function () {
    setCurrentAlbum(albumPicasso);
    
    songListContainer.addEventListener("mouseover", function (event) {
        //only target indivedual song rows during event delegation
        if (event.target.parentElement.className === "album-view-song-item") {
            event.target.parentElement.querySelector(".song-item-number").innerHTML = playButtonTemplate;
        //change the content from the number to the playbutton's HTML
        }
    });
    
    for (i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener("mouseleave", function (event) {
        //Revert the content back to the number
        //Selects first child elements, which is the song-item-number element
            this.children[0].innerHTML = this.children[0].getAttribute("data-song-number");
        });
        
        songRows[i].addEventListener("mousedown", function(event){
        // Event handler call
            clickHandler(event.target);
        });
    }
};