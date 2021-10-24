
function removeAllChildrenFrom(element) {
    const children = element.childNodes;
    let i = element.childElementCount - 1;
    while (i >= 0) {
        element.removeChild(children[i--]);
    }
}

function slideUpDown() {
    let el = searchBar.parentElement;
    document.getElementsByClassName('nav-title')[0].classList.toggle('hidden');
    document.getElementById("search-results").classList.toggle("hidden");
    el.classList.toggle('expanded')
    el.classList.toggle('search-pos-top');
}

function searchSlide() {
    if (!searchBar.parentElement.classList.contains('expanded')) {
        
        slideUpDown();
    }
    if (searchInput !== document.activeElement) {
        navSlide();
    }
    searchInput.focus();
};

function navSlide() {
    if (searchBar.parentElement.classList.contains('expanded')) {
        searchInput.value = '';
        slideUpDown();
    }
    nav.classList.toggle('in');
    nav.classList.toggle('out');
}

function playPause() {
    if (video.paused) {
        playIcon.classList.replace('fa-play', 'fa-pause');
        video.play();
    } else {
        playIcon.classList.replace('fa-pause', 'fa-play');
        video.pause();
    }
}

function hide() {
    removeAllChildrenFrom(playlistTracks);
    let watchHistory = localStorage.getGlobal('History');
    // playID
    modal.style.display = 'none';
    let source = document.getElementsByTagName('source')[0];
    let found;
    let foundID = 0;
    if (typeof source !== 'undefined') {
        for (let key of Object.keys(watchHistory)) {
            for (let i = 0; i < watchHistory[key].length; i++) {
                if (watchHistory[key][i].source == source.src) {
                    watchHistory[key][i].timestamp = video.currentTime;
                    break;
                }
            }
        }
        //destroy Video DOM Element
        source.remove();
        video.pause();
        video.removeAttribute('src');
        video.load();
    }
    localStorage.setGlobal('History', watchHistory);
}

function showPlaylist() {
    let watchHistory = localStorage.getGlobal('History');
    const playlistVideoContainer = document.getElementsByClassName('playlist-video-container')[0];
    const modalContainer = document.getElementsByClassName('modal-container')[0];

    if (playlistModal.style.display == 'none' || playlistModal.style.display == '') {
        playlistModal.style.display = 'block'
            playlistVideoContainer.appendChild(video);
    } else {
        playlistModal.style.display = 'none';
        modalContainer.appendChild(video);
    }

    let source = document.getElementsByTagName('source')[0];
    let foundID = 0;
    let found;
    let listID = 0;

    if (typeof source !== 'undefined') {
        for (let key of Object.keys(watchHistory)) {
            for (let i = 0; i < watchHistory[key].length; i++) {
                if (watchHistory[key][i].source == source.src) {
                    listID = watchHistory[key][i].playID;
                    break;
                }
            }
        }
    }

    console.log(listID)

    const windowControlsContainer = document.createElement('li');
    windowControlsContainer.classList.add('window-controls-container');

    const playlistWindowControls = document.createElement('div');
    playlistWindowControls.classList.add('playlist-window-controls');

    const closePlaylistWindow = document.createElement('i');
    closePlaylistWindow.classList.add('fas', 'fa-times', 'fa-md');
    closePlaylistWindow.onclick = () => showPlaylist();

    playlistWindowControls.appendChild(closePlaylistWindow);
    windowControlsContainer.appendChild(playlistWindowControls);
    playlistTracks.appendChild(windowControlsContainer);

    playlistTracks.children[listID].scrollIntoView();

}

function minimize() {
    if (minimized) {
        compressExpand.classList.replace('fa-expand-alt', 'fa-compress-alt');
        popupModalHeader.classList.replace('header-pos-min', 'header-pos-max');
        popupModalFooter.classList.replace('footer-pos-min', 'footer-pos-max');
        modal.classList.replace('modal-pos-min', 'modal-pos-max');
        modal.style.left = '0px';
        modal.style.top = '0px';
        playlistSelect.style.display = 'block';
        minimized = false;
    } else {
        compressExpand.classList.replace('fa-compress-alt', 'fa-expand-alt');
        popupModalHeader.classList.replace('header-pos-max', 'header-pos-min');
        popupModalFooter.classList.replace('footer-pos-max', 'footer-pos-min');
        modal.classList.replace('modal-pos-max', 'modal-pos-min');
        playlistModal.style.display = 'none';
        modal.style.left = '65%';
        modal.style.top = '65%';
        playlistSelect.style.display = 'none';
        minimized = true;
    }
}

function getTime(secs) {
    return {
        hrs: Math.floor(secs / 60 / 60) % 60,
        mins: Math.floor(secs / 60) % 60,
        secs: Math.floor(secs % 60)
    };
}

function formatTime(val) {
    if (val < 10) {
        return '0' + val;
    }
    return val;
}

function printFormattedTime(time) {
    if (isNaN(time.hrs) && isNaN(time.mins) && isNaN(time.secs)) {
        return '00:00:00';
    }
    return `${formatTime(time.hrs)}:${formatTime(time.mins)}:${formatTime(time.secs)}`
}
