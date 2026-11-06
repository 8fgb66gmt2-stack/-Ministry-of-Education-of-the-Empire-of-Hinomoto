/* THE IMPERIAL PALIMPSEST — three seals hidden in the Ministry's own ornament */
(function(){
"use strict";
if(window.__imperialPalimpsestInstalled)return;
window.__imperialPalimpsestInstalled=true;
const KEY="hinomoto-imperial-palimpsest-v1";
const $=(s,r=document)=>r.querySelector(s);
const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(v)?v:[]}catch(_){return[]}};
const write=v=>{try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch(_){return false}};
const records=[
 {id:"rose",target:".rose-window",symbol:"Ⅰ",title:"第一の印 — 薔薇窓",question:"薔薇窓の下に記された三つのラテン語。その最後の一語を、刻まれたとおりに記してください。",answer:"cultura",hint:"Sapientia · Libertas · Cultura"},
 {id:"atlas",target:".atlas-core",symbol:"Ⅱ",title:"第二の印 — 知の星図",question:"星図の中心に座す、春臣を示す一文字。その文字を記してください。",answer:"春",hint:"六つの学問領域を結ぶ、中心の季節。"},
 {id:"astral",target:".astral-center",symbol:"Ⅲ",title:"第三の印 — 知識天象儀",question:"四方位の中心に置かれた一文字。学びの根を示すその文字を記してください。",answer:"學",hint:"古き知と新しき知を結ぶ、学びの一字。"}
];
let found=read().filter(id=>records.some(r=>r.id===id));
const section=$("#palimpsest"),count=$("#palimpsest-count"),progress=$("#palimpsest-progress"),final=$("#palimpsest-final");
if(!section)return;
const dialog=document.createElement("dialog");
dialog.className="palimpsest-dialog";
dialog.innerHTML='<div class="palimpsest-dialog-inner"><small>THE IMPERIAL PALIMPSEST　／　封緘記録</small><h2 id="palimpsest-dialog-title">頁の余白</h2><p id="palimpsest-question"></p><form id="palimpsest-form"><label for="palimpsest-answer">印を記す</label><input id="palimpsest-answer" type="text" autocomplete="off" maxlength="32"><div class="palimpsest-dialog-actions"><button type="submit">印を照合する</button><button class="secondary" type="button" id="palimpsest-hint">手掛かり</button><button class="secondary" type="button" id="palimpsest-close">閉じる</button></div></form><div class="palimpsest-feedback" id="palimpsest-feedback" role="status" aria-live="polite"></div></div>';
document.body.appendChild(dialog);
let active=null;
const form=$("#palimpsest-form",dialog),input=$("#palimpsest-answer",dialog),feedback=$("#palimpsest-feedback",dialog);
function render(){
 records.forEach(r=>{const stamp=$('[data-seal-mark="'+r.id+'"]',section);if(stamp)stamp.classList.toggle("is-found",found.includes(r.id));});
 if(count)count.textContent="COLLECTED SEALS　"+found.length+" / 3";
 if(progress)progress.textContent=found.length===3?"三つの學印が揃いました。封緘記録をお読みください。":"三つの學印が、頁の奥で待っています。";
 if(final)final.hidden=found.length!==3;
}
function open(r){
 active=r;$("#palimpsest-dialog-title",dialog).textContent=r.title;
 $("#palimpsest-question",dialog).textContent=r.question;
 input.value="";feedback.textContent="";
 if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
 input.focus();
}
records.forEach(r=>{
 const target=$(r.target);
 if(!target)return;
 const button=document.createElement("button");
 button.type="button";button.className="palimpsest-mark";button.textContent=r.symbol;
 button.setAttribute("aria-label",found.includes(r.id)?r.title+" — 取得済み":r.title+" — 印を調べる");
 button.title="頁の余白を調べる";
 button.addEventListener("click",()=>open(r));
 target.appendChild(button);
});
form.addEventListener("submit",event=>{
 event.preventDefault();if(!active)return;
 const value=input.value.trim().normalize("NFKC").toLocaleLowerCase();
 if(value===active.answer.normalize("NFKC").toLocaleLowerCase()){
  if(!found.includes(active.id))found.push(active.id);
  write(found);feedback.textContent="照合しました。學印を一つ、書架に納めました。";render();
  window.setTimeout(()=>{if(dialog.open)dialog.close();},650);
 }else feedback.textContent="その文字では、封は解かれません。頁の意匠をもう一度お確かめください。";
});
$("#palimpsest-hint",dialog).addEventListener("click",()=>{if(active)feedback.textContent=active.hint;});
$("#palimpsest-close",dialog).addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
const reset=$("#palimpsest-reset");
if(reset)reset.addEventListener("click",()=>{found=[];write(found);render();});
render();
})();