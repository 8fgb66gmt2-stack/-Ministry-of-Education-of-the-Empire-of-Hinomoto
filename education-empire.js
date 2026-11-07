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
 "marginalia.html":{title:"余白の書",en:"THE MARGINALIA",url:"marginalia.html",desc:"知の余白に遺された、最後の問い。"},
 "palimpsest.html":{title:"失われた余白",en:"THE IMPERIAL PALIMPSEST",url:"palimpsest.html",desc:"四つの學印を結び、封じられた最終頁へ。"},
 "circuit.html":{title:"知の連環図譜",en:"THE LIVING ATLAS",url:"circuit.html",desc:"人物・思想・著作・教育機關のつながりを辿る。"}
};
const stars=[
 {id:"inheritance",title:"受け継ぐ",en:"INHERITANCE",glyph:"❧",desc:"古典と歴史を読み、先人の知を次代へ手渡す。",link:"archives.html#history",linkLabel:"帝國教育史をひらく",connections:[["『教育侖』","archives.html#education-theory"],["教育人物録","archives.html#persons"],["帝國大學","institutions.html#university"]]},
 {id:"inquiry",title:"問いを立てる",en:"INQUIRY",glyph:"✧",desc:"答えを受け取るだけでなく、自ら問い、考え、探究する。",link:"index.html#atlas",linkLabel:"知の星図を巡る",connections:[["知の錬成室","index.html#inquiry-atelier"],["知の星図","index.html#atlas"],["知の巡礼","index.html#pilgrimage"]]},
 {id:"freedom",title:"自由を守る",en:"LIBERTAS",glyph:"☼",desc:"身分や家柄に左右されず、学びたい者に学びの門をひらく。",link:"about.html#philosophy",linkLabel:"教育理念を読む",connections:[["九条院春臣の思想","about.html#director"],["教育思想閲覧室","index.html#codex"],["閲覧者証","index.html#reader-registry"]]},
 {id:"culture",title:"文化を育む",en:"CULTURA",glyph:"✿",desc:"学問と芸術、言葉と思想を結び、豊かな文化を育てる。",link:"archives.html#publications",linkLabel:"刊行物・研究資料へ",connections:[["古典と近代の対話","index.html#two-libraries"],["刊行物・著作","archives.html#publications"],["六條杠葉","archives.html#sixjo-yuzuriha"]]},
 {id:"future",title:"未来を拓く",en:"FUTURE",glyph:"☾",desc:"学びを受け取った一人ひとりが、自らの意志で未来を選ぶ。",link:"institutions.html#university",linkLabel:"帝國大學を訪ねる",connections:[["帝國大學","institutions.html#university"],["帝都女學院","institutions.html#academy"],["教育行政の公表資料","notices.html"]]},
 {id:"harmony",title:"知を結ぶ",en:"SAPIENTIA",glyph:"✥",desc:"古き知と新しき知を対話させ、世界を多面的に見つめる。",link:"index.html#two-libraries",linkLabel:"古典と近代の対話へ",connections:[["知の対話","index.html#two-libraries"],["教育機關の系譜","index.html#institutions-orbit"],["知識天象儀","index.html#imperial-instruments"]]}
];
const journeys={
 thinker:{label:"思索の道",steps:["about.html#philosophy","index.html#atlas","index.html#codex"],text:"教育理念から知の星図へ。問いを持ち、自分の考えを深める道。"},
 teacher:{label:"教育の道",steps:["about.html#director","institutions.html","archives.html#education-theory"],text:"九条院春臣の言葉から教育機關へ。教えることと学ぶことを考える道。"},
 culture:{label:"文化の道",steps:["index.html#two-libraries","archives.html","institutions.html#university"],text:"古典と近代、書物と学問。文化の源流を辿る道。"},
 circuit:{label:"連環の道",steps:["circuit.html","archives.html#education-theory","institutions.html#university"],text:"人物・思想・著作の関係を辿り、教育機關へ。知の記録を結び直す道。"}
};
const safeRead=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback}catch(_){return fallback}};
const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}};
let state=safeRead(STORE,{journey:"thinker",visited:[]});
if(!state||typeof state!=="object")state={journey:"thinker",visited:[]};
if(!Array.isArray(state.visited))state.visited=[];
const currentVisit=page+(location.hash||"");
if(!state.visited.includes(currentVisit)){state.visited.push(currentVisit);safeWrite(STORE,state)}
let collected=safeRead(HUNT,[]);
if(!Array.isArray(collected))collected=[];
const root=document.createElement("div");
root.innerHTML='<button class="empire-compass-trigger" type="button" aria-label="帝國學問羅針盤をひらく" title="帝國學問羅針盤">✥</button><dialog class="empire-dialog" id="empire-knowledge-dialog" aria-labelledby="empire-dialog-title"><div class="empire-shell"><header class="empire-dialog-head"><button class="empire-dialog-close" type="button" aria-label="閉じる">×</button><small>THE IMPERIAL ATLAS OF LEARNING　／　日ノ本帝國教育星圖</small><h2 id="empire-dialog-title">帝國學問羅針盤</h2><p>知の星辰を結び、學びの道をひらく。</p></header><div class="empire-dialog-body"><div class="empire-statusbar"><small>THE CONSTELLATION OF KNOWLEDGE　／　知の星座</small><div class="empire-progress" id="empire-progress" aria-label="學印の蒐集状況"></div></div><div class="empire-constellation" id="empire-constellation"></div><section class="empire-detail" aria-live="polite"><small id="empire-detail-en">SELECT A STAR</small><h3 id="empire-detail-title">星をひとつ選んでください</h3><p id="empire-detail-text">星を選ぶと、その知の領域と学びの道筋がひらかれます。</p><a class="empire-detail-link" id="empire-detail-link" href="index.html#atlas">関連する頁をひらく　→</a><nav class="empire-connections" id="empire-connections" aria-label="この星と連なる閲覧頁"></nav></section><div class="empire-journeys" role="group" aria-label="知の巡路"><button type="button" data-empire-journey="thinker">思索の道</button><button type="button" data-empire-journey="teacher">教育の道</button><button type="button" data-empire-journey="culture">文化の道</button><button type="button" data-empire-journey="circuit">連環の道</button></div><p id="empire-journey-text" style="font-size:12px;line-height:2;color:#5b4843;margin:0 0 12px" aria-live="polite"></p><nav class="empire-route" id="empire-route" aria-label="知の巡路"></nav><section class="empire-secret" id="empire-secret"><small>ARCANUM EDUCATIONIS　／　秘められた教育理念</small><h3>四つの學印、ここに結ばれる。</h3><p>学びを受け継ぎ、問いを立て、自由を守り、文化を育む。知はひとりの胸に閉じるものではなく、人から人へと渡され、未来を照らす光となる。</p><div class="secret-motto">學ビヲ絶ヤサズ、未来ヲ拓ク。</div><p>學印を集めた者に、帝國教育廳の理念を示す特別の頁をひらく。</p><a href="about.html#philosophy" style="display:inline-block;margin-top:8px;color:#64172e;border-bottom:1px solid #b18a4d">教育理念を読み返す　✧</a></section></div></div></dialog>';
document.body.appendChild(root);
/* THE CONSTELLATION'S CROSS-REFERENCES — each selected principle opens a living reading path. */
const connectionStyle=document.createElement("style");
connectionStyle.textContent=".empire-connections{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-top:15px;padding-top:12px;border-top:1px solid #b18a4d55}.empire-connections>small{flex:0 0 100%;font:italic 9px Georgia,serif;letter-spacing:.16em;color:#8b633b}.empire-connections>a{display:inline-flex;align-items:center;min-height:30px;padding:6px 9px;border:1px solid #b18a4d66;background:#fffaf0;color:#64172e;text-decoration:none;font:11px 'Shippori Mincho',serif;transition:background .2s,color .2s,border-color .2s}.empire-connections>a:hover,.empire-connections>a:focus-visible{background:#64172e;color:#fff0d6;border-color:#64172e}@media(max-width:600px){.empire-connections>a{flex:1 1 calc(50% - 7px);justify-content:center;text-align:center}}@media(prefers-reduced-motion:reduce){.empire-connections>a{transition:none}}";
document.head.appendChild(connectionStyle);

