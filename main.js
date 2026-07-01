/* ══════════════════════════════════════
   TYRE PLAZA – main.js v2.0
   TEUS Technology © 2025
══════════════════════════════════════ */

// ── NAV ──
function initNav(){
  const ham=document.querySelector('.nav-hamburger');
  const links=document.querySelector('.nav-links');
  if(ham&&links) ham.addEventListener('click',()=>links.classList.toggle('open'));
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const h=a.getAttribute('href')||'';
    if(h.endsWith(page)||h===page) a.classList.add('active');
  });
}

// ── SCROLL REVEAL ──
function initReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible')});
  },{threshold:.1});
  document.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach(el=>obs.observe(el));
}

// ── COUNTER ──
function animCount(el){
  const target=+el.dataset.target,suf=el.dataset.suffix||'',dur=1600;
  const step=target/(dur/16);let cur=0;
  const t=setInterval(()=>{
    cur+=step;
    if(cur>=target){cur=target;clearInterval(t)}
    el.textContent=Math.floor(cur).toLocaleString()+suf;
  },16);
}
function initCounters(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){animCount(e.target);obs.unobserve(e.target)}});
  },{threshold:.5});
  document.querySelectorAll('[data-target]').forEach(el=>obs.observe(el));
}

// ── LIGHTBOX ──
function initLightbox(){
  const lb=document.getElementById('lightbox');
  if(!lb) return;
  const img=lb.querySelector('.lb-img'),cap=lb.querySelector('.lb-caption');
  document.querySelectorAll('[data-lb]').forEach(el=>{
    el.style.cursor='zoom-in';
    el.addEventListener('click',()=>{
      img.src=el.dataset.src||el.src||'';
      if(cap) cap.textContent=el.dataset.cap||el.alt||'';
      lb.classList.add('open');document.body.style.overflow='hidden';
    });
  });
  const close=()=>{lb.classList.remove('open');document.body.style.overflow=''};
  lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-close')) close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') close()});
}

// ── FILTER ──
function initFilter(){
  document.querySelectorAll('.tag-filter').forEach(tf=>{
    tf.querySelectorAll('.tag-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        tf.querySelectorAll('.tag-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat=btn.dataset.cat;
        document.querySelectorAll('[data-filter]').forEach(item=>{
          const show=cat==='all'||item.dataset.filter===cat;
          item.style.display=show?'':'none';
          if(show) setTimeout(()=>item.classList.add('visible'),50);
        });
      });
    });
  });
}

// ── WHATSAPP ──
function waEnquiry(product,size='',brand=''){
  const phone='255767638987';
  let msg=`Habari Tyre Plaza! 🛞\n\nNaomba maelezo/bei ya:\n`;
  if(brand) msg+=`Brand: ${brand}\n`;
  if(product) msg+=`Bidhaa: ${product}\n`;
  if(size) msg+=`Size: ${size}\n`;
  msg+=`\nAsante. (Toka website: tyreplaza.co.tz)`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank');
}

// ── RFQ CART ──
const rfqCart={items:[],
  add(name,size,brand){
    this.items.push({name,size,brand,id:Date.now()});
    this.updateBadge();
    showToast(`✓ Imeongezwa kwenye RFQ: ${name}`,'green');
  },
  remove(id){this.items=this.items.filter(i=>i.id!==id);this.updateBadge()},
  updateBadge(){
    const b=document.querySelector('.rfq-badge');
    if(b) b.textContent=this.items.length;
    if(b) b.style.display=this.items.length?'flex':'none';
  },
  sendWhatsApp(){
    if(!this.items.length){showToast('Ongeza bidhaa kwanza!','red');return}
    const phone='255767638987';
    let msg=`Habari Tyre Plaza! 📋\n\nNINAPELEKA OMBI LA BEI (RFQ):\n\n`;
    this.items.forEach((it,i)=>{msg+=`${i+1}. ${it.brand} ${it.name} – Size: ${it.size}\n`});
    msg+=`\nTafadhali nipelekee bei za bidhaa hizi.\nAsante! (tyreplaza.co.tz)`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank');
  }
};

