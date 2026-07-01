/* NAVIGATION */
const pageNames = {
  dashboard:'📊 Executive Dashboard',
  marketplace:'🛒 Online Marketplace — Customer Layer',
  orders:'📦 Orders & Tracking',
  payment:'💳 Payment Engine',
  booking:'📅 Workshop Booking Engine',
  pos:'🧾 POS & Mauzo',
  inventory:'📦 Inventory / Stoo Management',
  workshop:'🔧 Workshop Bay Monitor',
  warranty:'🛡️ Warranty & CRM',
  fleet:'🚛 Fleet B2B Portal',
  finance:'💰 Finance & Reports',
  hr:'👥 Human Resources',
  display:'📺 Smart TV Display',
  bi:'🧠 Business Intelligence',
  ai:'🤖 AI Analytics Engine',
  green:'♻️ Green Recycling Program',
  branch:'🏪 Branch Management',
  settings:'⚙️ System Settings'
};

function nav(id, el) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const sc = document.getElementById('sc-' + id);
  if (sc) sc.classList.add('active');
  document.getElementById('page-title').textContent = pageNames[id] || 'Dashboard';
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
}

/* CLOCK */
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('sw-TZ', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
  const date = now.toLocaleDateString('sw-TZ', {weekday:'short', year:'numeric', month:'short', day:'numeric'});
  const timeShort = now.toLocaleTimeString('sw-TZ', {hour:'2-digit', minute:'2-digit'});

  const clk = document.getElementById('clock');
  const ds = document.getElementById('date-str');
  const tt = document.getElementById('ticker-time');
  if (clk) clk.textContent = time;
  if (ds) ds.textContent = date;
  if (tt) tt.textContent = date;

  const tvC = document.getElementById('tv-clock');
  const tvD = document.getElementById('tv-date');
  if (tvC) tvC.textContent = timeShort;
  if (tvD) tvD.textContent = date;
}
setInterval(updateClock, 1000);
updateClock();

/* COUNTER ANIMATIONS */
function animateCounter(el) {
  const raw = el.dataset.count;
  const target = parseFloat(raw);
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Number.isInteger(target) ? Math.floor(current).toLocaleString() : current.toFixed(1);
  }, 20);
}
setTimeout(() => {
  document.querySelectorAll('[data-count]').forEach(animateCounter);
}, 500);

/* TOAST NOTIFICATIONS */
function toast(message, type) {
  type = type || 'teal';
  const icons = { green:'✅', red:'❌', gold:'⚡', teal:'🌱', blue:'ℹ️', purple:'🤖' };
  const classes = { green:'toast-green', red:'toast-red', gold:'toast-gold', teal:'toast-teal', blue:'toast-teal', purple:'toast-purple' };
  const container = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast ' + (classes[type] || 'toast-teal');
  t.innerHTML = '<span style="font-size:1rem;flex-shrink:0">' + (icons[type] || 'ℹ️') + '</span><span>' + message + '</span>';
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(20px)';
    t.style.transition = 'all 0.4s ease';
    setTimeout(() => t.remove(), 400);
  }, 3500);
}

/* POS CALCULATOR */
function posCalc() {
  const base = parseInt(document.getElementById('pos-item').value) || 0;
  const qty = parseInt(document.getElementById('pos-qty').value) || 1;
  const disc = parseFloat(document.getElementById('pos-disc').value) || 0;
  const total = Math.round(base * (qty / 4) * (1 - disc / 100));
  document.getElementById('pos-total').textContent = 'TZS ' + total.toLocaleString();
}

function doSale() {
  const name = document.getElementById('pos-name').value;
  const phone = document.getElementById('pos-phone').value;
  const total = document.getElementById('pos-total').textContent;
  const pay = document.getElementById('pos-pay').value;
  if (!name) { toast('Jaza jina la mteja!', 'red'); return; }

  const time = new Date().toLocaleTimeString('sw-TZ', {hour:'2-digit', minute:'2-digit'});
  const tbody = document.getElementById('sales-body');
  const tr = document.createElement('tr');
  tr.innerHTML = '<td>'+time+'</td><td>Bidhaa mpya</td><td>'+name+'</td><td class="text-green fw-700">'+total.replace('TZS ','')+'</td><td><span class="badge badge-teal">'+pay+'</span></td>';
  tbody.insertBefore(tr, tbody.firstChild);

  toast('✅ Sale ya '+name+' – '+total+' imekamilika!', 'green');

  if (phone) {
    const msg = '✅ RISITI – TYRE PLAZA\n\nHabari '+name+'!\n\nMalipo yako: '+total+'\nNjia: '+pay+'\n\nAsante kwa biashara!\n\n📍 Pamba Road, Mwanza\n📞 0719 231 796';
    window.open('https://wa.me/255'+phone.replace(/^0/,'').replace(/\s/g,'')+'?text='+encodeURIComponent(msg), '_blank');
  }
}

/* MARKETPLACE CART */
const cartItems = [];

