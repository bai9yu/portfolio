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
filters('[data-award-filter]','.award-card','awardFilter','[data-award-count]','份记录');
