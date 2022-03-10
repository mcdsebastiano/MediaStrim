import "../custom/Poster.js";

import {
    Player,
    MediaController
}
from "./Media.js";

import {
    printFormattedTime
}
from "../utils/Time.js";

import {
    removeAllChildrenFrom,
    undoFragment,
    backButton,
    container,
    fragment,
    content,
    nav,
}
from "../utils/UI.js";

class ResourceLoader {
    constructor() {
        this.player = new Player();
        this.controller = new MediaController();
        this.PageData = {
            curr: undefined,
            prev: undefined,
            prevPages: [],
        };
        this.coordinateEvents()
    };
    
    get prevPage() {
        this.popPage();
        return this.PageData.prev;
    }

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

        if (data.length === 0) 
            throw new Error("Error loading source: Directory doesn't exist....");

        if (typeof data[0] === "undefined") {
            if (typeof this.PageData.curr !== "undefined" && page !== this.PageData.curr && page !== this.PageData.prev) 
                this.PageData.prevPages.push(this.PageData.curr);
                
            this.PageData.curr = page;

        }

        return data;
    }

    loadPlayer(data) {
        if (this.player.minimized === false && backButton.visible) 
            backButton.hide();

        if (this.player.visible == false)
            this.player.show();

        this.player.playlist.empty();
        this.player.trackId = 0;

        this.controller.setTracks(this.player, data);
        this.controller.playTrack(this.player, 0);
    }

    async loadPage(data) {
        if (this.PageData.prevPages.length > 0) 
            backButton.show()
        
        removeAllChildrenFrom(container);
        undoFragment();

        return {
            collection: await Promise.all(await this.getPosters(data)),
            keys: Object.keys(data)
        };
    }

    updatePage() {
        container.appendChild(fragment);
        container.style.height = 'calc(100% - 5px)';
        content.appendChild(container);
    }

    popPage() {
        if(this.PageData.prevPages.length === 0) 
            return;
        
        this.PageData.prev = this.PageData.prevPages.pop();
    }

    async getPosters(data) {
        return Object.keys(data).map(async(key) => {
            if (data[key] === null) 
                data[key] = {};

            data[key].title = key.split("\/").pop();
            const search = data[key].title.replace(/\s/gi, '%20');

            return await this.newHttpRequest({
                url: `http://www.omdbapi.com/?t=${search}&apikey=fdfec37c`
            });
        });
    }

    createPoster(obj) {
        const poster = document.createElement("poster-img");
        poster.set(obj);
        fragment.appendChild(poster);
        return poster;
    }

    coordinateEvents() {
        window.onkeydown = event => {
            if (event.keyCode === 32)
                this.player.controller.togglePlaying();
        }

        this.player.controls.Play.button.onclick = () => this.controller.togglePlay(this.player);
        this.player.controls.Prev.button.onclick = () => this.controller.prevTrack(this.player);
        this.player.controls.Next.button.onclick = () => this.controller.nextTrack(this.player);

        this.player.controls.TrackBar.bar.onclick = event => this.controller.moveThumb(this.player, event.clientX);

        this.player.Media.onclick = () => this.controller.togglePlay(this.player);

        this.player.controls.Volume.container.onclick = event => this.controller.adjustVolume(this.player, event.clientX);
        this.player.controls.Volume.button.onclick = () => this.controller.toggleMute(this.player);

        this.player.Media.addEventListener("timeupdate", () => {
            this.player.controls.TrackBar.track.style.width = this.player.Media.currentTime / this.player.Media.duration * 100 + '%';
            this.player.CurrentTime.textContent = `${printFormattedTime(this.player.Media.currentTime)}`;
        });

        this.player.Media.onended = () => this.controller.nextTrack(this.player);

        this.player.titleBar.windowControls.minimizeMaximize.button.onclick = () => {
            if (this.player.minimized === false) {
                if (this.PageData.prevPages.length > 0) {
                    backButton.show();
                }
                this.player.minimize();
            } else {
                if (backButton.visible === true) {
                    backButton.hide();
                }
                this.player.maximize();
            }
        };
        this.player.titleBar.windowControls.playlist.button.onclick = () => this.player.togglePlaylist();
        this.player.titleBar.windowControls.close.button.onclick = () => {
            if (this.PageData.prevPages.length > 0) {
                backButton.show();
            }

            this.player.playlist.empty();
            this.player.toggle();
        }

        this.player.playlist.viewer.close.button.onclick = () => this.player.togglePlaylist();
    }
};

export {
    ResourceLoader
};
