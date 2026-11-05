(function(){
"use strict";
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));

/* Reading line */
const progress=$("#reading-progress");
function updateProgress(){
 if(!progress)return;
 const root=document.documentElement,max=root.scrollHeight-root.clientHeight;
 progress.style.width=(max>0?root.scrollTop/max*100:0)+"%";
}
window.addEventListener("scroll",updateProgress,{passive:true});
window.addEventListener("resize",updateProgress);updateProgress();

/* Mobile navigation */
const toggle=$(".nav-toggle"),nav=$(".nav-links");
if(toggle&&nav){
 toggle.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded",String(open));
  const label=$("[data-toggle-label]",toggle);
  if(label)label.textContent=open?"閉じる":"案内をひらく";
 });
 $$("a",nav).forEach(a=>a.addEventListener("click",()=>{
  nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");
  const label=$("[data-toggle-label]",toggle);if(label)label.textContent="案内をひらく";
 }));
}

/* Gentle section reveal: content remains visible if the observer is unavailable */
const reveal=$$(".reveal");
if("IntersectionObserver" in window){
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});
 },{threshold:.1,rootMargin:"0px 0px -24px 0px"});
 reveal.forEach(el=>observer.observe(el));
}else reveal.forEach(el=>el.classList.add("is-visible"));

/* Pointer-lit hero and dimensional cards */
const hero=$(".hero");
if(hero&&window.matchMedia("(hover:hover) and (pointer:fine)").matches){
 hero.addEventListener("pointermove",event=>{
  const rect=hero.getBoundingClientRect();
  hero.style.setProperty("--pointer-x",(event.clientX-rect.left)+"px");
  hero.style.setProperty("--pointer-y",(event.clientY-rect.top)+"px");
 });
}
if(window.matchMedia("(hover:hover) and (pointer:fine)").matches){
 $$(".portal-card").forEach(card=>{
  card.addEventListener("pointermove",event=>{
   const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;
   card.style.setProperty("--shine-x",(x*100)+"%");
   card.style.setProperty("--shine-y",(y*100)+"%");
   card.style.setProperty("--tilt-x",((.5-y)*4)+"deg");
   card.style.setProperty("--tilt-y",((x-.5)*5)+"deg");
  });
  card.addEventListener("pointerleave",()=>{
   card.style.setProperty("--tilt-x","0deg");card.style.setProperty("--tilt-y","0deg");
  });
 });
}

/* Directory filters */
const filters=$$("[data-filter]"),directoryItems=$$("[data-category]");
filters.forEach(button=>button.addEventListener("click",()=>{
 const value=button.dataset.filter;
 filters.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));
 directoryItems.forEach(item=>{item.hidden=value!=="all"&&item.dataset.category!==value;});
}));

