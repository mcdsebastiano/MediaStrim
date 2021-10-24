const OMDB_API_KEY= '';
const HOME = '.\/Videos';
const MOVIES = '.\/Videos\/Movies';
const SERIES = '.\/Videos\/Series';

/*********************/

const playlistSelect = document.getElementById('playlist-select');
const popupModalHeader = document.getElementsByClassName('popup-modal-header')[0];
const popupModalFooter = document.getElementsByClassName('popup-modal-footer')[0];
const playlistModal = document.getElementsByClassName('playlist-container')[0];
const playlistTracks = document.getElementsByClassName('playlist-tracks')[0];

const volumeContainer = document.getElementsByClassName('volume-container')[0];
const volumeSlider = document.getElementsByClassName('volume-slider')[0];
const volumeIcon = document.getElementsByClassName('fa-volume-up')[0];
const volumeButton = document.getElementById('volume-button');

const compressExpand = document.getElementsByClassName('fa-compress-alt')[0];
const minMaxIcon = document.getElementById('min-max');
const closeIcon = document.getElementById('close');

const trackbar = document.getElementsByClassName('trackbar')[0];
const track = document.getElementsByClassName('track')[0];

const playIcon = document.getElementsByClassName('fa-play')[0];
const dur = document.getElementsByTagName('time')[0];
const playButton = document.getElementById('play-pause');
const nextButton = document.getElementById('skip-next');
const prevButton = document.getElementById('skip-prev');

const modal = document.getElementsByClassName('popup-modal')[0];
const video = document.getElementById('media');

/*********************/

const container = document.getElementById('container');
const content = document.getElementById('content');
const nav = document.getElementById('nav');

const searchBar = document.getElementsByClassName('searchbar')[0];
const searchInput = document.getElementById('search-input');
const searchIcon = document.getElementById('search');

let epPanelOn = false;
let minimized = false;

const maxVolume = 75;
let vol;

let prevPages = [];
let currPage;
let prevPage = currPage;

/*********************/

(function () {

  
  Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function (key) {
    const value = this.getItem(key);
    return value && JSON.parse(value);
  }

  Storage.prototype.setGlobal = function (key, value) {
    if (typeof localStorage.globalSettings === undefined) {
      return;
    }

    let settings = localStorage.getObject('globalSettings');
    settings[key] = value;

    localStorage.setObject('globalSettings', settings);

  }

  Storage.prototype.getGlobal = function (key) {
    let settings = localStorage.getObject('globalSettings');

    if (typeof settings[key] !== 'undefined') {
      return settings[key];
    }
  }
  
  if (typeof localStorage.globalSettings === 'undefined') {
    localStorage.setObject('globalSettings', {
      Volume: 1,
      History: {}
    });
  }
    
  function dragElement(elmnt) {
    var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
    
    document.getElementsByClassName(elmnt.classList[0] + "-header")[0].onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  
  dragElement(modal);

  volumeSlider.style.width = localStorage.getGlobal('Volume') * 100 + '%';
  video.volume = localStorage.getGlobal('Volume');

  document.body.setAttribute('onload', 'load(HOME)');
})();


// Developer use only
const clearStorage = () => localStorage.clear();

