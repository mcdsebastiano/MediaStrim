import {
    setIcon,
    titleBar,
    playlistViewer,
    playerControls,
    backButton,
    removeAllChildrenFrom
}
from "../utils/UI.js";

class Player {
    constructor() {
        this.playlist = new Playlist();
        this.minimized = false;
        this.visible = false;
        this.trackID = 0;

        this.CurrentTime = document.getElementsByTagName("time")[0];
        this.Media = document.getElementById('media');

        this.modal = document.getElementsByClassName("player-modal")[0];
        this.controls = playerControls;
        this.titleBar = titleBar;

        this.history;
    }

    get tracks() {
        return this.playlist.tracks;
    }

    toggle() {
        if (this.visible === false) {
            this.show();
        } else {
            this.hide()
        }
    }

    show() {
        this.modal.style.display = "block";
        this.visible = true;
    }

    togglePlaylist() {
        this.playlist.toggle(this.Media, this.controls);
    }

    hide() {

        // console.log(this.history[this.playlist.tracks[this.trackID].path][this.trackID]);
        // console.log(this.history[this.playlist.tracks[this.trackID].path]);

        // this.history[this.playlist.tracks[this.trackID].path][this.trackID].timestamp = this.Media.currentTime
        // localStorage.setGlobal("History", this.history);

        this.playlist.empty();
        this.modal.style.display = "none";
        this.visible = false;

        let source = document.getElementsByTagName('source')[0];
        source.remove();

        // destroy the DOM element.
        this.Media.pause();
        this.Media.removeAttribute('src');
        this.Media.load();
    }

    minimize() {
        this.titleBar.windowControls.minimizeMaximize.icon.classList.replace('fa-compress-alt', 'fa-expand-alt');
        this.titleBar.self.classList.replace('header-pos-max', 'header-pos-min');
        this.controls.self.classList.replace('footer-pos-max', 'footer-pos-min');
        this.modal.classList.replace('modal-pos-max', 'modal-pos-min');
        this.modal.style.left = '65%';
        this.modal.style.top = '65%';
        this.minimized = true;
    }

    maximize() {
        this.titleBar.windowControls.minimizeMaximize.icon.classList.replace('fa-expand-alt', 'fa-compress-alt');
        this.titleBar.self.classList.replace('header-pos-min', 'header-pos-max');
        this.controls.self.classList.replace('footer-pos-min', 'footer-pos-max');
        this.modal.classList.replace('modal-pos-min', 'modal-pos-max');
        this.modal.style.left = '0px';
        this.modal.style.top = '0px';
        this.minimized = false;
    }

}

class Playlist {
    constructor() {
        this.tracks = []
        this.viewer = playlistViewer;
        this.visible = false;
    }

    get length() {
        return this.tracks.length;
    }

    add(track) {
        this.tracks.push(track);
    }

    remove(idx) {
        this.tracks.splice(idx, 1);
    }

    track(idx) {
        return this.tracks[idx];
    }

    empty() {
        this.tracks = [];
        removeAllChildrenFrom(this.viewer.tracklist)
    }

    shuffle() {
        console.log(this.tracks);
    }

    repeatOne() {
        console.log(this.tracks);
    }

    repeatAll() {
        console.log(this.tracks);
    }

    show() {
        this.viewer.container.style.display = "block";
        this.visible = true;
    }

    hide() {
        this.viewer.container.style.display = "none";
        this.visible = false;
    }

    toggle(media, controls) {
        if (this.visible === false) {
            this.show();
            document.getElementsByClassName("playlist-video-container")[0].appendChild(media);
            document.getElementsByClassName("playlist-video-container")[0].appendChild(this.viewer.Play.button);
            document.getElementsByClassName("playlist-video-container")[0].appendChild(this.viewer.Prev.button);
            document.getElementsByClassName("playlist-video-container")[0].appendChild(this.viewer.Next.button);
            document.getElementsByClassName("playlist-video-container")[0].appendChild(this.viewer.Shuffle.button);
            document.getElementsByClassName("playlist-video-container")[0].appendChild(this.viewer.RepeatOne.button);
            document.getElementsByClassName("playlist-video-container")[0].appendChild(this.viewer.RepeatAll.button);
        } else {
            this.hide();
            document.getElementsByClassName('modal-container')[0].appendChild(media);
            controls.self.insertBefore(this.viewer.Play.button, controls.TrackBar.bar);
            controls.self.insertBefore(this.viewer.Prev.button, controls.TrackBar.bar);
            controls.self.insertBefore(this.viewer.Next.button, controls.TrackBar.bar);
        }
    }

    swap(i, j) {
        let temp = this.tracks[i];
        this.tracks[i] = this.tracks[j];
        this.tracks[j] = temp;
    }
}

class MediaController {
    constructor() {}