// ── TOAST ──
function showToast(msg,type='green'){
  const colors={green:'#22C55E',red:'#C0181A',gold:'#F5A800'};
  const t=document.createElement('div');
  t.style.cssText=`position:fixed;bottom:5.5rem;left:50%;transform:translateX(-50%) translateY(20px);
    background:${colors[type]||colors.green};color:#fff;padding:.75rem 1.8rem;
    border-radius:6px;font-family:'Montserrat',sans-serif;font-size:.85rem;font-weight:700;
    letter-spacing:.05em;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,.4);
    animation:toastIn .3s ease forwards;white-space:nowrap;`;
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(-50%) translateY(-10px)';setTimeout(()=>t.remove(),400)},3200);
}
const tStyle=document.createElement('style');
tStyle.textContent=`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`;
document.head.appendChild(tStyle);

// ── VEHICLE FINDER ──
const vehicleData={
  Toyota:{
    Prado:{'2015-2024':['265/65R17','285/60R18']},
    Hilux:{'2010-2024':['265/65R17','215/65R16']},
    Corolla:{'2014-2024':['195/65R15','205/65R15']},
    Vitz:{'2010-2024':['175/65R14','195/65R15']},
    Fielder:{'2012-2024':['195/65R15','205/65R15']},
    Auris:{'2012-2024':['195/65R15','215/60R16']},
    Wish:{'2010-2024':['205/65R15','215/60R16']},
    Rush:{'2018-2024':['215/65R16','225/65R17']},
    Fortuner:{'2016-2024':['265/65R17','235/65R17']},
    RAV4:{'2014-2024':['225/65R17','235/60R18']},
    Vanguard:{'2010-2020':['225/65R17','235/60R18']},
    Harrier:{'2014-2024':['225/60R18','235/60R18']},
    Highlander:{'2014-2024':['235/65R17','235/60R18']},
    Land_Cruiser:{'2010-2024':['275/70R18','265/65R17']},
  },
  Nissan:{
    Navara:{'2015-2024':['265/60R18','265/65R17']},
    X_Trail:{'2014-2024':['225/65R17','215/60R17']},
    Note:{'2012-2024':['195/65R15','205/65R15']},
    Tiida:{'2010-2020':['195/65R15','205/65R15']},
    Patrol:{'2010-2024':['275/70R16','265/65R17']},
  },
  Isuzu:{D_Max:{'2012-2024':['255/70R16','265/65R17']},FVZ:{'2010-2024':['10.00R20','11.00R20']},NQR:{'2010-2024':['7.50R16','8.25R16']}},
  Mercedes:{Actros:{'2010-2024':['315/80R22.5','295/80R22.5']},Sprinter:{'2014-2024':['225/75R16C','215/65R16C']}},
  Scania:{R_Series:{'2010-2024':['315/80R22.5','295/80R22.5']}},
  Mitsubishi:{
    Canter:{'2010-2024':['7.00R16','7.50R16']},
    Pajero:{'2012-2024':['265/65R17','255/70R16']},
    Outlander:{'2014-2024':['225/60R18','235/60R18']},
  },
  Subaru:{
    Forester:{'2013-2024':['225/60R17','225/65R17']},
    Outback:{'2015-2024':['225/60R18','235/60R18']},
    XV:{'2017-2024':['225/60R17','235/65R17']},
    Legacy:{'2010-2024':['215/60R16','215/65R16']},
  },
  Honda:{
    CR_V:{'2013-2024':['225/65R17','235/60R18']},
    Fit:{'2010-2024':['185/65R15','195/65R15']},
    Freed:{'2011-2024':['185/65R15','195/65R15']},
    Vezel:{'2014-2024':['215/60R16','225/65R17']},
  },
  Mazda:{
    CX_5:{'2013-2024':['225/65R17','225/60R18']},
    Demio:{'2010-2024':['185/65R15','195/65R15']},
    Atenza:{'2013-2024':['215/60R16','225/65R17']},
  },
};
function populateVFMake(){
  const mk=document.getElementById('vf-make');if(!mk)return;
  Object.keys(vehicleData).forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m.replace(/_/g,' ');mk.appendChild(o)});
  mk.addEventListener('change',populateVFModel);
}
function populateVFModel(){
  const mk=document.getElementById('vf-make').value;
  const mo=document.getElementById('vf-model');
  mo.innerHTML='<option value="">-- Chagua Model --</option>';
  document.getElementById('vf-year').innerHTML='<option value="">-- Chagua Mwaka --</option>';
  document.getElementById('vf-results').innerHTML='';
  if(vehicleData[mk]) Object.keys(vehicleData[mk]).forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m.replace(/_/g,' ');mo.appendChild(o)});
  mo.addEventListener('change',populateVFYear);
}
function populateVFYear(){
  const mk=document.getElementById('vf-make').value,mo=document.getElementById('vf-model').value;
  const yr=document.getElementById('vf-year');
  yr.innerHTML='<option value="">-- Chagua Mwaka --</option>';
  document.getElementById('vf-results').innerHTML='';
  if(vehicleData[mk]&&vehicleData[mk][mo]) Object.keys(vehicleData[mk][mo]).forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;yr.appendChild(o)});
}
function findTyres(){
  const mk=document.getElementById('vf-make').value,mo=document.getElementById('vf-model').value,yr=document.getElementById('vf-year').value;
  const res=document.getElementById('vf-results');
  if(!mk||!mo||!yr){res.innerHTML='<p style="color:var(--gold);font-size:.85rem;">⚠️ Tafadhali chagua gari lako kwanza.</p>';return}
  const sizes=(vehicleData[mk]&&vehicleData[mk][mo]&&vehicleData[mk][mo][yr])||[];
  if(!sizes.length){res.innerHTML='<p style="color:var(--muted);">Hakuna data kwa gari hili. Wasiliana nasi.</p>';return}
  res.innerHTML=`
    <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);border-radius:8px;padding:1.5rem;">
      <p style="color:var(--green);font-size:.8rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1rem;">
        ✓ Ukubwa Unaofaa: ${mk.replace(/_/g,' ')} ${mo.replace(/_/g,' ')} (${yr})
      </p>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap;margin-bottom:1.2rem;">
        ${sizes.map(s=>`<span style="background:var(--navy);border:1px solid rgba(245,168,0,.3);color:var(--gold);padding:.5rem 1rem;border-radius:5px;font-family:'Montserrat',sans-serif;font-size:.9rem;font-weight:700;">${s}</span>`).join('')}
      </div>
      <button onclick="waEnquiry('Tairi ya ${mk.replace(/_/g,' ')} ${mo.replace(/_/g,' ')}','${sizes[0]}','')" class="btn btn-red btn-sm">
        💬 Uliza Bei WhatsApp
      </button>
    </div>`;
}

