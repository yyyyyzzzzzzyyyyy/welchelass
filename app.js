const list = document.getElementById('music-list');

/* HELPERS */
function norm(t){
  return String(t||'')
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,'')
    .trim();
}

function get(track, keys){
  const map = {};
  Object.keys(track).forEach(k => map[norm(k)] = track[k]);
  for (let k of keys) {
    if (map[norm(k)]) return map[norm(k)];
  }
  return '—';
}

function color(v){
  v = norm(v);
  if (v.includes('seguro') || v.includes('completa') || v.includes('full')) return 'green';
  if (v.includes('tal') || v.includes('medio') || v.includes('exclusiva')) return 'blue';
  if (v.includes('relleno') || v.includes('decides') || v.includes('rara')) return 'yellow';
  if (v.includes('ya') || v.includes('salteada') || v.includes('filtrada')) return 'red';
  return 'blue';
}

/* LOAD */
fetch('data.json')
.then(r => r.json())
.then(data => {
  data.forEach(track => {
    const id = String(get(track,['id'])).padStart(2,'0');

    const row = document.createElement('div');
    row.className = 'track';
    row.dataset.id = id;

    const interes = get(track,['tipo de interes','tipo de interés']);
    const forma = get(track,['forma recomendada de escuchar']);
    const estado = get(track,['estado']);

    row.innerHTML = `
      <img src="images/${id}.jpg">
      <button class="play-btn">▶</button>
      <div>
        <div class="track-title">${get(track,['titulo','título'])}</div>

        <div class="badges">
          <span class="badge ${color(interes)}">${interes}</span>
          <span class="badge ${color(forma)}">${forma}</span>
          <span class="badge ${color(estado)}">${estado}</span>
        </div>

        <div class="track-meta">
          <div><strong>ARTISTAS:</strong> ${get(track,['artistas'])}</div>
          <div><strong>ÁLBUM:</strong> ${get(track,['album'])}
          · <strong>AÑO:</strong> ${get(track,['año','ano'])}
          · <strong>DURACIÓN:</strong> ${get(track,['duracion','duración'])}</div>
        </div>

        <div class="context-box">${get(track,['contexto'])}</div>

        <div class="track-meta">
          <strong>NOTA:</strong> ${get(track,['nota','nota extra'])}
        </div>
      </div>
    `;

    list.appendChild(row);
  });
});

/* PLAYER */
const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const titleEl = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');

let currentTrack = null;

document.addEventListener('click', e => {
  if (!e.target.classList.contains('play-btn')) return;

  if (currentTrack) currentTrack.classList.remove('active');

  const track = e.target.closest('.track');
  currentTrack = track;
  track.classList.add('active');

  const id = track.dataset.id;
  audio.src = `audio/${id}.mp3`;
  cover.src = `images/${id}.jpg`;
  titleEl.textContent = track.querySelector('.track-title').textContent;

  audio.play();
  playPause.textContent = '⏸';
  player.classList.remove('hidden');
  document.body.classList.add('playing');
});

playPause.onclick = () => {
  audio.paused ? audio.play() : audio.pause();
  playPause.textContent = audio.paused ? '▶' : '⏸';
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => audio.volume = volume.value;

audio.onended = () => {
  document.body.classList.remove('playing');
  if (currentTrack) currentTrack.classList.remove('active');
};

/* FILTROS */
['filter-interes','filter-forma','filter-estado'].forEach(id => {
  document.getElementById(id).onchange = () => {
    const i = norm(filter-interes.value);
    const f = norm(filter-forma.value);
    const e = norm(filter-estado.value);

    document.querySelectorAll('.track').forEach(t => {
      const b = t.querySelectorAll('.badge');
      const ok =
        (!i || norm(b[0].textContent).includes(i)) &&
        (!f || norm(b[1].textContent).includes(f)) &&
        (!e || norm(b[2].textContent).includes(e));
      t.style.display = ok ? '' : 'none';
    });
  };
});

/* GUÍA */
const guide = document.getElementById('guide-modal');
open-guide.onclick = e => { e.preventDefault(); guide.classList.remove('hidden'); };
close-guide.onclick = () => guide.classList.add('hidden');
