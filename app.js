const list = document.getElementById('music-list');

/* NORMALIZADOR */
function norm(t){
  return String(t||'').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,'').trim();
}

/* GET */
function get(track, keys){
  const map = {};
  Object.keys(track).forEach(k => map[norm(k)] = track[k]);
  for (let k of keys) if (map[norm(k)]) return map[norm(k)];
  return '—';
}

/* COLOR */
function color(v){
  v = norm(v);
  if (v.includes('seguro') || v.includes('completa') || v.includes('full')) return 'green';
  if (v.includes('tal vez') || v.includes('punto') || v.includes('exclusiva')) return 'blue';
  if (v.includes('relleno') || v.includes('decides')) return 'yellow';
  return 'red';
}

let tracksData = [];

/* LOAD */
fetch('data.json')
.then(r => r.json())
.then(data => {
  tracksData = data;
  data.forEach((track, index) => {
    const id = String(get(track,['id','ID'])).padStart(2,'0');

    const row = document.createElement('div');
    row.className = 'track';
    row.dataset.index = index;

    row.innerHTML = `
      <div class="track-id">${id}</div>
      <img src="images/${id}.jpg">
      <button class="play-btn">▶</button>
      <div>
        <div class="track-title">${get(track,['titulo','título'])}</div>
        <div class="badges">
          <span class="badge ${color(get(track,['tipo']))}">${get(track,['tipo'])}</span>
          <span class="badge ${color(get(track,['forma']))}">${get(track,['forma'])}</span>
          <span class="badge ${color(get(track,['estado']))}">${get(track,['estado'])}</span>
        </div>
        <div class="track-meta">${get(track,['artistas'])}</div>
        <div class="context-box">${get(track,['contexto'])}</div>
      </div>
    `;
    list.appendChild(row);
  });
});

/* IMAGE MODAL */
const imageModal = document.getElementById('image-modal');
const imageModalImg = document.getElementById('image-modal-img');

document.addEventListener('click', e => {
  if (e.target.tagName === 'IMG' && e.target.closest('.track')) {
    imageModalImg.src = e.target.src;
    imageModal.classList.remove('hidden');
  }
});
document.getElementById('close-image').onclick = () => imageModal.classList.add('hidden');

/* PLAYER */
const audio = document.getElementById('audio');
const cover = document.getElementById('player-cover');
const titleEl = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

let currentIndex = null;

document.addEventListener('click', e => {
  if (!e.target.classList.contains('play-btn')) return;
  const index = e.target.closest('.track').dataset.index;
  playTrack(+index);
});

function playTrack(index){
  const track = tracksData[index];
  if (!track) return;

  const id = String(get(track,['id','ID'])).padStart(2,'0');
  currentIndex = index;

  audio.src = `audio/${id}.mp3`;
  cover.src = `images/${id}.jpg`;
  titleEl.textContent = get(track,['titulo','título']);
  audio.play();

  document.querySelectorAll('.track').forEach(t => t.classList.remove('active'));
  document.querySelector(`.track[data-index="${index}"]`).classList.add('active');

  document.getElementById('player').classList.remove('hidden');
  playPause.textContent = '⏸';
}

playPause.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
  playPause.textContent = audio.paused ? '▶' : '⏸';
};

audio.ontimeupdate = () => progress.value = (audio.currentTime / audio.duration) * 100 || 0;
progress.oninput = () => audio.currentTime = (progress.value / 100) * audio.duration;
volume.oninput = () => audio.volume = volume.value;

audio.onended = () => currentIndex !== null && playTrack(currentIndex + 1);
