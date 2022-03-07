import {
    nav
}
from "./utils/UI.js";
import {
    ResourceLoader,
    MOVIES,
    SERIES,
    HOME,
}
from "./modules/ResourceLoader.js";

(async() => {

    const loader = new ResourceLoader();
    
    nav.slider.onclick = () => {
        nav.self.classList.toggle('in');
        nav.self.classList.toggle('out');
    }
  
    nav.homeButton.onclick = async() => await load(HOME);
    nav.moviesButton.onclick = async() => await load(MOVIES);
    nav.seriesButton.onclick = async() => await load(SERIES);

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

                for (let i = 0; i < keys.length; i++) {
                    const Poster = loader.createPoster(collection[i].Poster);
                    Poster.onClick(async() => await load(keys[i]));
                    loader.updateCollection();
                }

                loader.updatePage()
            }

        } catch (err) {
            console.error(err);

        }

    }

    await load(HOME);
})();
