const list = document.getElementById('music-list');

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(track => {
      const row = document.createElement('div');
      row.className = 'track';

      const id = String(track["ID"]).padStart(2, '0');

      const img = document.createElement('img');
      img.src = `images/${id}.jpg`;
      img.onerror = () => {
        img.src = 'https://via.placeholder.com/90x90?text=NO+IMG';
      };
      row.appendChild(img);

      const playBtn = document.createElement('button');
      playBtn.className = 'play-btn';
      playBtn.textContent = '▶';
      row.appendChild(playBtn);

      const info = document.createElement('div');
      info.className = 'track-info';

      const meta = document.createElement('div');
      meta.innerHTML = `
        <div class="track-title">${track["TÍTULO"] || ''}</div>

        <div class="track-main">
          ${track["TIPO DE INTERÉS"] || ''} ·
          ${track["FORMA RECOMENDADA DE ESCUCHAR"] || ''} ·
          ${track["ESTADO"] || ''}
        </div>

        <div class="track-secondary">
          <span>${track["ALBUM AL QUE PERTENECE"] || ''}</span>
          <span>${track["AÑO"] || ''}</span>
          <span>${track["DURACION"] || ''}</span>
        </div>

        <div class="track-notes">
          ${track["CONTEXTO"] || ''}
          ${track["NOTA EXTRA"] ? ' — ' + track["NOTA EXTRA"] : ''}
        </div>
      `;

      info.appendChild(meta);
      row.appendChild(info);
      list.appendChild(row);

      playBtn.onclick = () => playTrack(track);
    });
  });

const audio = document.getElementById('audio');
const player = document.getElementById('player');
const cover = document.getElementById('player-cover');
const title = document.getElementById('player-title');
const playPause = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const time = document.getElementById('time');

function playTrack(track) {
  const id = String(track["ID"]).padStart(2, '0');
  audio.src = `audio/${id}.mp3`;
  audio.play();

  cover.src = `images/${id}.jpg`;
  title.textContent = track["TÍTULO"] || '';

  player.classList.remove('hidden');
  playPause.textContent = '⏸';
}

playPause.onclick = () => {
  if (audio.paused) {
    audio.play();
    playPause.textContent = '⏸';
  } else {
    audio.pause();
    playPause.textContent = '▶';
  }
};

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
  const m = Math.floor(audio.currentTime / 60);
  const s = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  time.textContent = `${m}:${s}`;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};
