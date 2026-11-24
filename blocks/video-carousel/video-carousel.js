/**
 * video-carousel — a row of videos with an orange dot pill and a play / pause control (live
 * .carousel-video-with-controls-wrapper: slick, centre mode, one video in view with the next one
 * peeking; a dot per video ("Play video n") selects and plays it, the round button plays or
 * pauses the current video, a finished video advances to the next one).
 * Decode tier: reconstructive (one slide per row).
 *
 * Authored shape:
 *   - one row per video: a paragraph holding ONE link whose href is the mp4 (davids-model D1: the
 *     player URL is a link, never a block setting);
 *   - optional caption row (rich text without a video link, live .caption-richtext) — shown
 *     between the videos and the controls.
 * The authored link paragraph stays in its slide (visually hidden); the <video> is generated
 * from its href.
 *
 * @variants block class: mute — clips start muted, with a sound toggle beside play;
 *   vertical — 9:16 clips, three in view from 1200px (live
 *   .vertical-variable-width); white — white dot pill with orange dots (live .dots-container.white)
 * @ew-exempt "Play video n", "Play Button" / "Pause Button": control labels (live aria-labels)
 */

const PLAY = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#FB4C06"></circle><path d="M47 30.7679C48.3333 31.5377 48.3333 33.4622 47 34.232L23.75 47.6554C22.4167 48.4252 20.75 47.463 20.75 45.9234L20.75 19.0766C20.75 17.537 22.4167 16.5748 23.75 17.3446L47 30.7679Z" fill="white"></path></svg>';
const MUTED = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#FB4C06"></circle><path d="M18 26h7l9-8v28l-9-8h-7z" fill="white"></path><path d="M39 26l10 12M49 26L39 38" stroke="white" stroke-width="3" stroke-linecap="round"></path></svg>';
const SOUND = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#FB4C06"></circle><path d="M18 26h7l9-8v28l-9-8h-7z" fill="white"></path><path d="M40 24c4 4 4 12 0 16M44 20c7 7 7 17 0 24" stroke="white" stroke-width="3" stroke-linecap="round"></path></svg>';
const PAUSE = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="32" fill="#FB4C06"></circle><rect x="22" y="19" width="7" height="26" rx="2" fill="white"></rect><rect x="35" y="19" width="7" height="26" rx="2" fill="white"></rect></svg>';

function videoLink(row) {
  return [...row.querySelectorAll('a[href]')].find((a) => /\.mp4(\?|$)/i.test(a.getAttribute('href')));
}

export default function decorate(block) {
  if (block.querySelector('.vc-track')) return; // EW9: re-entrant
  const rows = [...block.children];
  const viewport = document.createElement('div');
  viewport.className = 'vc-list';
  const track = document.createElement('div');
  track.className = 'vc-track';
  viewport.append(track);
  const slides = [];
  const captions = [];
  rows.forEach((row) => {
    const link = videoLink(row);
    if (!link) {
      row.classList.add('vc-caption');
      captions.push(row);
      return;
    }
    row.classList.add('vc-slide');
    const item = document.createElement('div');
    item.className = 'vc-item';
    const video = document.createElement('video');
    video.src = link.href;
    video.playsInline = true;
    video.preload = 'metadata';
    video.muted = false;
    const para = link.closest('p') || link;
    para.classList.add('vc-source');
    item.append(video);
    row.prepend(item);
    track.append(row);
    slides.push({ row, video });
  });

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'vc-dots';
  const list = document.createElement('ul');
  list.className = 'vc-dots-list';
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'vc-play';
  control.setAttribute('aria-label', 'Play Button');
  control.innerHTML = PLAY;
  let current = 0;
  let playing = false;

  const setPlaying = (on) => {
    playing = on;
    control.innerHTML = on ? PAUSE : PLAY;
    control.setAttribute('aria-label', on ? 'Pause Button' : 'Play Button');
  };

  const go = (i, play) => {
    slides.forEach((s, k) => {
      if (k !== i) s.video.pause();
      s.row.classList.toggle('vc-active', k === i);
      list.children[k]?.classList.toggle('vc-dot-active', k === i);
    });
    current = i;
    track.style.setProperty('--vc-index', i);
    if (play) {
      slides[i].video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      setPlaying(false);
    }
  };

  slides.forEach((s, k) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Play video ${k + 1}`);
    b.innerHTML = '<span class="vc-dot"></span>';
    b.addEventListener('click', () => go(k, true));
    li.append(b);
    list.append(li);
    s.video.addEventListener('ended', () => {
      if (slides.length > 1) go((k + 1) % slides.length, true);
      else setPlaying(false);
    });
  });

  control.addEventListener('click', () => {
    const { video } = slides[current];
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  });

  const controls = document.createElement('div');
  controls.className = 'vc-controls';
  controls.append(control);
  // variant `mute`: the clips start muted with a sound toggle (live .mute-button)
  if (block.classList.contains('mute')) {
    const mute = document.createElement('button');
    mute.type = 'button';
    mute.className = 'vc-play vc-mute';
    const setMuted = (on) => {
      slides.forEach((s) => { s.video.muted = on; });
      mute.innerHTML = on ? MUTED : SOUND;
      mute.setAttribute('aria-label', on ? 'Unmute Button' : 'Mute Button');
    };
    setMuted(true);
    mute.addEventListener('click', () => setMuted(!slides[0].video.muted));
    controls.append(mute);
  }
  dotsWrap.append(list, controls);
  block.append(viewport, ...captions, dotsWrap);

  // live starts the current clip once the carousel scrolls into view (observed: clip 1 playing)
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    if (!playing) go(current, true);
  }, { threshold: 0.25 });
  io.observe(block);
  if (slides.length) go(0, false);
}
