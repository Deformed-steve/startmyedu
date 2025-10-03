function SettingsB() {
  var x = document.getElementById("settings");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function SettingsNew() {
  var x = document.getElementById("settingsNEW");

  if (x.style.display === "none") {
    x.classList.remove("slide-out");
    x.style.display = "inline-block";
    x.classList.add("slide-in");
  } else {
    x.classList.add("slide-out");
    x.classList.remove("slide-in");
    setTimeout(function() {
      x.style.display = "none";
    }, 500);
  }
}


// check if the system is low quality because well if we dont then bad stuff
var LOW_END_MODE = localStorage.getItem('perform_mode') === 'true'; // Ensure it's a boolean

if (LOW_END_MODE === null) {
  LOW_END_MODE = false;
  localStorage.setItem('perform_mode', 'false');
}

const badsystem =
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
  (navigator.deviceMemory && navigator.deviceMemory <= 2);

console.log("CORES:", navigator.hardwareConcurrency);
console.log("MEM:", navigator.deviceMemory);

if (!badsystem) {
  console.log("Checked system, seems fine, maybe runs fine too :sob:");
} else if (LOW_END_MODE === false && badsystem && !localStorage.getItem('asked_pref')) {
  popupAlert("Low-end system detected.\nWould you like to enable performance mode?", () => {
    LOW_END_MODE = true;
    localStorage.setItem('perform_mode', 'true');
    window.location.reload();
  }, () => {
    LOW_END_MODE = false;
    localStorage.setItem('perform_mode', 'false');
    localStorage.setItem('asked_pref', true);
  }, "yes", "no");
}

const PerfValue = document.getElementById("PerfValue");

let DefaultPerfValue = 'Disabled';
let PerfColor = 'red';

function PerformanceOption() {
  if (LOW_END_MODE) {
    LOW_END_MODE = false;
    localStorage.setItem('perform_mode', 'false');
    DefaultPerfValue = 'Disabled';
    PerfColor = 'red';
    window.location.reload();
  } else {
    LOW_END_MODE = true;
    localStorage.setItem('perform_mode', 'true');
    PerfColor = 'green';
    DefaultPerfValue = 'Enabled';
    window.location.reload();
  }

  PerfValue.innerHTML = `<a style="color: ${PerfColor};">${DefaultPerfValue}</a>`;
}

if (LOW_END_MODE) {
  PerfColor = 'green';
  DefaultPerfValue = 'Enabled';
  if (!document.body.style.transition) {
    document.body.style.setProperty("-webkit-transition", "none", "important");
    document.body.style.setProperty("-moz-transition", "none", "important");
    document.body.style.setProperty("-o-transition", "none", "important");
    document.body.style.setProperty("transition", "none", "important");
  }
  // css animations
  const style = document.createElement("style");
  style.innerHTML = `
    * {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
    }
    `;
  document.head.appendChild(style);

  // js animations
  window.requestAnimationFrame = () => 0;
  window.cancelAnimationFrame = () => {};
  document.querySelectorAll('.switch-scene').forEach(el => el.remove());

  // mc server
  document.querySelectorAll('#embed').forEach(el => el.remove());
  localStorage.setItem('MCToggle', 'false');
} else {
  DefaultPerfValue = 'Disabled';
  PerfColor = 'red';
}

PerfValue.innerHTML = `<a style="color: ${PerfColor};">${DefaultPerfValue}</a>`;


//spanish shit

var spanish; //Had to import because it would say 'not defined' 
//like shut your dumbass up



spanish = localStorage.getItem("spanish"); //dont delete main variable to the spanish you fucking cunt

//if (localStorage.getItem('spanish') == 'true') alert("Brokener");

//if (spanish == 'true') {
// alert("ON");
// } else {
//    alert("OFF");
// }

//the dyslexic shit, i feel your pain
var dyslexicv;

dyslexicv = localStorage.getItem("dyslexic");

function toggleDyslexia() {
  var dyslexic = localStorage.getItem('dyslexic');

  if (dyslexic === 'true') {
    localStorage.setItem('dyslexic', 'false');
    alert("SET TO DYSLEXIC OFF");
  } else {
    localStorage.setItem('dyslexic', 'true');
    alert("SET TO DYSLEXIC");
  }

  location.reload();
}

//if (localStorage.getItem('dyslexic') == 'true') document.getElementById("body").style.fontFamily = "OpenDyslexic-Regular";

function fontcheck() { //SO THE GODDAMN WEBSITE CAN READ THE FUCKING FONT
  if (dyslexicv == 'true') { //For people who cant read well, like me
    document.body.style.fontFamily = "OpenDyslexic-Regular";
  } else {
    document.body.style.fontFamily = "AOTFShinGoProRegular";
  }
}

//The Dev Mode
var dev;

dev = localStorage.getItem("dev");

function toggleDevMode() {
  var dev = localStorage.getItem('dev');

  if (dev === 'true') {
    localStorage.setItem('dev', 'false');
    alert("DEV OFF");
  } else {
    localStorage.setItem('dev', 'true');
    alert("DEV ON");
  }

  location.reload();
}

// Dark Mode
const DarkValue = document.getElementById("DarkValue");

const dark = localStorage.getItem("dark");

let blankdarkvalue = 'Disabled';
let darkcolor = 'red';

if (dark === 'true') {
  blankdarkvalue = 'Enabled';
  darkcolor = 'green';
}

DarkValue.innerHTML = `<a style="color: ${darkcolor};">${blankdarkvalue}</a>`;


function toggleDarkMode() {
  var dark = localStorage.getItem('dark');

  if (dark === 'true') {
    localStorage.setItem('dark', 'false');
    alert("Dark OFF");
  } else {
    localStorage.setItem('dark', 'true');
    alert("Dark ON");
  }

  location.reload();
}

function changeImage(a, b) {
  if (a == null || b == null) {
    console.log("No id was given to changeImage() function.");
    return;
  }

  var element = document.getElementById(b);
  if (element) {
    element.src = a;
    if (dark === 'true') {
      console.log("Changed id " + b + " to dark mode.");
    } else {
      console.log("Changed id " + b + " to light mode.");
    }
  } else {
    console.log("Element with id " + b + " does not exist.");
  }
  // So if like before if the image doesnt exist or like the id doesnt exitst it will say that instead of it throwing a error
}

function checkcolor() { // main
  if (dark == 'true') {
    document.body.style.background = "linear-gradient(#333333, #1a1a1c)";

    document.getElementById("eshop").style.background = "linear-gradient(#333333, #1a1a1c)";

    // Change Images code -----

    changeImage("appicon/icons/dark/unknown.png", "bottomz");

    changeImage("appicon/icons/dark/huh.png", "abtme");

    changeImage("appicon/icons/dark/notifs.png", "notifz");

    changeImage("appicon/icons/dark/cashapp.png", "cashapp");

    changeImage("appicon/icons/dark/web.png", "webz");

    changeImage("appicon/icons/dark/settings.png", "settinz");

    changeImage("appicon/icons/dark/discord.png", "discord");

    changeImage("appicon/icons/dark/close.png", "closegame");

    changeImage("appicon/icons/dark/shop.png", "shop");
  } else {
    document.body.style.background = "linear-gradient(#ffffff, #d9d9d9)";

    document.getElementById("eshop").style.background = "linear-gradient(#ffffff, #d9d9d9)";

    changeImage("appicon/icons/light/unknown.png", "bottomz");

    changeImage("appicon/icons/light/huh.png", "abtme");

    changeImage("appicon/icons/light/notifs.png", "notifz");

    changeImage("appicon/icons/light/cashapp.png", "cashapp");

    changeImage("appicon/icons/light/web.png", "webz");

    changeImage("appicon/icons/light/settings.png", "settinz");

    changeImage("appicon/icons/light/discord.png", "discord");

    changeImage("appicon/icons/light/close.png", "closegame");

    changeImage("appicon/icons/light/shop.png", "shop");

  }
}

function cloakmode() {
  /* var cloak = prompt("Name For Cloak? (EX: Home for Google Classroom)");
  var iconChoice = prompt("Choose an icon (1-4):\n1. G-Classroom 1\n2. IXL 2\n3. Icon 3\n4. Icon 4");
  
  switch (parseInt(iconChoice)) {
      case 1:
          document.querySelector("link[rel='shortcut icon']").href = "https://ssl.gstatic.com/classroom/favicon.png";
          break;
      case 2:
          document.querySelector("link[rel='shortcut icon']").href = "https://www.ixl.com/ixl-favicon.png";
          break;
      case 3:
          document.querySelector("link[rel='shortcut icon']").href = "icon3.png";
          break;
      case 4:
          document.querySelector("link[rel='shortcut icon']").href = "icon4.png";
          break;
      default:
          alert("Invalid icon choice. Using default icon.");
          break;
  }

  document.title = cloak;

  */

  //This is for the cloak mode, but it is not finished yet lol
}

var cloak = localStorage.getItem('cloak');

const CloakValue = document.getElementById("CloakValue");

let DefaultCloakValue = 'Disabled';

let CloakColor = 'red';

function TempCloak() {
  if (cloak === 'true') {
    localStorage.setItem('cloak', 'false');
    location.reload();
  } else {
    localStorage.setItem('cloak', 'true');

    let iconswitch = document.querySelector("link[rel='shortcut icon']");
    if (!iconswitch) {
      iconswitch = document.createElement('link');
      iconswitch.rel = 'shortcut icon';
      document.head.appendChild(iconswitch);
    }
    iconswitch.href = "cloak.png";

    document.title = "â€Ž";
    CloakColor = 'green';
    DefaultCloakValue = 'Enabled';
    CloakValue.innerHTML = `<a style="color: ${CloakColor};">${DefaultCloakValue}</a>`;
  }
}

if (cloak === 'true') {
  let iconswitch = document.querySelector("link[rel='shortcut icon']");
  if (!iconswitch) {
    iconswitch = document.createElement('link');
    iconswitch.rel = 'shortcut icon';
    document.head.appendChild(iconswitch);
  }
  iconswitch.href = "cloak.png";
  document.title = "â€Ž";
  CloakColor = 'green';
  DefaultCloakValue = 'Enabled';
}

CloakValue.innerHTML = `<a style="color: ${CloakColor};">${DefaultCloakValue}</a>`;



// Home Button Position NEW: and the like notificatio nthing
var selectElement = document.querySelector('select[name="ButtonPosition"]');

var notifPopup = document.querySelector('select[name="NotifPosition"]');

var ButtonPos = localStorage.getItem('ButtonPosition') || 'BLeft';

var NotifPos = localStorage.getItem('NotifPosition') || 'BLeft';

selectElement.addEventListener('change', function() {
  var ChosenOption = this.value;
  localStorage.setItem('ButtonPosition', ChosenOption);

  ChangeButtonPos(ChosenOption);
});

notifPopup.addEventListener('change', function() {
  var ChosenNotifPos = this.value;
  localStorage.setItem('NotifPosition', ChosenNotifPos);
  ChangeNotifPos(ChosenNotifPos);
});

function ChangeButtonPos(position) {
  var HomeButton = document.getElementById('closegame');

  if (!HomeButton) return; // idk why it would return false but just in case

  HomeButton.style.bottom = '';
  HomeButton.style.top = '';
  HomeButton.style.left = '';
  HomeButton.style.right = '';

  switch (position) {
    case 'BLeft':
      HomeButton.style.bottom = '0';
      HomeButton.style.left = '0';
      break;
    case 'TLeft':
      HomeButton.style.top = '0';
      HomeButton.style.left = '0';
      break;
    case 'BRight':
      HomeButton.style.bottom = '0';
      HomeButton.style.right = '0';
      break;
    case 'TRight':
      HomeButton.style.top = '0';
      HomeButton.style.right = '0';
      break;
    default:
      HomeButton.style.bottom = '0';
      HomeButton.style.left = '0';
      break;
  }
}

function ChangeNotifPos(position, show) {
  var NotifPopup = document.getElementById('achievement');

  if (!NotifPopup) return; // idk why it would return false but just in case

  NotifPopup.style.bottom = '';
  NotifPopup.style.top = '';
  NotifPopup.style.left = '';
  NotifPopup.style.right = '';
  NotifPopup.style.border = '';
  NotifPopup.style.borderRadius = '';

  switch (position) {
    case 'BLeft':
      NotifPopup.style.bottom = '20px';
      NotifPopup.style.left = '20px';
      NotifPopup.style.top = '';
      NotifPopup.style.transform = 'translateX(-100%)';
      NotifPopup.style.borderLeft = '5px solid #0052CA';
      NotifPopup.style.borderTopRightRadius = '15px';
      NotifPopup.style.borderBottomRightRadius = '15px';
      break;
    case 'TLeft':
      NotifPopup.style.top = '20px';
      NotifPopup.style.left = '20px';
      NotifPopup.style.bottom = '';
      NotifPopup.style.transform = 'translateX(-100%)';
      NotifPopup.style.borderLeft = '5px solid #0052CA';
      NotifPopup.style.borderTopRightRadius = '15px';
      NotifPopup.style.borderBottomRightRadius = '15px';
      break;
    case 'BRight':
      NotifPopup.style.bottom = '20px';
      NotifPopup.style.right = '20px';
      NotifPopup.style.top = '';
      NotifPopup.style.transform = 'translateX(100%)';
      NotifPopup.style.borderRight = '5px solid #0052CA';
      NotifPopup.style.borderTopLeftRadius = '15px';
      NotifPopup.style.borderBottomLeftRadius = '15px';
      break;
    case 'TRight':
      NotifPopup.style.top = '20px';
      NotifPopup.style.right = '20px';
      NotifPopup.style.bottom = '';
      NotifPopup.style.transform = 'translateX(100%)';
      NotifPopup.style.transform = 'translateX(100%)';
      NotifPopup.style.borderRight = '5px solid #0052CA';
      NotifPopup.style.borderTopLeftRadius = '15px';
      NotifPopup.style.borderBottomLeftRadius = '15px';
      break;
  }

  if (show == null) {
    achievement("img/beetle.png", "Notification will be here!", "");
  }
}

selectElement.value = ButtonPos;

notifPopup.value = NotifPos;

ChangeButtonPos(ButtonPos);

ChangeNotifPos(NotifPos, 1);

// New Tab Option

/* const NTABValue = document.getElementById("NTABValue");

let DefaultNTABValue = 'Disabled';

let NTABColor = 'red';

function NewTabOption() {
    var ntab = localStorage.getItem('NTAB');

    if (ntab == 'true') 
    {
        localStorage.setItem('NTAB', 'false');
        DefaultNTABValue = 'Disabled';
        NTABColor = 'red';  
        console.log("NTAB OFF");
    } 
    else 
    {
        localStorage.setItem('NTAB', 'true');
        NTABColor = 'green';
        DefaultNTABValue = 'Enabled';
        console.log("NTAB ON");
    }

    NTABValue.innerHTML = `<a style="color: ${NTABColor};">${DefaultNTABValue}</a>`;
}

if (localStorage.getItem('NTAB') == 'true') {
    NTABColor = 'green';
    DefaultNTABValue = 'Enabled';
}

NTABValue.innerHTML = `<a style="color: ${NTABColor};">${DefaultNTABValue}</a>`;
*/
const NTABValue = document.getElementById("NTABValue");

let DefaultNTABValue = 'Disabled';
let NTABColor = 'red';

function NewTabOption() {
  try {
    if (window.top.location.href === "about:blank") {
      popupAlert('using "i love water" method, it may not work properly. Enabling..', 0, 0);
    }
  } catch (e) {
    popupAlert('using "i love water" method, it may not work properly. Enabling..', 0, 0);
  }

  var ntab = localStorage.getItem('NTAB');

  if (ntab == 'true') {
    localStorage.setItem('NTAB', 'false');
    DefaultNTABValue = 'Disabled';
    NTABColor = 'red';
    console.log("NTAB OFF");
  } else {
    localStorage.setItem('NTAB', 'true');
    NTABColor = 'green';
    DefaultNTABValue = 'Enabled';
    console.log("NTAB ON");
  }

  NTABValue.innerHTML = `<a style="color: ${NTABColor};">${DefaultNTABValue}</a>`;
}

if (localStorage.getItem('NTAB') == 'true') {
  NTABColor = 'green';
  DefaultNTABValue = 'Enabled';
  NTABValue.innerHTML = `<a style="color: ${NTABColor};">${DefaultNTABValue}</a>`;
} else {
  NTABValue.innerHTML = `<a style="color: ${NTABColor};">${DefaultNTABValue}</a>`;
}

// prevention of CTRL + W

const CtrlValue = document.getElementById("CtrlValue");

let DefaultCtrlValue = 'Disabled';
let CtrlColor = 'red';

function CtrlOption() {

  var Ctrl = localStorage.getItem('Ctrl');

  if (Ctrl == 'true') {
    localStorage.setItem('Ctrl', 'false');
    DefaultCtrlValue = 'Disabled';
    CtrlColor = 'red';
  } else {
    localStorage.setItem('Ctrl', 'true');
    CtrlColor = 'green';
    DefaultCtrlValue = 'Enabled';
  }

  CtrlValue.innerHTML = `<a style="color: ${CtrlColor};">${DefaultCtrlValue}</a>`;
}

if (localStorage.getItem('Ctrl') == 'true') {
  CtrlColor = 'green';
  DefaultCtrlValue = 'Enabled';
  CtrlValue.innerHTML = `<a style="color: ${CtrlColor};">${DefaultCtrlValue}</a>`;
} else {
  CtrlValue.innerHTML = `<a style="color: ${CtrlColor};">${DefaultCtrlValue}</a>`;
}

// Toggle Server List

var MCToggle;

let DefaultMCServerValue = 'Disabled';

const mcserver = document.getElementById("MCServerValue");

MCToggle = localStorage.getItem("MCToggle");

if (MCToggle == null) {
  localStorage.setItem('MCToggle', 'true');
  MCToggle = 'true';
  console.log("Loading Server....")
  mcserver.innerHTML = `<a style="color: green;">Enabled</a>`;
  var embed = new ServerEmbed(document.getElementById("embed"), "500px");
  embed.ping("wss://" + window.location.hostname + "/server");
}

function toggleMCServer() {
  var MCToggle = localStorage.getItem('MCToggle');

  if (MCToggle === 'true') {
    localStorage.setItem('MCToggle', 'false');
    alert("Server List Disabled, reload to see changes.");
    mcserver.innerHTML = `<a style="color: red;">Disabled</a>`;
  } else {
    localStorage.setItem('MCToggle', 'true');
    alert("Server List Enabled, reload to see changes.");
    mcserver.innerHTML = `<a style="color: green;">Enabled</a>`;
  }
}

if (MCToggle === 'true') {
  console.log("Loading Server....")
  mcserver.innerHTML = `<a style="color: green;">Enabled</a>`;
  var embed = new ServerEmbed(document.getElementById("embed"), "500px");
  embed.ping("wss://" + window.location.hostname + "/server");
} else {
  mcserver.innerHTML = `<a style="color: red;">Disabled</a>`;
}





// ------------------ COMMUNITY MODE SO SCARY --------------------------


const CommunityValue = document.getElementById("CommunityMode");

let DefaultCommunityValue = 'Disabled';
let CommunityColor = 'red';
let InputThing = document.getElementById("hideunlessitsonorsm");
let InputValue = document.getElementById("imlazyLMAO");

function CommunityModeToggle(skip) {
  try {
    if (window.top.location.href === "about:blank") {
      popupAlert('using "i love water" method, 3rd party links <br>may NOT load at times not my fucking fault. Enabling.. tch', 0, 0);
    }
  } catch (e) {
    popupAlert('using "i love water" method, 3rd party links <br>may NOT load at times not my fucking fault. Enabling.. tch', 0, 0);
  }

  var CommunityMode = localStorage.getItem('CommunityMode');

  if (CommunityMode == 'true' || skip === 1) {
    localStorage.removeItem('CommunityMode');
    DefaultCommunityValue = 'Disabled';
    InputThing.style.display = 'none';
    CommunityColor = 'red';
    console.log("oh yay its gone");
    localStorage.removeItem('CommunityLink');
  } else {
    localStorage.setItem('CommunityMode', 'true');
    CommunityColor = 'green';
    DefaultCommunityValue = 'Enabled';
    InputThing.style.display = 'block';
    console.log("COMMUNITY MODE IS ENABLED WE ARE ALL GONNA DIE");
    if (localStorage.getItem('CommunityLink') !== null) {
      InputValue.value = localStorage.getItem('CommunityLink');
    }
  }

  CommunityValue.innerHTML = `<a style="color: ${CommunityColor};">${DefaultCommunityValue}</a>`;
}

if (localStorage.getItem('CommunityMode') == 'true') {
  CommunityColor = 'green';
  DefaultCommunityValue = 'Enabled';
  InputThing.style.display = 'block';
  CommunityValue.innerHTML = `<a style="color: ${CommunityColor};">${DefaultCommunityValue}</a>`;
  if (localStorage.getItem('CommunityLink') !== null) {
    InputValue.value = localStorage.getItem('CommunityLink');
  }
} else {
  CommunityValue.innerHTML = `<a style="color: ${CommunityColor};">${DefaultCommunityValue}</a>`;
}

function CommunityModeLink() {
  // Handle the community mode link shit or sm
  if (InputValue.value.includes('https://') || InputValue.value.includes('http://')) {
    localStorage.setItem('CommunityLink', InputValue.value);
    popupAlert('Community link set! Reload the page to see new content! (if theres any)', 0, 0);
  } else {
    popupAlert('Improper link! Is this a valid JSON?', 0, 0);
    localStorage.removeItem('CommunityLink');
  }
}