// ===== 1. Обратный отсчёт (setInterval) =====
const timerEl = document.getElementById('timer');
const releaseDate = new Date(2027, 2, 1); // 1 марта 2027 (месяцы с нуля!)

function updateTimer() {
  let diff = releaseDate - new Date();

  if (diff <= 0) {
    timerEl.textContent = 'Игра уже вышла!';
    return;
  }

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor(diff / (1000 * 60 * 60) % 24);
  let minutes = Math.floor(diff / (1000 * 60) % 60);
  let seconds = Math.floor(diff / 1000 % 60);

  timerEl.textContent = days + ' д ' + hours + ' ч ' + minutes + ' мин ' + seconds + ' сек';
}
updateTimer();
setInterval(updateTimer, 1000);

// ===== 2. Песочница: мышь (mousedown + mousemove) и клавиатура =====
const sandbox = document.getElementById('sandbox');
const colorName = document.getElementById('colorName');
var drawing = false;
var color = 'orange';

sandbox.addEventListener('mousedown', function () {
  drawing = true;
});
// mouseup ловим на всём документе, чтобы не "залипало" если отпустили за полем
document.addEventListener('mouseup', function () {
  drawing = false;
});

sandbox.addEventListener('mousemove', function (e) {
  if (!drawing) return;

  let rect = sandbox.getBoundingClientRect();
  let dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.left = (e.clientX - rect.left - 6) + 'px';
  dot.style.top = (e.clientY - rect.top - 6) + 'px';
  dot.style.background = color;
  sandbox.appendChild(dot);

  // через 3 секунды точка пропадает (setTimeout)
  setTimeout(function () {
    dot.remove();
  }, 3000);
});

document.addEventListener('keydown', function (e) {
  // если печатаем в форме, то клавиши не трогаем
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  if (e.key === 'r') { color = 'red'; colorName.textContent = 'красный'; }
  if (e.key === 'g') { color = 'limegreen'; colorName.textContent = 'зелёный'; }
  if (e.key === 'b') { color = 'dodgerblue'; colorName.textContent = 'синий'; }
  if (e.key === 'y') { color = 'yellow'; colorName.textContent = 'жёлтый'; }
  if (e.key === 'c') { sandbox.innerHTML = ''; }

  // Esc закрывает попап и лайтбокс
  if (e.key === 'Escape') {
    closeLightbox();
    closePopup();
  }
});

// счётчик нажатий (keypress устарел, но у нас в курсе он был)
var pressCount = 0;
document.addEventListener('keypress', function () {
  pressCount++;
  document.getElementById('pressCount').textContent = pressCount;
});

// ===== 3. Лайтбокс =====
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const bigImg = document.getElementById('bigImg');

// один обработчик на всю галерею, смотрим на event.target
gallery.addEventListener('click', function (e) {
  if (e.target.tagName === 'IMG') {
    bigImg.src = e.target.getAttribute('data-big');
    lightbox.style.display = 'flex';
  }
});

function closeLightbox() {
  lightbox.style.display = 'none';
}

lightbox.addEventListener('click', closeLightbox);
// чтобы лайтбокс не закрывался при клике на саму картинку
bigImg.addEventListener('click', function (e) {
  e.stopPropagation();
});

// ===== 4. Popup =====
const popup = document.getElementById('popup');

function openPopup() {
  popup.style.display = 'flex';
}
function closePopup() {
  popup.style.display = 'none';
}

document.getElementById('popupBtn').addEventListener('click', openPopup);
document.getElementById('popupClose').addEventListener('click', closePopup);
popup.addEventListener('click', function (e) {
  if (e.target === popup) closePopup(); // клик именно по тёмному фону
});
document.getElementById('popupGo').addEventListener('click', function () {
  closePopup();
  document.getElementById('formTitle').scrollIntoView();
});

// через 15 секунд попап появится сам
setTimeout(openPopup, 15000);