/* Knowledge constellation */
const studies={
 classics:{
  kicker:"01　/　TEXTS & CLASSICS",title:"古典・漢学",
  text:"春臣は幼少期から古典・漢学に親しみ、先人たちが遺した言葉と思想を学んだ。古典を絶対視するのではなく、時代を越えて読み直し、自ら考えるための礎として向き合っている。",
  quote:"「古きを知る者こそ、新しきを選ぶことができる。」"
 },
 history:{
  kicker:"02　/　MEMORY & LETTERS",title:"歴史・文学",
  text:"歴史と文学は、人々が何を考え、何を愛し、どのように生きてきたのかを伝える知の記録である。春臣は古今の記録と言葉に親しみ、文化を次代へ渡すことの意味を考え続けた。",
  quote:"「昔の先生方がいて、今の学生たちがいて、その間を少し繋いだだけです。」"
 },
 western:{
  kicker:"03　/　THOUGHT & PHILOSOPHY",title:"西洋思想・哲学",
  text:"後に西洋思想や哲学を学び、古典の知と近代の思想を照らし合わせた。古いものを捨てて新しいものに従うのではなく、双方を知った上で自ら選び取る姿勢を大切にする。",
  quote:"「古きを捨てて新しきを取るのではない。」"
 },
 science:{
  kicker:"04　/　NATURE & INQUIRY",title:"自然科学",
  text:"自然科学にも目を向け、物事を権威や慣習だけで判断せず、問いを立て、観察し、考えることを重んじた。知ることは、世界を自分の目で見つめ直すことでもある。",
  quote:"「分からないことは恥ではありません。」"
 },
 education:{
  kicker:"05　/　PEDAGOGY & FREEDOM",title:"近代教育学",
  text:"近代教育学を学び、教師と学生の関係、人格形成、学問の自由を問い続けた。教師が生徒を理想像へ作り替えるのではなく、その人が自分自身になれるよう助けることを教育の役割と考える。",
  quote:"「教師は少し先に勉強しただけです。」"
 },
 arts:{
  kicker:"06　/　AESTHETICS & ART",title:"美術・美意識",
  text:"文学や美術にも深い関心を寄せた。美を単なる装飾としてではなく、その時代を生きる人々の感性や価値観が映るものとして見つめ、表現の中に宿る人間の姿を考えた。",
  quote:"「君はどう思うのです？」"
 }
};
const atlasButtons=$$("[data-study]"),atlasTitle=$("#atlas-title"),atlasText=$("#atlas-description"),atlasQuote=$("#atlas-quote"),atlasKicker=$("#atlas-kicker"),atlasPosition=$("#atlas-position");
function selectStudy(key){
 const item=studies[key];if(!item)return;
 atlasButtons.forEach((button,index)=>{
  const selected=button.dataset.study===key;
  button.setAttribute("aria-pressed",String(selected));
  if(selected&&atlasPosition)atlasPosition.textContent=String(index+1).padStart(2,"0")+"　／　06";
 });
 if(atlasTitle)atlasTitle.textContent=item.title;
 if(atlasText)atlasText.textContent=item.text;
 if(atlasQuote)atlasQuote.textContent=item.quote;
 if(atlasKicker)atlasKicker.textContent=item.kicker;
}
atlasButtons.forEach(button=>button.addEventListener("click",()=>selectStudy(button.dataset.study)));

/* Turning pages through the words of Kōjōin Haruomi */
const quotations=[
 {text:"「人を作るのが教育ではありません。その人が、自分自身になれるようにすることが教育です。」",source:"— 九条院 春臣　／　教育思想"},
 {text:"「君はどう思うのです？」",source:"— 九条院 春臣　／　学生との対話"},
 {text:"「分からないことは恥ではありません。分からないままにしておくことのほうが、よほど勿体ない。」",source:"— 九条院 春臣　／　学びについて"},
 {text:"「教師が生徒より偉いなどということはありません。教師は少し先に勉強しただけです。」",source:"— 九条院 春臣　／　教師と学生"},
 {text:"「古きを捨てて新しきを取るのではない。古きを知る者こそ、新しきを選ぶことができる。」",source:"— 九条院 春臣　／　文化の継承"},
 {text:"「未来を決めるのは、未来を生きる人間自身でしょう。」",source:"— 九条院 春臣　／　未来について"}
];
let quoteIndex=0;
const quoteText=$("#quote-text"),quoteSource=$("#quote-source"),quoteCount=$("#quote-count");
function showQuote(index){
 quoteIndex=(index+quotations.length)%quotations.length;
 const item=quotations[quoteIndex];
 if(quoteText){quoteText.style.opacity="0";quoteText.style.transform="translateY(5px)";window.setTimeout(()=>{
  quoteText.textContent=item.text;quoteText.style.opacity="1";quoteText.style.transform="translateY(0)";
 },140);}
 if(quoteSource)quoteSource.textContent=item.source;
 if(quoteCount)quoteCount.textContent=String(quoteIndex+1).padStart(2,"0")+" / "+String(quotations.length).padStart(2,"0");
 if(typeof renderBookmarks==="function")renderBookmarks();
}
const prevQuote=$("[data-quote-prev]"),nextQuote=$("[data-quote-next]");
if(prevQuote)prevQuote.addEventListener("click",()=>showQuote(quoteIndex-1));
if(nextQuote)nextQuote.addEventListener("click",()=>showQuote(quoteIndex+1));

