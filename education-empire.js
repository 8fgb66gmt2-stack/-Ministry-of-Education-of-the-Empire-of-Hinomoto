/* THE IMPERIAL KNOWLEDGE COMPASS — education portal expansion */
(function(){
"use strict";
if(document.getElementById("empire-knowledge-dialog"))return;
const STORE="hinomoto-imperial-knowledge-v1";
const HUNT="hinomoto-imperial-seals-v1";
const page=(location.pathname.split("/").pop()||"index.html");
const pages={
 "index.html":{title:"首頁",en:"THE PORTAL",url:"index.html",desc:"帝國教育の理念と知の星図を起点に、學びの世界を巡る。"},
 "about.html":{title:"教育廳について",en:"THE MINISTRY",url:"about.html",desc:"九条院春臣の教育思想と、本廳が守る学びの自由を読む。"},
 "institutions.html":{title:"教育機關案内",en:"INSTITUTIONS",url:"institutions.html",desc:"帝國の學び舎と、そこに集う人々の営みを訪ねる。"},
 "archives.html":{title:"教育史料室",en:"ARCHIVES",url:"archives.html",desc:"書物、人物、思想。時代を越えて受け継がれる知の記録。"},
 "notices.html":{title:"告示・公表資料",en:"PUBLIC RECORDS",url:"notices.html",desc:"教育行政に關する公表文書と制度の記録を閲覧する。"},
 "sealed-folio.html":{title:"封緘文庫",en:"SEALED FOLIO",url:"sealed-folio.html",desc:"問いを持ち、頁を読み、三つの鍵を解く。"},
 "marginalia.html":{title:"余白の書",en:"THE MARGINALIA",url:"marginalia.html",desc:"知の余白に遺された、最後の問い。"}
};
const stars=[
 {id:"inheritance",title:"受け継ぐ",en:"INHERITANCE",glyph:"❧",desc:"古典と歴史を読み、先人の知を次代へ手渡す。"},
 {id:"inquiry",title:"問いを立てる",en:"INQUIRY",glyph:"✧",desc:"答えを受け取るだけでなく、自ら問い、考え、探究する。"},
 {id:"freedom",title:"自由を守る",en:"LIBERTAS",glyph:"☼",desc:"身分や家柄に左右されず、学びたい者に学びの門をひらく。"},
 {id:"culture",title:"文化を育む",en:"CULTURA",glyph:"✿",desc:"学問と芸術、言葉と思想を結び、豊かな文化を育てる。"},
 {id:"future",title:"未来を拓く",en:"FUTURE",glyph:"☾",desc:"学びを受け取った一人ひとりが、自らの意志で未来を選ぶ。"},
 {id:"harmony",title:"知を結ぶ",en:"SAPIENTIA",glyph:"✥",desc:"古き知と新しき知を対話させ、世界を多面的に見つめる。"}
];
const journeys={
 thinker:{label:"思索の道",steps:["about.html#philosophy","index.html#atlas","index.html#codex"],text:"教育理念から知の星図へ。問いを持ち、自分の考えを深める道。"},
 teacher:{label:"教育の道",steps:["about.html#director","institutions.html","archives.html#education-theory"],text:"九条院春臣の言葉から教育機關へ。教えることと学ぶことを考える道。"},
 culture:{label:"文化の道",steps:["index.html#two-libraries","archives.html","institutions.html#university"],text:"古典と近代、書物と学問。文化の源流を辿る道。"}
};
const safeRead=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback}catch(_){return fallback}};
const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}};
let state=safeRead(STORE,{journey:"thinker",visited:[]});
if(!state||typeof state!=="object")state={journey:"thinker",visited:[]};
if(!Array.isArray(state.visited))state.visited=[];
if(!state.visited.includes(page)){state.visited.push(page);safeWrite(STORE,state)}
let collected=safeRead(HUNT,[]);
if(!Array.isArray(collected))collected=[];
const root=document.createElement("div");
root.innerHTML='<button class="empire-compass-trigger" type="button" aria-label="帝國學問羅針盤をひらく" title="帝國學問羅針盤">✥</button><dialog class="empire-dialog" id="empire-knowledge-dialog" aria-labelledby="empire-dialog-title"><div class="empire-shell"><header class="empire-dialog-head"><button class="empire-dialog-close" type="button" aria-label="閉じる">×</button><small>THE IMPERIAL ATLAS OF LEARNING　／　日ノ本帝國教育星圖</small><h2 id="empire-dialog-title">帝國學問羅針盤</h2><p>知の星辰を結び、學びの道をひらく。</p></header><div class="empire-dialog-body"><div class="empire-statusbar"><small>THE CONSTELLATION OF KNOWLEDGE　／　知の星座</small><div class="empire-progress" id="empire-progress" aria-label="學印の蒐集状況"></div></div><div class="empire-constellation" id="empire-constellation"></div><section class="empire-detail" aria-live="polite"><small id="empire-detail-en">SELECT A STAR</small><h3 id="empire-detail-title">星をひとつ選んでください</h3><p id="empire-detail-text">星を選ぶと、その知の領域と学びの道筋がひらかれます。</p></section><div class="empire-journeys" role="group" aria-label="知の巡路"><button type="button" data-empire-journey="thinker">思索の道</button><button type="button" data-empire-journey="teacher">教育の道</button><button type="button" data-empire-journey="culture">文化の道</button></div><p id="empire-journey-text" style="font-size:12px;line-height:2;color:#5b4843;margin:0 0 12px" aria-live="polite"></p><nav class="empire-route" id="empire-route" aria-label="知の巡路"></nav><section class="empire-secret" id="empire-secret"><small>ARCANUM EDUCATIONIS　／　秘められた教育理念</small><h3>四つの學印、ここに結ばれる。</h3><p>学びを受け継ぎ、問いを立て、自由を守り、文化を育む。知はひとりの胸に閉じるものではなく、人から人へと渡され、未来を照らす光となる。</p><div class="secret-motto">學ビヲ絶ヤサズ、未来ヲ拓ク。</div><p>學印を集めた者に、帝國教育廳の理念を示す特別の頁をひらく。</p><a href="about.html#philosophy" style="display:inline-block;margin-top:8px;color:#64172e;border-bottom:1px solid #b18a4d">教育理念を読み返す　✧</a></section></div></div></dialog>';
document.body.appendChild(root);
const dialog=root.querySelector("dialog"),trigger=root.querySelector(".empire-compass-trigger");
const detailEn=root.querySelector("#empire-detail-en"),detailTitle=root.querySelector("#empire-detail-title"),detailText=root.querySelector("#empire-detail-text");
const progress=root.querySelector("#empire-progress"),secret=root.querySelector("#empire-secret");
function toast(message){let el=document.querySelector(".empire-toast");if(!el){el=document.createElement("div");el.className="empire-toast";el.setAttribute("role","status");document.body.appendChild(el)}el.textContent=message;el.classList.add("is-shown");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("is-shown"),2600)}
function updateHunt(){
 progress.replaceChildren();
 for(let i=0;i<4;i++){const dot=document.createElement("i");dot.className=collected.length>i?"is-found":"";progress.appendChild(dot)}
 secret.classList.toggle("is-open",collected.length>=4);
}
function showStar(item){
 detailEn.textContent=item.en;detailTitle.textContent=item.title;detailText.textContent=item.desc;
 root.querySelectorAll(".empire-star").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.star===item.id)));
}
const constellation=root.querySelector("#empire-constellation");
stars.forEach(item=>{
 const button=document.createElement("button");button.type="button";button.className="empire-star";button.dataset.star=item.id;button.setAttribute("aria-pressed","false");
 const glyph=document.createElement("span");glyph.className="star-glyph";glyph.textContent=item.glyph;
 const title=document.createElement("strong");title.textContent=item.title;
 const en=document.createElement("small");en.textContent=item.en;
 button.append(glyph,title,en);button.addEventListener("click",()=>showStar(item));const detail=item.desc;
 button.addEventListener("focus",()=>{detailText.textContent=detail});
 constellation.appendChild(button);
});
function renderJourney(key){
 const journey=journeys[key]||journeys.thinker;
 root.querySelectorAll("[data-empire-journey]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.empireJourney===key)));
 root.querySelector("#empire-journey-text").textContent=journey.text;
 const nav=root.querySelector("#empire-route");nav.replaceChildren();
 journey.steps.forEach((href,i)=>{
  const info=pages[href.split("#")[0]]||pages["index.html"];
  const a=document.createElement("a");a.href=href;
  const strong=document.createElement("strong");strong.textContent=["第一の門","第二の門","第三の門"][i]+"　"+(info.title||"學問の頁");
  const small=document.createElement("small");small.textContent=info.en;
  a.append(strong,small);nav.appendChild(a);
 });
 state.journey=key;safeWrite(STORE,state);
}
root.querySelectorAll("[data-empire-journey]").forEach(button=>button.addEventListener("click",()=>renderJourney(button.dataset.empireJourney)));
function open(){if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");}
function close(){if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open")}
trigger.addEventListener("click",open);
root.querySelector(".empire-dialog-close").addEventListener("click",close);
dialog.addEventListener("click",event=>{if(event.target===dialog)close()});
dialog.addEventListener("close",()=>trigger.focus());
document.addEventListener("keydown",event=>{if(event.altKey&&event.key.toLowerCase()==="e"&&!event.repeat){event.preventDefault();open()}});
root.querySelectorAll("[data-empire-journey]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.empireJourney===state.journey)));
renderJourney(state.journey||"thinker");showStar(stars[0]);updateHunt();
const huntPages={"index.html":"学","about.html":"由","institutions.html":"問","archives.html":"未"}; // The four seals are discovered by visiting the four principal halls.
if(huntPages[page]&&document.querySelector(".footer-bottom")){
 const button=document.createElement("button");button.type="button";button.className="empire-hunt-trigger";button.textContent="✧";button.title="頁の余白に隠された學印";button.setAttribute("aria-label","この頁に隠された學印を見つける");
 button.addEventListener("click",()=>{
  const id=page;
  if(!collected.includes(id)){collected.push(id);safeWrite(HUNT,collected);button.classList.add("is-found");button.textContent="✦";toast(collected.length>=4?"四つの學印が結ばれた。羅針盤に秘められた頁がひらく。":"學印をひとつ収めた。");
  }else toast("この頁の學印は、すでに収められている。");
  updateHunt();
 });
 document.querySelector(".footer-bottom").appendChild(button);
 if(collected.includes(page)){button.classList.add("is-found");button.textContent="✦"}
}
})();
