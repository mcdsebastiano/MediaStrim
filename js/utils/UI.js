/* TODO:
 * 1,   complete UI responsive code
 * 2,   make the playlist work & fix volume controls,
 * 3,   find a way to make onClick modular since it is so simple and default is always click! */

export const modal = document.getElementsByClassName("popup-modal")[0];
export const container = document.getElementById('container');
export const fragment = document.createDocumentFragment();
export const content = document.getElementById('content');


const navButtons = document.getElementsByClassName("link");

export const nav = {
    self: document.getElementById('nav'),
    slider: navButtons[0],
    homeButton: navButtons[1],
    moviesButton: navButtons[2],
    seriesButton: navButtons[3]
}

export const titleBar = {
    self: document.getElementsByClassName("title-bar")[0],
    windowControls: {

        minimizeMaximize: {
            button: document.getElementById("min-max"),
            icon: document.getElementsByClassName("fa-compress-alt")[0],
        },
        close: {
            button: document.getElementById("close"),
            icon: document.getElementsByClassName("fa-window-close")[0],
        },
        playlist: {
            button: document.getElementById("show-playlist"),
            icon: document.getElementsByClassName("fa-list")[0],
        },

        text: "Title of Movie, 2006",
    }

}

export const playerControls = {
    self: document.getElementsByClassName("player-controls")[0],
    Play: {
        button: document.getElementById("play-pause"),
        icon: document.getElementsByClassName("fa-play")[0]
    },
    Prev: {
        button: document.getElementById("skip-prev"),
        // icon: document.getElementById("")
    },
    Next: {
        button: document.getElementById("skip-next"),
        // icon: document.getElementById("")
    },
    TrackBar: {
        track: document.getElementsByClassName('track')[0],
        bar: document.getElementsByClassName("trackbar")[0]
    },
    Volume: {
        volume: 1,
        container: document.getElementsByClassName('volume-container')[0],
        slider: document.getElementsByClassName('volume-slider')[0],
        icon: document.getElementsByClassName('fa-volume-up')[0],
        button: document.getElementById('volume-button')
    }

}

export const playlistViewer = {
    self: document.getElementsByClassName("playlist-container")[0],
    tracks: document.getElementsByClassName("playlist-tracks")[0],
    
}


export function removeAllChildrenFrom(element) {
    const children = element.childNodes;
    let i = element.childElementCount - 1;
    while (i >= 0) {
        element.removeChild(children[i--]);
    }
}

export function undoFragment() {
    removeAllChildrenFrom(fragment);
}
