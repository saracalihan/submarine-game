const cvs = document.getElementById('sonar')
const ctx = cvs.getContext('2d')

const drawRect = (x, y, w, h, color) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

const drawCircleF = (x, y, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI, false)
  ctx.closePath()
  ctx.fill()
}
const drawCircleS = (x, y, r, w, color) => {
  ctx.strokeStyle = color
  ctx.lineWidth = w
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.stroke()
}

const drawSonarScreen = (contact) => {
  var backgroundColor = "#051306"
  var color = '#63CA29'
  var size = cvs.width
  drawRect(0, 0, 600, 600, '#6A6860')
  drawCircleF(size / 2, size / 2, 300, backgroundColor)
  drawRect(size / 2 - 0.5, 0, 1, size, color)
  drawRect(0, size / 2 - 0.5, size, 1, color)
  drawCircleS(size / 2, cvs.height / 2, size / 2, 5, color)
  drawCircleF(size / 2, cvs.height / 2, 8, "#fff")


  for (let i = 1; i <= 4; i++) {
    drawCircleS(size / 2, cvs.height / 2, i * size / 10, 1, color)
  }

  if (contact.isDisplay) {
    contact.color = contact.isEnemy ? "#B5381E" : "#70BA70"
    drawCircleF(contact.x, contact.y, contact.width / 2, contact.color)
  }
  mark()
}

function mark() {
  for (var i = 0; i < 60; i++) {
    angle = (i - 3) * (Math.PI * 2) / 60; // THE ANGLE TO MARK.
    ctx.lineWidth = 1; // HAND WIDTH.
    ctx.beginPath();

    var x1 = (cvs.width / 2) + Math.cos(angle) * (cvs.width / 2);
    var y1 = (cvs.height / 2) + Math.sin(angle) * (cvs.width / 2);
    var x2 = (cvs.width / 2) + Math.cos(angle) * (cvs.width / 2 - (cvs.width / 2 / 30));
    var y2 = (cvs.height / 2) + Math.sin(angle) * (cvs.width / 2 - (cvs.width / 2 / 30));

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = '#63CA29';
    ctx.closePath()
    ctx.stroke();
  }
}
var i = 0
const sonar = () => {
  ctx.beginPath();
  ctx.moveTo(cvs.width / 2, cvs.height / 2); // START FROM CENTER OF THE CLOCK.
  ctx.lineTo((cvs.width / 2 + Math.cos(i) * cvs.width / 2), // DRAW THE LENGTH.
    cvs.height / 2 + Math.sin(i) * cvs.width / 2);
  ctx.strokeStyle = '#fff'; // COLOR OF THE HAND.
  ctx.closePath()
  ctx.stroke();
  i += .017

}
const fireHud = (a) => {
  ctx.beginPath();
  ctx.moveTo(cvs.width / 2, cvs.height / 2); // START FROM CENTER OF THE CLOCK.
  ctx.lineTo((cvs.width / 2 + Math.cos(a) * cvs.width / 2), // DRAW THE LENGTH.
    cvs.height / 2 + Math.sin(a) * cvs.width / 2);

  // DRAW THE TAIL OF THE SECONDS HAND.
  ctx.moveTo(cvs.width / 2, cvs.height / 2); // START FROM CENTER OF THE CLOCK.
  ctx.lineTo((cvs.width / 2 + Math.cos(a + .3) * cvs.width / 2), // DRAW THE LENGTH.
    cvs.height / 2 + Math.sin(a + .3) * cvs.width / 2);
  ctx.strokeStyle = '#CFFFCD'; // COLOR OF THE HAND.
  ctx.closePath()
  ctx.stroke();
}

const goto = (x, y, contact) => {
  contact.x += contact.speed * (Math.sign(x - contact.x))

  contact.y += contact.speed * (Math.sign(y - contact.y))

  contact.distance = Math.sqrt(Math.pow(contact.x - cvs.width / 2, 2) + Math.pow(contact.y - cvs.width / 2, 2))
  contact.isDisplay = (contact.distance > cvs.width / 2 - contact.width / 2) ? false : true
}