/* One index for all important pages */
const records=[
 {title:"帝國教育廳について",desc:"本廳の役割・教育行政・基本理念",url:"about.html",keywords:"教育廳 本廳 役割 教育行政 中央行政機關"},
 {title:"教育理念",desc:"学ぶ自由、自ら考える力、文化の継承",url:"about.html#philosophy",keywords:"理念 自由 古典 西洋 学問 人格形成 教師 学生"},
 {title:"九条院春臣",desc:"教育廳長官・帝國大學創設者",url:"about.html#director",keywords:"長官 教育者 思想家 文学者 教育侖 吉田松陰 教師"},
 {title:"日ノ本帝國國立帝國大學",desc:"九条院春臣が創設した高等教育・学術研究機關",url:"institutions.html#university",keywords:"大学 帝國大學 高等教育 学術 文学 哲学 歴史 医学 美術"},
 {title:"日ノ本國立帝都女學院",desc:"中原壱葉・中原八雲らが教壇に立つ教育機關",url:"institutions.html#academy",keywords:"女學院 学校 國語 央語 中原壱葉 中原八雲"},
 {title:"中原壱葉",desc:"詩人・日ノ本國立帝都女學院國語教諭",url:"institutions.html#academy",keywords:"中原 中也 詩人 國語 教師 九条院塾 森林太郎"},
 {title:"中原八雲",desc:"文學者・翻譯家・日ノ本國立帝都女學院央語教諭",url:"institutions.html#academy",keywords:"小泉八雲 ヘルン 央語 怪談 妖怪 神武國"},
 {title:"『教育侖』",desc:"九条院春臣による教育思想の代表的著作",url:"archives.html#education-theory",keywords:"教育論 教育侖 著作 自由 国家 文化継承"},
 {title:"帝國教育史",desc:"教育思想と教育制度の歩み",url:"archives.html#history",keywords:"史料 資料 歴史 教育制度"},
 {title:"教育人物録",desc:"教育・学術・文化に携わる人々",url:"archives.html#persons",keywords:"人物録 人物 教師 春臣 壱葉 八雲"},
 {title:"刊行物・研究資料",desc:"教育思想・学術・文化継承に關する記録",url:"archives.html#publications",keywords:"刊行物 研究 資料 学術"},
 {title:"告示・公表資料",desc:"教育行政情報・公表文書・統計・刊行物",url:"notices.html",keywords:"告示 統計 公表 通達 行政情報"}
];
function searchRecords(query){
 const terms=String(query||"").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 if(!terms.length)return records.slice(0,6);
 return records.filter(item=>{
  const hay=(item.title+" "+item.desc+" "+item.keywords).toLocaleLowerCase();
  return terms.every(term=>hay.includes(term));
 });
}
function addResultLink(container,item,className){
 const a=document.createElement("a");a.href=item.url;if(className)a.className=className;
 const strong=document.createElement("strong");strong.textContent=item.title;
 const small=document.createElement("small");small.textContent=item.desc;
 a.append(strong,small);container.appendChild(a);return a;
}

/* Inline search */
const searchForm=$("#site-search-form"),searchInput=$("#site-search-input"),searchPanel=$("#search-results"),searchList=$("#search-list"),searchCount=$("#search-count");
if(searchForm&&searchInput&&searchPanel&&searchList&&searchCount){
 searchForm.addEventListener("submit",event=>{
  event.preventDefault();searchList.replaceChildren();
  const raw=searchInput.value.trim(),found=searchRecords(raw);
  searchCount.textContent=raw?"「"+raw+"」の検索結果："+found.length+"件":"主な案内";
  if(found.length)found.forEach(item=>addResultLink(searchList,item));
  else{const p=document.createElement("p");p.className="search-empty";p.textContent="該当する項目はありません。別の言葉でお探しください。";searchList.appendChild(p);}
  searchPanel.classList.add("open");
 });
 const close=$("#search-close");if(close)close.addEventListener("click",()=>searchPanel.classList.remove("open"));
}

