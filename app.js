const tracksContainer = document.getElementById("tracks");
const audio = document.getElementById("audio");

const player = document.getElementById("player");
const playerImg = document.getElementById("player-img");
const playerTitle = document.getElementById("player-title");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playPause = document.getElementById("playPause");
const back10 = document.getElementById("back10");
const forward10 = document.getElementById("forward10");

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(track => {

      const div = document.createElement("div");
      div.className = "track";

      div.innerHTML = `
        <img src="${track.image || ''}">
        <button class="play-btn">▶</button>

        <div class="track-info">
          <div class="track-title">${track.titulo || ''}</div>

          <div class="badges">
            <span class="badge ${track.interesColor || ''}">${track.interes || ''}</span>
            <span class="badge ${track.escuchaColor || ''}">${track.escucha || ''}</span>
            <span class="badge ${track.estadoColor || ''}">${track.estado || ''}</span>
          </div>

          <div class="track-meta">
            <strong>ARTISTAS:</strong> ${track.artistas || '—'}<br>
            <strong>ÁLBUM:</strong> ${track.album || '—'}<br>
            <strong>AÑO:</strong> ${track.año || '—'} ·
            <strong>DURACIÓN:</strong> ${track.duracion || '—'}
          </div>

          <div class="context-box">
            <div class="context-title">CONTEXTO</div>
            ${track.contexto || '—'}
          </div>

          <div class="note-box">
            <strong>NOTA:</strong> ${track.nota || '—'}
          </div>
        </div>
      `;

      div.querySelector(".play-btn").onclick = () => {
        audio.src = track.audio;
        audio.play();
        player.classList.remove("hidden");
        playerImg.src = track.image;
        playerTitle.textContent = track.titulo;
        playPause.textContent = "⏸";
      };

      tracksContainer.appendChild(div);
    });
  });

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => {
  audio.volume = volume.value;
};

playPause.onclick = () => {
  if (audio.paused) {
    audio.play();
    playPause.textContent = "⏸";
  } else {
    audio.pause();
    playPause.textContent = "▶";
  }
};

back10.onclick = () => audio.currentTime -= 10;
forward10.onclick = () => audio.currentTime += 10;
