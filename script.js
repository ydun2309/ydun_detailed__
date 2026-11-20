(() => {
const $ = s => document.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* NAV */
const nav = $('#nav'), links = $('#navLinks'), menuBtn = $('#menuBtn');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), {passive:true});
menuBtn.onclick = () => { const o = links.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o); };
links.querySelectorAll('a').forEach(a => a.onclick = () => links.classList.remove('open'));
const secs = [...document.querySelectorAll('section[id]')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), {rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s => spy.observe(s));

/* REVEAL */
const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => rv.observe(el));

/* JOURNEY */
const STEPS = [
  {t:'Every player receives an invitation', img:'section-one-illustration.svg',
   p:['Each player in the squad receives a personal invitation to join Ydun: a preventive health programme that gives them an overview of their own health — and concrete tools and motivation to improve it.',
      'Taking part is voluntary, and it is built to fit around the training schedule, not on top of it.'],
   tags:['Personal invitation','Voluntary','Squad-wide']},
  {t:'Ydun maps each player’s health profile', img:'section-two-illustration.svg',
   p:['Players sign up online, complete a short questionnaire and book a time with Ydun’s nurse, who takes physical measurements and blood tests at the training ground.',
      'For football, the profile can also include markers of gut health and recovery. Ydun’s algorithm turns the data into a personal health profile — the player’s baseline.'],
   note:'*All data is stored on the secure health data platform BioTell™, where players log in with MitID. The platform is developed in collaboration with KMD.',
   tags:['Questionnaire','Physical measures','Blood tests','Biomarkers']},
  {t:'Players get personal recommendations', img:'section-three-illustration.svg',
   p:['From their profile, every player receives an action plan with recommendations on match-day fuelling, recovery nutrition, hydration and sleep.',
      'Activities take place at the club, alongside the performance staff — often together with teammates: fuelling stations, cooking sessions and team meals.'],
   tags:['Fuelling','Recovery','Hydration','Team meals']},
  {t:'The feedback cycle kicks in', img:'section-four-illustration.svg',
   p:['The new habits start, and with them more energy for training and matches. After 12 weeks, players are invited to follow-up tests and can see how their values have moved against their own baseline.',
      'Ydun then offers new, adjusted recommendations — and once good habits are well established, the club can continue on its own.'],
   tags:['12-week retest','Own baseline','Adjust & repeat']}
];
const stepsEl = $('#steps'), stage = $('#stage'), jBox = $('#journeyBox');
let jIdx = 0, jTimer;
STEPS.forEach((s,i) => {
  const b = document.createElement('button');
  b.className = 'step-btn'; b.setAttribute('role','tab');
  b.innerHTML = `<span class="n">0${i+1}</span><span class="t">${s.t}</span><span class="bar"></span>`;
  b.onclick = () => { showStep(i); restartJ(); };
  stepsEl.appendChild(b);
});
function showStep(i){
  jIdx = i; const s = STEPS[i];
  [...stepsEl.children].forEach((b,k) => { b.classList.toggle('active', k===i); b.setAttribute('aria-selected', k===i); });
  const active = stepsEl.children[i]; const bar = active.querySelector('.bar');
  bar.style.animation='none'; bar.offsetWidth; bar.style.animation='';
  stage.innerHTML = `<img class="fade-in" src="assets/images/${s.img}" alt=""><div class="fade-in"><div class="eyebrow" style="margin-bottom:8px">Step 0${i+1} of 04</div><h3>${s.t}</h3>${s.p.map(x=>`<p>${x}</p>`).join('')}<div class="tags">${s.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>${s.note?`<p class="note">${s.note}</p>`:''}</div>`;
}
function restartJ(){ clearInterval(jTimer); if (!reduce) jTimer = setInterval(() => { if (!jBox.classList.contains('paused')) showStep((jIdx+1)%STEPS.length); }, 7000); }
jBox.addEventListener('mouseenter', () => jBox.classList.add('paused'));
jBox.addEventListener('mouseleave', () => jBox.classList.remove('paused'));
showStep(0); restartJ();

