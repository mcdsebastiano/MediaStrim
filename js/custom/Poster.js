import {
    posterHTML
}
from "../utils/UI.js";

const template = document.createElement("template");
template.innerHTML = posterHTML;

class Poster extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: "open"
        });

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get plus() {
        return this.shadowRoot.querySelector(".plus");
    }

    get wrapper() {
        return this.shadowRoot.querySelector(".wrapper");
    }

    get info() {
        return this.shadowRoot.querySelector(".info");
    }

    set(obj) {

        const wrapper = this.shadowRoot.querySelector(".wrapper");
        wrapper.style.backgroundImage = "url('" + obj.Poster + "')";
        wrapper.style.backgroundSize = '100% 100%';

    }
}

customElements.define('poster-img', Poster);
