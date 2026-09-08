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
// Each slide remains available without JavaScript through native scrolling.
document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const track=carousel.querySelector('.slides'),slides=[...track.children],counter=carousel.querySelector('[data-count]'),play=carousel.querySelector('[data-play]');
  let index=0,timer=null,playing=false,visible=true;
  const update=()=>{if(!track.clientWidth)return;index=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));counter.textContent=`${index+1} / ${slides.length}`;};
  const go=delta=>{index=(index+delta+slides.length)%slides.length;track.scrollTo({left:track.clientWidth*index,behavior:motion()});};
  const stop=()=>{playing=false;clearInterval(timer);timer=null;play.textContent='播放';play.setAttribute('aria-pressed','false');};
  const schedule=()=>{clearInterval(timer);timer=null;if(playing&&!document.hidden&&visible&&!reduced.matches)timer=setInterval(()=>go(1),5500);};
  carousel.querySelector('[data-prev]').addEventListener('click',()=>{stop();go(-1);});
  carousel.querySelector('[data-next]').addEventListener('click',()=>{stop();go(1);});
  carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();stop();go(e.key==='ArrowRight'?1:-1);}});
  track.addEventListener('scroll',update,{passive:true});
  track.addEventListener('pointerdown',stop);
  play.addEventListener('click',()=>{if(playing)stop();else if(!reduced.matches){playing=true;play.textContent='暂停';play.setAttribute('aria-pressed','true');schedule();}});
  carousel.addEventListener('mouseenter',()=>clearInterval(timer));
  carousel.addEventListener('mouseleave',schedule);
  carousel.addEventListener('focusin',e=>{if(e.target!==play)stop();});
  document.addEventListener('visibilitychange',schedule);
  reduced.addEventListener('change',stop);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(carousel);
  let previousWidth=track.clientWidth;new ResizeObserver(()=>{if(track.clientWidth&&track.clientWidth!==previousWidth){previousWidth=track.clientWidth;track.scrollTo({left:index*track.clientWidth,behavior:'instant'});}}).observe(track);
});
const feature=document.querySelector('[data-feature]');
if(feature){
 const frames=[...feature.children];let index=0;
 const change=delta=>{index=(index+delta+frames.length)%frames.length;frames.forEach((frame,i)=>{frame.hidden=i!==index;frame.classList.toggle('is-entering',i===index);});document.querySelector('[data-feature-count]').textContent=`${index+1} / ${frames.length}`;};
 document.querySelector('[data-feature-prev]').addEventListener('click',()=>change(-1));
 document.querySelector('[data-feature-next]').addEventListener('click',()=>change(1));
}
function filters(buttonSelector,itemSelector,key,counterSelector,noun){
 const buttons=[...document.querySelectorAll(buttonSelector)],items=[...document.querySelectorAll(itemSelector)];
 buttons.forEach(button=>button.addEventListener('click',()=>{
 const selected=button.dataset[key];buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 items.forEach(item=>item.hidden=selected!=='all'&&item.dataset[key==='filter'?'category':'awardCategory']!==selected);
 document.querySelector(counterSelector).textContent=`${items.filter(i=>!i.hidden).length} ${noun}`;
 }));
}
filters('[data-filter]','.project-case','filter','[data-filter-count]','个代表项目');
filters('[data-award-filter]','.award-card','awardFilter','[data-award-count]','份记录');
// This is a public product preview. It never reads the private research workspace.
document.querySelectorAll('[data-meow]').forEach(demo=>{
 const tabs=[...demo.querySelectorAll('[data-demo]')];
 const choose=tab=>{tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!selected;});};
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>choose(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=tabs[(index+1)%tabs.length];if(e.key==='ArrowLeft')next=tabs[(index-1+tabs.length)%tabs.length];if(e.key==='Home')next=tabs[0];if(e.key==='End')next=tabs.at(-1);if(next){e.preventDefault();choose(next);next.focus();}});});
 demo.querySelector('.demo-convert').addEventListener('click',e=>{const done=e.target.getAttribute('aria-pressed')==='true';e.target.setAttribute('aria-pressed',String(!done));e.target.textContent=done?'把讨论变成行动':'重置示例';demo.querySelector('.demo-action').textContent=done?'讨论结论已整理，等待加入行动计划。':'已加入示例行动：整理调度策略对比材料。';});
});
