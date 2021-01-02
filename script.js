'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Cookie message

const header = document.querySelector('.header');

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// scroll  to:

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('X/Y Scroll positions: ', window.pageXOffset, window.pageYOffset);
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// ////////////////////Page Navigation/////////////////////////////////

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     console.log('link');
//     console.log(this.getAttribute('href'));

//   });
// });

////////////////////////////////// smooth scroll for navbar links///////////////////////////////////////////////////////////////

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// /////////////////////////////// OPERATIONS TAB FUNCTIONALITY /////////////////////////////////////////////

const tabs = document.querySelectorAll('.operations__tab');

const tabsContainer = document.querySelector('.operations__tab-container');

const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  if (!clicked) return;

  document
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');
  document
    .querySelector('.operations__content--active')
    .classList.remove('operations__content--active');

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////// MENU FADE ANIMATION //////////////////////

const nav = document.querySelector('.nav');

const handleHover = function (e) {
  console.log(this);

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////// STICKY NAV /////////////////////////////////////////////

// const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  entries.forEach(entry => {
    // console.log(entry);
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });
};

const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, options);
headerObserver.observe(header);

/////////////////////////////////////// SECTION REVEAL ///////////////////////////////////////////////////

const sections = document.querySelectorAll('.section');

const revealoptions = {
  root: null,
  threshold: 0.15,
};

const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry.target);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, revealoptions);

sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

///////////////////////////////////////////////// LAZY NAVIGATION ////////////////////////////////////////////////////

const lazyPics = document.querySelectorAll('img[data-src]');

const lazyOptions = {
  root: null,
  threshold: 1,
};

const revealPic = function (entries, observer) {
  const [entry] = entries;
  console.log(entry.target);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const picObserver = new IntersectionObserver(revealPic, lazyOptions);

lazyPics.forEach(picture => {
  picObserver.observe(picture);
});

/////////////////////////////////////////////// SLIDER FEATURE /////////////////////////////////////////////////////

const slider = function () {
  const slides = document.querySelectorAll('.slide');

  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');

  const dotsContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class ="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  let curSlide = 0;

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 100}%)`;
  });

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();

  // Next Slide

  const nextSlide = function () {
    if (curSlide === slides.length - 1) {
      curSlide = 0;
    } else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const previousSlide = function () {
    if (curSlide === 0) {
      curSlide = slides.length;
    }
    curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  // Arrow Commands

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
  });
};

slider();

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const allSections = document.querySelectorAll('.section');

// console.log(allSections);

// document.getElementById('section--1');

// const allButtons = document.getElementsByTagName('button');

// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// creating and inserting elements

// .insertAdjacentHTML

// Delete elements

// Styles

// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 200 + 'px';

// console.log(message.style.height);

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.classList);
// console.log(logo.className);

// Classes

// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();

// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert("You've been hovering, you hoverer, you");

//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

// const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {});

// const h1 = document.querySelector('h1');

// gpoing downwards

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'magenta';
// h1.lastElementChild.style.color = 'turquoise';

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
