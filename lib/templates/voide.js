const state = {
  invert: false,
  caption: true,
  mute: false,
  autoplay: false,
};

const containers = {
  slide: null,
  caption: null,
};

const slideContainer = document.querySelector('.slide-container > section');
const captionContainer = document.querySelector('.caption-container');

document.addEventListener('DOMContentLoaded', async () => {
  ['invert', 'caption', 'mute', 'autoplay'].forEach((key) => {
    document.querySelector(`.${key}-button`).addEventListener('click', () => {
      setState(key, !state[key]);
      handlers[key]();
    });
  });

  ['back', 'forward'].forEach((key) => {
    document.querySelector(`.${key}-button`).addEventListener('click', () => {
      setState('autoplay', false);
      handlers[key]();
    });
  });

  window.addEventListener('hashchange', loadPage);

  loadPage();
});

const updateUI = () => {
  const { invert, caption, mute } = state;

  ['invert', 'caption', 'mute', 'autoplay'].forEach((key) => {
    document
      .querySelector(`.${key}-button .active`)
      .classList[state[key] ? 'remove' : 'add']('d-none');
    document
      .querySelector(`.${key}-button .inactive`)
      .classList[state[key] ? 'add' : 'remove']('d-none');
  });

  document.querySelector('.autoplay-button').disabled = mute ? 'disabled' : '';

  captionContainer.classList[caption ? 'remove' : 'add']('invisible');
  slideContainer.classList[invert ? 'add' : 'remove']('invert');
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
  captionContainer.innerHTML = props.comments[page];

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
  slideContainer.innerHTML = props.sections[page];
};

const handlers = {
  invert: () => {},
  caption: () => {},
  mute: () => {
    if (state.mute) {
      setState('autoplay', false);
    }
  },
  autoplay: () => {
    if (state.autoplay) {
      setPage(currentPage() + 1);
    }
  },
  back: () => {
    setState('autoplay', false);
    setPage(currentPage() - 1);
  },
  forward: () => {
    setState('autoplay', false);
    setPage(currentPage() + 1);
  },
};

const setPage = (page) => {
  if (page > -1 && page < props.sections.length) {
    location.hash = `#${page}`;
  }
};