function addToCart(name, size) {
  cartItems.push({ name: name, size: size, id: Date.now() });
  document.getElementById('cart-section').style.display = 'block';
  renderCart();
  toast(name+' ('+size+') imeongezwa cart! 🛒', 'teal');
}

function renderCart() {
  const el = document.getElementById('cart-items');
  el.innerHTML = cartItems.map(function(item, i) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.8rem;background:rgba(255,255,255,0.03);border-radius:6px;margin-bottom:0.4rem;font-size:0.76rem;border:1px solid var(--border)">'+
      '<span class="text-white fw-700">'+item.name+'</span>'+
      '<span style="color:var(--dim)">'+item.size+'</span>'+
      '<button onclick="removeFromCart('+i+')" style="background:none;border:none;color:var(--red2);cursor:pointer;font-size:0.85rem;padding:0.1rem 0.3rem">✕</button>'+
      '</div>';
  }).join('');
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  if (!cartItems.length) document.getElementById('cart-section').style.display = 'none';
  else renderCart();
}

function clearCart() {
  cartItems.length = 0;
  document.getElementById('cart-section').style.display = 'none';
}

function submitOrder() {
  const name = document.getElementById('cart-name').value;
  const phone = document.getElementById('cart-phone').value;
  const branch = document.getElementById('cart-branch').value;
  if (!name || !phone) { toast('Jaza jina na simu!', 'red'); return; }

  let msg = '🛒 ODA MPYA – TYRE PLAZA\n\n👤 Jina: '+name+'\n📞 Simu: '+phone+'\n🏪 Tawi: '+branch+'\n\n📦 Bidhaa:\n';
  cartItems.forEach(function(item, i) { msg += (i+1)+'. '+item.name+' – '+item.size+'\n'; });
  msg += '\nAsante! Tutawasiliana nawe hivi karibuni.\n\n📍 Pamba Road, Mwanza\n📞 0719 231 796';

  window.open('https://wa.me/255'+phone.replace(/^0/,'').replace(/\s/g,'')+'?text='+encodeURIComponent(msg), '_blank');
  toast('Oda imetumwa WhatsApp! 🛒', 'green');
  clearCart();
  document.getElementById('cart-name').value = '';
  document.getElementById('cart-phone').value = '';
}

