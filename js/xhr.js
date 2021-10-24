function load(page) {

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let watchHistory = localStorage.getGlobal('History');
            const data = JSON.parse(this.responseText);
            if (typeof data[0] != 'undefined') {
                // display the player
                modal.style.display = 'block';

                // this will probably be changed (i.e when we save a playlist we dont
                // want it to disappear!)
                removeAllChildrenFrom(playlistTracks);

                const playlistFragment = document.createDocumentFragment();

                let videoID = 0;
                let videoKey;
                let lastLeftOff = false;

                function changeSource(id) {

                    console.log(id);

                    if (id >= data.length || id < 0)
                        return;

                    videoKey = data[id].path;
                    let foundID = 0;
                    const currentSrc = document.getElementsByTagName('source')[0];
                    if (typeof currentSrc !== 'undefined') {
                        if (watchHistory[videoKey]) {
                            for (let i = 0; i < watchHistory[videoKey].length; i++) {
                                if (watchHistory[videoKey][i].source == currentSrc.src) {
                                    foundID = i;
                                    break;
                                }
                            }
                            if (video.currentTime === video.duration) {
                                watchHistory[videoKey][foundID].timestamp = 0;
                            } else {
                                watchHistory[videoKey][foundID].timestamp = video.currentTime;
                            }

                        }
                        currentSrc.remove();
                    }

                    const source = document.createElement('source');
                    source.setAttribute('src', `${data[id].path}${data[id].source}`);
                    document.getElementsByClassName('text')[0].textContent = data[id].title;
                    video.appendChild(source);

                    console.log(source)

                    video.load();
                    playPause();

                    playlist[videoID].classList.remove('active');

                    foundID = -1;
                    if (typeof watchHistory[videoKey] !== 'undefined') {
                        for (let i = 0; i < watchHistory[videoKey].length; i++) {
                            let item = watchHistory[videoKey][i];
                            if (item.title == data[id].title) {
                                foundID = i;
                                break;
                            }
                        }
                    }

                    if (foundID > -1) {
                        video.currentTime = watchHistory[data[id].path][foundID].timestamp;
                        videoID = watchHistory[data[id].path][foundID].videoID;
                    } else {

                        videoID = id;

                        if (typeof watchHistory[data[id].path] !== "undefined") {
                            watchHistory[data[id].path].push({
                                title: data[id].title,
                                timestamp: 0,
                                source: source.src,
                                videoID
                            });
                            localStorage.setGlobal('History', watchHistory);
                        } else {
                            watchHistory[data[id].path] = [];
                            watchHistory[data[id].path][0] = {
                                title: data[id].title,
                                timestamp: 0,
                                source: source.src,
                                videoID
                            };
                            localStorage.setGlobal('History', watchHistory);
                        }
                        video.currentTime = 0;
                    }
                    playlist[id].classList.add('active');
                }

                data.forEach((item, i) => {
                    // new list item
                    const listItem = document.createElement('li');
                    listItem.classList.add('playlist');

                    //play-pause option - TODO: if video is playing show pause button
                    const playButton = document.createElement('i');
                    playButton.classList.add('far');
                    playButton.classList.add('fa-play-circle');
                    playButton.classList.add('fa-2x');
                    listItem.appendChild(playButton);
                    playButton.onclick = () => changeSource(i);

                    // filename -- should be filename (backend needs work)
                    const playlistTitle = document.createElement('span');
                    playlistTitle.id = i;
                    playlistTitle.innerText = item.title;
                    playlistTitle.style.width = "100%";
                    listItem.appendChild(playlistTitle);

                    // info button -- ping OMDB
                    const infoButton = document.createElement('i');
                    infoButton.classList.add('fas');
                    infoButton.classList.add('fa-info-circle');
                    listItem.appendChild(infoButton);

                    // done
                    playlistFragment.appendChild(listItem);
                });

                const playlist = document.getElementsByClassName('playlist');
                playlistTracks.appendChild(playlistFragment);

                changeSource(videoID);

                let playID = Math.max.apply(Math, watchHistory[videoKey].map(item => item.videoID));

                if (typeof playID !== "undefined") {
                    const notificationHeader = document.createElement('div');
                    
                    notificationHeader.classList.add("notification-header");

                    const OKButton = document.createElement('button');
                    OKButton.classList.add("notification-header", "ok-button");
                    OKButton.textContent = 'OK';

                    const cancelButton = document.createElement('button');
                    cancelButton.classList.add("notification-header", "cancel-button");
                    
                    const closeIcon = document.createElement('i');
                    closeIcon.classList.add("close-icon", 'fas', 'fa-window-close', 'fa-2x');
                    cancelButton.appendChild(closeIcon);

                    const message = document.createElement('span');
                    message.classList.add("notification-header", "message");
                    message.textContent = 'Continue where you last left?';

                    notificationHeader.appendChild(message);
                    notificationHeader.appendChild(OKButton);
                    notificationHeader.appendChild(cancelButton);

                    document.body.appendChild(notificationHeader);

                    OKButton.onclick = () => {
                        changeSource(playID)
                        notificationHeader.remove();
                    };

                    cancelButton.onclick = () => {
                        notificationHeader.remove()
                    };
                }

                video.onended = () => changeSource(videoID + 1);
                nextButton.onclick = () => changeSource(videoID + 1);
                prevButton.onclick = () => changeSource(videoID - 1);
            } else {

                if (typeof currPage !== "undefined" && page != currPage && page != prevPage) {
                    prevPages.push(currPage);
                }

                removeAllChildrenFrom(container);

                const fragment = document.createDocumentFragment();

                if (prevPages.length > 0) {

                    // if (container.classList.contains('add-padding-for-back-button') === false) {
                    // container.classList.remove('container__no-padding-for-back-button');
                    // container.classList.add('container__padding-for-back-button');
                    // }

                    const backButton = document.createElement('div');
                    backButton.classList.add('go-back');

                    const backIcon = document.createElement('i');
                    backIcon.classList.add('far', 'fa-arrow-alt-circle-left', 'fa-5x');

                    backButton.onclick = () => {
                        prevPage = prevPages.pop();
                        load(prevPage);
                    };

                    backButton.appendChild(backIcon);
                    fragment.appendChild(backButton);
                } else {
                    container.classList.remove('container__padding-for-back-button');
                    container.classList.add('container__no-padding-for-back-button');
                }

                const keys = Object.keys(data);

                keys.forEach(async key => {
                    let temp = JSON.parse(JSON.stringify(data));
                    const dirs = key.split("\/");

                    let str = 'Videos';
                    let depth = dirs.length - 2;

                    currPage = page;

                    const cover = document.createElement('div');
                    cover.classList.add('cover');

                    const title = document.createElement('p');

                    const titleText = dirs[dirs.length - 1];

                    const coverWrapper = document.createElement('div');

                    coverWrapper.append(cover);
                    if (OMDB_API_KEY.trim().length > 0 && depth === 2) {
                        let poster = await getPoster(titleText);
                        cover.style.backgroundImage = `url(${poster})`;
                        cover.style.backgroundSize = '100% 100%'
                    } else {
                        title.innerText = titleText;
                        cover.style.fontSize = '52pt';
                        cover.innerHTML = '&#128193';
                        coverWrapper.append(title);
                    }
                    fragment.appendChild(coverWrapper);

                    for (let i = 2; i < dirs.length; i++) {
                        str += '\/' + dirs[i];
                        temp = data[str];
                        if (!Number.isInteger(parseInt(key))) {
                            coverWrapper.onclick = (event) => {
                                if (nav.classList.contains("out") === true) {
                                    event.preventDefault();
                                    navSlide();
                                    return;
                                }
                                load(key)
                            };
                        } else {
                            coverWrapper.onclick = (event) => {

                                if (nav.classList.contains("out") === true) {
                                    event.preventDefault();
                                    navSlide();
                                    return;
                                }
                                load(temp[key])
                            }; ;
                        }
                    }
                    container.appendChild(fragment);
                    container.style.height = 'calc(100% - 5px)';

                });
                content.appendChild(container);

            }
        }
    };
    xhr.open('GET', `content.php?dir=${page}`, true);
    xhr.send();
}

async function getPoster(title) {
    const search = title.replace(/\s/gi, '%20');
    const data = await fetch(`http://www.omdbapi.com/?t=${search}&apikey=${OMDB_API_KEY}`);
    const json = await data.json();
    return json.Poster;
}
