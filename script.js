const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded','false');
}));

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('enrolForm').addEventListener('submit', function(e){
  e.preventDefault();
  const data = new FormData(this);
  const lines = [
    'Assalamu Alaykum, I would like to enquire about Taqwa Education tuition.',
    '',
    `Parent/Guardian: ${data.get('parent')}`,
    `Phone: ${data.get('phone')}`,
    `Child: ${data.get('child')}`,
    `Year Group: ${data.get('year')}`,
    `Tuition Required: ${data.get('service')}`,
    `Attendance: ${data.get('attendance')}`,
    `Preferred Day: ${data.get('day')}`,
    data.get('message') ? `Notes: ${data.get('message')}` : ''
  ].filter(Boolean);
  const url = 'https://wa.me/447846252413?text=' + encodeURIComponent(lines.join('\n'));
  window.open(url, '_blank', 'noopener');
});