function mpFilter() {
  const cat = document.getElementById('mp-cat').value;
  document.querySelectorAll('#mp-grid .prod-card').forEach(function(card) {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
}

/* WARRANTY & CRM */
const warrantyRecords = [];

function saveWarranty() {
  const name = document.getElementById('w-name').value;
  const phone = document.getElementById('w-phone').value;
  const brand = document.getElementById('w-brand').value;
  const size = document.getElementById('w-size').value;
  const car = document.getElementById('w-car').value;
  const plate = document.getElementById('w-plate').value;
  const period = document.getElementById('w-period').value;

  if (!name || !phone || !size) { toast('Jaza sehemu zinazohitajika!', 'red'); return; }

  warrantyRecords.push({ name:name, phone:phone, brand:brand, size:size, car:car, plate:plate, period:period });

  const tbody = document.querySelector('#warranty-table tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = '<td><div class="td-white">'+name+'</div><small style="color:var(--muted)">'+phone+'</small></td>'+
    '<td>'+brand+'<br><small>'+size+'</small></td>'+
    '<td>'+(car||'-')+'<br><small>'+(plate||'-')+'</small></td>'+
    '<td><span class="badge badge-green">'+period+'</span></td>'+
    '<td><span class="badge badge-green">Active</span></td>'+
    '<td><button class="btn btn-gold btn-sm" onclick="sendWA(\''+name+'\',\''+phone.replace(/\s/g,'')+'\',\'reminder\')">💬</button></td>';
  tbody.insertBefore(tr, tbody.firstChild);

  document.getElementById('warranty-count').textContent = (warrantyRecords.length + 3) + ' records';

  const msg = '🛡️ WARANTI YAKO – TYRE PLAZA\n\nHabari '+name+'!\n\nWaranti yako imesajiliwa:\n🛞 '+brand+' '+size+'\n🚗 '+car+' ('+plate+')\n📅 Muda: '+period+'\n\nKwa maswali:\n📞 0719 231 796\nTyre Plaza – Pamba Road, Mwanza';
  window.open('https://wa.me/255'+phone.replace(/^0/,'').replace(/\s/g,'')+'?text='+encodeURIComponent(msg), '_blank');

  toast('Waranti ya '+name+' imehifadhiwa! 🛡️', 'purple');
  ['w-name','w-phone','w-dot','w-car','w-plate','w-size'].forEach(function(id) {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

function sendWA(name, phone, type) {
  let msg;
  if (type === 'rotation') {
    msg = '⏰ KIKUMBUSHO – TYRE PLAZA\n\nHabari '+name+'!\n\nKilomita zimefika. Wakati wa:\n🔄 Tyre Rotation\n📐 Alignment Check\n\nTembelea Tyre Plaza!\n📍 Pamba Road, Mwanza\n📞 0719 231 796';
  } else {
    msg = '👋 UJUMBE KUTOKA TYRE PLAZA\n\nHabari '+name+'!\n\nTunataka kukuuliza kuhusu tairi/betri zako. Je, kuna chochote unachohitaji?\n\n📞 0719 231 796\nTyre Plaza – Pamba Road, Mwanza';
  }
  window.open('https://wa.me/255'+phone.replace(/^0/,'').replace(/\s/g,'')+'?text='+encodeURIComponent(msg), '_blank');
  toast('Ujumbe umetumwa kwa '+name+'!', 'gold');
}

/* WORKSHOP */
function startWorkshopJob() {
  const name = document.getElementById('bj-name').value;
  const car = document.getElementById('bj-car').value;
  if (!name || !car) { toast('Jaza taarifa za gari!', 'red'); return; }
  toast(car+' ya '+name+' – Kazi imeanza Bay 4! 🔧', 'teal');
  document.getElementById('bj-name').value = '';
  document.getElementById('bj-car').value = '';
}

/* GREEN POINTS */
function calcGP() {
  const qty = parseInt(document.getElementById('g-qty').value) || 0;
  const ptsPerTyre = parseInt(document.getElementById('g-size').value) || 40;
  const total = qty * ptsPerTyre;
  document.getElementById('gp-calc').textContent = total + ' pts';
  document.getElementById('gp-disc').textContent = (total * 100).toLocaleString();
}

function saveGreenPoints() {
  const name = document.getElementById('g-name').value;
  const phone = document.getElementById('g-phone').value;
  const pts = document.getElementById('gp-calc').textContent;
  const disc = document.getElementById('gp-disc').textContent;
  if (!name || !phone) { toast('Jaza jina na simu!', 'red'); return; }

  const msg = '🌱 GREEN POINTS – TYRE PLAZA\n\nHabari '+name+'!\n\nAsante kwa kulinda mazingira! ♻️\n\nUmepata: '+pts+'\nPunguzo lako: TZS '+disc+' kwenye ununuzi wako ujao.\n\n📍 Pamba Road, Mwanza\n📞 0719 231 796';
  window.open('https://wa.me/255'+phone.replace(/^0/,'').replace(/\s/g,'')+'?text='+encodeURIComponent(msg), '_blank');
  toast(name+' amepata '+pts+'! 🌱', 'teal');
  document.getElementById('g-name').value = '';
  document.getElementById('g-phone').value = '';
}

/* TV DISPLAY */
function updateTV() {
  const parts = document.getElementById('tv-select').value.split('|');
  const ids = ['tv-brand', 'tv-name', 'tv-size', 'tv-warranty'];
  ids.forEach(function(id, i) {
    const el = document.getElementById(id);
    if (el && parts[i]) el.textContent = parts[i];
  });
}

const tvProducts = [
  'Blackhawk|HS918 DRIVE TYRE|315/80R22.5 · 295/80R22.5|1yr Warranty',
  'Mixed|STOCK MPYA – 17 INCH|215/60R17 · 225/65R17 · 235/65R17|Warranty',
  'Mixed|STOCK MPYA – 18 INCH|225/60R18 · 235/60R18|Warranty',
  'Dunlop|SP SPORT MAXX|195/65R15 · 205/65R15|2yr Warranty',
  'BF Goodrich|ALL-TERRAIN KO2|265/65R17 · 285/60R18|2yr Warranty',
  'Dynablack|HEAVY DUTY DRIVE|11.00R20 · 10.00R20|1yr Warranty'
];
let tvIndex = 0;
setInterval(function() {
  tvIndex = (tvIndex + 1) % tvProducts.length;
  const parts = tvProducts[tvIndex].split('|');
  ['tv-brand','tv-name','tv-size','tv-warranty'].forEach(function(id, i) {
    const el = document.getElementById(id);
    if (el) { el.style.opacity = '0'; setTimeout(function() { el.textContent = parts[i] || ''; el.style.opacity = '1'; }, 300); }
  });
}, 5000);

/* KEYBOARD SHORTCUTS */
document.addEventListener('keydown', function(e) {
  if (!e.altKey) return;
  const map = {
    '1':'dashboard', '2':'marketplace', '3':'pos', '4':'inventory',
    '5':'workshop', '6':'warranty', '7':'fleet', '8':'finance',
    '9':'ai', '0':'green'
  };
  if (map[e.key]) nav(map[e.key], null);
});

/* INITIALIZATION */
setTimeout(function() {
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Habari za asubuhi' : h < 17 ? 'Habari za mchana' : 'Habari za jioni';
  toast(greeting+'! Tyre Plaza Corporate OS™ v5.0 iko tayari. ⚡', 'teal');
}, 1000);

setTimeout(function() { toast('🚨 AI Alert: BF Goodrich KO2 vitengo 3 tu — itaisha leo!', 'red'); }, 3000);
setTimeout(function() { toast('🛒 Online Order #TP-2025-013 mpya imetoka Marketplace!', 'gold'); }, 5000);
