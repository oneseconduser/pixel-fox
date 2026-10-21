// ===== 1. DOM2: создаём карточки через JS =====
var features = [
  { icon: '🏃', title: 'Быстрый геймплей', text: 'Динамичные уровни, где важна скорость и реакция.' },
  { icon: '🎵', title: 'Чиптюн-музыка', text: 'Саундтрек в стиле 8-бит, написанный специально для игры.' },
  { icon: '👾', title: '4 босса', text: 'Каждый босс требует своей тактики.' },
  { icon: '🏆', title: 'Достижения', text: 'Больше 30 достижений и таблица рекордов.' }
];

const cardsBox = document.getElementById('cards');

for (let i = 0; i < features.length; i++) {
  let card = document.createElement('div');
  card.className = 'card';

  let h3 = document.createElement('h3');
  h3.textContent = features[i].icon + ' ' + features[i].title;

  let p = document.createElement('p');
  p.textContent = features[i].text;

  let small = document.createElement('small');
  small.textContent = 'Клавиша ' + (i + 1);

  card.appendChild(h3);
  card.appendChild(p);
  card.appendChild(small);
  cardsBox.appendChild(card);
}

// ===== 2. Hover-эффекты через JS (не через CSS) =====
const cards = document.querySelectorAll('.card');

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener('mouseover', function () {
    this.style.transform = 'translateY(-8px) scale(1.05)';
    this.style.background = '#1f4068';
    this.style.boxShadow = '0 8px 20px rgba(255,159,67,0.5)';
  });
  cards[i].addEventListener('mouseout', function () {
    this.style.transform = '';
    this.style.background = '';
    this.style.boxShadow = '';
  });
  // при нажатии карточка "вдавливается"
  cards[i].addEventListener('mousedown', function () {
    this.style.transform = 'scale(0.95)';
  });
  cards[i].addEventListener('mouseup', function () {
    this.style.transform = 'translateY(-8px) scale(1.05)';
  });
}

// ===== 3. Клавиши 1-4 подсвечивают карточки, стрелки листают карусель =====
document.addEventListener('keydown', function (e) {
  let n = parseInt(e.key);
  if (n >= 1 && n <= cards.length) {
    let c = cards[n - 1];
    c.style.background = '#ff9f43';
    c.style.color = '#222';
    c.style.transform = 'rotate(3deg) scale(1.1)';
    // через 0.4 сек возвращаем как было
    setTimeout(function () {
      c.style.background = '';
      c.style.color = '';
      c.style.transform = '';
    }, 400);
  }

  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

// ===== 4. Карусель =====
const slidesBox = document.getElementById('slides');
const slideCount = document.querySelectorAll('.slide').length;
var current = 0;

function showSlide() {
  slidesBox.style.transform = 'translateX(-' + (current * 100) + '%)';
  document.getElementById('slideNum').textContent = (current + 1) + ' / ' + slideCount;
}

function nextSlide() {
  current++;
  if (current >= slideCount) current = 0;
  showSlide();
}

function prevSlide() {
  current--;
  if (current < 0) current = slideCount - 1;
  showSlide();
}

document.getElementById('nextBtn').addEventListener('click', nextSlide);
document.getElementById('prevBtn').addEventListener('click', prevSlide);

// ===== 5. Аккордеон (перемещение по узлам DOM) =====
const titles = document.querySelectorAll('.acc-title');

for (let i = 0; i < titles.length; i++) {
  titles[i].addEventListener('click', function () {
    let text = this.nextElementSibling;           // следующий узел - текст ответа
    let wasOpen = (text.style.display === 'block');
    let all = this.parentNode.children;           // все элементы внутри аккордеона

    // сначала всё закрываем
    for (let j = 0; j < all.length; j++) {
      if (all[j].classList.contains('acc-text')) {
        all[j].style.display = 'none';
      } else {
        all[j].classList.remove('open');
      }
    }

    // открываем, если до этого был закрыт
    if (!wasOpen) {
      text.style.display = 'block';
      this.classList.add('open');
    }
  });
}

// ===== 6. Всплытие и перехват =====
const logBox = document.getElementById('log');
const stopCheck = document.getElementById('stopCheck');

function addLog(text) {
  logBox.innerHTML += text + '<br>';
}

// true в конце = перехват (capture), срабатывает ПЕРВЫМ
document.getElementById('box1').addEventListener('click', function () {
  addLog('box1: перехват (capture)');
}, true);

// обычные обработчики - всплытие
document.getElementById('box1').addEventListener('click', function () {
  addLog('box1: всплытие');
});
document.getElementById('box2').addEventListener('click', function () {
  addLog('box2: всплытие');
});
document.getElementById('box3').addEventListener('click', function (e) {
  addLog('box3: клик, target = ' + e.target.id);
  if (stopCheck.checked) {
    e.stopPropagation(); // дальше вверх событие не пойдёт
  }
});

document.getElementById('clearLog').addEventListener('click', function () {
  logBox.innerHTML = '';
});