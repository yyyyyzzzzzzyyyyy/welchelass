const tracksContainer = document.getElementById("tracks");
const audio = document.getElementById("audio");

const player = document.getElementById("player");
const playerImg = document.getElementById("player-img");
const playerTitle = document.getElementById("player-title");
const playPauseBtn = document.getElementById("playPause");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const back10 = document.getElementById("back10");
const forward10 = document.getElementById("forward10");

let isPlaying = false;

function driveToDirect(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([^/]+)/);
  return match
    ? `https://drive.google.com/uc?export=download&id=${match[1]}`
    : "";
}

fetch("data.json")
  .then(r => r.json())
  .then(data => {
    data.forEach(track => {

      const img = driveToDirect(track["ENLACE IMAGEN"]);
      const song = driveToDirect(track["ENLACE CANCIÓN"]);

      const div = document.createElement("div");
      div.className = "track";

      div.innerHTML = `
        <img src="${img}">
        <div>
          <div class="track-title">${track["TÍTULO"]}</div>
          <div class="context-box">${track["CONTEXTO"] || ""}</div>
        </div>
        <button class="play-btn">▶</button>
      `;

      div.querySelector(".play-btn").onclick = () => {
        audio.src = song;
        playerImg.src = img;
        playerTitle.textContent = track["TÍTULO"];
        player.classList.remove("hidden");
        audio.play();
        playPauseBtn.textContent = "⏸";
        isPlaying = true;
      };

      tracksContainer.appendChild(div);
    });
  });

playPauseBtn.onclick = () => {
  if (!audio.src) return;
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶";
  } else {
    audio.play();
    playPauseBtn.textContent = "⏸";
  }
  isPlaying = !isPlaying;
};

audio.ontimeupdate = () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
};

progress.oninput = () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => audio.volume = volume.value;
back10.onclick = () => audio.currentTime -= 10;
forward10.onclick = () => audio.currentTime += 10;
