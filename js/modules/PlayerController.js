import {
    titleBar,
    playlistViewer,
    playerControls,
}
from "../utils/UI.js";

class Player {
    constructor() {
        
        this.data = null;
        this.minimized = false;
        this.trackId = 0;

        this.CurrentTime = document.getElementsByTagName("time")[0];
        this.Video = document.getElementById('media');
        
        /// from UI
        this.titleBar = titleBar;
        this.controls = playerControls;
        this.playlist = new Playlist();
    }

    setIcon(btn, icon) {
        btn.icon.classList.replace(btn.icon.classList[1], icon);
    }
}

// TODO: takes an HTMLCollection?
class Playlist {
    constructor(tracks) {
        this.tracks = tracks;
        this.viewer = playlistViewer;
    }
}

class PlayerController {
    constructor(player) {
        this.player = player;
    }

    moveThumb(pos) {
        let track = this.player.controls.TrackBar.track;
        track.style.width = pos - this.player.controls.TrackBar.bar.getBoundingClientRect().x + 'px';
        const percent = track.getBoundingClientRect().width / this.player.controls.TrackBar.bar.getBoundingClientRect().width;

        let dur = this.player.Video.duration || 0;
        this.player.Video.currentTime = dur * percent;
    }

    toggleMute() {
        if (this.player.Video.muted) {
            this.player.setIcon(this.player.controls.Volume, "fa-volume-up");
            this.player.controls.Volume.slider.style.width = this.player.controls.Volume.volume * 100 + '%';
            this.player.Video.volume = this.player.controls.Volume.volume;
            this.player.Video.muted = false;
        } else {
            this.player.setIcon(this.player.controls.Volume, "fa-volume-mute");
            this.player.controls.Volume.slider.style.width = '0px';
            this.player.controls.Volume.volume = this.player.Video.volume;
            this.player.Video.muted = true;
        }
    }

    playTrack(diff) {
        const id = this.player.trackId + diff; ;

        if (id >= this.player.data.length || id < 0)
            return;

        const currentSrc = document.getElementsByTagName("source")[0];

        if (typeof currentSrc !== "undefined") {
            currentSrc.remove();
        }

        const sourceElement = document.createElement("source");
        sourceElement.setAttribute("src", `${this.player.data[id].path}${this.player.data[id].source}`);
        this.player.Video.appendChild(sourceElement);

        this.player.trackId = id;
        this.player.Video.load();
        this.togglePlay();
    }

    // FIXME: this is a bit broken
    adjustVolume(vol) {
        console.log(this.player.Video.volume);
        this.player.controls.Volume.slider.style.width = vol - this.player.controls.Volume.container.getBoundingClientRect().x + 'px';
        this.player.Video.volume = this.player.controls.Volume.slider.getBoundingClientRect().width / 100;

        if (this.player.Video.muted) {
            this.player.controls.Volume.icon.classList.replace('fa-volume-mute', 'fa-volume-up');
            this.player.Video.muted = false;
        }
    }
    
    nextVideo() {
        this.playTrack(+1);
    }

    prevVideo() {
        this.playTrack(-1);
    }

    play() {
        if (this.player.Video.paused === false)
            return;

        this.player.setIcon(this.player.controls.Play, "fa-pause");
        this.player.Video.play();
    }

    pause() {
        if (this.player.Video.paused === true)
            return;

        this.player.setIcon(this.player.controls.Play, 'fa-play');
        this.player.Video.pause();
    }

    togglePlay() {
        if (this.player.Video.paused === false)
            this.pause();
        else
            this.play();

    }
}

export {
    Player,
    Playlist,
    PlayerController
};
