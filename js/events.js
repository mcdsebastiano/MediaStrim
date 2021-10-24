window.onkeydown = function (event) {
    if (event.keyCode === 32) {
        playPause()
    }
};

searchIcon.addEventListener('click', function searchSubmit(event) {
    if (searchInput.value.trim().length === 0) {
        event.preventDefault();
    }
    if (!nav.classList.contains('out')) {
        navSlide();
    }
    slideUpDown();
    if (searchIcon.parentElement.classList.contains('expanded')) {
        searchInput.focus();
    }
});

video.onclick = () => playPause();
playButton.onclick  = () => playPause();

trackbar.onclick    = (event) => {
    track.style.width = event.clientX - trackbar.getBoundingClientRect().x + 'px';
    const percent = track.getBoundingClientRect().width / trackbar.getBoundingClientRect().width;
    video.currentTime = video.duration * percent;
};

video.addEventListener(
    'timeupdate',
    () => {
    track.style.width = video.currentTime / video.duration * 100 + '%';
    let currTime = getTime(video.currentTime);
    let durTime = getTime(video.duration);
    dur.textContent = `${printFormattedTime(currTime)} / ${printFormattedTime(durTime)}`;
},
    false);

volumeButton.onclick = () => {
    if (video.muted) {
        volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
        volumeSlider.style.width = vol * 100 + '%';
        video.volume = vol;
        video.muted = false;
    } else {
        volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
        volumeSlider.style.width = '0px';
        vol = video.volume;
        video.muted = true;
    }
};

volumeContainer.onclick = event => {
    volumeSlider.style.width = event.clientX - volumeContainer.getBoundingClientRect().x + 'px';
    video.volume = volumeSlider.getBoundingClientRect().width / maxVolume;
    if (video.muted) {
        volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
        video.muted = false;
    }

    localStorage.setGlobal('Volume', video.volume)
};