/* Command palette: keyboard-first, instant navigation */
const command=$("#command-dialog"),commandButton=$("[data-open-search]"),commandClose=$("[data-command-close]");
const commandForm=$("#command-search-form"),commandInput=$("#command-search-input"),commandList=$("#command-results-list"),commandCount=$("#command-count");
let commandLinks=[],commandActive=-1;
function renderCommand(query){
 if(!commandList||!commandCount)return;
 commandList.replaceChildren();
 const found=searchRecords(query);
 commandCount.textContent=query&&query.trim()?"該当項目　"+found.length+"件":"主要項目　"+found.length+"件";
 commandLinks=found.map(item=>addResultLink(commandList,item));
 commandActive=-1;
}
function openCommand(){
 if(!command)return;
 renderCommand("");
 if(typeof command.showModal==="function")command.showModal();else command.setAttribute("open","");
 if(commandInput)window.setTimeout(()=>commandInput.focus(),40);
}
function closeCommand(){
 if(!command)return;
 if(typeof command.close==="function"&&command.open)command.close();else command.removeAttribute("open");
}
if(commandButton)commandButton.addEventListener("click",openCommand);
if(commandClose)commandClose.addEventListener("click",closeCommand);
if(commandForm&&commandInput)commandForm.addEventListener("submit",event=>{
 event.preventDefault();renderCommand(commandInput.value);
 if(commandLinks.length)commandLinks[0].focus();
});
if(commandInput)commandInput.addEventListener("input",()=>renderCommand(commandInput.value));
if(commandList)commandList.addEventListener("keydown",event=>{
 if(!commandLinks.length)return;
 if(event.key==="ArrowDown"){event.preventDefault();commandActive=(commandActive+1)%commandLinks.length;commandLinks[commandActive].focus();}
 if(event.key==="ArrowUp"){event.preventDefault();commandActive=(commandActive-1+commandLinks.length)%commandLinks.length;commandLinks[commandActive].focus();}
});
if(command)command.addEventListener("click",event=>{if(event.target===command)closeCommand();});
document.addEventListener("keydown",event=>{
 const target=event.target;
 const editing=target&&(target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(target.tagName));
 if(command?.open&&target===commandInput&&commandLinks.length&&(event.key==="ArrowDown"||event.key==="ArrowUp")){
  event.preventDefault();commandActive=event.key==="ArrowDown"?0:commandLinks.length-1;commandLinks[commandActive].focus();
 }else if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){
  event.preventDefault();openCommand();
 }else if(event.key==="/"&&!editing&&!command?.open){
  event.preventDefault();openCommand();
 }else if(event.key==="Escape"&&command?.open)closeCommand();
});

/* Living Codex: select and turn through four chapters */
const codexChapters=[
 {key:"freedom",folio:"FOLIO Ⅰ　／　FREEDOM",title:"教育と自由",reader:"教育を、他者を理想の形へ作り替えるための技術にしない。学ぶ者が自ら考え、自身の人生を選択するための力を育む。",page:"教育は、国家に都合のよい人間を製造するための制度ではない。人が自ら考え、自分の人生を選び取るための営みである。",quote:"「その人が、自分自身になれるようにすることが教育です。」"},
 {key:"teacher",folio:"FOLIO Ⅱ　／　TEACHER & STUDENT",title:"教師と学生",reader:"教師と学生の間にあるのは、身分の上下ではない。教師は少し先に学んだ者として、学生の問いに向き合い、ともに考える。",page:"教師が生徒より偉いのではありません。教師は少し先に勉強しただけです。問いを持つことを恐れず、互いに学ぶことを大切にする。",quote:"「君はどう思うのです？」"},
 {key:"classics",folio:"FOLIO Ⅲ　／　CLASSICS & MODERNITY",title:"古典と近代",reader:"古典を絶対視せず、新しい思想を無条件に正しいともしない。先人の知を学び、近代の学問と照らし合わせ、自ら選び取る。",page:"古いものを捨てて新しいものを取るのではない。古きを知る者こそ、新しきを選ぶことができる。",quote:"「古きを知る者こそ、新しきを選ぶことができる。」"},
 {key:"future",folio:"FOLIO Ⅳ　／　THE FUTURE",title:"未来を選ぶ",reader:"教育が未来の形を決めるのではない。学びを受け取った者が、自らの意思で未来を選び、その時代を生きていく。",page:"未来を決めるのは、未来を生きる人間自身でしょう。学びは、その選択を支えるためにある。",quote:"「未来を決めるのは、未来を生きる人間自身でしょう。」"}
];
let codexIndex=0;
const codexButtons=$$("[data-codex]");
const codexContent=$("#codex-page-content"),codexKicker=$("#codex-page-kicker"),codexPageTitle=$("#codex-page-title"),codexPageText=$("#codex-page-text"),codexPageQuote=$("#codex-page-quote"),codexPageNumber=$("#codex-page-number"),codexReaderTitle=$("#codex-reader-title"),codexReaderText=$("#codex-reader-text"),codexChapterCount=$("#codex-chapter-count");
function selectCodex(index){
 codexIndex=(index+codexChapters.length)%codexChapters.length;
 const chapter=codexChapters[codexIndex];
 codexButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.codex===chapter.key)));
 if(codexContent){
  codexContent.classList.add("turning");
  window.setTimeout(()=>{
   if(codexKicker)codexKicker.textContent=chapter.folio;
   if(codexPageTitle)codexPageTitle.textContent=chapter.title;
   if(codexPageText)codexPageText.textContent=chapter.page;
   if(codexPageQuote)codexPageQuote.textContent=chapter.quote;
   codexContent.classList.remove("turning");
  },150);
 }
 if(codexPageNumber)codexPageNumber.textContent=String(codexIndex+1).padStart(2,"0")+"　／　04";
 if(codexReaderTitle)codexReaderTitle.textContent=chapter.title;
 if(codexReaderText)codexReaderText.textContent=chapter.reader;
 if(codexChapterCount)codexChapterCount.textContent="FOLIO "+String(codexIndex+1).padStart(2,"0")+" / 04";
}
codexButtons.forEach(button=>button.addEventListener("click",()=>selectCodex(codexChapters.findIndex(chapter=>chapter.key===button.dataset.codex))));
const codexNext=$("#codex-next");if(codexNext)codexNext.addEventListener("click",()=>selectCodex(codexIndex+1));


