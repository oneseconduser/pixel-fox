// Общий скрипт, подключается на всех страницах

// подсвечиваем ссылку текущей страницы в меню (Location)
var links = document.querySelectorAll('nav a');
var page = location.pathname.split('/').pop();
if (page === '') page = 'index.html';

for (let i = 0; i < links.length; i++) {
  if (links[i].getAttribute('href') === page) {
    links[i].classList.add('active');
  }
}

// инфа про экран и браузер в футере (Screen, Navigator)
var info = document.getElementById('info');

function showInfo() {
  info.textContent = 'Экран: ' + screen.width + 'x' + screen.height +
    ' | Окно: ' + window.innerWidth + 'px | Язык: ' + navigator.language;
}
showInfo();
window.addEventListener('resize', showInfo);

// кнопка "назад" (History)
document.getElementById('backBtn').addEventListener('click', function () {
  if (history.length > 1) {
    history.back();
  } else {
    alert('Дальше назад идти некуда :)');
  }
});