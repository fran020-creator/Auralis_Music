// MÚSICAS REAIS - Biblioteca Auralis
const musicLibrary = [
    {
      id: 1,
      name: "On & On",
      artist: "Cartoon & Jéja ft. Daniel Levi",
      emoji: "🎵",
      url: "./music/Cartoon, Jéja - On & On (feat. Daniel Levi) _ Electronic Pop _ NCS - Copyright Free Music [K4DyBUG242c].mp3",
      cover: "🎵",
      duration: "3:24"
    },
    {
      id: 2,
      name: "Invincible",
      artist: "DEAF KEV",
      emoji: "⚡",
      url: "./music/DEAF KEV - Invincible _ Glitch Hop _ NCS - Copyright Free Music [J2X5mJ3HDYE].mp3",
      cover: "⚡",
      duration: "4:15"
    },
    {
      id: 3,
      name: "My Heart",
      artist: "Different Heaven & EH_DE",
      emoji: "❤️",
      url: "./music/Different Heaven & EH_DE - My Heart _ Drumstep _ NCS - Copyright Free Music [jK2aIUmmdP4].mp3",
      cover: "❤️",
      duration: "3:50"
    },
    {
      id: 4,
      name: "Blank",
      artist: "Disfigure",
      emoji: "🎧",
      url: "./music/Disfigure - Blank _ Melodic Dubstep _ NCS - Copyright Free Music [p7ZsBPK656s].mp3",
      cover: "🎧",
      duration: "4:08"
    },
    {
      id: 5,
      name: "Sky High",
      artist: "Elektronomia",
      emoji: "🌤️",
      url: "./music/Elektronomia - Sky High _ Progressive House _ NCS - Copyright Free Music [TW9d8vYrVFQ].mp3",
      cover: "🌤️",
      duration: "4:03"
    },
    {
      id: 6,
      name: "Heroes Tonight",
      artist: "Janji ft. Johnning",
      emoji: "🦸",
      url: "./music/Janji - Heroes Tonight (feat. Johnning) _ Progressive House _ NCS - Copyright Free Music [3nQNiWdeH2Q].mp3",
      cover: "🦸",
      duration: "3:28"
    },
    {
      id: 7,
      name: "Mortals",
      artist: "Warriyo ft. Laura Brehm",
      emoji: "🎹",
      url: "./music/Warriyo - Mortals (feat. Laura Brehm) _ Future Trap _ NCS - Copyright Free Music [yJg-Y5byMMw].mp3",
      cover: "🎹",
      duration: "3:42"
    },
    {
      id: 8,
      name: "Melodia Tranquila",
      artist: "Free Music",
      emoji: "🎸",
      url: "./music/song1.mp3",
      cover: "🎸",
      duration: "3:00"
    }
  ];
  
  // ... (resto do código permanece igual)
  
  let currentTrack = null;
  let audioPlayer = null;
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;
  let currentTrackIndex = 0;
  let favoriteSongs = JSON.parse(localStorage.getItem('favoriteSongs')) || [];
  let currentPage = 'home';
  
  // Inicializar
  document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = document.getElementById('audioPlayer');
    renderSongs();
    setupEventListeners();
    setupNavigation();
    renderFavoriteSongs();
  });
  
  // Renderizar lista de músicas
  function renderSongs() {
    const container = document.getElementById('songsList');
    if (!container) return;
    
    container.innerHTML = '';
  
    musicLibrary.forEach((song, index) => {
      const isFav = isFavorite(song.id);
      const songItem = document.createElement('div');
      songItem.className = 'song-item';
      songItem.innerHTML = `
        <div class="song-number">${index + 1}</div>
        <div class="song-cover">${song.cover}</div>
        <div class="song-info">
          <span class="song-name">${song.name}</span>
          <span class="song-artist">${song.artist}</span>
        </div>
        <div class="song-duration">${song.duration}</div>
        <button class="favorite-btn" onclick="toggleFavorite(${song.id})" title="${isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <button class="play-song-btn" onclick="playTrack(${song.id}, ${index})">
          ▶
        </button>
      `;
      container.appendChild(songItem);
    });
  
    // Renderizar estações de rádio
    renderRadioStations();
  }
  
  function renderRadioStations() {
    const container = document.getElementById('radioStations');
    container.innerHTML = '';
  
    musicLibrary.forEach(song => {
      const station = document.createElement('div');
      station.className = 'radio-station';
      station.innerHTML = `
        <div class="station-icon">${song.cover}</div>
        <div class="station-info">
          <h3>${song.artist}</h3>
          <p>Em reprodução: ${song.name}</p>
        </div>
        <button class="play-station-btn" onclick="playTrack(${song.id})">▶</button>
      `;
      container.appendChild(station);
    });
  }
  
  // Reproduzir música
  function playTrack(trackId, index = null) {
    currentTrackIndex = index !== null ? index : musicLibrary.findIndex(t => t.id === trackId);
    currentTrack = musicLibrary[currentTrackIndex];
    
    // Atualizar UI
    updateTrackInfo();
    
    // Configurar áudio
    audioPlayer.src = currentTrack.url;
    audioPlayer.play();
    isPlaying = true;
    updatePlayButton();
    
    // Atualizar progresso
    setupProgressBar();
  }
  
  function updateTrackInfo() {
    document.getElementById('trackCover').textContent = currentTrack.cover;
    document.getElementById('trackName').textContent = currentTrack.name;
    document.getElementById('artistName').textContent = currentTrack.artist;
    document.getElementById('totalTime').textContent = currentTrack.duration;
  }
  
  function setupProgressBar() {
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', () => {
      document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
    });
    
    audioPlayer.addEventListener('ended', () => {
      if (isRepeat) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
      } else {
        playNext();
      }
    });
  }
  
  function updateProgress() {
    if (audioPlayer.duration) {
      const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      document.getElementById('progress').style.width = progress + '%';
      document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
    }
  }
  
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  function setupEventListeners() {
    // Play/Pause
    document.querySelector('.play-btn').addEventListener('click', togglePlay);
    
    // Anterior/Próxima
    document.querySelector('.prev-btn').addEventListener('click', playPrevious);
    document.querySelector('.next-btn').addEventListener('click', playNext);
    
    // Shuffle
    document.querySelector('.shuffle-btn').addEventListener('click', () => {
      isShuffle = !isShuffle;
      document.querySelector('.shuffle-btn').style.opacity = isShuffle ? '1' : '0.6';
    });
    
    // Repeat
    document.querySelector('.repeat-btn').addEventListener('click', () => {
      isRepeat = !isRepeat;
      document.querySelector('.repeat-btn').style.opacity = isRepeat ? '1' : '0.6';
    });
    
    // Volume
    const volumeRange = document.getElementById('volumeRange');
    volumeRange.addEventListener('input', (e) => {
      audioPlayer.volume = e.target.value / 100;
    });
    
    // Progress bar click
    document.getElementById('progressBar').addEventListener('click', (e) => {
      const bar = e.currentTarget.querySelector('.bar');
      const rect = bar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioPlayer.currentTime = audioPlayer.duration * percent;
    });
  }

  // Navegação entre páginas
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = link.getAttribute('data-page');
        navigateToPage(pageName);
      });
    });

    // Busca em tempo real
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    }
  }

  function navigateToPage(pageName) {
    currentPage = pageName;
    
    // Atualizar links ativos
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageName) {
        link.classList.add('active');
      }
    });

    // Mostrar/esconder páginas
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    const activePage = document.getElementById(pageName + 'Page');
    if (activePage) {
      activePage.classList.add('active');
    }

    // Limpar busca se voltar ao início
    if (pageName === 'home') {
      renderSongs();
    }
  }

  // Função de busca
  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');
    const resultsTitle = document.getElementById('searchResultsTitle');

    if (searchTerm === '') {
      resultsContainer.innerHTML = '<div class="no-results"><div class="no-results-icon">🎵</div><p>Digite algo para buscar</p></div>';
      resultsTitle.textContent = 'Buscar Músicas';
      return;
    }

    const filteredSongs = musicLibrary.filter(song => 
      song.name.toLowerCase().includes(searchTerm) ||
      song.artist.toLowerCase().includes(searchTerm)
    );

    if (filteredSongs.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results"><div class="no-results-icon">🔍</div><p>Nenhum resultado encontrado</p></div>';
      resultsTitle.textContent = 'Nenhum resultado encontrado';
      return;
    }

    resultsTitle.textContent = `Resultados para "${searchTerm}" (${filteredSongs.length})`;
    resultsContainer.innerHTML = '';
    
    filteredSongs.forEach((song, index) => {
      const songIndex = musicLibrary.findIndex(s => s.id === song.id);
      const songItem = document.createElement('div');
      songItem.className = 'song-item';
      songItem.innerHTML = `
        <div class="song-number">${index + 1}</div>
        <div class="song-cover">${song.cover}</div>
        <div class="song-info">
          <span class="song-name">${song.name}</span>
          <span class="song-artist">${song.artist}</span>
        </div>
        <div class="song-duration">${song.duration}</div>
        <button class="play-song-btn" onclick="playTrack(${song.id}, ${songIndex})">
          ▶
        </button>
      `;
      resultsContainer.appendChild(songItem);
    });
  }

  // Renderizar músicas favoritas
  function renderFavoriteSongs() {
    const container = document.getElementById('librarySongs');
    if (!container) return;

    if (favoriteSongs.length === 0) {
      container.innerHTML = '<div class="no-results"><div class="no-results-icon">📚</div><p>Sua biblioteca está vazia</p><p style="font-size: 0.9rem; margin-top: 8px;">Adicione músicas aos favoritos clicando no botão ♥️</p></div>';
      return;
    }

    container.innerHTML = '';
    
    const favoriteMusicData = musicLibrary.filter(song => 
      favoriteSongs.includes(song.id)
    );

    favoriteMusicData.forEach((song, index) => {
      const songIndex = musicLibrary.findIndex(s => s.id === song.id);
      const songItem = document.createElement('div');
      songItem.className = 'song-item';
      songItem.innerHTML = `
        <div class="song-number">${index + 1}</div>
        <div class="song-cover">${song.cover}</div>
        <div class="song-info">
          <span class="song-name">${song.name}</span>
          <span class="song-artist">${song.artist}</span>
        </div>
        <div class="song-duration">${song.duration}</div>
        <button class="play-song-btn" onclick="playTrack(${song.id}, ${songIndex})">
          ▶
        </button>
      `;
      container.appendChild(songItem);
    });
  }

  // Adicionar/remover dos favoritos
  window.toggleFavorite = function(songId) {
    if (favoriteSongs.includes(songId)) {
      favoriteSongs = favoriteSongs.filter(id => id !== songId);
    } else {
      favoriteSongs.push(songId);
    }
    localStorage.setItem('favoriteSongs', JSON.stringify(favoriteSongs));
    renderFavoriteSongs();
    
    // Atualizar botão na página inicial se estiver visível
    if (currentPage === 'home') {
      renderSongs();
    }
  }

  function isFavorite(songId) {
    return favoriteSongs.includes(songId);
  }
  
  function togglePlay() {
    if (!currentTrack) {
      playTrack(musicLibrary[0].id, 0);
      return;
    }
    
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
    } else {
      audioPlayer.play();
      isPlaying = true;
    }
    updatePlayButton();
  }
  
  function updatePlayButton() {
    document.querySelector('.play-btn').textContent = isPlaying ? '⏸' : '▶';
  }
  
  function playNext() {
    if (!currentTrack) return;
    
    let nextIndex = isShuffle 
      ? Math.floor(Math.random() * musicLibrary.length)
      : (currentTrackIndex + 1) % musicLibrary.length;
    
    playTrack(musicLibrary[nextIndex].id, nextIndex);
  }
  
  function playPrevious() {
    if (!currentTrack) return;
    
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = musicLibrary.length - 1;
    
    playTrack(musicLibrary[prevIndex].id, prevIndex);
  }

  // Tornar funções globais para uso em onclick
  window.playTrack = playTrack;