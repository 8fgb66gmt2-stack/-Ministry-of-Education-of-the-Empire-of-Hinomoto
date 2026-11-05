/* IMPERIAL INTERACTIVE ATLAS & SEALED ARCHIVE */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
/* Four directions of the imperial knowledge instrument */
const atlas={
 north:{index:"DIRECTION I　／　THE CLASSICS",title:"古典・漢学",text:"先人の言葉と思想を読み、時代を越えて受け継がれた知の根を辿る。古典は過去に閉じたものではなく、今日を考えるための灯である。",link:"archives.html#history",label:"史料室をひらく　→"},
 east:{index:"DIRECTION II　／　THE HUMANITIES",title:"歴史・文学",text:"人々が何を考え、何を愛し、どのように生きたのか。歴史と文学に刻まれた人間の営みを、言葉と記録から読み解く。",link:"archives.html#persons",label:"教育人物録を読む　→"},
 south:{index:"DIRECTION III　／　THE SCIENCES",title:"自然科学",text:"観察し、問いを立て、確かめる。自然の理を探究する姿勢は、権威や慣習に判断を委ねず、自ら世界を見つめる学びの一つである。",link:"institutions.html#university",label:"帝國大學を訪ねる　→"},
 west:{index:"DIRECTION IV　／　THE ARTS",title:"美術・美意識",text:"美術と文学に宿る感性を見つめ、表現が時代と人間をどのように映すのかを考える。美は飾りに留まらず、世界を知るための窓となる。",link:"archives.html#publications",label:"刊行物・著作を読む　→"}
};
const points=$$("[data-astral]"),idx=$("#astral-index"),title=$("#astral-title"),copy=$("#astral-copy"),link=$("#astral-link");
function choose(key){const item=atlas[key];if(!item)return;points.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.astral===key)));if(idx)idx.textContent=item.index;if(title)title.textContent=item.title;if(copy)copy.textContent=item.text;if(link){link.href=item.link;link.textContent=item.label;}}
points.forEach(b=>b.addEventListener("click",()=>choose(b.dataset.astral)));
/* Fine pointer parallax, with no movement on touch devices */
const hero=$(".hero");
if(hero&&matchMedia("(hover:hover) and (pointer:fine)").matches){hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();hero.style.setProperty("--pointer-x",(e.clientX-r.left)+"px");hero.style.setProperty("--pointer-y",(e.clientY-r.top)+"px");});}
/* The sealed folio — three stages, answers grounded in public portal content */
const panel=$("#arg-panel"),form=$("#arg-form"),field=$("#arg-answer"),feedback=$("#arg-feedback"),progress=$("#arg-progress"),reward=$("#arg-reward"),prompt=$("#arg-prompt"),heading=$("#arg-heading"),stepLabel=$("#arg-step-label");
if(panel&&form&&field&&feedback){
 const stages=[
  {label:"FOLIO I　／　THE AUTHOR",title:"第一の鍵　—　書物の名",prompt:"九条院春臣が教育と自由、教師と学生、古典と近代について論じた代表的著作。その書名を、教育史料室の表記どおりに記せ。",answers:["教育侖"],hint:"教育史料室の「教育思想」に、その書名がある。"},
  {label:"FOLIO II　／　THE FOUNDER",title:"第二の鍵　—　門をひらいた人",prompt:"帝國大學で最初の女性學生となり、日ノ本帝國國立帝都女學院を創設した人物。その姓名を記せ。",answers:["六條杠葉","杠葉"],hint:"教育機關案内と教育人物録を辿る。"},
  {label:"FOLIO III　／　THE FIRST LEARNING",title:"第三の鍵　—　知のはじまり",prompt:"九条院春臣の「知の星図」。その第一に掲げられた学問領域を記せ。",answers:["古典漢学","古典・漢学","古典 漢学"],hint:"首頁の「知の星図」で、最初の星を選ぶ。"}
 ];
 let current=0,cleared=[];
 const norm=s=>String(s||"").normalize("NFKC").replace(/[\s　・･「」『』。、]/g,"").toLowerCase();
 function render(){const s=stages[current];if(heading)heading.textContent=s.title;if(prompt)prompt.textContent=s.prompt;if(stepLabel)stepLabel.textContent=s.label;if(feedback)feedback.textContent="";if(field){field.value="";field.focus({preventScroll:true});}if(progress)$$("span",progress).forEach((x,i)=>x.classList.toggle("done",i<current));}
 function finish(){if(progress)$$("span",progress).forEach(x=>x.classList.add("done"));form.hidden=true;if(panel)panel.classList.add("completed");if(reward)reward.classList.add("is-open");}
 form.addEventListener("submit",e=>{e.preventDefault();const answer=norm(field.value);if(!answer){feedback.textContent="鍵となる言葉を記してください。";return;}if(stages[current].answers.some(x=>norm(x)===answer)){cleared[current]=true;current++;if(current>=stages.length){finish();return;}render();}else{feedback.textContent="その言葉では封緘は解けない。史料をもう一度辿られよ。";feedback.classList.add("arg-error");}});
 const hint=$("#arg-hint");if(hint)hint.addEventListener("click",()=>{feedback.textContent=stages[current].hint;feedback.classList.remove("arg-error");});
 render();
}
/* small engraved seal opens the exploration without disrupting the official portal */
const seal=$("[data-open-sealed]");if(seal)seal.addEventListener("click",()=>{location.href="sealed-folio.html";});
})();
