const state = {
  invert: false,
  caption: true,
  mute: false,
  autoplay: false,
};

const refs = {
  audio: null,
};

const containers = {
  slide: document.querySelector('.slide-container'),
  caption: document.querySelector('.caption-container'),
  page: document.querySelector('.page-container'),
};

document.addEventListener('DOMContentLoaded', async () => {
  bindEventHandlers();
  loadPage();
});

const bindEventHandlers = () => {
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

  document.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        handlers.back();
        break;
      case 'ArrowRight':
        handlers.forward();
        break;
    }
  });

  window.addEventListener('hashchange', loadPage);
};

const setState = (key, value) => {
  state[key] = value;
  updateUI();
};

const stopAudio = () => {
  if (refs.audio) {
    refs.audio.pause();
  }
};

const currentPage = () => {
  return parseInt(location.hash.replace(/#/, '')) || 0;
};

const setPage = (page) => {
  if (page > -1 && page < props.sections.length) {
    location.hash = `#${page}`;
  }
};

const loadPage = () => {
  const page = currentPage();
  containers.slide.innerHTML = props.sections[page];
  containers.caption.innerHTML = props.comments[page].join('<br>');
  updateUI();

  if (!state.mute) {
    if (page > 0) {
      stopAudio();
      const audio = new Audio(`voices/${page}.wav?${new Date().getTime()}`);
      audio.volume = 0.5;
      audio.play();
      refs.audio = audio;

      if (state.autoplay) {
        audio.addEventListener('ended', () => {
          if (page < props.sections.length - 1) {
            setPage(page + 1);
          } else {
            setState('autoplay', false);
          }
        });
      }
    } else {
      if (state.autoplay) {
        setPage(1);
      }
    }
  }
};

const updateUI = () => {
  const { invert, caption, mute, autoplay } = state;

  ['invert', 'caption', 'mute', 'autoplay'].forEach((key) => {
    document
      .querySelector(`.${key}-button .active`)
      .classList[state[key] ? 'remove' : 'add']('d-none');
    document
      .querySelector(`.${key}-button .inactive`)
      .classList[state[key] ? 'add' : 'remove']('d-none');
  });

  const page = currentPage();
  const lastPage = props.sections.length - 1;
  document.querySelector('.autoplay-button').disabled =
    mute || page >= lastPage ? 'disabled' : '';

  containers.caption.classList[caption ? 'remove' : 'add']('invisible');
  containers.slide
    .querySelector('section')
    .classList[invert ? 'add' : 'remove']('invert');
  containers.page.textContent = `${page} / ${lastPage}`;
};

const handlers = {
  invert: () => {},
  caption: () => {},
  mute: () => {
    if (state.mute) {
      setState('autoplay', false);
      stopAudio();
    }
  },
  autoplay: () => {
    if (state.autoplay) {
      loadPage();
    } else {
      stopAudio();
    }
  },
  back: () => {
    setState('autoplay', false);
    setPage(currentPage() - 1);
    stopAudio();
  },
  forward: () => {
    setState('autoplay', false);
    setPage(currentPage() + 1);
    stopAudio();
  },
};