// ===== 5. Новое окно (window.open) =====
document.getElementById('winBtn').addEventListener('click', function () {
  let w = window.open('index.html', '', 'width=500,height=400');
  if (w) {
    setTimeout(function () {
      w.close(); // закрываем через 5 секунд
    }, 5000);
  } else {
    alert('Браузер заблокировал окно');
  }
});

// ===== 6. Форма и валидация =====
const form = document.getElementById('joinForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('pass');
const platformSelect = document.getElementById('platform');
const agree = document.getElementById('agree');

function showError(input, msg) {
  input.classList.add('error');
  input.classList.remove('ok');
  document.getElementById(input.id + 'Err').textContent = msg;
}
function showOk(input) {
  input.classList.remove('error');
  input.classList.add('ok');
  document.getElementById(input.id + 'Err').textContent = '';
}

function checkName() {
  if (nameInput.value.trim().length < 2) {
    showError(nameInput, 'Имя должно быть минимум 2 символа');
    return false;
  }
  showOk(nameInput);
  return true;
}

function checkEmail() {
  let v = emailInput.value.trim();
  if (v.length < 5 || v.indexOf('@') === -1 || v.indexOf('.') === -1) {
    showError(emailInput, 'Введи нормальный email');
    return false;
  }
  showOk(emailInput);
  return true;
}

function checkPass() {
  let v = passInput.value;
  if (v.length < 6 || !/\d/.test(v)) {
    showError(passInput, 'Минимум 6 символов и хотя бы одна цифра');
    return false;
  }
  showOk(passInput);
  return true;
}

function checkPlatform() {
  if (platformSelect.value === '') {
    document.getElementById('platformErr').textContent = 'Выбери платформу';
    return false;
  }
  document.getElementById('platformErr').textContent = '';
  return true;
}

// blur - проверяем, когда ушли с поля
nameInput.addEventListener('blur', checkName);
emailInput.addEventListener('blur', checkEmail);
passInput.addEventListener('blur', checkPass);

// input - если ошибка уже показана, проверяем на лету
nameInput.addEventListener('input', function () {
  if (this.classList.contains('error')) checkName();
});
emailInput.addEventListener('input', function () {
  if (this.classList.contains('error')) checkEmail();
});
passInput.addEventListener('input', function () {
  if (this.classList.contains('error')) checkPass();
});

// focus / blur - подсвечиваем подпись (label) над полем
const textInputs = [nameInput, emailInput, passInput];
for (let i = 0; i < textInputs.length; i++) {
  textInputs[i].addEventListener('focus', function () {
    this.previousElementSibling.classList.add('active');
  });
  textInputs[i].addEventListener('blur', function () {
    this.previousElementSibling.classList.remove('active');
  });
}

// change - у select
platformSelect.addEventListener('change', function () {
  document.getElementById('platformInfo').textContent =
    'Ты выбрал: ' + this.options[this.selectedIndex].text;
  checkPlatform();
});

// submit
form.addEventListener('submit', function (e) {
  e.preventDefault(); // страница не перезагружается

  let ok = true;
  // проверяем всё сразу, чтобы показались все ошибки
  if (!checkName()) ok = false;
  if (!checkEmail()) ok = false;
  if (!checkPass()) ok = false;
  if (!checkPlatform()) ok = false;

  if (!agree.checked) {
    document.getElementById('agreeErr').textContent = 'Нужно согласие';
    ok = false;
  } else {
    document.getElementById('agreeErr').textContent = '';
  }

  if (!ok) return;

  if (confirm('Отправить заявку?')) {
    alert('Спасибо, ' + nameInput.value + '! Заявка принята.');
    form.reset();
    for (let i = 0; i < textInputs.length; i++) {
      textInputs[i].classList.remove('ok');
    }
    document.getElementById('platformInfo').textContent = '';

    let s = document.getElementById('success');
    s.textContent = '✅ Заявка отправлена!';
    setTimeout(function () {
      s.textContent = '';
    }, 4000);
  }
});