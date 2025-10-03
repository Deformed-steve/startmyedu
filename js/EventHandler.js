const month = new Date().getMonth();
const day = new Date().getDate();
const dark = localStorage.getItem("dark");
const imagebg = localStorage.getItem('CustomBG');

if (month === 9) { // october
  console.log("spooky...");
  var boottitle = document.getElementsByClassName("t1");
  var profile = document.getElementById("eventchange");
  if (localStorage.getItem('perform_mode') === 'false') {
    boottitle[0].innerHTML = "SNUBTENDO</br>BUT SCARY";
  }
  profile.src = "appicon/holloween-pfp.png";
  document.getElementById('hide').insertAdjacentHTML('beforeend', `
        <div class="Sbuns" style="position: absolute; top: 0; left: 0; width: 100%; height: 120%; z-index: 9999; opacity: 0.2; pointer-events: none;">
            <img src="admin/nomod.png" style="pointer-events: none; width: 100%; height: 120%; object-fit: fill;">
        </div>
    `);

}
if (month === 10) { // november
  console.log("fall vibes");
  const boottitle = document.getElementsByClassName("t1");
  if (localStorage.getItem('perform_mode') === 'false') {
    if (boottitle[0]) boottitle[0].innerHTML = "SNUBTENDO</br>BUT FALL";
  }

  if (imagebg === null && dark === "true") {
    document.body.style.background = "linear-gradient(#2a1a0d, #5b2d0a)";
  } else {
    document.body.style.background = "linear-gradient(#fff2d5, #c26f18)";
  }

  if (localStorage.getItem('perform_mode') === 'false') fallleaves();
} else if (month === 11) { // december
  console.log("flalalala la la laaa~~");
  var boottitle = document.getElementsByClassName("t1");
  var present = document.createElement('script');
  var profile = document.getElementById("eventchange");
  if (localStorage.getItem('perform_mode') === 'false') {
    boottitle[0].innerHTML = "SNUBTENDO</br>BUT FESTIVE";
  }
  profile.src = "appicon/DawnBringer.png";
  present.type = 'text/javascript';
  present.src = 'js/FunnyBox.js';
  present.defer = true;
  document.body.appendChild(present);
  document.getElementById('hide').insertAdjacentHTML('afterbegin', `
        <div class="wrapper">
            <div class="snow layer1 a"></div>
            <div class="snow layer1"></div> 
            <div class="snow layer2 a"></div>
            <div class="snow layer2"></div>
            <div class="snow layer3 a"></div>
            <div class="snow layer3"></div>
        </div>
    `);
  const presentImg = document.createElement('img');
  presentImg.id = "present";
  presentImg.src = "img/present.png";
  presentImg.onclick = () => {
    if (localStorage.getItem('clicked-present') !== 'true') {
      achievement('img/present.png', 'Achievement Unlocked!', 'You clicked the present! Happy Holidays!');
      localStorage.setItem('clicked-present', 'true');
    }
  };
  document.getElementById('hide').prepend(presentImg);

  if (imagebg === null && dark === "true") {
    document.body.style.background = "linear-gradient(#333333, #032f9c)";
  } else {
    document.body.style.background = "linear-gradient(#ffffff, #032f9c)";
  }
} else if (month === 1 && day === 18) { // snubs birthday
  console.log("HAPPY BIRTHDAY I HATE SNUBS THIS DAMN IDIOT");
  var boottitle = document.getElementsByClassName("t1");
  setTimeout(() => {
    var allimages = document.querySelectorAll("#pleaseworkdude");
    allimages.forEach(image => {
      image.src = "snubs.png";
      image.setAttribute("data-src", "snubs.png");
    });
    console.log(allimages);
  }, 1000);
  if (localStorage.getItem('perform_mode') === 'false') {
    boottitle[0].innerHTML = "SNUBBY</br>HAPPY BIRTHDAY";
  }
  confetti();
  achievement("icon.png", "HAPPY BIRTHDAY", "ITS SNUBS BIRTHDAY NOOOOOO");
}

function fallleaves(count = 24) {
  const css = `
  <style id="fall-leaves-style">
    .leaf-wrap { position: fixed; inset: 0; overflow: hidden; pointer-events:none; z-index:15; }
    .leaf {
      position: absolute; top:-10vh;
      width: 24px; height: 24px;
      background-image: url('img/leaf.png');
      background-size: contain; background-repeat: no-repeat;
      opacity: .9; will-change: transform;
      animation: fallLinear 9s linear infinite, sway 3.2s ease-in-out infinite alternate;
    }
    @keyframes fallLinear {
      0%   { transform: translateY(-10vh) rotate(0deg);   }
      100% { transform: translateY(110vh) rotate(360deg); }
    }
    @keyframes sway {
      0%   { margin-left: -20px; transform-origin: 50% 0; }
      100% { margin-left:  20px; transform-origin: 50% 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .leaf { animation: fallLinear 12s linear infinite; }
    }
  </style>`;
  if (!document.getElementById('fall-leaves-style')) {
    document.head.insertAdjacentHTML('beforeend', css);
  }

  const cont = document.createElement('div');
  cont.className = 'leaf-wrap';

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'leaf';
    const left = Math.random() * 100;
    const delay = (Math.random() * 8).toFixed(2);
    const dur = (8 + Math.random() * 6).toFixed(2);
    const size = 16 + Math.random() * 24;
    el.style.left = `${left}vw`;
    el.style.animationDelay = `${delay}s, ${Math.random().toFixed(2)}s`;
    el.style.animationDuration = `${dur}s, ${(2.8 + Math.random()*2).toFixed(2)}s`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    cont.appendChild(el);
  }
  document.getElementById('hide')?.appendChild(cont);
}