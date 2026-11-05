/* THE IMPERIAL CELESTIAL ORRERY — interactive seasonal reading rite */
(function(){
"use strict";
if(document.getElementById("celestial-dialog"))return;
const KEY="hinomoto-celestial-season-v1";
const seasons=[
 {id:"spring",name:"春霞",symbol:"✿",note:"薄紅の霞をまとい、頁の余白に花影を添える。"},
 {id:"summer",name:"夏星",symbol:"✧",note:"澄んだ夜気と星明かり。知の星図をひらく季節。"},
 {id:"autumn",name:"秋灯",symbol:"❧",note:"琥珀の灯が、古い書物の文字を静かに照らす。"},
 {id:"winter",name:"冬月",symbol:"☾",note:"白い月光のもと、言葉の輪郭を深く味わう。"}
];
const links=[
 ["首頁","THE PORTAL","index.html"],
 ["教育理念","PHILOSOPHY","about.html#philosophy"],
 ["長官紹介","THE MINISTER","about.html#director"],
 ["教育機關","INSTITUTIONS","institutions.html"],
 ["教育史料室","ARCHIVES","archives.html"],
 ["封緘文庫","SEALED FOLIO","sealed-folio.html"]
];
const saved=(()=>{try{return localStorage.getItem(KEY)||"summer"}catch(_){return"summer"}})();
const root=document.createElement("div");
root.innerHTML='<button class="celestial-trigger" type="button" aria-label="玲瓏天球儀をひらく" title="玲瓏天球儀">✧</button><dialog class="celestial-dialog" id="celestial-dialog" aria-labelledby="celestial-title"><div class="celestial-frame"><header class="celestial-head"><button class="celestial-close" type="button" aria-label="閉じる">×</button><small>THE CELESTIAL READING RITE　／　IMPERIAL ASTRARIUM</small><h2 id="celestial-title">玲瓏天球儀</h2><p>知の軌道を巡り、季節の光で頁をひらく。</p></header><div class="celestial-layout"><div class="celestial-orrery" aria-hidden="true"><div class="celestial-sun">學</div><div class="celestial-orbit"><span class="celestial-planet">✿</span><span class="celestial-planet">✧</span><span class="celestial-planet">❧</span><span class="celestial-planet">☾</span></div></div><section class="celestial-side"><h3>學問の星辰を巡る</h3><p>教育廳の諸室を、ひとつの星座として結ぶ。星の名を選べば、その頁へと導かれる。</p><nav class="celestial-destinations" aria-label="天球儀の行先">'+links.map(x=>'<a href="'+x[2]+'"><strong>'+x[0]+'</strong><small>'+x[1]+'</small></a>').join("")+'</nav></section></div><section class="celestial-season"><div class="celestial-season-label">THE FOUR SEASONS　／　四季の閲覧意匠</div><div class="celestial-seasons">'+seasons.map(s=>'<button type="button" data-season="'+s.id+'" aria-pressed="false">'+s.symbol+'　'+s.name+'</button>').join("")+'</div><p class="celestial-season-note" id="celestial-season-note" aria-live="polite"></p></section></div></dialog>';
document.body.appendChild(root);
const dialog=root.querySelector("dialog"),trigger=root.querySelector(".celestial-trigger"),note=root.querySelector("#celestial-season-note");
function applySeason(id,notify){
const season=seasons.find(s=>s.id===id)||seasons[1];
document.body.dataset.celestialSeason=season.id;
root.querySelectorAll("[data-season]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.season===season.id)));
note.textContent=season.note;
try{localStorage.setItem(KEY,season.id)}catch(_){}
if(notify){note.textContent=season.note+"　—　閲覧意匠を移した。"}
}
root.querySelectorAll("[data-season]").forEach(b=>b.addEventListener("click",()=>applySeason(b.dataset.season,true)));
trigger.addEventListener("click",()=>{dialog.showModal();});
root.querySelector(".celestial-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener("close",()=>trigger.focus());
document.addEventListener("keydown",e=>{if(e.altKey&&e.key.toLowerCase()==="o"&&!e.repeat){e.preventDefault();dialog.showModal()}});
applySeason(seasons.some(s=>s.id===saved)?saved:"summer",false);
})();