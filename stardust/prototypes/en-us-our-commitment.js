// tide.com replica — section-landing archetype: YouTube preview overlay → player (live .youtube-video-preview-overlay,
// data-action-detail = embed src). Same src as live; the iframe mounts on activation only.
(() => {
  document.querySelectorAll('.yt__overlay').forEach((overlay) => {
    const play = () => {
      const iframe = document.createElement('iframe');
      iframe.src = overlay.dataset.embed;
      iframe.title = 'YouTube video player';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      overlay.replaceWith(iframe);
    };
    overlay.addEventListener('click', play);
    overlay.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
  });
})();