/* Mount the compass in the shared reading dock instead of floating over other controls. */
const compassTrigger=root.querySelector(".empire-compass-trigger");
let floatingDock=document.querySelector(".renaissance-dock");
if(!floatingDock){
 floatingDock=document.createElement("div");
 floatingDock.className="renaissance-dock";
 document.body.appendChild(floatingDock);
}
floatingDock.setAttribute("role","group");
floatingDock.setAttribute("aria-label","帝國教育廳の閲覧補助器具");
if(compassTrigger)floatingDock.insertBefore(compassTrigger,floatingDock.firstChild);
const ledger=document.createElement("section");
ledger.className="empire-ledger";
ledger.innerHTML='<div class="empire-ledger-heading"><small>THE RECORD OF YOUR INQUIRY　／　知的巡覧録</small><h3>學びの足跡</h3><p>訪れた頁を記録し、選んだ巡路の進み具合を映します。この記録は、この端末のブラウザーに保存されます。</p></div><div class="empire-ledger-progress"><div class="empire-ledger-progress-label"><span id="empire-ledger-route">思索の道</span><strong id="empire-ledger-count">0 / 3</strong></div><div class="empire-ledger-track"><i id="empire-ledger-fill"></i></div></div><ol class="empire-ledger-steps" id="empire-ledger-steps"></ol><div class="empire-notebook"><div><small>THE SCHOLAR\'S NOTEBOOK　／　學問手帖</small><h3>頁の余白に、あなたの言葉を。</h3><p>気づいたこと、心に残った一節、次に調べたい問いを自由に書き留められます。</p></div><textarea id="empire-notebook-text" rows="4" maxlength="5000" placeholder="今日、心に留まった言葉は……"></textarea><div class="empire-notebook-actions"><span id="empire-notebook-status" role="status">この端末に保存できます。</span><div><button type="button" id="empire-notebook-save">手帖に記す</button><button type="button" id="empire-notebook-export">記録を持ち出す</button></div></div></div>';
root.querySelector(".empire-dialog-body").appendChild(ledger);
const NOTE_KEY="hinomoto-imperial-scholar-notebook-v1";
const noteField=ledger.querySelector("#empire-notebook-text");
const noteStatus=ledger.querySelector("#empire-notebook-status");
window.addEventListener("imperial:notebook:update",event=>{if(typeof event.detail?.value==="string"){noteField.value=event.detail.value;noteStatus.textContent="問いの錬成室から記録を受け取りました。"}});
try{noteField.value=localStorage.getItem(NOTE_KEY)||""}catch(_){}
ledger.querySelector("#empire-notebook-save").addEventListener("click",()=>{
 try{localStorage.setItem(NOTE_KEY,noteField.value);noteStatus.textContent="記録をこの端末に保存しました。";toast("學問手帖に記録を収めた。")}
 catch(_){noteStatus.textContent="保存できませんでした。ブラウザーの保存設定をご確認ください。"}
});
ledger.querySelector("#empire-notebook-export").addEventListener("click",()=>{
 const content="日ノ本帝國 帝國教育廳｜學問手帖\n\n"+noteField.value+"\n";
 const blob=new Blob([content],{type:"text/plain;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="帝國教育廳_學問手帖.txt";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 noteStatus.textContent="學問手帖を書き出しました。";
});
const dialog=root.querySelector("dialog"),trigger=compassTrigger;
const detailEn=root.querySelector("#empire-detail-en"),detailTitle=root.querySelector("#empire-detail-title"),detailText=root.querySelector("#empire-detail-text"),detailLink=root.querySelector("#empire-detail-link");
const progress=root.querySelector("#empire-progress"),secret=root.querySelector("#empire-secret");
function toast(message){let el=document.querySelector(".empire-toast");if(!el){el=document.createElement("div");el.className="empire-toast";el.setAttribute("role","status");document.body.appendChild(el)}el.textContent=message;el.classList.add("is-shown");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("is-shown"),2600)}
function updateHunt(){
 progress.replaceChildren();
 for(let i=0;i<4;i++){const dot=document.createElement("i");dot.className=collected.length>i?"is-found":"";progress.appendChild(dot)}
 secret.classList.toggle("is-open",collected.length>=4);
}
function showStar(item){
 detailEn.textContent=item.en;detailTitle.textContent=item.title;detailText.textContent=item.desc;if(detailLink){detailLink.href=item.link;detailLink.textContent=item.linkLabel+"　→"}
 const connectionNav=root.querySelector("#empire-connections");
 if(connectionNav){
  connectionNav.replaceChildren();
  const caption=document.createElement("small");caption.textContent="RELATED FOLIOS　／　連環する頁";connectionNav.appendChild(caption);
  (item.connections||[]).forEach(([label,url])=>{
   const a=document.createElement("a");a.href=url;a.textContent=label;connectionNav.appendChild(a);
  });
 }
 state.lastSubject=item.id;safeWrite(STORE,state);
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
 state.journey=key;safeWrite(STORE,state);renderLedger(key);
}
function renderLedger(key){
 const journey=journeys[key]||journeys.thinker;
 const names=journey.steps.map(href=>href.split("#")[0]);
 const done=journey.steps.map(href=>state.visited.includes(href));
 const count=done.filter(Boolean).length;
 ledger.querySelector("#empire-ledger-route").textContent=journey.label;
 ledger.querySelector("#empire-ledger-count").textContent=count+" / 3";
 ledger.querySelector("#empire-ledger-fill").style.width=(count/3*100)+"%";
 const list=ledger.querySelector("#empire-ledger-steps");list.replaceChildren();
 journey.steps.forEach((href,i)=>{
  const info=pages[href.split("#")[0]]||pages["index.html"];
  const li=document.createElement("li");li.className=done[i]?"is-complete":"";
  const mark=document.createElement("span");mark.className="empire-ledger-mark";mark.textContent=done[i]?"✦":String(i+1).padStart(2,"0");
  const a=document.createElement("a");a.href=href;
  const strong=document.createElement("strong");strong.textContent=info.title;
  const small=document.createElement("small");small.textContent=done[i]?"VISITED　／　巡覧済":"TO VISIT　／　これから訪れる頁";
  a.append(strong,small);li.append(mark,a);list.appendChild(li);
 });
}
window.addEventListener("hashchange",()=>{const current=(location.pathname.split("/").pop()||"index.html")+(location.hash||"");if(!state.visited.includes(current)){state.visited.push(current);safeWrite(STORE,state)}renderLedger(state.journey||"thinker")});
root.querySelectorAll("[data-empire-journey]").forEach(button=>button.addEventListener("click",()=>renderJourney(button.dataset.empireJourney)));
function open(){renderLedger(state.journey||"thinker");if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");}
function close(){if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open")}
trigger.addEventListener("click",open);
root.querySelector(".empire-dialog-close").addEventListener("click",close);
dialog.addEventListener("click",event=>{if(event.target===dialog)close()});
dialog.addEventListener("close",()=>trigger.focus());
document.addEventListener("keydown",event=>{if(event.altKey&&event.key.toLowerCase()==="e"&&!event.repeat){event.preventDefault();open()}});
root.querySelectorAll("[data-empire-journey]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.empireJourney===state.journey)));
renderJourney(state.journey||"thinker");showStar(stars.find(item=>item.id===state.lastSubject)||stars[0]);updateHunt();
const huntTargets={"index.html":".imperial-principle-copy .emp-translation","about.html":"#director .kicker","institutions.html":"#academy-founder h3","archives.html":"#sixjo-yuzuriha h2"};
if(huntTargets[page]){
 const target=document.querySelector(huntTargets[page]);
 if(!target)return;
 const button=document.createElement("button");button.type="button";button.className="empire-hunt-trigger";button.textContent="✧";button.title="欄外に残された學印";button.setAttribute("aria-label","この頁に隠された學印を収める");
 button.addEventListener("click",()=>{
  const id=page;
  if(!collected.includes(id)){collected.push(id);safeWrite(HUNT,collected);button.classList.add("is-found");button.textContent="✦";toast(collected.length>=4?"四つの學印が結ばれた。羅針盤に秘められた頁がひらく。":"學印をひとつ収めた。");
  }else toast("この頁の學印は、すでに収められている。");
  updateHunt();
 });
 target.appendChild(button);
 if(collected.includes(page)){button.classList.add("is-found");button.textContent="✦"}
}
if(!document.querySelector('script[src^="education-palace.js"]')){const palaceLoader=document.createElement("script");palaceLoader.src="education-palace.js?v=20261106-3";palaceLoader.defer=true;document.head.appendChild(palaceLoader);}
})();