/* LOOP */
const NODES = [
  {n:'01',t:'Nutritional strategy',s:'Meals, timing, fuelling, hydration',ph:1,
   what:'The plan the nutrition staff set for the squad and for each player: daily meals, timing around sessions, match-day fuelling and hydration.',
   measure:['Periodised carbohydrate targets across the matchweek','Protein distribution across the day','Hydration and electrolyte strategy','Supplement policy'],
   out:'A clear, written prescription — the reference everything else is compared against.'},
  {n:'02',t:'What the player eats',s:'Actual intake and adherence',ph:1,
   what:'What actually reaches the plate. The gap between the plan and real intake is often where the most useful information sits.',
   measure:['Photo-based or logged intake at club meals','Match-day and travel-day intake','Adherence to fuelling targets','Self-reported GI tolerance'],
   out:'A realistic picture of intake per player, not an assumed one.'},
  {n:'03',t:'Biological response',s:'Microbiome, metabolites, biomarkers',ph:1,
   what:'How the body responds to what the player eats and to the training load.',
   measure:['Blood biomarkers from Ydun’s nurse','Gut microbiome and metabolite profiles','Repeated sampling to build a personal reference range'],
   out:'Each player’s biological baseline — the foundation for Phase 2.'},
  {n:'04',t:'Player response',s:'Recovery, GI health, illness, load',ph:2,
   what:'Once enough baseline data exists, biological changes are linked to what matters on the pitch.',
   measure:['Recovery and wellness scores','GI symptoms around matches','Illness days and availability','Training and match load'],
   out:'Evidence of whether a change in strategy made a functional difference for that player.'},
  {n:'05',t:'Feedback to the team',s:'Read against the player’s own baseline',ph:2,
   what:'A concise longitudinal view for the Head of Nutrition, so decisions are based on each player’s trend — not a squad average.',
   measure:['Individual trend dashboards','Flags when a player moves outside their own range','Before / after view for every intervention'],
   out:'Adjust the strategy — then measure again.'}
];
const CYCLE = ['Measure','Understand','Intervene','Measure response','Learn','Personalise'];
const cyc = $('#cycle'); cyc.innerHTML = CYCLE.map((c,i)=>`<span data-i="${i}">${c}</span>`).join(' → ');
const loopEl = $('#loopNodes'), det = $('#loopDetail');
NODES.forEach((d,i) => {
  const b = document.createElement('button');
  b.className = 'node' + (d.ph===2?' p2':'');
  b.innerHTML = `<div class="num">${d.n}<span class="ph">Phase ${d.ph}</span></div><h3>${d.t}</h3><p>${d.s}</p>`;
  b.onclick = () => { stopPlay(); showNode(i); };
  loopEl.appendChild(b);
});
const cycMap = [0,0,1,3,4]; // node -> cycle word
function showNode(i){
  const d = NODES[i];
  [...loopEl.children].forEach((b,k)=>b.classList.toggle('active',k===i));
  cyc.querySelectorAll('span').forEach((s,k)=>s.classList.toggle('on', i===0 ? k===2 : i===4 ? k>=4 : k===cycMap[i]));
  det.classList.remove('fade-in'); det.offsetWidth; det.classList.add('fade-in');
  det.innerHTML = `<div><h4>Step ${d.n} · Phase ${d.ph}</h4><h3>${d.t}</h3><p>${d.what}</p></div>
    <div><h4>What we look at</h4><ul>${d.measure.map(m=>`<li>${m}</li>`).join('')}</ul></div>
    <div><h4>What it gives the club</h4><p>${d.out}</p></div>`;
}
let playT = null; const playBtn = $('#playLoop');
function stopPlay(){ clearInterval(playT); playT=null; playBtn.textContent='▶ Play the loop'; }
playBtn.onclick = () => {
  if (playT) return stopPlay();
  let i = 0; showNode(0); playBtn.textContent='❚❚ Pause';
  playT = setInterval(()=>{ i=(i+1)%NODES.length; showNode(i); }, 2600);
};
showNode(0);

