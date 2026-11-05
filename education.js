(function(){
"use strict";
const progress=document.getElementById("reading-progress");
function updateProgress(){
 if(!progress)return;
 const root=document.documentElement,max=root.scrollHeight-root.clientHeight;
 progress.style.width=(max>0?root.scrollTop/max*100:0)+"%";
}
window.addEventListener("scroll",updateProgress,{passive:true});
window.addEventListener("resize",updateProgress);updateProgress();

const toggle=document.querySelector(".nav-toggle"),nav=document.querySelector(".nav-links");
if(toggle&&nav){
 toggle.addEventListener("click",function(){
  const open=nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded",String(open));
  const label=toggle.querySelector("[data-toggle-label]");
  if(label)label.textContent=open?"閉じる":"案内をひらく";
 });
 nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");
  const label=toggle.querySelector("[data-toggle-label]");if(label)label.textContent="案内をひらく";
 }));
}

const revealItems=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});
 },{threshold:.12,rootMargin:"0px 0px -35px 0px"});
 revealItems.forEach(el=>observer.observe(el));
}else revealItems.forEach(el=>el.classList.add("is-visible"));

const filters=document.querySelectorAll("[data-filter]");
const directoryItems=document.querySelectorAll("[data-category]");
filters.forEach(button=>button.addEventListener("click",()=>{
 const filter=button.dataset.filter;
 filters.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
 directoryItems.forEach(item=>{item.hidden=filter!=="all"&&item.dataset.category!==filter;});
}));

const records=[
 {title:"帝國教育廳について",desc:"本廳の役割・教育行政・基本方針",url:"about.html",keywords:"教育廳 本廳 役割 教育行政 中央行政機關"},
 {title:"教育理念",desc:"自ら考える力・学ぶ機会・学問の自由",url:"about.html#philosophy",keywords:"理念 自由 古典 西洋 学問 人格形成 教師 学生"},
 {title:"九条院春臣",desc:"教育廳長官・帝國大學創設者",url:"about.html#director",keywords:"長官 教育者 思想家 文学者 教育侖 吉田松陰 教師"},
 {title:"日ノ本帝國國立帝國大學",desc:"九条院春臣が創設した高等教育・学術研究機關",url:"institutions.html#university",keywords:"大学 帝國大學 高等教育 学術"},
 {title:"日ノ本國立帝都女學院",desc:"中原壱葉・中原八雲らが教壇に立つ教育機關",url:"institutions.html#academy",keywords:"女學院 学校 國語 央語 中原壱葉 中原八雲"},
 {title:"『教育侖』",desc:"九条院春臣による教育思想の代表的著作",url:"archives.html#education-theory",keywords:"教育論 教育侖 著作 自由 国家 文化継承"},
 {title:"帝國教育史",desc:"教育思想と制度の歩みを記録する資料分類",url:"archives.html#history",keywords:"史料 資料 歴史 教育制度"},
 {title:"教育人物録",desc:"教育・学術・文化の発展に携わった人々",url:"archives.html#persons",keywords:"人物録 人物 教師 春臣 壱葉 八雲"},
 {title:"刊行物・研究資料",desc:"教育思想・学術・文化継承に關する記録",url:"archives.html#publications",keywords:"刊行物 研究 資料 学術"},
 {title:"告示・公表資料",desc:"行政情報・統計・告示の掲載方針",url:"notices.html",keywords:"告示 統計 公表 通達 行政情報"}
];
const form=document.getElementById("site-search-form"),input=document.getElementById("site-search-input"),panel=document.getElementById("search-results"),list=document.getElementById("search-list"),count=document.getElementById("search-count");
if(form&&input&&panel&&list&&count){
 form.addEventListener("submit",event=>{
  event.preventDefault();
  const raw=input.value.trim(),terms=raw.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  list.replaceChildren();
  if(!terms.length){count.textContent="検索語を入力してください";panel.classList.add("open");return;}
  const found=records.filter(item=>{const hay=(item.title+" "+item.desc+" "+item.keywords).toLocaleLowerCase();return terms.every(term=>hay.includes(term));});
  count.textContent="「"+raw+"」の検索結果："+found.length+"件";
  if(found.length){
   found.forEach(item=>{const a=document.createElement("a");a.href=item.url;a.textContent=item.title+"　—　"+item.desc;list.appendChild(a);});
  }else{const p=document.createElement("p");p.className="search-empty";p.textContent="該当する案内は見つかりませんでした。別の言葉でもう一度お試しください。";list.appendChild(p);}
  panel.classList.add("open");
 });
 const close=document.getElementById("search-close");if(close)close.addEventListener("click",()=>panel.classList.remove("open"));
}

