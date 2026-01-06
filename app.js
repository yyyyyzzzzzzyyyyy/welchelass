const list = document.getElementById('music-list');

function get(track, keys) {
  const norm = {};
  Object.keys(track).forEach(k => {
    norm[k.toLowerCase().trim()] = track[k];
  });
  for (let k of keys) {
    if (norm[k.toLowerCase()]) return norm[k.toLowerCase()];
  }
  return '—';
}

fetch('data.json')
  .then(r => r.json())
  .then(data => {
    data.forEach(track => {
      const id = String(track.ID).padStart(2,'0');
      const estado = get(track,['ESTADO']);

      const row = document.createElement('div');
      row.className = 'track';

      row.innerHTML = `
        <img src="images/${id}.jpg">
        <button class="play-btn">▶</button>

        <div class="track-info">
          <div class="track-title">${get(track,['TÍTULO','TITULO'])}</div>

          <div class="badges">
            <span class="badge interest">${get(track,['TIPO DE INTERÉS','TIPO DE INTERES'])}</span>
            <span class="badge listen">${get(track,['FORMA RECOMENDADA DE ESCUCHAR'])}</span>
            <span class="badge status ${estado.toLowerCase().includes('full') ? 'full' : ''}">
              ${estado}
            </span>
          </div>

          <div class="context-box">
            <div class="context-title">CONTEXTO</div>
            ${get(track,['CONTEXTO'])}
          </div>
        </div>
      `;

      row.querySelector('.play-btn').onclick = () => play(track,id);
      list.appendChild(row);
    });
  });

/* PLAYER */
const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const title = document.getElementById('player-title');

function play(track,id){
  audio.src = `audio/${id}.mp3`;
  audio.play();
  cover.src = `images/${id}.jpg`;
  title.textContent = get(track,['TÍTULO','TITULO']);
  player.classList.remove('hidden');
}

/* MODAL */
const guide = document.getElementById('guide-modal');
document.getElementById('open-guide').onclick = () => guide.classList.remove('hidden');
document.getElementById('close-guide').onclick = () => guide.classList.add('hidden');