/* PLANNER */
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const T = {
  str:{label:'MD-4',name:'Strength & power day',focus:'Build & repair',cho:[4,5],plate:[['Breakfast','Oats, eggs, fruit, yoghurt'],['Pre-training','Toast with honey, banana'],['Post-training','Protein-rich lunch within 1 h'],['Evening','Lean protein, vegetables, moderate carbs']],tip:'Prioritise protein around the session to support muscle repair and adaptation.'},
  vol:{label:'MD-3',name:'High-intensity day',focus:'Fuel the load',cho:[5,7],plate:[['Breakfast','Porridge, fruit, milk'],['Pre-training','Rice cakes, jam, sports drink'],['During','Fluids + electrolytes'],['Post-training','Rice or pasta bowl with chicken or fish']],tip:'The heaviest training day of the week — fuel for the work required.'},
  mod:{label:'MD-2',name:'Moderate / tactical day',focus:'Top up',cho:[4,6],plate:[['Breakfast','Wholegrain bread, eggs, fruit'],['Lunch','Mixed plate: grains, protein, vegetables'],['Snack','Yoghurt with granola'],['Evening','Balanced dinner']],tip:'Lower load; keep protein steady and start topping up carbohydrate stores.'},
  act:{label:'MD-1',name:'Activation day',focus:'Load carbohydrate',cho:[6,8],plate:[['Breakfast','Pancakes, fruit, juice'],['Lunch','Pasta or rice, lean protein'],['Snacks','Bagel, dried fruit, milk'],['Evening','Carb-rich, familiar, low-fibre meal']],tip:'Carbohydrate loading begins. Keep foods familiar and moderate fibre to protect the gut.'},
  md:{label:'MD',name:'Match day',focus:'Perform',cho:[6,8],plate:[['3–4 h before','Carb-rich pre-match meal, low fat & fibre'],['2–4 h before','Around 5–7 ml/kg fluid'],['Half-time','Sports drink or gels + fluid'],['After','Carbs + protein as soon as practical']],tip:'Eat a tried-and-tested pre-match meal. Nothing new on match day.',match:true},
  rec:{label:'MD+1',name:'Recovery day',focus:'Refuel & repair',cho:[5,7],plate:[['Breakfast','Big recovery breakfast'],['Through the day','Protein every 3–4 h'],['Fluids','Replace sweat losses'],['Evening','Colourful plate: vegetables, fruit, fish']],tip:'Players with heavy minutes refuel hard; non-starters doing compensatory training need less.'},
  off:{label:'Off',name:'Day off',focus:'Maintain',cho:[3,4],plate:[['Meals','Regular, balanced meals'],['Protein','Keep 4–5 servings across the day'],['Fibre','Good day for vegetables & wholegrains'],['Fluids','Normal hydration']],tip:'Lower energy needs — keep protein up and enjoy variety.'},
  recD:{label:'MD+1 / MD-2',name:'Recovery into next match',focus:'Refuel fast',cho:[6,8],plate:[['Breakfast','Big recovery breakfast'],['Snacks','Every 2–3 h: carbs + protein'],['Fluids','Replace sweat losses'],['Evening','Carb-rich dinner']],tip:'With under 72 h between matches, recovery and loading overlap — stores must be refilled quickly.'},
};
// Mon..Sun. Single: Saturday match. Double: Wednesday + Saturday matches.
const SCHED = {
  single:['off','str','vol','mod','act','md','rec'],
  double:['recD','act','md','recD','act','md','rec']
};
let sched='single', mass=75, dayIdx=5;
const weekEl=$('#week'), fuelOut=$('#fuelOut');
function renderWeek(){
  weekEl.innerHTML='';
  SCHED[sched].forEach((k,i)=>{
    const d=T[k], mid=(d.cho[0]+d.cho[1])/2;
    const b=document.createElement('button');
    b.className='day'+(d.match?' match':'')+(i===dayIdx?' on':'');
    b.setAttribute('aria-pressed', i===dayIdx);
    b.innerHTML=`<span class="dn">${DAYS[i]}</span><span class="barwrap"><span class="b" style="height:${(mid/8)*100}%"></span></span><span class="md">${d.label.split(' / ')[0]}</span>`;
    b.onclick=()=>{dayIdx=i;renderWeek();renderDay();};
    weekEl.appendChild(b);
  });
}
function renderDay(){
  const d=T[SCHED[sched][dayIdx]];
  const lo=Math.round(d.cho[0]*mass/10)*10, hi=Math.round(d.cho[1]*mass/10)*10;
  const pLo=Math.round(1.6*mass/5)*5, pHi=Math.round(2.2*mass/5)*5;
  const serv=Math.round(0.3*mass)+'–'+Math.round(0.4*mass);
  fuelOut.innerHTML=`<div class="fade-in"><div class="focus">${DAYS[dayIdx]} · ${d.label} · ${d.focus}</div><h3>${d.name}</h3>
    <div class="big">
      <div class="metric"><div class="k">Carbohydrate</div><div class="v">${lo}–${hi} g</div><div class="s">${d.cho[0]}–${d.cho[1]} g per kg</div></div>
      <div class="metric"><div class="k">Protein</div><div class="v">${pLo}–${pHi} g</div><div class="s">1.6–2.2 g/kg · ${serv} g per serving</div></div>
    </div><p style="color:var(--soft)">${d.tip}</p></div>
    <div class="plate fade-in"><h4>Example day</h4><ul>${d.plate.map(p=>`<li><b>${p[0]}</b><span>${p[1]}</span></li>`).join('')}</ul></div>`;
}
$('#sched').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  sched=b.dataset.s; $('#sched').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
  dayIdx = SCHED[sched].indexOf('md'); renderWeek(); renderDay();
});
$('#mass').oninput=e=>{mass=+e.target.value;$('#massOut').textContent=mass+' kg';renderDay();};
renderWeek(); renderDay();

