import {
    ResourceLoader
}
from "./modules/ResourceLoader.js";
import {
    backButton,
    nav
}
from "./utils/UI.js";

const HOME = ".\/Videos";
const MUSIC = ".\/Music";
const MOVIES = ".\/Videos\/Movies";
const SERIES = ".\/Videos\/Series";

(async(loader) => {

    async function loadPage(page) {
        if (loader.PageData.curr == page) 
            return;

        return await load(page);
    }

    nav.slider.onclick = () => nav.toggle();
    nav.homeButton.onclick = async() => await loadPage(HOME);
    nav.moviesButton.onclick = async() => await loadPage(MOVIES);
    nav.seriesButton.onclick = async() => await loadPage(SERIES);
    nav.musicButton.onclick = async() => await loadPage(MUSIC);

    async function load(page) {
        try {
            const data = await loader.getPage(page);

            if (typeof data[0] !== "undefined") {

                loader.loadPlayer(data);

            } else {

                const {
                    collection,
                    keys
                } = await loader.loadPage(data);

                if (loader.PageData.prevPages.length > 0) 
                    backButton.show();
                else if (loader.PageData.prevPages.length === 0) 
                    backButton.hide();
                
                backButton.self.onclick = async() => await load(loader.prevPage);

                for (let i = 0; i < collection.length; i++) {
                    const Poster = loader.createPoster(collection[i]);
                    Poster.info.onclick = (event) => console.log(collection[i].Plot); ;
                    Poster.plus.onclick = async(event) => loader.controller.setTracks(loader.player, await loader.getPage(keys[i]));
                    Poster.wrapper.onclick = async(event) => {
                        if (event.target.classList.contains("poster") === true) 
                            return;

                        if (nav.self.classList.contains("out")) {
                            nav.toggle();
                            return;
                        }

                        await load(keys[i]);
                    };
                }

                loader.updatePage()
                
            }
        } catch (err) {
            console.error(err);
        }
    }
    
    await load(HOME);

})(new ResourceLoader());