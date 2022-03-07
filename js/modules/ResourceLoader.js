import {
    Player,
    PlayerController
}
from "./PlayerController.js";

import {
    printFormattedTime
}
from "../utils/Time.js";

import {
    removeAllChildrenFrom,
    undoFragment,
    container,
    fragment,
    content,
    modal
}
from "../utils/UI.js";

class ResourceLoader {
    constructor() {
        this.player = new Player();
        this.playerController = new PlayerController(this.player);
        this.PageData = {
            curr: null,
            prev: null,
            prevPages: [],
        };

        this.loadPlayerControls()
    };

    async newHttpRequest(obj) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(obj.method || 'GET', obj.url);

            if (obj.headers) {
                Object.keys(obj.headers).forEach(key => {
                    xhr.setRequestHeader(key, object.headers[key]);
                });
            }

            xhr.onload = function () {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send(obj.body);
        });
    }

    async getPage(page) {
        const data = await this.newHttpRequest({
            url: `content.php?dir=${page}`
        });

        if (data.length === 0) {
            throw new Error("Error loading source: Directory doesn't exist....");
        }

        if (typeof data[0] === "undefined") {

            if (typeof this.PageData.curr !== null && page != this.PageData.curr && page != this.PageData.prev) {
                this.PageData.prevPages.push(this.PageData.curr);
            }
            this.PageData.curr = page;

        }
        return data;
    }

    async loadPage(data) {

        removeAllChildrenFrom(container);
        
        undoFragment();

        const collection = await Promise.all(await this.getPosters(data));
        const keys = Object.keys(data);

        return {
            collection,
            keys
        };
    }

    updateCollection() {
        container.appendChild(fragment);
        container.style.height = 'calc(100% - 5px)';
    }

    updatePage() {
        content.appendChild(container);
    }

    popPage() {
        this.PageData.prev = this.PageData.prevPages.pop();
    }

    async getPosters(data) {
        return Object.keys(data).map(async(key) => {
            if (data[key] === null) {
                data[key] = {};
            }

            data[key].title = key.split("\/").pop();
            const search = data[key].title.replace(/\s/gi, '%20');

            return await this.newHttpRequest({
                url: `http://www.omdbapi.com/?t=${search}&apikey=fdfec37c`
            });
        });
    }

    createPoster(url) {

        const Poster = {
            cover: document.createElement('div'),
            title: document.createElement('p'),
            wrapper: document.createElement('div'),
            onClick: async function (fn) {
                Poster.wrapper.addEventListener("click", () => {
                    fn()
                });
            }
        };

        Poster.wrapper.appendChild(Poster.cover);

        Poster.cover.classList.add("cover");
        Poster.cover.style.backgroundImage = "url('" + url + "')";
        Poster.cover.style.backgroundSize = '100% 100%';

        fragment.appendChild(Poster.wrapper);

        return Poster;
    }

    loadPlayer(data) {
        modal.style.display = "block";

        this.player.data = data;
        this.player.trackId = 0;

        this.playerController.playTrack(0);
    }

    loadPlayerControls() {
        window.onkeydown = event => {
            if (event.keyCode === 32)
                this.player.controller.togglePlaying();
        }

        this.player.controls.Play.button.onclick = () => this.playerController.togglePlay();
        this.player.controls.Prev.button.onclick = () => this.playerController.prevVideo();
        this.player.controls.Next.button.onclick = () => this.playerController.nextVideo();

        this.player.controls.TrackBar.bar.onclick = event => this.playerController.moveThumb(event.clientX);

        this.player.Video.onclick = () => this.playerController.togglePlay();

        this.player.controls.Volume.container.onclick = event => this.playerController.adjustVolume(event.clientX);
        this.player.controls.Volume.button.onclick = () => this.playerController.toggleMute();

        this.player.Video.addEventListener("timeupdate", () => {
            this.player.controls.TrackBar.track.style.width = this.player.Video.currentTime / this.player.Video.duration * 100 + '%';
            this.player.CurrentTime.textContent = `${printFormattedTime(this.player.Video.currentTime)}`;
        });

        this.player.Video.onended = () => this.playerController.nextVideo();

        // TITLEBAR & WINDOW CONTROLS

        this.player.titleBar.windowControls.minimizeMaximize.button.onclick = () => {
            if (this.player.minimized === false) {
                this.player.titleBar.windowControls.minimizeMaximize.icon.classList.replace('fa-compress-alt', 'fa-expand-alt');
                this.player.titleBar.self.classList.replace('header-pos-max', 'header-pos-min');
                this.player.controls.self.classList.replace('footer-pos-max', 'footer-pos-min');
                modal.classList.replace('modal-pos-max', 'modal-pos-min');
                modal.style.left = '65%';
                modal.style.top = '65%';
                this.player.minimized = true;
            } else {
                this.player.titleBar.windowControls.minimizeMaximize.icon.classList.replace('fa-expand-alt', 'fa-compress-alt');
                this.player.titleBar.self.classList.replace('header-pos-min', 'header-pos-max');
                this.player.controls.self.classList.replace('footer-pos-min', 'footer-pos-max');
                modal.classList.replace('modal-pos-min', 'modal-pos-max');
                modal.style.left = '0px';
                modal.style.top = '0px';
                this.player.minimized = false;
            }
        };

        this.player.titleBar.windowControls.playlist.button.onclick = () => console.log("clicked!");
        this.player.titleBar.windowControls.close.button.onclick = () => modal.style.display = "none";
    }

};

const HOME = ".\/Videos";
const MOVIES = ".\/Videos\/Movies";
const SERIES = ".\/Videos\/Series";

export {
    ResourceLoader,
    HOME,
    MOVIES,
    SERIES
};