// ── COMPARISON TOOL ──
const compareList=[];
function addToCompare(name,brand,size,warranty,origin,country){
  if(compareList.length>=3){showToast('Unaweza kulinganisha bidhaa 3 tu!','red');return}
  if(compareList.find(i=>i.name===name)){showToast('Bidhaa hii ipo tayari!','gold');return}
  compareList.push({name,brand,size,warranty,origin,country});
  showToast(`✓ Imeongezwa kulinganishwa: ${name}`,'green');
  updateComparePanel();
}
function updateComparePanel(){
  const panel=document.getElementById('compare-panel');
  if(!panel) return;
  if(!compareList.length){panel.style.display='none';return}
  panel.style.display='flex';
  panel.innerHTML=`
    <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
      <span style="font-size:.8rem;color:var(--gold);font-weight:700;">KULINGANISHA (${compareList.length}/3):</span>
      ${compareList.map(i=>`<span style="background:var(--navy2);border:1px solid var(--border);padding:.3rem .8rem;border-radius:4px;font-size:.78rem;color:var(--white);">${i.brand} ${i.name}</span>`).join('')}
      <a href="pages/compare.html" class="btn btn-gold btn-sm">Linganisha Sasa →</a>
      <button onclick="clearCompare()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:.75rem;">✕ Futa</button>
    </div>`;
}
function clearCompare(){compareList.length=0;updateComparePanel()}

// ── INIT ──
document.addEventListener('DOMContentLoaded',()=>{
  initNav();initReveal();initCounters();initLightbox();initFilter();
  populateVFMake();
});
