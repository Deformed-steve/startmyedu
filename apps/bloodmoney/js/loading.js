(function() {
  'use strict';

  let loadingProgress = 0;
  const progressBar = document.getElementById('loadingProgressBar');

  // Simulate loading progress
  function updateProgress() {
    loadingProgress += Math.random() * 15;
    if (loadingProgress > 100) loadingProgress = 100;

    if (progressBar) {
      progressBar.style.width = loadingProgress + '%';
    }

    if (loadingProgress < 100) {
      setTimeout(updateProgress, 100 + Math.random() * 200);
    }
  }

  // Hide loading screen
  function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 1000);
    }
  }

  // Check if game is ready
  function checkGameReady() {
    if (typeof SceneManager !== 'undefined' && SceneManager._scene && SceneManager._scene.isReady && SceneManager._scene.isReady()) {
      loadingProgress = 100;
      if (progressBar) {
        progressBar.style.width = '100%';
      }
      setTimeout(hideLoadingScreen, 500);
    } else {
      setTimeout(checkGameReady, 100);
    }
  }

  // Start loading simulation
  document.addEventListener('DOMContentLoaded', function() {
    updateProgress();

    // Wait for game to initialize
    if (typeof SceneManager !== 'undefined') {
      checkGameReady();
    } else {
      // Fallback: wait for main.js to load
      const checkMain = setInterval(() => {
        if (typeof SceneManager !== 'undefined') {
          clearInterval(checkMain);
          checkGameReady();
        }
      }, 100);
    }
  });

  // Fallback: hide after maximum time
  setTimeout(() => {
    hideLoadingScreen();
  }, 10000);
})();