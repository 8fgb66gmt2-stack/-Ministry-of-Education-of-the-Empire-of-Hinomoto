(function(){
"use strict";
const records={
 haruomi:{type:"PERSON　／　教育人物",title:"九条院 春臣",copy:"教育廳長官。近代日ノ本帝國における教育制度の礎を築き、日ノ本帝國國立帝國大學の創設者であり、『教育侖』の著者として記録されています。",links:[["長官紹介を読む","about.html#director"],["教育人物録をひらく","archives.html#persons"],["九条院春臣の教育思想へ","index.html#codex"]]},
 philosophy:{type:"EDUCATIONAL PHILOSOPHY　／　教育思想",title:"教育理念",copy:"九条院春臣の教育思想を礎として、学びの自由と文化の継承を重んじる理念。人を理想像へ作り替えるのではなく、自ら考え、自分の人生を歩めるよう助けることを大切にします。",links:[["教育理念を読む","about.html#philosophy"],["教育思想閲覧室をひらく","index.html#codex"]]},
 book:{type:"FOUNDATIONAL TEXT　／　著作",title:"『教育侖』",copy:"九条院春臣が著した代表的著作。教育と自由、教師と学生、古典教育、近代教育、人格形成、国家と教育、学問の自由、文化継承などを論じる文献として教育史料室に収められています。",links:[["『教育侖』の記録を読む","archives.html#education-theory"],["教育思想閲覧室へ","index.html#codex"]]},
 university:{type:"HIGHER EDUCATION　／　教育機關",title:"日ノ本帝國國立帝國大學",copy:"九条院春臣が創設した高等教育・学術研究機關。文学・哲学・歴史・自然科学・医学・美術などを含む総合高等教育機關として構想されました。",links:[["教育機關案内を読む","institutions.html#university"],["帝國大學公式サイトを訪ねる","https://8fgb66gmt2-stack.github.io/https-8fgb66gmt2-stack.github.io-nippon-imperial-university-/"]]},
 yuzuriha:{type:"EDUCATOR　／　教育人物",title:"六條 杠葉",copy:"歌人・詩人・評論家・隨筆家。帝國大學初の女性學生として学び、のちに日ノ本帝國國立帝都女學院を創設した人物として、教育史料室に記録されています。",links:[["六條杠葉の人物記録を読む","archives.html#sixjo-yuzuriha"],["帝都女學院の創設者紹介へ","institutions.html#academy-founder"]]},
 academy:{type:"SCHOOL EDUCATION　／　教育機關",title:"日ノ本帝國國立帝都女學院",copy:"六條杠葉が創設した教育機關。性別によって学問の機会を分けず、学びたいと願う者に門戸をひらくという理念を礎としています。",links:[["教育機關案内を読む","institutions.html#academy"],["六條杠葉の人物記録へ","archives.html#sixjo-yuzuriha"]]}
};
const routes={
 thought:{caption:"教育理念から『教育侖』へ。思想が書物となり、学びの場所へ受け継がれる道。",nodes:["haruomi","philosophy","book","university"]},
 educators:{caption:"九条院春臣と六條杠葉。教育者の記録から、それぞれが関わる教育機關へと辿る道。",nodes:["haruomi","university","yuzuriha","academy"]},
 learning:{caption:"既存の知の星図、教育思想閲覧室、知の巡礼、閲覧者証を結ぶ學びの道。",nodes:["philosophy","book","university","academy"]}
};
const buttons=[...document.querySelectorAll("[data-circuit-node]")];
const routeButtons=[...document.querySelectorAll("[data-circuit-route]")];
const caption=document.getElementById("circuit-route-caption");
const type=document.getElementById("circuit-detail-type");
const title=document.getElementById("circuit-detail-title");
const copy=document.getElementById("circuit-detail-copy");
const links=document.getElementById("circuit-detail-links");
function selectNode(key){
 const item=records[key];if(!item)return;
 buttons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.circuitNode===key)));
 type.textContent=item.type;title.textContent=item.title;copy.textContent=item.copy;
 links.replaceChildren();
 item.links.forEach(([label,url])=>{
  const a=document.createElement("a");a.href=url;a.textContent=label+"　→";
  if(/^https:\/\//.test(url)){a.target="_blank";a.rel="noopener noreferrer";}
  links.appendChild(a);
 });
}
function selectRoute(key){
 const route=routes[key];if(!route)return;
 routeButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.circuitRoute===key)));
 buttons.forEach(button=>{
  const active=route.nodes.includes(button.dataset.circuitNode);
  button.classList.toggle("is-on-route",active);
  button.classList.toggle("is-off-route",!active);
 });
 caption.textContent=route.caption;
 selectNode(route.nodes[0]);
}
buttons.forEach(button=>button.addEventListener("click",()=>selectNode(button.dataset.circuitNode)));
routeButtons.forEach(button=>button.addEventListener("click",()=>selectRoute(button.dataset.circuitRoute)));
const navToggle=document.querySelector(".nav-toggle");
const nav=document.getElementById("circuit-nav");
if(navToggle&&nav){
 navToggle.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded",String(open));
  const label=navToggle.querySelector("span");if(label)label.textContent=open?"閉じる":"案内をひらく";
 });
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");navToggle.setAttribute("aria-expanded","false");}));
}
const clock=document.getElementById("imperial-clock");
if(clock){
 const formatter=new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
 const tick=()=>{clock.textContent=formatter.format(new Date());};
 tick();window.setInterval(tick,1000);
}
selectRoute("thought");
})();