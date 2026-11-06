(function(){
"use strict";
if(document.querySelector(".imperial-palace-dock"))return;
const key="hinomoto-imperial-lantern-v1";
let lantern=false;try{lantern=localStorage.getItem(key)==="on"}catch(_){}
document.body.classList.toggle("imperial-lantern-on",lantern);
const dock=document.createElement("aside");dock.className="imperial-palace-dock";dock.setAttribute("aria-label","帝國教育廳 補助器具");
dock.innerHTML='<button type="button" class="dock-seal" data-dock-compass aria-label="帝國學問羅針盤をひらく" title="帝國學問羅針盤">✥</button><button type="button" class="dock-label" data-dock-lantern aria-pressed="false">閲覧燈</button><button type="button" class="dock-seal" data-dock-top aria-label="頁の先頭へ戻る" title="頁の先頭へ">⌃</button>';
document.body.appendChild(dock);
const lamp=dock.querySelector("[data-dock-lantern]");
function sync(){lamp.setAttribute("aria-pressed",String(lantern));lamp.textContent=lantern?"閲覧燈 ON":"閲覧燈"}
sync();
lamp.addEventListener("click",()=>{lantern=!lantern;document.body.classList.toggle("imperial-lantern-on",lantern);try{localStorage.setItem(key,lantern?"on":"off")}catch(_){}sync()});
dock.querySelector("[data-dock-compass]").addEventListener("click",()=>{
 const trigger=document.querySelector(".empire-compass-trigger");
 if(trigger)trigger.click();else window.location.href="index.html#atlas";
});
dock.querySelector("[data-dock-top]").addEventListener("click",()=>window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
const folio=document.querySelector("#empire-secret");
if(folio&&!folio.querySelector("[data-palimpsest-link]")){
 const link=document.createElement("a");link.href="palimpsest.html";link.className="empire-detail-link";link.dataset.palimpsestLink="true";link.textContent="失われた余白をひらく　／　THE IMPERIAL PALIMPSEST　✧";link.style.display="inline-block";link.style.marginTop="12px";link.style.borderBottom="1px solid #b18a4d";folio.appendChild(link);
}
const page=(location.pathname.split("/").pop()||"index.html");
if(page==="palimpsest.html"){
 const steps=[
  {en:"FOLIO I　／　THE EDUCATOR",title:"第一の問い — 思想を遺した者",intro:"教育廳の長官であり、日ノ本帝國國立帝國大學の創設者。教育を人が自ら考え、人生を選び取るための営みと捉えた人物の名を記せ。",question:"帝國教育廳長官の姓名は何か。",answer:"九条院春臣",hint:"首頁の長官紹介、または教育廳についての頁を読み返す。"},
  {en:"FOLIO II　／　THE IMPERIAL PRINCIPLE",title:"第二の問い — 教育の標語",intro:"知を受け継ぎ、問いを育てる。帝國教育廳の創設理念を示す標語を、掲げられた言葉のまま記せ。",question:"「學ビヲ絶ヤサズ、未来ヲ拓ク。」この標語を入力せよ。",answer:"學ビヲ絶ヤサズ未来ヲ拓ク",hint:"首頁の薔薇窓の下、創設理念の章に掲げられている。"},
  {en:"FOLIO III　／　THE LAST PRINCIPLE",title:"第三の問い — 教えるということ",intro:"教育は、知識を授けるだけの営みではない。九条院春臣の思想を象徴する、教育と支配についての一文を探せ。",question:"「教えることは、＿＿することではない。」空欄に入る二字を記せ。",answer:"支配",hint:"首頁の「教育理念」および九条院春臣の思想を辿る。"}
 ];
 const normalize=s=>String(s||"").normalize("NFKC").replace(/[ 　\t\r\n。、．・「」『』：:／/]/g,"").toLowerCase();
 const storage="hinomoto-palimpsest-progress-v1";let progress=0;try{progress=Math.max(0,Math.min(3,Number(localStorage.getItem(storage)||0)))}catch(_){}
 const root=document.querySelector("#palimpsest-game");if(!root)return;
 const bar=root.querySelector(".palimpsest-progress"),label=root.querySelector("#palimpsest-label"),title=root.querySelector("#palimpsest-title"),intro=root.querySelector("#palimpsest-intro"),question=root.querySelector("#palimpsest-question"),form=root.querySelector("#palimpsest-form"),input=root.querySelector("#palimpsest-answer"),feedback=root.querySelector("#palimpsest-feedback"),hint=root.querySelector("#palimpsest-hint"),final=root.querySelector("#palimpsest-final");
 function draw(){
  bar.replaceChildren();for(let i=0;i<3;i++){const mark=document.createElement("i");if(i<progress)mark.className="is-done";bar.appendChild(mark)}
  if(progress>=3){form.hidden=true;hint.hidden=true;label.textContent="THE FINAL FOLIO　／　REVEALED";title.textContent="失われた余白は、未来へひらかれた。";intro.textContent="三つの問いは、すべて教育廳の公開された記録に記されていた。知ること、読み解くこと、自ら答えを選び取ること。その営みそのものが、学びの道である。";question.textContent="學ビヲ絶ヤサズ、未来ヲ拓ク。";final.classList.add("is-open");return}
  const step=steps[progress];label.textContent=step.en;title.textContent=step.title;intro.textContent=step.intro;question.textContent=step.question;input.value="";feedback.textContent="";
 }
 form.addEventListener("submit",event=>{event.preventDefault();if(normalize(input.value)===normalize(steps[progress].answer)){progress++;try{localStorage.setItem(storage,String(progress))}catch(_){}feedback.textContent=progress===3?"最後の頁がひらかれた。":"封緘がひとつ解けた。次の頁へ。";draw()}else feedback.textContent="その言葉では、まだ頁はひらかれない。公開された記録をもう一度辿ってみてください。"});
 hint.addEventListener("click",()=>{feedback.textContent=steps[progress]?.hint||""});
 const reset=root.querySelector("#palimpsest-reset");reset.addEventListener("click",()=>{progress=0;try{localStorage.removeItem(storage)}catch(_){}final.classList.remove("is-open");form.hidden=false;hint.hidden=false;draw()});
 draw();
}
})();