/* Imperial ceremonial portal */
const rite=$("#rite-dialog"),riteOpen=$("[data-open-rite]"),riteClose=$("[data-rite-close]"),riteEnter=$("[data-rite-enter]");
function openRite(){if(!rite)return;if(typeof rite.showModal==="function")rite.showModal();else rite.setAttribute("open","");}
function closeRite(){if(!rite)return;if(typeof rite.close==="function"&&rite.open)rite.close();else rite.removeAttribute("open");}
if(riteOpen)riteOpen.addEventListener("click",openRite);
if(riteClose)riteClose.addEventListener("click",closeRite);
if(riteEnter)riteEnter.addEventListener("click",closeRite);
if(rite)rite.addEventListener("click",event=>{if(event.target===rite)closeRite();});
const riteEmblem=$(".rite-emblem");
if(riteEmblem&&window.matchMedia("(hover:hover) and (pointer:fine)").matches){
 riteEmblem.addEventListener("pointermove",event=>{
  const r=riteEmblem.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;
  riteEmblem.style.setProperty("--rite-y",((x-.5)*22)+"deg");
  riteEmblem.style.setProperty("--rite-x",((.5-y)*18)+"deg");
 });
 riteEmblem.addEventListener("pointerleave",()=>{riteEmblem.style.setProperty("--rite-x","0deg");riteEmblem.style.setProperty("--rite-y","0deg");});
}

/* Reading lamps: a night-colored codex and a vertical Japanese folio */
function syncToggle(selector,enabled,labelOn,labelOff){
 $$(selector).forEach(button=>{
  button.setAttribute("aria-pressed",String(enabled));
  const span=$("span",button);
  if(span)span.textContent=enabled?labelOn:labelOff;
 });
}
$$("[data-night-toggle]").forEach(button=>button.addEventListener("click",()=>{
 const enabled=!document.body.classList.contains("night-codex");
 document.body.classList.toggle("night-codex",enabled);
 syncToggle("[data-night-toggle]",enabled,"OFF","ON");
 $$("[data-night-toggle]").forEach(button=>{if(!button.querySelector("span"))button.textContent=enabled?"夜間頁":"燈火";});
}));
$$("[data-vertical-toggle]").forEach(button=>button.addEventListener("click",()=>{
 const enabled=!document.body.classList.contains("vertical-codex");
 document.body.classList.toggle("vertical-codex",enabled);
 syncToggle("[data-vertical-toggle]",enabled,"横書","縦書");
 $$("[data-vertical-toggle]").forEach(button=>{if(!button.querySelector("span"))button.textContent=enabled?"横書":"縦書";});
}));