const modal=document.getElementById("detail-dialog");
const modalTitle=document.getElementById("dialog-title"),modalLabel=document.getElementById("dialog-label"),modalBody=document.getElementById("dialog-content");
const details={
 university:{title:"日ノ本帝國國立帝國大學",label:"HIGHER EDUCATION",body:"<p>九条院春臣が創設した高等教育・学術研究機關。大学の精神は「學問ノ府、文化ノ源流」。国家に必要な人材を生産するだけの機関ではなく、文学・哲学・歴史・自然科学・医学・美術など、学問そのものを探究する場所として構想された。</p><div class='dialog-note'>詳細な學部構成・設立年等は、正史資料に基づき別途掲載します。</div>"},
 academy:{title:"日ノ本國立帝都女學院",label:"SECONDARY EDUCATION",body:"<p>國語教諭の中原壱葉、央語教諭の中原八雲らが教壇に立つ教育機關。</p><p>中原壱葉は詩人としても知られ、生徒自身の言葉を見つけることを重んじる。中原八雲は外国語・外国文学・民間傳承に通じ、異なる言葉の向こうにある文化や人々の感情を伝える。</p>"},
 theory:{title:"『教育侖』",label:"FOUNDATIONAL TEXT",body:"<p>九条院春臣による教育思想の代表的著作。教育と自由、教師と学生、古典教育と近代教育、人格形成、国家と教育、学問の自由、文化継承などを論じる。帝國大學の必読書の一つとして知られる。</p>"},
 philosophy:{title:"教育理念",label:"EDUCATIONAL PHILOSOPHY",body:"<p>教育は、国家に都合のよい人間を製造する制度ではなく、自ら考え、自分の人生を選択できるようにする営みである。学びたいと願う者に学ぶ場所を与え、教師と学生が共に問い続けることを大切にする。</p>"},
 history:{title:"帝國教育史",label:"HISTORY & SYSTEM",body:"<p>教育思想と制度の歩みを記録する資料分類。九条院春臣が教育そのものを国家文化の中心に据え、教育制度の礎を築いたことを重要な節目として扱う。</p><div class='dialog-note'>年代・制度の詳細は、正史として確定した資料に基づき追記します。</div>"},
 persons:{title:"教育人物録",label:"PERSONS & EDUCATORS",body:"<p>教育・学術・文化の発展に携わった人物を紹介する資料分類。現在は九条院春臣を中心に、中原壱葉・中原八雲ら教育に携わる人物の記録を整理する。</p>"},
 publications:{title:"刊行物・研究資料",label:"BOOKS & RESEARCH",body:"<p>教育思想・教育史・学術に關する著作と研究記録を収録する資料分類。著作の書誌情報や内容は、確認できた資料から順次掲載する。</p>"}
};
document.querySelectorAll("[data-dialog]").forEach(button=>button.addEventListener("click",()=>{
 const item=details[button.dataset.dialog];if(!item||!modal)return;
 modalTitle.textContent=item.title;modalLabel.textContent=item.label;modalBody.innerHTML=item.body;
 if(typeof modal.showModal==="function")modal.showModal();else modal.setAttribute("open","");
}));
function closeModal(){if(!modal)return;if(typeof modal.close==="function")modal.close();else modal.removeAttribute("open");}
const closeButton=document.getElementById("dialog-close");if(closeButton)closeButton.addEventListener("click",closeModal);
if(modal)modal.addEventListener("click",event=>{if(event.target===modal)closeModal();});
})();