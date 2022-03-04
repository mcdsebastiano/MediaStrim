import { nav } from "./utils/UI.js";
import {
    ResourceLoader,
    MOVIES,
    SERIES,
    HOME,
}
from "./ResourceLoader.js";

const loader = new ResourceLoader();

nav.homeButton.onClick(async() => await load(HOME));
nav.seriesButton.onClick(async() => await load(MOVIES));
nav.moviesButton.onClick(async() => await load(SERIES));

async function load(page) {
    try {

        const data = await loader.getPage(page);

        if (typeof data[0] !== "undefined") {

            loader.loadPlayer(data);
            loader.loadPlayerControls();

        } else {

            const {
                collection,
                keys
            } = await loader.loadPage(data);

            for (let i = 0; i < keys.length; i++) {
                const Poster = loader.createPoster(collection[i].Poster);
                Poster.onClick(async() => await load(keys[i]));
                loader.refreshCollection();
            }

            loader.refreshPage()
        }

    } catch (err) {
        console.error(err);

    }

}

await load(SERIES + "\/Breaking Bad");