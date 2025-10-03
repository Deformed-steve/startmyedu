fetch('data/games.json')
  .then(response => response.json())
  .then(data => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    data.sort((a, b) => {
      const aIsFavorite = favorites.includes(a.id);
      const bIsFavorite = favorites.includes(b.id);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });

    const newgames = document.getElementById('NEWRELEASES');
    if (newgames) {
      const somegames = data.slice(0, 8);
      const ul = document.createElement('ul');
      ul.classList.add('new-releases-list');

      somegames.forEach(game => {
        const li = document.createElement('li');
        li.textContent = game.name;
        ul.appendChild(li);
      });

      newgames.appendChild(ul);
    }

    // Heres a funny little var to hold our media scroller thingy
    const divElement = document.getElementsByClassName('media-scroller snaps-inline')[0];

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, {
      rootMargin: "0px 0px 200px 0px"
    });

    data.forEach(game => {
      const newDiv = document.createElement('div');
      newDiv.classList.add('media-element');
      newDiv.onclick = function() {
        Hide(); // Hiding stuff
      };

      // Here comes the messy part! yippe

      const newLink = document.createElement('a');
      newLink.id = game.id;
      newLink.style.float = 'left';
      newLink.target = '_blank';
      newLink.classList.add('media-element');

      // You got pictures!
      /*const newImg = document.createElement('img');
      newImg.src = game.image;
      newImg.setAttribute('decoding', 'async');*/

      // You got pictures! but lazy!
      const newImg = document.createElement('img');
      newImg.dataset.src = game.image;
      newImg.src = 'appicon/placeholder.png'; // To make sure the image doesnt like fuckup the layout
      newImg.classList.add('lazy-load', 'placeholder');
      newImg.setAttribute("id", "pleaseworkdude");
      newImg.setAttribute('decoding', 'async');

      observer.observe(newImg);

      const underText = document.createElement('a');
      underText.classList.add('text-overlay');
      underText.textContent = game.name;

      const filledstar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gold" width="24" height="24"> <path d="M12 2l3.09 6.26L22 9.27l-5.45 5.32L17.91 22 12 18.27 6.09 22l1.36-7.41L2 9.27l6.91-1.01z"/> </svg>`;
      const hollowstar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="gold" stroke-width="2" width="24" height="24"> <path d="M12 2l3.09 6.26L22 9.27l-5.45 5.32L17.91 22 12 18.27 6.09 22l1.36-7.41L2 9.27l6.91-1.01z"/> </svg>`;


      const favoriteStar = document.createElement('div');
      favoriteStar.classList.add('favorite-star');
      favoriteStar.innerHTML = favorites.includes(game.id) ? filledstar : hollowstar;

      if (favorites.includes(game.id)) {
        favoriteStar.classList.add('favorited');
      } else {
        favoriteStar.classList.remove('favorited');
      }

      // Add click handler for favorite toggle
      favoriteStar.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        // Get current favorites properly
        let curfavorites = JSON.parse(localStorage.getItem('favorites')) || [];

        const index = curfavorites.indexOf(game.id);

        if (index === -1) {
          // Add to favorites
          curfavorites.push(game.id);
          favoriteStar.innerHTML = filledstar;
          favoriteStar.classList.add('favorited');
        } else {
          // Remove from favorites
          curfavorites.splice(index, 1);
          favoriteStar.innerHTML = hollowstar;
          favoriteStar.classList.remove('favorited');
        }

        // Save to settings
        localStorage.setItem('favorites', JSON.stringify(curfavorites));

        // Update the sort - use the updated curfavorites, not the old favorites
        const mediaScroller = document.getElementsByClassName('media-scroller snaps-inline')[0];
        const gameElements = Array.from(mediaScroller.children);

        gameElements.sort((a, b) => {
          const aId = a.querySelector('a').id;
          const bId = b.querySelector('a').id;
          const aIsFavorite = curfavorites.includes(aId);
          const bIsFavorite = curfavorites.includes(bId);

          if (aIsFavorite && !bIsFavorite) return -1;
          if (!aIsFavorite && bIsFavorite) return 1;
          return 0;
        });

        // Reappend in new order
        gameElements.forEach(el => mediaScroller.appendChild(el));
      });

      // Adding everything together...
      newLink.appendChild(newImg);
      newLink.appendChild(underText);
      newLink.appendChild(favoriteStar)
      newDiv.appendChild(newLink);

      newLink.style.position = 'relative';

      // Ngl GPT helped a bit for this part, i was lazy but idc
      if (game.offline && game.cost) {
        addshop(game.name, game.cost, game.image, game.offline, game.id)


        /*
        OLD SHOP... well buy button cuz well now we have a shop
        const buyButton = document.createElement('button');
        buyButton.id = 'buygamebutton';

        const userCoins = parseInt(localStorage.getItem('monie'));
        const hasPurchased = localStorage.getItem(`bought_${game.id}`);

        if (!hasPurchased) {
            buyButton.textContent = `Buy Offline Download (${game.cost} Coins)`;
            buyButton.addEventListener('click', function (e) {
                e.stopPropagation();

                if (!isNaN(userCoins) && userCoins >= game.cost) {
                    localStorage.setItem('monie', userCoins - game.cost);
                    localStorage.setItem(`bought_${game.id}`, true);
                    buyButton.innerHTML = `<progress />`; // I'll add a better progress bar later lol
                    downloadFile(game.offline, game.id + '.html');
                    confetti();
                } else {
                    popupAlert(`Insufficient coins! You have ${userCoins}`, 0, 0, 0);
                }
            });
        } else {
            buyButton.textContent = '(Owned) Redownload?';
            buyButton.addEventListener('click', function (e) {
                confetti();
                e.stopPropagation();
                downloadFile(game.offline, game.id + '.html');
                buyButton.innerHTML = `<progress />`; // I'll add a better progress bar later lol
            });
        }

        newDiv.appendChild(buyButton);*/

      }

      if (game.mobile) {
        const mobileButton = document.createElement('button');
        // mobileButton.id = 'mobiledownloadbutton'; ill add a seperate id later
        mobileButton.id = 'buygamebutton';
        mobileButton.setAttribute("onclick", game.mobile);

        mobileButton.textContent = 'Download Mobile Version (Apple only)';
        mobileButton.addEventListener('click', function(e) {
          e.stopPropagation();
          mobileButton.innerHTML = `<progress />`; // I'll add a better progress bar later lol
        });

        newDiv.appendChild(mobileButton);
      }

      // BAM!
      divElement.appendChild(newDiv);

      // Now we gotta make that click do the funni...
      newLink.addEventListener('click', function(e) {
        e.preventDefault();

        var ntab = localStorage.getItem('NTAB');

        if (ntab === 'true' && game.src !== undefined) {
          if (game.src.includes('https://')) {
            var newTab = window.open('about:blank', '_blank');
            newTab.document.write(`
                            <link rel="stylesheet" href="https://${window.location.hostname}/styles/AlertOnly.scss">
                            <div id="keycode" class="keycode">Client ID:</div>
                            <div id="iframeHolder"><iframe name="gameframe" id="iframe" src="${game.src}" allow="geolocation; camera; clipboard-read; clipboard-write" style="position: fixed; z-index: 9; top: 0px; left: 0px; bottom: 0px; right: 0px; width: 100%; height: 100%; border: none; margin: 0; padding: 0;"></iframe></div>
                            <script src="js/Popup.js"></script>
                            <script src="js/confetti.browser.min.js"></script>
                            <script>
                                window.addEventListener("beforeunload", function (e) {
                                    if (localStorage.getItem("Ctrl") == "true") {
                                        e.preventDefault();
                                        e.returnValue = "";
                                    }
                                });
                            </script>
                        `);
            newTab.document.close();
            Hide();
          } else {
            var newTab = window.open('about:blank', '_blank');
            newTab.document.write(`
                            <link rel="stylesheet" href="https://${window.location.hostname}/styles/AlertOnly.scss">
                            <div id="keycode" class="keycode">Client ID:</div>
                            <div id="iframeHolder"><iframe name="gameframe" id="iframe" src="https://${window.location.hostname}/${game.src}" allow="geolocation; camera; clipboard-read; clipboard-write" style="position: fixed; z-index: 9; top: 0px; left: 0px; bottom: 0px; right: 0px; width: 100%; height: 100%; border: none; margin: 0; padding: 0;"></iframe></div>
                            <script src="js/Popup.js"></script>
                            <script src="js/confetti.browser.min.js"></script>
                            <script>
                                window.addEventListener("beforeunload", function (e) {
                                    if (localStorage.getItem("Ctrl") == "true") {
                                        e.preventDefault();
                                        e.returnValue = "";
                                    }
                                });
                            </script>
                        `);
            newTab.document.close();
            Hide();
          }
        } else {
          if (!document.getElementById('iframe') && game.src !== undefined) {
            try {
              if (window.top.location.href === "about:blank" && game.src.includes('https://')) {
                //popupAlert('"i love water" method may not work with 3rd party links.. opening', 0, 0);
                console.log('"i love water" method may not work with 3rd party links.. opening');
              }
            } catch (e) {
              console.log('"i love water" method may not work with 3rd party links.. opening');
              //popupAlert('"i love water" method may not work with 3rd party links.. opening', 0, 0);
            }
            document.getElementById('iframeHolder').innerHTML = `<iframe name="gameframe" id="iframe" src="${game.src}"></iframe>`;

            const iframe = document.getElementById('iframe');

            iframe.onload = () => {
              try {
                const iframeWindow = iframe.contentWindow;
                iframeWindow.addEventListener("beforeunload", function(e) {
                  if (localStorage.getItem("Ctrl") == "true") {
                    e.preventDefault();
                    e.returnValue = "";
                  }
                });
              } catch (err) {
                console.warn("Couldn't inject beforeunload into iframe (likely cross-origin)", err);
              }
            };
          } else {
            popupAlert('Error Code: ' + game.src + '\nGame ID: ' + game.id, 0, 0, 0);
            Hide();
          }
        }
      });
    });
  })
  .catch(error => popupAlert('Error: ' + error, 0, 0, 0)); // Fuck you

const downloadFile = (path, filename) => {
  const anchor = document.createElement('a');
  anchor.href = path;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

function addshop(title, coins, image, offline, id) {
  const userCoins = parseInt(localStorage.getItem('monie')) || 0;
  const hasPurchased = localStorage.getItem(`bought_${id}`) === "true";

  const card = document.createElement("div");
  card.className = "card";

  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = title;
    card.appendChild(img);
  }

  const titleElem = document.createElement("div");
  titleElem.className = "card-title";
  titleElem.textContent = `${title}`;
  card.appendChild(titleElem);

  const button = document.createElement("button");
  button.className = "download-btn";

  if (!hasPurchased) {
    button.textContent = `Buy Offline Download (${coins} Coins)`;
    button.addEventListener('click', function(e) {
      e.stopPropagation();

      if (!isNaN(userCoins) && userCoins >= coins) {
        localStorage.setItem('monie', userCoins - coins);
        localStorage.setItem(`bought_${id}`, "true");
        button.innerHTML = `<progress />`;
        downloadFile(offline, `${id}.html`);
        confetti();
      } else {
        popupAlert(`Insufficient coins! You have ${userCoins}`, 0, 0, 0);
      }
    });
  } else {
    button.textContent = "(Owned) Redownload?";
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      button.innerHTML = `<progress />`;
      downloadFile(offline, `${id}.html`);
      confetti();
    });
  }

  card.appendChild(button);

  const gridContainer = document.getElementById("GAMELIST");
  if (gridContainer) {
    console.log("Adding card to .shop .grid:", title);
    gridContainer.appendChild(card);
  } else {
    console.warn("No .shop .grid container found to add the game card.");
  }
}



// Now the rest of the old loader. its messy lol

//the start of all the code lol -Snubby

var spanish;
//Had to import because it would say 'not defined' 
//like shut your dumbass up

function checkBanned(callback) {
  const dbName = 'ban-system';
  const dbVersion = 1;

  const request = indexedDB.open(dbName, dbVersion);

  request.onerror = function(event) {
    const store = db.createObjectStore('settings', {
      keyPath: 'key'
    });
    store.createIndex('key', 'key', {
      unique: true
    });
    console.log("Created System.")
    console.error('Database error:', event.target.error);
  };

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');

    const request = store.get('banned');

    request.onsuccess = function(event) {
      const banned = event.target.result;
      if (banned) {
        callback(banned.value === 'true');
      } else {
        callback(false);
      }
    };
  };
}

if (spanish == 'true') { // spanish stuff
  $(function() {
    $('#profile').click(function() {
      if (!$('#iframe').length) {
        $('#iframeHolder').html('<iframe name="gameframe" id="iframe" src="/profilia.html" </iframe>');
      }
    });
  });
} else {
  $(function() {
    $('#profile').click(function() {
      if (!$('#iframe').length) {
        $('#iframeHolder').html('<iframe name="gameframe" id="iframe" src="/profile.html" </iframe>');
      }
    });
  });
}

if (spanish == 'true') { //About me spanish stuff
  $(function() {
    $('#aboutme').click(function() {
      if (!$('#iframe').length) {
        $('#iframeHolder').html('<iframe name="gameframe" id="iframe" src="aboutmeES.html" </iframe>');
      }
    });
  });
} else {
  $(function() {
    $('#aboutme').click(function() {
      if (!$('#iframe').length) {
        $('#iframeHolder').html('<iframe name="gameframe" id="iframe" src="aboutme.html" </iframe>');
      }
    });
  });
}

$(function() {
  const mainproxy = "https://browse." + window.location.hostname.split(".").slice(-2).join(".") + "/";


  var links = [
    mainproxy,
    "https://nebulaservices.org/",
    "https://radon.games/proxy",
    "https://mynewcharaterhesachillguythatdontgaf.familyguy.in/",
    "https://open-discord-popup.netlify.app/"
  ];

  var linkNames = [
    "Snub Proxy",
    "Radon Proxy",
    "Nebula Proxy",
    "Rammerhead Proxy",
    "Discord Popout (Payment Request API)",
  ];

  function loadLink(index) {
    if (index === 999) {
      buypass();
    } else {
      var link = links[index];
      try {
        if (window.top.location.href) {
          if (!$('#iframe').length) {
            $('#iframeHolder').html('<iframe allowfullscreen allow="camera; microphone; payment"  style="position: fixed; z-index: 9; top: 0px; left: 0px; bottom: 0px; right: 0px; width: 100%; height: 100%; border: none; margin: 0; padding: 0;" sandbox="allow-pointer-lock allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads" name="gameframe" id="iframe" src="' + link + '"></iframe>');
          }
        }
      } catch (e) {
        popupAlert('"i love water" method detected! Opening link in AB', 0, 0);

        var abwindow = window.open('about:blank', '_blank');

        abwindow.document.write('<iframe allowfullscreen allow="payment" style="position: fixed; z-index: 9; top: 0px; left: 0px; bottom: 0px; right: 0px; width: 100%; height: 100%; border: none; margin: 0; padding: 0;" sandbox="allow-pointer-lock allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads" name="gameframe" id="iframe" src="' + link + '" style="width:100%;height:100%;border:none;"></iframe>');
        abwindow.document.close();
        Hide();
      }
    }
  }

  $('#webun').click(function() {
    var optionsText = linkNames.map((name, index) => `${index + 1}. ${name}`).join("\n");
    var linkIndex = prompt("Type the number corresponding to proxy:\n\n" + optionsText);
    if (linkIndex !== null && !isNaN(linkIndex) && linkIndex >= 1 && linkIndex <= links.length) {
      loadLink(linkIndex - 1);
    } else {
      loadLink(0);
    }
  });
});

function buypass() {
  if (!window.PaymentRequest) return alert("It cannot be used because it does not support Payment Request API");

  new PaymentRequest([{
    supportedMethods: location.origin + "/payment-manifest.json",
    data: {
      url: document.querySelector("input").value
    },
  }, ], {
    total: {
      label: "_",
      amount: {
        value: "1",
        currency: "USD"
      },
    },
  }).show();
}

if ('serviceWorker' in navigator && window.PaymentRequest) {
  navigator.serviceWorker.register('service-worker.js').then(() => {
    navigator.serviceWorker.addEventListener("message", event => {

    });
  });

  self.addEventListener("canmakepayment", (e) => e.respondWith(true));

  self.addEventListener("paymentrequest", async (event) => {

    event.respondWith(new Promise(async (resolve, reject) => {
      try {
        const client = await event.openWindow("./navigate.html");

        if (!client) return reject("Failed to open window.");

        /**
         * @type { string }
         */
        const url = event.methodData[0].data?.url;

        client.postMessage({
          url: url.match(/https?:\/\//) ? url : "https://google.com/"
        });

      } catch (error) {
        reject(error);
      }
    }));
  });
}




$(function() {
  $('#ohno').click(function() {
    if (!$('#iframe').length) {
      $('#iframeHolder').html('<iframe sandbox="allow-pointer-lock allow-scripts allow-popups allow-forms allow-same-origin allow-popups-to-escape-sandbox allow-downloads" name="gameframe" id="iframe" src="enterprise/" </iframe>');
    }
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key == '`') window.open(this.localStorage.getItem('website'), '_blank', );
}, false);

