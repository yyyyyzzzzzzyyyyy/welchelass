fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('music-list');

    data.forEach(track => {
      const card = document.createElement('div');
      card.className = 'track';

      const img = document.createElement('img');
      img.src = track["ENLACE IMAGEN"] || '';
      card.appendChild(img);

      const playBtn = document.createElement('button');
      playBtn.className = 'play-btn';
      playBtn.textContent = '▶';
      card.appendChild(playBtn);

      const info = document.createElement('div');
      info.className = 'track-info';

      const title = document.createElement('div');
      title.className = 'track-title';
      title.textContent = track["TÍTULO"] || '';
      info.appendChild(title);

      const artist = document.createElement('div');
      artist.className = 'track-artist';
      artist.textContent = track["ARTISTAS"] || '';
      info.appendChild(artist);

      const meta = document.createElement('div');
      meta.className = 'track-meta';
      meta.innerHTML = `
        ${track["FORMA RECOMENDADA DE ESCUCHAR"] || ''}<br>
        ${track["ESTADO"] || ''}<br>
        ${track["CONTEXTO"] || ''}
      `;
      info.appendChild(meta);

      card.appendChild(info);
      list.appendChild(card);

      playBtn.addEventListener('click', () => {
        playTrack(track);
      });
    });
  });

const audio = document.getElementById('audio');
const player = document.getElementById('player');
const playerCover = document.getElementById('player-cover');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playPauseBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const time = document.getElementById('time');

function playTrack(track) {
  audio.src = track["ENLACE CANCIÓN"];
  audio.play();

  playerCover.src = track["ENLACE IMAGEN"] || '';
  playerTitle.textContent = track["TÍTULO"] || '';
  playerArtist.textContent = track["ARTISTAS"] || '';

  player.classList.remove('hidden');
  playPauseBtn.textContent = '⏸';
}

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = '⏸';
  } else {
    audio.pause();
    playPauseBtn.textContent = '▶';
  }
});

audio.addEventListener('timeupdate', () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;

  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60)
    .toString()
    .padStart(2, '0');

  time.textContent = `${minutes}:${seconds}`;
});

progress.addEventListener('input', () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});
