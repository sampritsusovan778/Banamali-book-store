const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, {threshold:.12});
$$('.reveal').forEach(el => revealObserver.observe(el));

$$('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
  const target = $(btn.dataset.scroll);
  target?.scrollIntoView({behavior:'smooth'});
}));

// Gentle 3D response for the hero books.
const stage = $('.hero-stage');
const books = $$('.hero-stage .book');
if (stage) {
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    books.forEach((b,i) => {
      const base = [
        'translate(-90px,20px) rotateY(20deg) rotateZ(-7deg)',
        'translate(50px,-20px) rotateY(-17deg) rotateZ(5deg)',
        'translate(-10px,90px) rotateY(12deg) rotateZ(12deg)'
      ][i];
      b.style.transform = `${base} rotateX(${y*-5}deg) translateZ(${x*18}px)`;
    });
  });
  stage.addEventListener('pointerleave', () => books.forEach((b,i) => {
    b.style.transform = [
      'translate(-90px,20px) rotateY(20deg) rotateZ(-7deg)',
      'translate(50px,-20px) rotateY(-17deg) rotateZ(5deg)',
      'translate(-10px,90px) rotateY(12deg) rotateZ(12deg)'
    ][i];
  }));
}

// Shelf filters + search.
const cards = $$('.card'), empty = $('#empty'), search = $('#search');
let activeFilter = 'all';
function updateShelf(){
  const q = (search?.value || '').trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const matchFilter = activeFilter === 'all' || card.dataset.cat === activeFilter;
    const matchSearch = !q || card.dataset.name.includes(q) || card.textContent.toLowerCase().includes(q);
    const show = matchFilter && matchSearch;
    card.style.display = show ? '' : 'none';
    if(show) visible++;
  });
  if(empty) empty.hidden = visible !== 0;
}
$$('.filter').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  updateShelf();
}));
search?.addEventListener('input', updateShelf);

// Mobile navigation.
const menu = $('.menu-btn');
menu?.addEventListener('click', () => {
  const nav = $('.nav nav');
  if (!nav) return;
  const open = nav.dataset.open === '1';
  nav.dataset.open = open ? '0' : '1';
  Object.assign(nav.style, open ? {
    display:'none'
  } : {
    display:'flex', position:'absolute', top:'70px', left:'0', right:'0',
    background:'rgba(242,234,216,.98)', padding:'24px 7vw', flexDirection:'column',
    borderBottom:'1px solid rgba(24,34,54,.14)', gap:'18px'
  });
});

// Copy a safe, non-invented location description.
$('#copyLocation')?.addEventListener('click', async () => {
  const text = 'Banamali Book Store, near Court Chhak, Jagatsinghpur, Odisha';
  try {
    await navigator.clipboard.writeText(text);
    $('#copyStatus').textContent = 'Location copied.';
  } catch {
    $('#copyStatus').textContent = text;
  }
});