if (localStorage.getItem('website') == null) localStorage.setItem('website', 'https://classroom.google.com/'); //Allows to go to google classroom with a click of a button you losers

localStorage.setItem('loggedin', 'true');

window.onload = $(function() { ///"ads"
  console.log("\nInterested in working with us?\nSee https://startmyeducation.net/careers\n\n");
});

// Verify

checkBanned(function(isBanned) {
  if (isBanned) {
    console.log('BANNED HAHA LLLLLLL');
    alert('Yo. Seems you are banned, means that you did something bad sooo sucks to suck!')
    document.body.innerHTML = '';
    window.stop();
    window.open("banned", "_self");
  } else {
    // Do something if user is not banned
    console.log('User is not banned');
  }
});

$(function() {
  var lelz = parseInt(localStorage.getItem('lelz'), 10),
    loaded_numb = lelz ? lelz + 1 : 1;
  localStorage.setItem('lelz', loaded_numb);

  $('#gamer').html('<p>Times went on website ' + loaded_numb + ' (locally)');
});



// ============== COMMUNITY MODE ========================

const CommunityFile = (path, filename) => {
  fetch(path)
    .then(response => response.blob())
    .then(blob => {
      const anchor = document.createElement('a');
      const url = URL.createObjectURL(blob);
      anchor.href = url;
      anchor.download = filename || path.split('/').pop();
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('trying proxy after this:', error);
      const proxiedUrl = `/wsocket/imgprox?url=${encodeURIComponent(path)}`;
      fetch(proxiedUrl)
        .then(response => response.blob())
        .then(blob => {
          const anchor = document.createElement('a');
          const url = URL.createObjectURL(blob);
          anchor.href = url;
          anchor.download = filename || path.split('/').pop();
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(url);
        })
        .catch(fallbackError => {
          console.error('even proxy didnt work, loser:', fallbackError);
        });
    });
};