const fire = () => {
  document.addEventListener('keydown', logKey)
  function logKey(e) {
    switch (e.code) {
      case 'ArrowRight':
        setInterval(a += .0001, 500)
        break;
      case 'ArrowLeft':
        setInterval(a -= .0001, 500)
        break;
      case 'Space':
        fireTorpedo()
        break;
      case 'KeyR':
        reloadTorpedoLauncher()
        break;
    }
  }

}
const reloadTorpedoLauncher = () => {
  if (submarine.torpedoSlot > 0 && submarine.torpedoLauncherStatus === 'EMPTY') {
    document.getElementById("fireButton").className = 'button'
    document.getElementById("reloadButton").className = 'activeButton'
    submarine.torpedoLauncherStatus = 'Reloading'
    const temp = submarine.torpedoSlot
    setTimeout(() => {
      submarine.torpedoSlot = temp - 1
      submarine.torpedoLauncherStatus = 'READY'
      document.getElementById("reloadButton").className = 'button'
    }, 2000);
    submarine.reloadTime = 10
  }
}

const fireTorpedo = () => {
  var temp = a
  if (submarine.torpedoLauncherStatus === 'READY') {
    a = a < 0 ? 6.2831 + a : -a
    a += 0.14//center point of signth

    y = (300 * Math.sin(a)) + cvs.width / 2
    x = (300 * Math.cos(a)) + cvs.width / 2

    console.log(a, x, y)


    drawCircleF(x, y, 50, '#f00')

    submarine.torpedoLauncherStatus = 'EMPTY'
    document.getElementById("fireButton").className = 'activeButton'
    a = temp
  }
}

const display = () => {
  document.getElementById("distance").innerText = contact.isDisplay ? Math.floor(contact.distance) : '?'
  document.getElementById("angle").innerText = Math.floor((360 - ((a + 0.14) * 180 / Math.PI)) % 360)
  document.getElementById("contactStatus").innerText = contact.isDisplay ? (contact.isEnemy ? 'ENEMY' : 'Friend') : '?'
  document.getElementById("contactStatus").style.color = contact.isDisplay ? (contact.isEnemy ? 'red' : '') : ''
  document.getElementById("contactStatus").style.fontWeight = contact.isDisplay ? (contact.isEnemy ? 'bold' : 'normal') : 'normal'
  document.getElementById("torpedoSlot").innerText = submarine.torpedoSlot
  document.getElementById("launcherStatus").innerText = submarine.torpedoLauncherStatus
  if (false && submarine.torpedoLauncherStatus === 'Reloading') {
    submarine.reloadTime -= fps
    document.getElementById("fire").innerText = submarine.reloadTime
  }
}

const contact = {
  isDisplay: true,
  isEnemy: true,
  color: null,
  distance: null,
  speed: .07,
  x: Math.random() * cvs.width,
  y: Math.random() * cvs.width,
  width: 20
}

const submarine = {
  torpedoSlot: 8,
  torpedoLauncherStatus: 'EMPTY',
  reloadTime: 10
}
contact.isEnemy = Boolean(Math.round(Math.random()));
contact.width = Math.floor(Math.random() * 25) + 5;
contact.speed = 1 - contact.width / 25

var a = 0//hud angle(radyan) (0-180*c <0 , 180-360 > 0) . *C = (360 - (a * 180 / Math.PI)) % 360
var sightAngle = (360 - (a * 180 / Math.PI)) % 360

var x = Math.random() * cvs.width
var y = Math.random() * cvs.width
const game = () => {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  drawSonarScreen(contact)
  goto(x, y, contact)
  fire()
  fireHud(a)
  sonar()
  display()
}
const fps = 30

setInterval(() => {
  game();
}, 1000 / fps);