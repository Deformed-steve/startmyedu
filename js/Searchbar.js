const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const searchbar = document.getElementById('searchbar');

// added this since it seems on phones it lags a LOT
if (isMobile) {
  searchbar.remove();
}

searchbar.addEventListener('input', function() {
  const searchtext = this.value.toLowerCase();
  const mediaElements = document.querySelectorAll('.media-element');

  if (searchtext === '') {
    mediaElements.forEach(element => {
      element.classList.remove('hidden');
    });
    return;
  }

  mediaElements.forEach(element => {
    const overlay = element.querySelector('.text-overlay');
    const tcontent = overlay ? overlay.textContent.toLowerCase() : '';

    if (tcontent.includes(searchtext)) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  });
});