    moveThumb(player, pos) {
        let track = player.controls.TrackBar.track;
        track.style.width = pos - player.controls.TrackBar.bar.getBoundingClientRect().x + 'px';
        const percent = track.getBoundingClientRect().width / player.controls.TrackBar.bar.getBoundingClientRect().width;

        let dur = player.Media.duration || 0;
        player.Media.currentTime = dur * percent;
    }

    // FIXME: this is a bit broken
    adjustVolume(player, vol) {
        player.controls.Volume.slider.style.width = vol - player.controls.Volume.container.getBoundingClientRect().x + 'px';
        player.Media.volume = player.controls.Volume.slider.getBoundingClientRect().width / 100;

        if (player.Media.muted) {
            setIcon(player.controls.Volume, 'fa-volume-up');
            player.Media.muted = false;
        }
    }

    toggleMute(player) {
        if (player.Media.muted) {
            setIcon(player.controls.Volume, "fa-volume-up");
            player.controls.Volume.slider.style.width = player.controls.Volume.volume * 100 + '%';
            player.Media.volume = player.controls.Volume.volume;
            player.Media.muted = false;
        } else {
            setIcon(player.controls.Volume, "fa-volume-mute");
            player.controls.Volume.slider.style.width = '0px';
            player.controls.Volume.volume = player.Media.volume;
            player.Media.muted = true;
        }
    }

    async playTrack(player, id) {
        if (id >= player.tracks.length || id < 0)
            return;

        player.playlist.viewer.self[player.trackID].classList.remove("active");
        player.playlist.viewer.self[id].classList.add("active");

        let videoKey = player.tracks[id].path;
        player.history = localStorage.getGlobal("History");
        player.history[videoKey] = player.history[videoKey] || [];

        this.syncTracks(player);

        const currentSrc = document.getElementsByTagName("source")[0];
        if (typeof currentSrc !== "undefined")
            currentSrc.remove();

        const sourceElement = document.createElement("source");
        sourceElement.setAttribute("src", `${player.tracks[id].path}${player.tracks[id].source}`);
        player.Media.appendChild(sourceElement);

        player.trackID = id;
        player.Media.load();

        if (typeof player.history[player.tracks[id].path][id] === "undefined") {
            player.history[player.tracks[id].path].push({
                title: player.tracks[id].title,
                timestamp: 0,
                source: sourceElement.src,
                trackID: id
            });
            localStorage.setGlobal("History", player.history);
        } else {
            player.Media.currentTime = player.history[player.tracks[id].path][id].timestamp
        }

        return await this.togglePlay(player);

    }

    syncTracks(player) {
        if (typeof player.history[player.tracks[player.trackID].path][player.trackID] === "undefined")
            return;

        let timestamp = 0;
        if (player.Media.currentTime < player.Media.duration)
            timestamp = player.Media.currentTime;

        player.history[player.tracks[player.trackID].path][player.trackID].timestamp = timestamp;
        localStorage.setGlobal("History", player.history);
    }

    async nextTrack(player) {
        return await this.playTrack(player, player.trackID + 1);
    }

    async prevTrack(player) {
        return await this.playTrack(player, player.trackID - 1);
    }

    async play(player) {
        if (player.Media.paused === false)
            return;

        setIcon(player.controls.Play, "fa-pause");
        return await player.Media.play();
    }

    async pause(player) {
        if (player.Media.paused === true)
            return;

        setIcon(player.controls.Play, 'fa-play');
        return await player.Media.pause();
    }

    async togglePlay(player) {
        if (player.Media.paused === false)
            return await this.pause(player);
        else
            return await this.play(player);
    }

    setTracks(player, data) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < data.length; i++) {
            const li = this.addTrack(player, data[i]);
            fragment.appendChild(li);
        };
        player.playlist.viewer.tracklist.appendChild(fragment);
    }

    addTrack(player, track) {
        let id = player.tracks.length;
        player.playlist.add(track);
        const listItem = document.createElement('li');
        listItem.classList.add('playlist');

        // TODO: if video is playing show pause button
        const playButton = document.createElement('i');
        playButton.classList.add('far', 'fa-play-circle', "fa-2x");
        listItem.appendChild(playButton);
        playButton.onclick = event => this.playTrack(player, id);

        const playlistTitle = document.createElement('span');
        playlistTitle.id = id;
        playlistTitle.innerText = `${id}`; // should be name of track
        playlistTitle.style.width = "100%";
        listItem.appendChild(playlistTitle);

        // info button
        const infoButton = document.createElement('i');
        infoButton.classList.add('fas');
        infoButton.classList.add('fa-info-circle');
        listItem.appendChild(infoButton);

        return listItem;
    }

    deleteTrack(player, idx) {
        player.playlist.remove(idx);
    }

    swapTracks(player, i, j) {
        if (i >= player.tracks.length ||
            j >= player.tracks.length ||
            i < 1 ||
            j < 1) {
            return
        }

        player.playlist.swap(i - 1, j - 1);
    }
}

export {
    Player,
    Playlist,
    MediaController
};
