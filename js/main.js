// ===== 1. Параллакс (mousemove) =====
const hero = document.getElementById('hero');
const layers = document.querySelectorAll('.layer');

function parallax(e) {
  let x = e.clientX / window.innerWidth - 0.5;
  let y = e.clientY / window.innerHeight - 0.5;

  for (let i = 0; i < layers.length; i++) {
    let speed = layers[i].getAttribute('data-speed');
    layers[i].style.transform = 'translate(' + (x * speed) + 'px, ' + (y * speed) + 'px)';
  }
}
hero.addEventListener('mousemove', parallax);

// когда мышь ушла с hero - возвращаем слои на место
hero.addEventListener('mouseout', function (e) {
  if (e.target === hero) {
    for (let i = 0; i < layers.length; i++) {
      layers[i].style.transform = 'translate(0px, 0px)';
    }
  }
});

// кнопка вкл/выкл параллакса (addEventListener / removeEventListener)
var parallaxOn = true;
document.getElementById('parallaxBtn').addEventListener('click', function () {
  if (parallaxOn) {
    hero.removeEventListener('mousemove', parallax);
    this.textContent = 'Включить параллакс';
  } else {
    hero.addEventListener('mousemove', parallax);
    this.textContent = 'Выключить параллакс';
  }
  parallaxOn = !parallaxOn;
});

// ===== 2. Кружок за курсором =====
const follower = document.getElementById('follower');

document.addEventListener('mousemove', function (e) {
  follower.style.left = (e.clientX - 10) + 'px';
  follower.style.top = (e.clientY - 10) + 'px';
});
// при зажатой кнопке кружок становится больше
document.addEventListener('mousedown', function () {
  follower.style.transform = 'scale(2)';
});
document.addEventListener('mouseup', function () {
  follower.style.transform = 'scale(1)';
});

// ===== 3. prompt / alert =====
document.getElementById('nameBtn').addEventListener('click', function () {
  let name = prompt('Как тебя зовут?');
  if (name) {
    document.getElementById('hello').textContent = 'Привет, ' + name + '! Поможешь лисёнку добраться домой?';
  } else {
    alert('Ты не ввёл имя :(');
  }
});

// ===== 4. BOM: ширина окна =====
function checkWidth() {
  const t = document.getElementById('modeText');
  if (window.innerWidth < 600) {
    t.textContent = 'Маленький экран (' + window.innerWidth + 'px). Игру лучше пробовать на ПК.';
  } else {
    t.textContent = 'Ширина окна: ' + window.innerWidth + 'px (десктопная версия)';
  }
}
checkWidth();
window.addEventListener('resize', checkWidth);

// ===== 5. Управление лисой (keydown / keyup) =====
const arena = document.getElementById('arena');
const fox = document.getElementById('fox');
const coin = document.getElementById('coin');
const scoreEl = document.getElementById('score');

let foxX = 20;
let foxY = 100;
let coinX = 0;
let coinY = 0;
let score = 0;
const keys = {}; // тут храним, какие клавиши сейчас зажаты

document.addEventListener('keydown', function (e) {
  keys[e.code] = true;
  fox.classList.add('running');
  // чтобы страница не скроллилась от стрелок
  if (e.code.indexOf('Arrow') === 0) {
    e.preventDefault();
  }
});

document.addEventListener('keyup', function (e) {
  keys[e.code] = false;
  fox.classList.remove('running');
});

function moveCoin() {
  coinX = Math.random() * (arena.clientWidth - 40);
  coinY = Math.random() * (arena.clientHeight - 40);
  coin.style.left = coinX + 'px';
  coin.style.top = coinY + 'px';
}
moveCoin();

// игровой цикл (setInterval)
setInterval(function () {
  if (keys['ArrowLeft'] || keys['KeyA']) foxX -= 4;
  if (keys['ArrowRight'] || keys['KeyD']) foxX += 4;
  if (keys['ArrowUp'] || keys['KeyW']) foxY -= 4;
  if (keys['ArrowDown'] || keys['KeyS']) foxY += 4;

  // не даём лисе выйти за поле
  if (foxX < 0) foxX = 0;
  if (foxY < 0) foxY = 0;
  if (foxX > arena.clientWidth - 45) foxX = arena.clientWidth - 45;
  if (foxY > arena.clientHeight - 50) foxY = arena.clientHeight - 50;

  fox.style.left = foxX + 'px';
  fox.style.top = foxY + 'px';

  // проверка: лиса дотронулась до монетки?
  if (Math.abs(foxX - coinX) < 30 && Math.abs(foxY - coinY) < 30) {
    score++;
    scoreEl.textContent = score;
    moveCoin();
  }
}, 20);