let CommunityModeCheck = localStorage.getItem('CommunityMode');
let CommunityModeLinkGrab = localStorage.getItem('CommunityLink');
let SourceFetch;

if (CommunityModeLinkGrab && CommunityModeLinkGrab.includes('proxy:')) {
  let cleanLink = CommunityModeLinkGrab.replace('proxy:', '');
  SourceFetch = `/wsocket/imgprox?url=${encodeURIComponent(cleanLink)}`;
} else {
  SourceFetch = CommunityModeLinkGrab;
}

if (CommunityModeCheck === 'true' && SourceFetch) {
  fetch(SourceFetch)
    .then(response => response.json())
    .then(data => {
      const authorName = data[0];
      const authorElement = document.getElementById('author-display');
      authorElement.innerText = 'Current Source: ' + authorName;
      // Heres a funny little var to hold our media scroller thingy
      const divElement = document.getElementsByClassName('media-scroller snaps-inline')[0];

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            obs.unobserve(img);
          }
        });
      }, {
        rootMargin: "0px 0px 200px 0px"
      });

      data.slice(1).forEach(game => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('media-element');
        newDiv.onclick = function() {
          Hide(); // Hiding stuff
        };

        // Here comes the messy part! yippe

        const newLink = document.createElement('a');
        newLink.id = game.id;
        newLink.style.float = 'left';
        newLink.target = '_blank';
        newLink.classList.add('media-element');

        // You got pictures!
        /*const newImg = document.createElement('img');
        newImg.src = game.image;
        newImg.setAttribute('decoding', 'async');*/

        // You got pictures! but lazy!
        const newImg = document.createElement('img');
        newImg.dataset.src = game.image;
        newImg.src = 'appicon/placeholder.png'; // To make sure the image doesnt like fuckup the layout
        newImg.classList.add('lazy-load', 'placeholder');
        newImg.setAttribute("id", "pleaseworkdude");
        newImg.setAttribute('decoding', 'async');

        observer.observe(newImg);

        const underText = document.createElement('a');
        underText.classList.add('text-overlay');
        underText.textContent = game.name;

        // Adding everything together...
        newLink.appendChild(newImg);
        newLink.appendChild(underText);
        newDiv.appendChild(newLink);

        // Ngl GPT helped a bit for this part, i was lazy but idc
        if (game.offline && game.cost) {
          const buyButton = document.createElement('button');
          buyButton.id = 'buygamebutton';

          const userCoins = parseInt(localStorage.getItem('monie'));
          const hasPurchased = localStorage.getItem(`bought_${game.id}`);

          if (!hasPurchased) {
            buyButton.textContent = `Buy Offline Download (${game.cost} Coins)`;
            buyButton.addEventListener('click', function(e) {
              e.stopPropagation();

              if (!isNaN(userCoins) && userCoins >= game.cost) {
                localStorage.setItem('monie', userCoins - game.cost);
                localStorage.setItem(`bought_${game.id}`, true);
                buyButton.innerHTML = `<progress />`; // I'll add a better progress bar later lol
                CommunityFile(game.offline, game.id + '.html');
                confetti();
              } else {
                popupAlert(`Insufficient coins! You have ${userCoins}`, 0, 0, 0);
              }
            });
          } else {
            buyButton.textContent = '(Owned) Redownload?';
            buyButton.addEventListener('click', function(e) {
              confetti();
              e.stopPropagation();
              CommunityFile(game.offline, game.id + '.html');
              buyButton.innerHTML = `<progress />`; // I'll add a better progress bar later lol
            });
          }

          newDiv.appendChild(buyButton);
        }

        if (game.js) {
          const jsButton = document.createElement('button');
          jsButton.id = 'buygamebutton';
          jsButton.setAttribute("onclick", game.js);
          jsButton.textContent = game.js_button;
          jsButton.addEventListener('click', function(e) {
            e.stopPropagation();
          });
          newDiv.appendChild(jsButton);
        }

        // BAM!
        divElement.insertBefore(newDiv, divElement.firstChild);

        // Now we gotta make that click do the funni...
        newLink.addEventListener('click', function(e) {
          e.preventDefault();

          var ntab = localStorage.getItem('NTAB');

          if (ntab === 'true' && game.src !== undefined) {
            if (game.src.includes('im too lazy to fix this rn')) {
              var newTab = window.open('about:blank', '_blank');
              newTab.document.write(`
                            <link rel="stylesheet" href="https://${window.location.hostname}/styles/AlertOnly.scss">
                            <div id="keycode" class="keycode">Client ID:</div>
                            <iframe name="gameframe" id="iframe" src="${game.src}" style="position: fixed; z-index: 9; top: 0px; left: 0px; bottom: 0px; right: 0px; width: 100%; height: 100%; border: none; margin: 0; padding: 0;"></iframe>
                            <script src="js/Popup.js"></script>
                            <script src="js/confetti.browser.min.js"></script>
                        `);
              newTab.document.close();
              Hide();
            } else {
              var newTab = window.open('about:blank', '_blank');
              newTab.document.write(`
                            <link rel="stylesheet" href="https://${window.location.hostname}/styles/AlertOnly.scss">
                            <div id="keycode" class="keycode">Client ID:</div>
                            <iframe name="gameframe" id="iframe" src="${game.src}" style="position: fixed; z-index: 9; top: 0px; left: 0px; bottom: 0px; right: 0px; width: 100%; height: 100%; border: none; margin: 0; padding: 0;"></iframe>
                            <script src="js/Popup.js"></script>
                            <script src="js/confetti.browser.min.js"></script>
                        `);
              newTab.document.close();
              Hide();
            }
          } else {
            if (!document.getElementById('iframe') && game.src !== undefined) {
              try {
                if (window.top.location.href === "about:blank" && game.src.includes('https://')) {
                  //popupAlert('"i love water" method may not work with 3rd party links.. opening', 0, 0);
                  console.log('"i love water" method may not work with 3rd party links.. opening');
                }
              } catch (e) {
                console.log('"i love water" method may not work with 3rd party links.. opening');
                //popupAlert('"i love water" method may not work with 3rd party links.. opening', 0, 0);
              }
              document.getElementById('iframeHolder').innerHTML = `<iframe name="gameframe" id="iframe" src="${game.src}"></iframe>`;
            } else {
              popupAlert('Error Code: ' + game.src + '\nGame ID: ' + game.id, 0, 0, 0);
              Hide();
            }
          }
        });
      });
    })
    .catch(error => popupAlert('Community source error? Maybe try using "proxy:"?', 0, 0, 0)); // Fuck you
}