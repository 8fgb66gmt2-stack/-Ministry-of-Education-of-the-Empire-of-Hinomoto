/* THE IMPERIAL READING CABINET & MARGINALIA QUEST */
(function(){
"use strict";
const KEY="hinomoto-education-marginalia-v1";
const PAGE_KEY="hinomoto-education-pages-v1";
const $=(s,r=document)=>r.querySelector(s);
const safeRead=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||"null");return v??fallback}catch(_){return fallback}};
const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch(_){}};
const state=safeRead(KEY,{found:[],complete:false});
const seen=safeRead(PAGE_KEY,[]);
const path=(location.pathname.split("/").pop()||"index.html");
const pageNames={"index.html":"首頁","about.html":"教育廳について","institutions.html":"教育機關案内","archives.html":"教育史料室","notices.html":"告示・公表資料","sealed-folio.html":"封緘文庫","marginalia.html":"余白の書"};
if(!seen.includes(path)){seen.push(path);safeWrite(PAGE_KEY,seen)}
const pageTotal=6;
const fragments=[
 {id:"classics",page:"index.html",selector:".hero-index",hint:"第一の星章。知の星図の最初の方位を思い出す。"},
 {id:"freedom",page:"about.html",selector:"#philosophy .kicker",hint:"第二の星章。教育理念の頁に記された、学びを支えるもの。"},
 {id:"self",page:"archives.html",selector:"#education-theory .kicker",hint:"第三の星章。教育を受ける者が、最後に自分自身であるために。"}
];
function toast(message){
 let el=$(".renaissance-toast");if(!el){el=document.createElement("div");el.className="renaissance-toast";el.setAttribute("role","status");document.body.appendChild(el)}
 el.textContent=message;el.classList.add("is-shown");window.clearTimeout(toast.timer);toast.timer=window.setTimeout(()=>el.classList.remove("is-shown"),2600);
}
function openDialog(dialog){if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","")}
function closeDialog(dialog){if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open")}
function renderCabinet(){
 const dialog=$("#renaissance-dialog");if(!dialog)return;
 const foundCount=fragments.filter(x=>state.found.includes(x.id)).length;
 const pageCount=Math.min(seen.filter(x=>pageNames[x]&&x!=="marginalia.html").length,pageTotal);
 $("#renaissance-fragments",dialog).textContent=foundCount+" / 03";
 $("#renaissance-pages",dialog).textContent=pageCount+" / 06";
 const secret=$("#renaissance-secret",dialog);
 if(secret){secret.hidden=foundCount<3;secret.href="marginalia.html"}
 $$(".marginalia-mark").forEach(btn=>btn.classList.toggle("is-found",state.found.includes(btn.dataset.fragment)));
}
function collect(id){
 if(state.found.includes(id))return;
 state.found.push(id);safeWrite(KEY,state);
 const count=fragments.filter(x=>state.found.includes(x.id)).length;
 toast(count===3?"三つの星章が揃った。余白の頁がひらかれた。":"星章をひとつ収めた。");
 renderCabinet();
}
function installMarks(){
 fragments.forEach(fragment=>{
  if(path!==fragment.page)return;
  const target=$(fragment.selector);if(!target||$(".marginalia-mark",target))return;
  const button=document.createElement("button");button.type="button";button.className="marginalia-mark";
  button.dataset.fragment=fragment.id;button.setAttribute("aria-label","頁間に隠された星章を収める");
  button.title="頁間の星章";
  button.textContent="✧";
  button.addEventListener("click",()=>collect(fragment.id));
  target.appendChild(button);
 });
}
function installCabinet(){
 const dock=document.createElement("div");dock.className="renaissance-dock";
 const trigger=document.createElement("button");trigger.type="button";trigger.className="dock-main";trigger.textContent="學";trigger.setAttribute("aria-label","帝國教育廳・閲覧書架をひらく");trigger.title="閲覧書架";
 const dialog=document.createElement("dialog");dialog.className="renaissance-dialog";dialog.id="renaissance-dialog";
 dialog.innerHTML='<div class="renaissance-dialog-head"><button class="renaissance-dialog-close" type="button" aria-label="閉じる">×</button><small>THE IMPERIAL READING CABINET</small><h2>帝國教育廳　閲覧書架</h2></div><div class="renaissance-dialog-body"><div class="renaissance-status"><div class="renaissance-stat"><strong id="renaissance-fragments">0 / 03</strong><span>星章の蒐集</span></div><div class="renaissance-stat"><strong id="renaissance-pages">0 / 06</strong><span>頁の巡覧</span></div></div><nav class="renaissance-links" aria-label="閲覧書架"><a href="index.html"><strong>首頁</strong><small>THE PORTAL</small></a><a href="about.html"><strong>教育廳について</strong><small>THE MINISTRY</small></a><a href="institutions.html"><strong>教育機關案内</strong><small>INSTITUTIONS</small></a><a href="archives.html"><strong>教育史料室</strong><small>ARCHIVES</small></a><a href="notices.html"><strong>告示・公表資料</strong><small>PUBLIC RECORDS</small></a><a href="sealed-folio.html"><strong>封緘文庫</strong><small>THE SEALED FOLIO</small></a></nav><div class="renaissance-clue">頁のあいだには、三つの星章が隠されている。各頁を読み、星章を見つけて収めよ。三つ揃えば、もう一つの頁がひらかれる。<br><a id="renaissance-secret" href="marginalia.html" hidden>余白の書をひらく　✧</a></div></div>';
 const lantern=document.createElement("button");lantern.type="button";lantern.className="renaissance-lantern-toggle";lantern.textContent="燈火";lantern.setAttribute("aria-label","燈火の閲覧モードを切り替える");lantern.setAttribute("aria-pressed","false");lantern.title="燈火の閲覧モード";
 dock.append(trigger,lantern);document.body.append(dock,dialog);
 lantern.addEventListener("click",()=>{const on=document.body.classList.toggle("lantern-reading");lantern.setAttribute("aria-pressed",String(on));safeWrite("hinomoto-education-lantern-v1",on);toast(on?"燈火をともした。":"燈火を静めた。")});
 const savedLantern=safeRead("hinomoto-education-lantern-v1",false);document.body.classList.toggle("lantern-reading",!!savedLantern);lantern.setAttribute("aria-pressed",String(!!savedLantern));
 trigger.addEventListener("click",()=>{renderCabinet();openDialog(dialog)});
 $(".renaissance-dialog-close",dialog).addEventListener("click",()=>closeDialog(dialog));
 dialog.addEventListener("click",e=>{if(e.target===dialog)closeDialog(dialog)});
 dialog.addEventListener("close",()=>trigger.focus());
 document.addEventListener("keydown",e=>{if((e.altKey&&e.key.toLowerCase()==="i")&&!e.repeat){e.preventDefault();renderCabinet();openDialog(dialog)}});
 renderCabinet();
}
function installTransitions(){
 const veil=document.createElement("div");veil.className="renaissance-veil";veil.setAttribute("aria-hidden","true");document.body.appendChild(veil);
 document.addEventListener("click",event=>{
  const a=event.target.closest("a[href]");if(!a||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||a.target||a.hasAttribute("download"))return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||!url.pathname.endsWith(".html")||url.pathname===location.pathname||url.hash)return;
  event.preventDefault();veil.classList.add("is-active");window.setTimeout(()=>location.href=url.href,330);
 });
}
function installProgressRail(){
 const rail=document.createElement("div");rail.className="renaissance-progress";rail.setAttribute("aria-hidden","true");
 const fill=document.createElement("span");rail.appendChild(fill);document.body.appendChild(rail);
 let pending=false;
 const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;const value=max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0;fill.style.transform="scaleX("+(value/100)+")";pending=false};
 const request=()=>{if(!pending){pending=true;window.requestAnimationFrame(update)}};
 window.addEventListener("scroll",request,{passive:true});window.addEventListener("resize",request);update();
}
function installPetalRitual(){
 document.addEventListener("click",event=>{
  if(event.target.closest("input,textarea,select,option"))return;
  const x=event.clientX||window.innerWidth/2,y=event.clientY||window.innerHeight/2;
  for(let i=0;i<7;i++){
   const petal=document.createElement("i");petal.className="renaissance-petal";petal.setAttribute("aria-hidden","true");
   const angle=(Math.PI*2*i/7)+(Math.random()-.5)*.45,distance=28+Math.random()*54;
   petal.style.left=x+"px";petal.style.top=y+"px";
   petal.style.setProperty("--petal-x",Math.cos(angle)*distance+"px");petal.style.setProperty("--petal-y",Math.sin(angle)*distance+"px");
   petal.style.setProperty("--petal-turn",(Math.random()*170-85)+"deg");
   document.body.appendChild(petal);window.setTimeout(()=>petal.remove(),1450);
  }
 });
}
function installMarginaliaPuzzle(){
 if(path!=="marginalia.html")return;
 const form=$("#marginalia-form"),input=$("#marginalia-answer"),feedback=$("#marginalia-feedback"),reward=$("#marginalia-reward");
 if(!form||!input||!feedback||!reward)return;
 const count=fragments.filter(x=>state.found.includes(x.id)).length;
 if(count<3){form.hidden=true;feedback.textContent="三つの星章が揃っていない。教育廳の各頁を巡り、頁間の星章を収められよ。";return}
 form.addEventListener("submit",event=>{
  event.preventDefault();const answer=input.value.normalize("NFKC").replace(/[\s　・「」『』。、]/g,"");
  if(["自分自身","自分自身になる","自分自身になれる"].includes(answer)){
   feedback.textContent="解錠。";reward.classList.add("is-open");safeWrite(KEY,{...state,complete:true});
  }else feedback.textContent="その言葉ではない。教育理念と教育思想の頁を、もう一度読み返されよ。";
 });
}
installMarks();
installCabinet();
installProgressRail();
installPetalRitual();
installTransitions();
installMarginaliaPuzzle();
})();