/* Constellation of the educational institutions */
const orbitRecords={
 juku:{label:"PRIVATE ACADEMY　／　01",title:"九条院塾",text:"九条院春臣が開いた私塾。春臣は塾生たちと学問を共にし、問いを持つことや、自ら考えることを大切にした。中原壱葉もかつてこの塾で学んだ。"},
 university:{label:"HIGHER EDUCATION　／　02",title:"日ノ本帝國國立帝國大學",text:"九条院春臣が創設した高等教育・学術研究機關。「學問ノ府、文化ノ源流」を精神に掲げ、文学・哲学・歴史・自然科学・医学・美術など、学問そのものを探究する場所として構想された。"},
 academy:{label:"GIRLS' ACADEMY　／　03",title:"日ノ本國立帝都女學院",text:"國語教諭の詩人・中原壱葉、央語教諭の文學者・翻譯家・中原八雲が教壇に立つ。異なる言葉と感性を持つ教師たちが、学生の学びを支えている。"},
 ministry:{label:"PUBLIC EDUCATION　／　04",title:"帝國教育廳",text:"九条院春臣が長官を務める中央行政機關。教育と学問の発展を支え、学ぶ機会と学問の自由、文化の継承を重んじる。"}
};
const orbitButtons=$$("[data-orbit]"),orbitLabel=$("#orbit-label"),orbitTitle=$("#orbit-title"),orbitDescription=$("#orbit-description");
function selectOrbit(key){
 const item=orbitRecords[key];if(!item)return;
 orbitButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.orbit===key)));
 if(orbitLabel)orbitLabel.textContent=item.label;
 if(orbitTitle)orbitTitle.textContent=item.title;
 if(orbitDescription)orbitDescription.textContent=item.text;
}
orbitButtons.forEach(button=>button.addEventListener("click",()=>selectOrbit(button.dataset.orbit)));

/* Dual archive: classic learning and modern inquiry */
const dualButtons=$$("[data-dual]"),classicsPane=$("#dual-classics"),modernPane=$("#dual-modern"),dualConclusion=$("#dual-conclusion");
const dualTexts={
 classics:"古典と漢学を通じて、先人の言葉と思想を受け継ぐ。過去を知ることは、現在を考えるための礎となる。",
 modern:"西洋思想・哲学・自然科学・近代教育学に向き合い、新たな問いを得る。新しさだけを正しさの証明とはしない。",
 harmony:"古きを捨てて新しきを取るのではない。古典を知り、近代の知と照らし合わせ、自ら考えて選び取る。その対話の中に、春臣の学びの姿勢がある。"
};
function selectDual(key){
 dualButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.dual===key)));
 if(classicsPane)classicsPane.classList.toggle("is-emphasized",key==="classics"||key==="harmony");
 if(modernPane)modernPane.classList.toggle("is-emphasized",key==="modern"||key==="harmony");
 if(dualConclusion)dualConclusion.textContent=dualTexts[key]||dualTexts.harmony;
}
dualButtons.forEach(button=>button.addEventListener("click",()=>selectDual(button.dataset.dual)));

/* Guided knowledge pilgrimage */
const routes={
 thinker:{label:"A PATH OF INQUIRY　／　問いを深める道",steps:[
  ["FIRST GATE","教育理念","九条院春臣が大切にした、学びと自由の思想にふれる。","about.html#philosophy","理念を読む　→"],
  ["SECOND GATE","『教育侖』","教育と自由、教師と学生、古典と近代を読み解く。","archives.html#education-theory","書をひらく　→"],
  ["THIRD GATE","知の星図","春臣の学問的関心を六つの領域から辿る。","#atlas","星図を巡る　→"]
 ]},
 teacher:{label:"A PATH OF TEACHING　／　教えることを考える道",steps:[
  ["FIRST GATE","春臣の教育思想","人を作るのではなく、その人が自分自身になることを助ける。","about.html#director","長官の言葉を読む　→"],
  ["SECOND GATE","九条院塾","問いを持ち、学ぶ者と共に考えた春臣の私塾を辿る。","#institutions-orbit","塾の記録を辿る　→"],
  ["THIRD GATE","帝都女學院","中原壱葉と中原八雲、それぞれの教え方にふれる。","institutions.html#academy","教師たちを知る　→"]
 ]},
 culture:{label:"A PATH OF CULTURE　／　文化を辿る道",steps:[
  ["FIRST GATE","古典・漢学","先人の言葉と思想から、帝國の文化の根を辿る。","#atlas","星図を巡る　→"],
  ["SECOND GATE","歴史・文学","歴史と文学に刻まれた人間の営みを読む。","archives.html","史料室を訪ねる　→"],
  ["THIRD GATE","帝國大學","学問と文化を探究する「學問ノ府」を訪ねる。","institutions.html#university","大学を知る　→"]
 ]}
};
const routeButtons=$$("[data-route]"),routeContainer=$("#pilgrimage-route"),routeSummary=$("#pilgrimage-summary");
function renderRoute(key){
 const route=routes[key];if(!route||!routeContainer)return;
 routeButtons.forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.route===key)));
 routeContainer.replaceChildren();
 route.steps.forEach((step,index)=>{
  const article=document.createElement("article");article.className="pilgrimage-step";
  const number=document.createElement("div");number.className="step-number";number.textContent=["Ⅰ","Ⅱ","Ⅲ"][index];
  const small=document.createElement("small");small.textContent=step[0];
  const title=document.createElement("h3");title.textContent=step[1];
  const p=document.createElement("p");p.textContent=step[2];
  const a=document.createElement("a");a.href=step[3];a.textContent=step[4];
  article.append(number,small,title,p,a);routeContainer.appendChild(article);
 });
 if(routeSummary)routeSummary.textContent=route.label;
}
routeButtons.forEach(button=>button.addEventListener("click",()=>renderRoute(button.dataset.route)));

