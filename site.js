(() => {
  const videos = [...document.querySelectorAll('video')];
  const motion = document.querySelector('#motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let autoPlay = !reduced.matches;
  const inView = new Set();
  const loadVideo = video => {
    if (video.dataset.src && !video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    }
  };
  const play = video => { loadVideo(video); video.muted = true; video.play().catch(() => {}); };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target: video, isIntersecting}) => {
      if (isIntersecting) { inView.add(video); if (autoPlay && !document.hidden) play(video); }
      else { inView.delete(video); video.pause(); }
    });
  }, {threshold: .25});
  videos.forEach(video => {
    video.dataset.src = video.getAttribute('src');
    video.muted = true;
    video.addEventListener('error', () => {
      if (!video.getAttribute('src')) return;
      let message = video.parentElement.querySelector('.media-error');
      if (!message) { message = document.createElement('p'); message.className = 'media-error'; message.setAttribute('role', 'status'); video.insertAdjacentElement('afterend', message); }
      message.replaceChildren('Video unavailable. ');
      const link = document.createElement('a'); link.href = video.dataset.src; link.textContent = 'Open video'; message.append(link);
    });
    video.addEventListener('loadeddata', () => video.parentElement.querySelector('.media-error')?.remove());
    observer.observe(video);
    video.addEventListener('pointerdown', () => loadVideo(video));
    video.addEventListener('keydown', () => loadVideo(video));
  });
  const updateMotion = () => {
    motion.querySelector('.motion-label').textContent = autoPlay ? 'Pause videos' : 'Play videos';
    motion.querySelector('.motion-icon').textContent = autoPlay ? 'Ⅱ' : '▶';
    motion.setAttribute('aria-label', autoPlay ? 'Pause videos' : 'Play videos');
    motion.setAttribute('aria-pressed', String(!autoPlay));
    inView.forEach(video => autoPlay ? play(video) : video.pause());
  };
  motion.addEventListener('click', () => { autoPlay = !autoPlay; updateMotion(); });
  reduced.addEventListener('change', () => { autoPlay = !reduced.matches; updateMotion(); });
  document.addEventListener('visibilitychange', () => {
    videos.forEach(video => { if (document.hidden) video.pause(); else if (autoPlay && inView.has(video)) play(video); });
  });
  updateMotion();
  const setVideo = (video, src, poster, label) => {
    video.pause(); video.dataset.src = src; video.src = src; video.poster = poster;
    video.setAttribute('aria-label', label); video.load();
    if (inView.has(video) && autoPlay) play(video);
  };
  let reversed = false;
  document.querySelector('#reverse-shortcut').addEventListener('click', () => {
    reversed = !reversed;
    const requested = reversed ? 'red' : 'blue';
    const selected = reversed ? 'blue' : 'red';
    const view = reversed ? 'Left' : 'Right';
    document.querySelector('#reverse-shortcut').textContent = reversed ? 'See the right-view test ↔' : 'See the left-view test ↔';
    setVideo(document.querySelector('#shortcut-test'), `videos/shortcut/put the ${requested} die in the basket - CTF test (fail).mp4`, `images/poster-shortcut-${requested}-fail.jpg`, `Test: ${view.toLowerCase()} view, asked for the ${requested} die, chooses the ${selected} die`);
    document.querySelector('#shortcut-view').textContent = `${view} view`;
    document.querySelector('#shortcut-instruction').innerHTML = `“Put the <strong class="${requested}-word">${requested} die</strong> in the basket.”`;
    document.querySelector('#shortcut-outcome').textContent = `Chooses the ${selected} die instead.`;
  });
  const labels = {'close-the-laptop':'Close the laptop','pull-out-the-tissue':'Pull out the tissue','put-the-shoe-upright':'Put the shoe upright'};
  const common = [['viewpoint','Viewpoint'],['background','Background'],['lightning','Lighting'],['dynamic-background','Dynamic background'],['foreground-clutter','Foreground clutter']];
  const noise = {'close-the-laptop':[['noise4','Noise 4'],['noise5','Noise 5']], 'pull-out-the-tissue':[['noise3','Noise 3'],['noise4','Noise 4']], 'put-the-shoe-upright':[['noise1','Noise 1'],['noise2','Noise 2']]};
  let task = 'close-the-laptop';
  const condition = document.querySelector('#robust-condition');
  const updateRollout = () => {
    const suffix = task + '--' + condition.value;
    const label = condition.selectedOptions[0].text;
    setVideo(document.querySelector('#robust-shift'), `videos/robustness/${suffix}.mp4`, `images/poster-${suffix}.jpg`, `DILL: ${labels[task]}, ${label}`);
    document.querySelector('#robust-label').textContent = label;
  };
  document.querySelectorAll('[data-task]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.task === task) return;
    task = button.dataset.task;
    document.querySelectorAll('[data-task]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const previous = condition.value;
    condition.replaceChildren(...common.concat(noise[task]).map(([value,label]) => new Option(label,value)));
    if ([...condition.options].some(option => option.value === previous)) condition.value = previous;
    setVideo(document.querySelector('#robust-train'), `videos/robustness/${task}--train.mp4`, `images/poster-${task}--train.jpg`, `DILL: ${labels[task]}, training condition`);
    updateRollout();
  }));
  condition.addEventListener('change', updateRollout);
  const dialog = document.querySelector('#figure-dialog');
  document.querySelectorAll('[data-figure]').forEach(button => button.addEventListener('click', () => {
    const image = document.querySelector('#expanded-figure'); image.src = button.dataset.figure; image.alt = button.querySelector('img').alt;
    dialog.showModal();
  }));
  document.querySelector('#close-figure').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
