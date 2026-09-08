'use strict';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const motion = () => reduced.matches ? 'auto' : 'smooth';
// Image zoom uses a native modal for focus containment, Escape and focus restoration.
const lightbox = document.querySelector('#image-dialog');
let opener;
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  opener=button;
  lightbox.querySelector('img').src=button.dataset.zoom;
  lightbox.querySelector('img').alt=button.dataset.caption;
  lightbox.querySelector('#image-title').textContent=button.dataset.caption;
  lightbox.showModal();
}));
lightbox.querySelector('[data-close]').addEventListener('click',()=>lightbox.close());
lightbox.addEventListener('click',e=>{if(e.target===lightbox){const b=lightbox.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)lightbox.close();}});
lightbox.addEventListener('close',()=>opener?.focus({preventScroll:true}));
document.querySelector('.back-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:motion()}));
function filters(buttonSelector,itemSelector,key,counterSelector,noun){
 const buttons=[...document.querySelectorAll(buttonSelector)],items=[...document.querySelectorAll(itemSelector)];
 buttons.forEach(button=>button.addEventListener('click',()=>{
 const selected=button.dataset[key];buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 items.forEach(item=>item.hidden=selected!=='all'&&item.dataset[key==='filter'?'category':'awardCategory']!==selected);
 document.querySelector(counterSelector).textContent=`${items.filter(i=>!i.hidden).length} ${noun}`;
 }));
}


const topics=[['研途喵','把散落的文献、笔记与讨论，重新汇成一条清晰的研究线索。','meowscholar'],['多智能体记忆','让经验在时间里沉淀，让每一次调用都尊重来源、权限与边界。','memory'],['天枢','让不同能力的智能体理解同一项任务，在变化中协作，在约束中前行。','tianshu']];
document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{
 const i=Number(button.dataset.topic),[name,copy,id]=topics[i];
 document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelector('[data-topic-name]').textContent=name;document.querySelector('[data-topic-copy]').textContent=copy;document.querySelector('[data-topic-link]').href=`projects.html#${id}`;
 const globe=document.querySelector('.universe-globe');globe.style.filter=`hue-rotate(${i*32}deg)`;globe.style.rotate=`${i*12}deg`;
}));
document.querySelectorAll('[data-tour]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-tour]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 document.querySelectorAll('[data-tour-panel]').forEach(p=>p.hidden=p.dataset.tourPanel!==button.dataset.tour);
}));
const memorySteps=[['先判断，谁可以访问。','核对请求者、字段、用途与时效，再决定这次协作能够使用哪些信息。'],['再寻找，最相关的证据。','协调器依据节点目录选择来源，由来源节点完成本地检索与字段投影，返回必要的证据。'],['有缺口，就继续补证。','当已有证据不足以支撑回答时，向其他获准节点补充检索，保留来源并辨认版本冲突。'],['最后，让回答可以追溯。','融合证据并压缩上下文，保留审计记录；失效或撤销的信息需要退出后续的记忆使用。']];
let memoryIndex=0;
document.querySelector('[data-memory-next]')?.addEventListener('click',()=>{memoryIndex=(memoryIndex+1)%memorySteps.length;document.querySelector('[data-memory-title]').textContent=memorySteps[memoryIndex][0];document.querySelector('[data-memory-copy]').textContent=memorySteps[memoryIndex][1];document.querySelector('[data-memory-count]').textContent=`${memoryIndex+1} / 4`;document.querySelector('.memory-installation').dataset.stage=String(memoryIndex);});
document.querySelectorAll('[data-deck]').forEach(deck=>{let index=0;const slides=[...deck.querySelectorAll('.deck-slide')];function show(delta){index=(index+delta+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==index);deck.querySelector('[data-deck-count]').textContent=`${index+1} / ${slides.length}`;}deck.querySelector('[data-deck-prev]').addEventListener('click',()=>show(-1));deck.querySelector('[data-deck-next]').addEventListener('click',()=>show(1));});

// The ring is manual: chronology and keyboard access remain predictable.
const honorGallery=document.querySelector('.honor-gallery');
if(honorGallery){
 const allCards=[...honorGallery.querySelectorAll('.award-card')];
 const filterButtons=[...document.querySelectorAll('[data-award-filter]')];
 const stage=honorGallery.querySelector('.podium-stage');
 let selectedCategory='all',sortOrder='newest',activeIndex=0,cards=[];
 const dates=honorGallery.querySelector('.podium-dates');
 function renderRing(){
  const total=cards.length;
  allCards.forEach(card=>{card.hidden=true;card.inert=true;card.classList.remove('is-active','is-left','is-right');card.setAttribute('aria-hidden','true');});
  if(!total)return;
  const positions=[[activeIndex,'is-active']];
  if(total>1)positions.push([(activeIndex+1)%total,'is-right']);
  if(total>2)positions.push([(activeIndex-1+total)%total,'is-left']);
  positions.forEach(([i,cls])=>{const card=cards[i];card.hidden=false;card.classList.add(cls);if(cls==='is-active'){card.inert=false;card.removeAttribute('aria-hidden');}});
  const active=cards[activeIndex];
  const status=honorGallery.querySelector('[data-podium-status]'),meta=document.createElement('span'),title=document.createElement('strong');meta.textContent=`${activeIndex+1} / ${total} · ${active.querySelector('small').textContent}`;title.textContent=active.querySelector('h2').textContent;status.replaceChildren(meta,title);
  dates.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===activeIndex)));
  document.querySelector('[data-award-count]').textContent=`${total} 份记录`;
  honorGallery.querySelectorAll('.podium-arrow').forEach(b=>b.disabled=total<2);
 }
 function rebuild(){
  cards=allCards.filter(c=>selectedCategory==='all'||c.dataset.awardCategory===selectedCategory).sort((a,b)=>(sortOrder==='newest'?-1:1)*a.dataset.awardDate.localeCompare(b.dataset.awardDate));
  activeIndex=0;dates.replaceChildren();
  cards.forEach((card,i)=>{const b=document.createElement('button');b.type='button';b.textContent=card.querySelector('small').textContent;b.setAttribute('aria-label',`${b.textContent} ${card.querySelector('h2').textContent}`);b.addEventListener('click',()=>{activeIndex=i;renderRing();});dates.append(b);});
  renderRing();
 }
 function step(n){activeIndex=(activeIndex+n+cards.length)%cards.length;renderRing();}
 filterButtons.forEach(b=>b.addEventListener('click',()=>{selectedCategory=b.dataset.awardFilter;filterButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));rebuild();}));
 honorGallery.querySelector('[data-award-sort]').addEventListener('change',e=>{sortOrder=e.target.value;rebuild();});
 honorGallery.querySelector('[data-award-prev]').addEventListener('click',()=>step(-1));
 honorGallery.querySelector('[data-award-next]').addEventListener('click',()=>step(1));
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();stage.focus({preventScroll:true});step(e.key==='ArrowLeft'?-1:1);}});
 honorGallery.classList.add('podium-ready');rebuild();
}
