export const container = document.getElementById('container');
export const content = document.getElementById('content');
export const popupModalHeader = document.getElementsByClassName("popup-modal-header")[0];
export const popupModalFooter = document.getElementsByClassName("popup-modal-footer")[0];
export const compressExpand = document.getElementsByClassName("fa-compress-alt")[0];
export const modal = document.getElementsByClassName("popup-modal")[0];
export const minMaxIcon = document.getElementById("min-max");
export const closeIcon = document.getElementById("close");

export const navButtons = document.getElementsByClassName("link");

export const nav = {
    homeButton: {
        onClick: async function (fn) {
            navButtons[1].addEventListener("click", () => {
                fn();
            });
        }
    },
    moviesButton: {
        onClick: async function (fn) {
            navButtons[2].addEventListener("click", () => {
                fn();
            });
        }
    },
    seriesButton: {
        onClick: async function (fn) {
            navButtons[3].addEventListener("click", () => {
                fn();
            });
        }
    }
}
export const backButton = document.createElement("div");
// backButton.classList.add("go-back");

export const backIcon = document.createElement("i");

export const fragment = document.createDocumentFragment();

export function removeAllChildrenFrom(element) {
    const children = element.childNodes;
    let i = element.childElementCount - 1;
    while (i >= 0) {
        element.removeChild(children[i--]);
    }
}

export function append(parentElement, childElement) {
    parentElement.appendChild(childElement);
}

// backIcon.classList.add("far", "fa-arrow-alt-circle-left");

export function undoFragment() {
    removeAllChildrenFrom(fragment);
}