/* A personal folio for saved quotations, held only in this browser */
const BOOKMARK_KEY="imperial-education-folio-v1";
function getBookmarks(){
 try{const parsed=JSON.parse(localStorage.getItem(BOOKMARK_KEY)||"[]");return Array.isArray(parsed)?parsed:[];}
 catch(_){return [];}
}
function setBookmarks(items){
 try{localStorage.setItem(BOOKMARK_KEY,JSON.stringify(items));return true;}
 catch(_){return false;}
}
const saveQuoteButton=$("#save-quote"),openBookmarksButton=$("#open-bookmarks"),bookmarkDialog=$("#bookmark-dialog"),bookmarkList=$("#bookmark-list"),bookmarkClose=$("#bookmark-close");
function renderBookmarks(){
 if(!bookmarkList)return;
 const items=getBookmarks();bookmarkList.replaceChildren();
 if(!items.length){const p=document.createElement("p");p.className="bookmark-empty";p.textContent="まだ栞はありません。心に残った言葉を、ここへ収めてください。";bookmarkList.appendChild(p);}
 items.forEach((item,index)=>{
  const entry=document.createElement("article");entry.className="bookmark-entry";
  const p=document.createElement("p");p.textContent=item.text;
  const small=document.createElement("small");small.textContent=item.source;
  const remove=document.createElement("button");remove.type="button";remove.textContent="×";remove.setAttribute("aria-label","この栞を取り除く");
  remove.addEventListener("click",()=>{const next=getBookmarks();next.splice(index,1);setBookmarks(next);renderBookmarks();});
  entry.append(p,small,remove);bookmarkList.appendChild(entry);
 });
 if(openBookmarksButton)openBookmarksButton.textContent="栞の書架をひらく　／　"+items.length;
 const current=quotations[quoteIndex];
 const saved=items.some(item=>item.text===current.text);
 if(saveQuoteButton){saveQuoteButton.setAttribute("aria-pressed",String(saved));saveQuoteButton.textContent=saved?"栞に収めました　✧":"この言葉を栞にする　✧";}
}
if(saveQuoteButton)saveQuoteButton.addEventListener("click",()=>{
 const current=quotations[quoteIndex],items=getBookmarks();
 const index=items.findIndex(item=>item.text===current.text);
 if(index>=0)items.splice(index,1);else items.unshift({text:current.text,source:current.source});
 if(setBookmarks(items))renderBookmarks();
});
if(openBookmarksButton)openBookmarksButton.addEventListener("click",()=>{
 renderBookmarks();if(bookmarkDialog&&typeof bookmarkDialog.showModal==="function")bookmarkDialog.showModal();else if(bookmarkDialog)bookmarkDialog.setAttribute("open","");
});
if(bookmarkClose)bookmarkClose.addEventListener("click",()=>{if(bookmarkDialog&&typeof bookmarkDialog.close==="function")bookmarkDialog.close();else if(bookmarkDialog)bookmarkDialog.removeAttribute("open");});
if(bookmarkDialog)bookmarkDialog.addEventListener("click",event=>{if(event.target===bookmarkDialog&&typeof bookmarkDialog.close==="function")bookmarkDialog.close();});
renderBookmarks();

})();
