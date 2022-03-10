export const container = document.getElementById('container');
export const fragment = document.createDocumentFragment();
export const content = document.getElementById('content');

export const posterHTML = `
<style>
.wrapper {
    background-position: center bottom;
    background-color: transparent;
    text-decoration: none;
    box-shadow: 1px 1px 6px 2px #ccc;
    height: 305px;
    width: 210px;
    
}

.select {
    display: inline-block;
}

.poster {
    position: relative;
    top: 240px;
    left: 15%;
    margin: 0.25em;
    text-shadow: 0px 1px 1px rgba(0,0,0,0.4);
    color: grey;
    border-radius: 50%;
    font-family: courier new;
    display: flex;
    align-items: center;
    justify-content: center;
    
    width: 24px;
    height: 24px;
    background-color: white;
}

.wrapper:hover {
  cursor: pointer;
}

@media (max-width: 1246px) {
  .wrapper {
    width: 140px;
    height: 205px;
  }
  .poster {
      top: 140px;
  }
}
</style>
<div class="wrapper">
    <div class="select"> 
        <div class="poster info">i</div>
        <div class="poster plus">+</div>
    </div>
</div>
`;

export const backButton = {
    self: document.getElementsByClassName("go-back")[0],
    visible: false,
    show: function () {
        this.self.classList.remove("hidden");
        this.visible = true;
    },
    hide: function () {
        this.self.classList.add("hidden");
        this.visible = false;
    },
    toggle: function () {
        if (this.visible === true) {
            this.hide();
        } else {
            this.show();
        }
    }
}

const navButtons = document.getElementsByClassName("link");

export const nav = {
    self: document.getElementById('nav'),
    slider: navButtons[0],
    homeButton: navButtons[1],
    moviesButton: navButtons[2],
    seriesButton: navButtons[3],
    musicButton: navButtons[4],
    toggle: function () {
        this.self.classList.toggle("in");
        this.self.classList.toggle("out");
    }
}

export const titleBar = {
    self: document.getElementsByClassName("title-bar")[0],
    windowControls: {

        minimizeMaximize: {
            button: document.getElementById("min-max"),
            icon: document.getElementsByClassName("fa-compress-alt")[0],
        },
        close: {
            button: document.getElementById("player-close"),
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

let shuffleButton = document.createElement("button");
let shuffleIcon = document.createElement("i");
shuffleIcon.classList.add("fas", "fa-random");
shuffleButton.appendChild(shuffleIcon);


let repeatOneButton = document.createElement("button");
let repeatOneIcon = document.createElement("i");
repeatOneIcon.classList.add("fas", "fa-repeat-1");
repeatOneButton.appendChild(repeatOneIcon);

let repeatAllButton = document.createElement("button");
let repeatAllIcon = document.createElement("i");
repeatAllIcon.classList.add("fas", "fa-repeat");
repeatAllButton.appendChild(repeatAllIcon);

export const playlistViewer = {
    container: document.getElementsByClassName("playlist-container")[0],
    tracklist: document.getElementsByClassName("playlist-tracks")[0],
    self: document.getElementsByClassName('playlist'),
    Play: playerControls.Play,
    Prev: playerControls.Prev,
    Next: playerControls.Next,
    Shuffle: {
        button: shuffleButton,
    },
    RepeatOne: {
        button: repeatOneButton, 
    },
    RepeatAll: {
        button: repeatAllButton,
    },

    close: {
        button: document.getElementById("playlist-close"),
        icon: document.getElementsByClassName("fa-window-close")[1],
    }

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

export function setIcon(btn, icon) {
    btn.icon.classList.replace(btn.icon.classList[1], icon);
}
