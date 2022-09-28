const state = {
  caption: true,
  mute: false,
  autoplay: false,
  comments: [],
};

document.addEventListener('DOMContentLoaded', async () => {
  const rendered = await (await fetch('rendered.json')).json();

  const style = document.createElement('style');
  style.textContent = rendered.css;
  document.head.appendChild(style);

  document.body.innerHTML += rendered.html;
  loadSection(0);

  document
    .querySelector('.caption-button')
    .addEventListener('click', toggleCaption);
  document.querySelector('.mute-button').addEventListener('click', toggleMute);
  document
    .querySelector('.autoplay-button')
    .addEventListener('click', toggleAutoplay);
  document.querySelector('.back-button').addEventListener('click', goBack);
  document.querySelector('.next-button').addEventListener('click', goNext);

  window.addEventListener('hashchange', loadPage);

  setState('comments', ['', ...rendered.comments]);
  loadPage();
});

const updateUI = () => {
  const { caption, mute, autoplay } = state;

  document
    .querySelector('.caption-button .active')
    .classList[caption ? 'remove' : 'add']('d-none');
  document
    .querySelector('.caption-button .inactive')
    .classList[caption ? 'add' : 'remove']('d-none');

  document
    .querySelector('.mute-button .active')
    .classList[mute ? 'remove' : 'add']('d-none');
  document
    .querySelector('.mute-button .inactive')
    .classList[mute ? 'add' : 'remove']('d-none');

  document
    .querySelector('.autoplay-button .active')
    .classList[autoplay ? 'remove' : 'add']('d-none');
  document
    .querySelector('.autoplay-button .inactive')
    .classList[autoplay ? 'add' : 'remove']('d-none');
  document.querySelector('.autoplay-button').disabled = mute ? 'disabled' : '';

  document
    .querySelector('.caption-container')
    .classList[caption ? 'remove' : 'add']('invisible');
};

const setState = (key, value) => {
  state[key] = value;
  updateUI();
};

const currentPage = () => {
  return parseInt(location.hash.replace(/#/, '')) || 0;
};

const loadPage = () => {
  const page = currentPage();

  loadSection(page);
  document.querySelector('.caption-container').textContent =
    state.comments[page];

  if (page > 0 && !state.mute) {
    const audio = new Audio(`voices/${page}.wav`);
    audio.volume = 0.5;
    audio.play();

    if (state.autoplay) {
      audio.addEventListener('ended', () => {
        setPage(page + 1);
      });
    }
  }
};
const loadSection = (page) => {
  document.querySelector('.slide-container > section').innerHTML =
    document.querySelector(`[id="${page}"]`).innerHTML;
};

const toggleCaption = () => {
  setState('caption', !state.caption);
};

const toggleMute = () => {
  setState('mute', !state.mtue);
  if (state.mute) {
    setState('autoplay', false);
  }
};

const toggleAutoplay = () => {
  setState('autoplay', !state.autoplay);
  if (state.autoplay) {
    setPage(currentPage() + 1);
  }
};

const goBack = () => {
  setState('autoplay', false);
  setPage(currentPage() - 1);
};

const goNext = () => {
  setState('autoplay', false);
  setPage(currentPage() + 1);
};

const setPage = (page) => {
  if (
    page > -1 &&
    page < document.querySelectorAll('.marpit > section').length + 1
  ) {
    location.hash = `#${page}`;
  }
};