/* BASELINE CHART */
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}}
const METRICS = {
  gi:{name:'GI symptom score',unit:'score (0–10, higher = worse)',squad:[2.5,5.5],own:[0.6,2.0],base:1.3,noise:.35,spikes:{8:3.4,9:3.0,15:3.8},ymax:8,
      insight:'This player normally reports almost no gut symptoms. Against the squad range, weeks with a score of 3–4 look normal — against their own baseline they stand out. Weeks 9–10 followed a change to the pre-match meal.'},
  sleep:{name:'Sleep quality',unit:'score (0–100, higher = better)',squad:[60,85],own:[78,90],base:84,noise:2.5,spikes:{5:70,12:68,13:72,18:71},ymax:100,ymin:40,low:true,
      insight:'A high sleeper by nature. Scores around 70 are still inside the squad range, but they are a clear drop for this player — around congested fixture periods.'},
  ck:{name:'Creatine kinase (CK)',unit:'U/L',squad:[200,900],own:[250,520],base:380,noise:50,spikes:{6:780,11:820,17:760},ymax:1200,ymin:0,
      insight:'This player usually recovers fast. Post-match CK values around 800 U/L sit inside the squad range but are well above what is normal for them — a prompt to look at recovery fuelling.'}
};
let metric='gi', ref='own';
const svg=$('#chart'), tt=$('#tt'), W=720,H=320,P={l:52,r:28,t:22,b:38};
function series(k){const m=METRICS[k],r=rng(k.length*977+13);return Array.from({length:20},(_,i)=>{let v=m.spikes[i]!=null?m.spikes[i]:m.base+(r()-.5)*2*m.noise;return +v.toFixed(k==='ck'?0:1);});}
function drawChart(){
  const m=METRICS[metric], data=series(metric), band=ref==='own'?m.own:m.squad;
  const ymin=m.ymin??0, ymax=m.ymax;
  const x=i=>P.l+i*(W-P.l-P.r)/19, y=v=>P.t+(1-(v-ymin)/(ymax-ymin))*(H-P.t-P.b);
  const out=v=>m.low?v<band[0]:v>band[1];
  let g='';
  for(let k=0;k<=4;k++){const v=ymin+k*(ymax-ymin)/4;g+=`<line x1="${P.l}" x2="${W-P.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(202,221,200,.1)"/><text x="${P.l-10}" y="${y(v)+4}" text-anchor="end" fill="#B9CDB7" font-size="12">${metric==='ck'?Math.round(v):+v.toFixed(0)}</text>`;}
  [1,5,10,15,20].forEach(w=>g+=`<text x="${x(w-1)}" y="${H-12}" text-anchor="middle" fill="#B9CDB7" font-size="12">Wk ${w}</text>`);
  const bandCol=ref==='own'?'rgba(120,195,70,.16)':'rgba(202,221,200,.10)', bandStroke=ref==='own'?'rgba(120,195,70,.55)':'rgba(202,221,200,.35)';
  g+=`<rect x="${P.l}" y="${y(band[1])}" width="${W-P.l-P.r}" height="${y(band[0])-y(band[1])}" fill="${bandCol}" stroke="${bandStroke}" stroke-dasharray="4 4" rx="4" style="transition:all .5s"/>`;
  g+=`<text x="${W-P.r-8}" y="${y(band[1])-6}" text-anchor="end" fill="${ref==='own'?'#78C346':'#CADDC8'}" font-size="12" font-weight="700" stroke="#113F27" stroke-width="4" paint-order="stroke">${ref==='own'?'Player 07 normal range':'Squad range'}</text>`;
  const path=data.map((v,i)=>(i?'L':'M')+x(i)+','+y(v)).join('');
  g+=`<path d="${path}" fill="none" stroke="#F4F5F1" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  data.forEach((v,i)=>{const o=out(v);g+=`<circle class="pt" data-i="${i}" cx="${x(i)}" cy="${y(v)}" r="${o?7:4.5}" fill="${o?'#F07E4F':'#092D1A'}" stroke="${o?'#F07E4F':'#F4F5F1'}" stroke-width="2"/>`;
    g+=`<rect data-i="${i}" class="hit" x="${x(i)-16}" y="${P.t}" width="32" height="${H-P.t-P.b}" fill="transparent"/>`;});
  svg.innerHTML=g;
  const flagged=data.filter(out).length;
  $('#legend').innerHTML=`<span><i style="background:#F4F5F1"></i>${m.name} · ${m.unit}</span><span><i style="background:${bandStroke}"></i>Reference: ${ref==='own'?'own baseline':'squad average range'}</span><span><i style="background:#F07E4F;border-radius:50%;width:10px"></i>Flagged week</span>`;
  $('#insight').innerHTML=`<div class="eyebrow">${ref==='own'?'Against own baseline':'Against squad average'}</div><div class="count">${flagged}</div><h3>week${flagged===1?'':'s'} flagged out of 20</h3><p>${ref==='own'?m.insight:'Read against the squad range, this player looks unremarkable. Switch to <b>Own baseline</b> to see what the squad average hides.'}</p>`;
  svg.querySelectorAll('.hit').forEach(h=>{
    h.onmouseenter=h.onfocus=e=>{const i=+h.dataset.i,v=data[i];tt.innerHTML=`<b>Week ${i+1}</b> · ${v} ${metric==='ck'?'U/L':''}${out(v)?' <span style="color:#F07E4F">· flagged</span>':''}`;
      const r=svg.getBoundingClientRect(),s=r.width/W;tt.style.left=(svg.offsetLeft+x(i)*s-40)+'px';tt.style.top=(svg.offsetTop+y(v)*s-44)+'px';tt.style.opacity=1;};
    h.onmouseleave=()=>tt.style.opacity=0;
  });
}
$('#metric').onchange=e=>{metric=e.target.value;drawChart();};
$('#ref').querySelectorAll('button').forEach(b=>b.onclick=()=>{ref=b.dataset.r;$('#ref').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));drawChart();});
drawChart();

/* FAQ */
const FAQ={
  club:[
    ['What does it cost?','We offer three packages: Ydun Basis (a single health screening), Ydun Change (the health-promoting package) and Ydun Evolution (the full programme). Pricing depends on squad size and package — get in touch for a quote.'],
    ['How does it fit around the training week?','Testing, workshops and team meals all take place at the training ground and are scheduled with the performance staff around training and fixtures, so players do not lose recovery time.'],
    ['How is the testing done?','Ydun’s nurses come to the club and test all participating players. Follow-up measurements are repeated so each player builds a personal baseline over time.'],
    ['Does it replace our nutritionist?','No. Ydun supports the Head of Nutrition and performance staff with data and a longitudinal view. The strategy stays with your staff.'],
    ['How long is the commitment?','Clubs commit for three months at a time, with at least 30 days’ notice.']
  ],
  player:[
    ['Can the club see my private health data?','No. Your personal health data belongs to you and is stored securely on BioTell™.'],
    ['Where is my data stored?','Ydun’s servers are located in the EU and comply with GDPR and health-record requirements. You log in with MitID.'],
    ['What if I change clubs?','Your data stays with you at Ydun. If your new club also uses Ydun, you can keep following your own development.'],
    ['Is it voluntary?','Yes — taking part is 100% voluntary, and there is no requirement to join every activity.'],
    ['What do I get out of it?','A clear picture of your own health, practical advice on fuelling and recovery, and more energy for training and matches.']
  ]
};
const faqList=$('#faqList');
function renderFaq(k){
  faqList.innerHTML='';
  FAQ[k].forEach(([q,a],i)=>{const d=document.createElement('div');d.className='qa';
    d.innerHTML=`<button aria-expanded="false" id="q${k}${i}">${q}<span class="pm"></span></button><div class="a" role="region" aria-labelledby="q${k}${i}"><div><p>${a}</p></div></div>`;
    d.querySelector('button').onclick=()=>{const o=d.classList.toggle('open');d.querySelector('button').setAttribute('aria-expanded',o);};
    faqList.appendChild(d);});
}
$('#faqTabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('#faqTabs').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));renderFaq(b.dataset.f);});
renderFaq('club');
})();
