class Player {
    constructor() {
        this.data = null;
        this.trackId = 0;

        this.Video = document.getElementById('media');
        this.CurrentTime = document.getElementsByTagName("time")[0];

        this.Play = {
            button: document.getElementById("play-pause"),
            icon: document.getElementsByClassName("fa-play")[0]
        },
        this.Prev = {
            button: document.getElementById("skip-prev"),
            // icon: document.getElementById("")
        },
        this.Next = {
            button: document.getElementById("skip-next"),
            // icon: document.getElementById("")
        },
        this.TrackBar = {
            track: document.getElementsByClassName('track')[0],
            bar: document.getElementsByClassName("trackbar")[0]
        },
        this.Volume = {
            volume: 1,
            container: document.getElementsByClassName('volume-container')[0],
            slider: document.getElementsByClassName('volume-slider')[0],
            icon: document.getElementsByClassName('fa-volume-up')[0],
            button: document.getElementById('volume-button')
        }

    }

    setIcon(btn, icon) {
        btn.icon.classList.replace(btn.icon.classList[1], icon);
    }
}

class PlayerController {
    constructor(player) {
        this.Player = player;
    }

    moveThumb(pos) {
        let track = this.Player.TrackBar.track;
        track.style.width = pos - this.Player.TrackBar.bar.getBoundingClientRect().x + 'px';
        const percent = track.getBoundingClientRect().width / this.Player.TrackBar.bar.getBoundingClientRect().width;

        let dur = this.Player.Video.duration || 0;
        this.Player.Video.currentTime = dur * percent;
    }

    toggleMute() {
        if (this.Player.Video.muted) {
            this.Player.setIcon(this.Player.Volume, "fa-volume-up");
            this.Player.Volume.slider.style.width = this.Player.Volume.volume * 100 + '%';
            this.Player.Video.volume = this.Player.Volume.volume;
            this.Player.Video.muted = false;
        } else {
            this.Player.setIcon(this.Player.Volume, "fa-volume-mute");
            this.Player.Volume.slider.style.width = '0px';
            this.Player.Volume.volume = this.Player.Video.volume;
            this.Player.Video.muted = true;
        }
    }

    playTrack(diff) {
        const id = this.Player.trackId + diff; ;

        if (id >= this.Player.data.length || id < 0)
            return;

        const currentSrc = document.getElementsByTagName("source")[0];

        if (typeof currentSrc !== "undefined") {
            currentSrc.remove();
        }

        const sourceElement = document.createElement("source");
        sourceElement.setAttribute("src", `${this.Player.data[id].path}${this.Player.data[id].source}`);
        this.Player.Video.appendChild(sourceElement);

        this.Player.trackId = id;
        this.Player.Video.load();
        this.togglePlay();
    }

    // FIXME: this is a bit broken
    adjustVolume(vol) {
        console.log(this.Player.Video.volume);
        this.Player.Volume.slider.style.width = vol - this.Player.Volume.container.getBoundingClientRect().x + 'px';
        this.Player.Video.volume = this.Player.Volume.slider.getBoundingClientRect().width / 100;

        if (this.Player.Video.muted) {
            this.Player.Volume.icon.classList.replace('fa-volume-mute', 'fa-volume-up');
            this.Player.Video.muted = false;
        }
    }

    nextVideo() {
        this.playTrack(+1);
    }

    prevVideo() {
        this.playTrack(-1);
    }

    play() {
        if (this.Player.Video.paused === false)
            return;

        this.Player.setIcon(this.Player.Play, "fa-pause");
        this.Player.Video.play();
    }

    pause() {
        if (this.Player.Video.paused === true)
            return;

        this.Player.setIcon(this.Player.Play, 'fa-play');
        this.Player.Video.pause();
    }

    togglePlay() {
        if (this.Player.Video.paused === false)
            this.pause();
        else
            this.play();

    }
}

export {
    Player,
    PlayerController
};