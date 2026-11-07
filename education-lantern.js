/* THE IMPERIAL LANTERN — cursor-following reading light for every folio */
(function(){
"use strict";
if(window.__HINOMOTO_IMPERIAL_LANTERN_INSTALLED__)return;
window.__HINOMOTO_IMPERIAL_LANTERN_INSTALLED__=true;
const STORAGE_KEY="hinomoto-education-lantern-v1";
const readSaved=()=>{
 try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"false")===true}
 catch(_){return false}
};
const writeSaved=value=>{
 try{localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}
 catch(_){}
};
const style=document.createElement("style");
style.textContent=`
.imperial-lantern-spotlight{
 position:fixed;inset:0;z-index:145;pointer-events:none;opacity:0;
 background:
  radial-gradient(circle 225px at var(--imperial-lantern-x,50vw) var(--imperial-lantern-y,50vh),
   rgba(255,238,202,.22) 0%,rgba(255,226,177,.13) 38%,rgba(35,17,23,.035) 62%,rgba(18,8,14,.44) 100%),
  radial-gradient(circle 62px at var(--imperial-lantern-x,50vw) var(--imperial-lantern-y,50vh),
   rgba(255,246,221,.16),transparent 100%);
 transition:opacity .32s ease;
}
body.lantern-reading .imperial-lantern-spotlight{opacity:.94}
.imperial-lantern-toggle{
 display:inline-flex;align-items:center;justify-content:center;gap:6px;
 min-width:104px;height:46px;padding:0 16px;border:1px solid #c7a66b;
 border-radius:24px;background:linear-gradient(145deg,#fff4d9,#b98d4e);
 color:#381421;box-shadow:0 7px 22px rgba(37,13,22,.25);
 font:500 11px 'Shippori Mincho',serif;letter-spacing:.16em;cursor:pointer;
}
.imperial-lantern-toggle:before{content:"✧";color:#805b2d}
.imperial-lantern-toggle[aria-pressed="true"]{
 background:linear-gradient(135deg,#6a1a35,#2b101b);color:#f6e7c9;
 box-shadow:0 0 0 4px rgba(196,163,106,.18),0 8px 26px rgba(37,13,22,.28);
}
.imperial-lantern-toggle[aria-pressed="true"]:before{color:#f0d49b}
.imperial-lantern-dock{
 position:fixed;right:clamp(14px,2vw,24px);
 bottom:clamp(14px,2vw,24px);z-index:180;
}
@media(max-width:680px){
 .imperial-lantern-dock{right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px))}
 .imperial-lantern-dock .imperial-lantern-toggle{min-width:92px;height:42px;padding:0 12px;font-size:10px}
 .imperial-lantern-spotlight{
  background:
   radial-gradient(circle 172px at var(--imperial-lantern-x,50vw) var(--imperial-lantern-y,50vh),
    rgba(255,238,202,.20) 0%,rgba(255,226,177,.12) 38%,rgba(35,17,23,.035) 62%,rgba(18,8,14,.40) 100%),
   radial-gradient(circle 48px at var(--imperial-lantern-x,50vw) var(--imperial-lantern-y,50vh),
    rgba(255,246,221,.14),transparent 100%);
 }
}
@media(prefers-reduced-motion:reduce){.imperial-lantern-spotlight{transition:none}}
`;
document.head.appendChild(style);
const spotlight=document.createElement("div");
spotlight.className="imperial-lantern-spotlight";
spotlight.setAttribute("aria-hidden","true");
document.body.appendChild(spotlight);
let dock=document.querySelector(".renaissance-dock");
let button=document.querySelector(".renaissance-lantern-toggle");
if(!button){
 if(!dock){
  dock=document.createElement("div");
  dock.className="imperial-lantern-dock";
  dock.setAttribute("role","group");
  dock.setAttribute("aria-label","帝國教育廳の閲覧補助器具");
  document.body.appendChild(dock);
 }
 button=document.createElement("button");
 button.type="button";
 button.className="renaissance-lantern-toggle imperial-lantern-toggle";
 button.textContent="燈火";
 button.setAttribute("aria-label","燈火のカーソル照明を切り替える");
 button.title="燈火の閲覧モード";
 button.setAttribute("aria-pressed","false");
 dock.appendChild(button);
 button.addEventListener("click",()=>{
  const on=!document.body.classList.contains("lantern-reading");
  document.body.classList.toggle("lantern-reading",on);
  button.setAttribute("aria-pressed",String(on));
  button.title=on?"燈火を消す":"燈火をともす";
  writeSaved(on);
 });
}else{
 button.classList.add("imperial-lantern-toggle");
}
const saved=readSaved();
document.body.classList.toggle("lantern-reading",saved);
button.setAttribute("aria-pressed",String(saved));
button.title=saved?"燈火を消す":"燈火をともす";
function followPointer(event){
 document.documentElement.style.setProperty("--imperial-lantern-x",event.clientX+"px");
 document.documentElement.style.setProperty("--imperial-lantern-y",event.clientY+"px");
}
document.addEventListener("pointermove",followPointer,{passive:true});
document.addEventListener("pointerdown",followPointer,{passive:true});
})();
