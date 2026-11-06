/* THE IMPERIAL READER REGISTRY — local reading identity and personalized routes */
(function(){
"use strict";
if(window.__hinomotoReaderRegistryInstalled)return;
window.__hinomotoReaderRegistryInstalled=true;
const PROFILE_KEY="hinomoto-reader-pass-v1";
const VISITS_KEY="hinomoto-reader-journey-v1";
const NOTE_KEY="hinomoto-imperial-scholar-notebook-v1";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const safeRead=(key,fallback)=>{try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback}catch(_){return fallback}};
const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}};
const page=(location.pathname.split("/").pop()||"index.html");
const interests={
 classics:{label:"古典・漢学",title:"古典の書架から、知の源流へ。",text:"先人の言葉を読み、時代を越えて受け継がれた思想を辿る航路です。",steps:[["知の星図","index.html#atlas"],["教育思想閲覧室","index.html#codex"],["『教育侖』","archives.html#education-theory"]]},
 history:{label:"歴史・文学",title:"記録と文学から、人の歩みを読む。",text:"歴史に刻まれた選択と、文学に遺された心を辿る航路です。",steps:[["知の星図","index.html#atlas"],["教育人物録","archives.html#persons"],["刊行物・研究資料","archives.html#publications"]]},
 philosophy:{label:"西洋思想・哲学",title:"思想を照らし合わせ、自分の言葉を見つける。",text:"異なる時代と思想を比較し、問いを立てるための航路です。",steps:[["教育理念","about.html#philosophy"],["古典と近代の対話","index.html#two-libraries"],["知の錬成室","index.html#inquiry-atelier"]]},
 science:{label:"自然科学",title:"観察し、確かめ、世界の理を探る。",text:"知識を受け取るだけでなく、観察と記録から自ら確かめる航路です。",steps:[["知の錬成室","index.html#inquiry-atelier"],["帝國大學","institutions.html#university"],["教育史料室","archives.html#history"]]},
 education:{label:"近代教育学",title:"教えることと、学ぶ自由を考える。",text:"九条院春臣の教育思想を手がかりに、学びの場と教師の役割を考える航路です。",steps:[["長官紹介","about.html#director"],["教育理念","about.html#philosophy"],["『教育侖』","archives.html#education-theory"]]},
 arts:{label:"美術・美意識",title:"美と文化の余韻を、書物の頁に辿る。",text:"藝術や文学が映す時代の感性を見つめ、表現の奥にある思想を辿る航路です。",steps:[["教育思想閲覧室","index.html#codex"],["刊行物・研究資料","archives.html#publications"],["帝國大學","institutions.html#university"]]}
};
const roleLabels={student:"學生",teacher:"教育者",researcher:"研究者",reader:"閲覧者"};
let profile=safeRead(PROFILE_KEY,null);
if(profile&&typeof profile!=="object")profile=null;
let visits=safeRead(VISITS_KEY,[]);
if(!Array.isArray(visits))visits=[];
if(["index.html","about.html","institutions.html","archives.html","notices.html"].includes(page)&&!visits.includes(page)){
 visits.push(page);visits=visits.slice(-20);safeWrite(VISITS_KEY,visits);
}
function recommendation(){
 const selected=profile&&interests[profile.interest]?interests[profile.interest]:interests.classics;
 const route=$("#reader-route-recommendation");
 if(route){
  route.replaceChildren();
  selected.steps.forEach((step,index)=>{
   const a=document.createElement("a");a.href=step[1];
   const strong=document.createElement("strong");strong.textContent=String(index+1).padStart(2,"0")+"　"+step[0];
   const small=document.createElement("small");small.textContent="OPEN FOLIO　↗";
   a.append(strong,small);route.appendChild(a);
  });
 }
 const title=$("#reader-route-title"),description=$("#reader-route-description");
 if(title)title.textContent=selected.title;
 if(description)description.textContent=selected.text;
 const current=$("#reader-pass-current");
 if(current){
  const strong=$("strong",current),span=$("span",current);
  if(profile){
   strong.textContent=(profile.name||"閲覧者")+"　／　"+(roleLabels[profile.role]||"閲覧者");
   span.textContent="関心領域："+selected.label+"　｜　閲覧者証はこの端末に保存されています。";
  }else{
   strong.textContent="閲覧者証は、まだ刻まれていません。";
   span.textContent="関心分野を選ぶと、あなたのための知の航路がひらかれます。";
  }
 }
 const count=$("#reader-visit-count"),seals=$("#reader-seal-count");
 if(count)count.textContent=String(visits.length).padStart(2,"0");
 const found=safeRead("hinomoto-imperial-seals-v1",[]);
 if(seals)seals.textContent=String(Array.isArray(found)?found.length:0).padStart(2,"0");
 const passButton=$(".reader-pass-trigger");
 if(passButton){
  const status=$(".reader-pass-status",passButton);
  if(status)status.textContent=profile?(roleLabels[profile.role]||"登録済"):"未登録";
 }
}
function openDialog(dialog){if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","")}
function closeDialog(dialog){if(typeof dialog.close==="function"&&dialog.open)dialog.close();else dialog.removeAttribute("open")}
function setupRegistry(){
 const nav=$(".grand-utility")||$(".nav-inner");
 if(!nav)return;
 const button=document.createElement("button");
 button.type="button";button.className="reader-pass-trigger";button.innerHTML='閲覧者証 <span class="reader-pass-status">未登録</span>';
 button.setAttribute("aria-haspopup","dialog");button.setAttribute("aria-label","帝國教育廳の閲覧者証を登録・閲覧する");
 nav.appendChild(button);
 const sectionButton=$("[data-open-reader-pass]");
 if(sectionButton)sectionButton.addEventListener("click",()=>button.click());
 const dialog=document.createElement("dialog");
 dialog.className="reader-pass-dialog";dialog.id="reader-pass-dialog";
 dialog.setAttribute("aria-labelledby","reader-pass-title");
 dialog.innerHTML='<div class="reader-pass-frame"><header class="reader-pass-head"><button class="reader-pass-close" type="button" aria-label="閉じる">×</button><small>THE IMPERIAL READER REGISTRY　／　閲覧者登録</small><h2 id="reader-pass-title">知の門を、あなたの名で。</h2><p>関心をひとつ選び、帝國教育廳の閲覧者証をお納めください。<br>その選択に応じた知の航路をご案内します。</p></header><form class="reader-pass-form" id="reader-pass-form"><div class="reader-pass-field full"><label for="reader-pass-name">閲覧名　／　任意</label><input id="reader-pass-name" name="name" type="text" maxlength="24" autocomplete="nickname" placeholder="空欄でも登録できます"></div><div class="reader-pass-field"><label for="reader-pass-role">閲覧者の立場</label><select id="reader-pass-role" name="role"><option value="reader">閲覧者</option><option value="student">學生</option><option value="teacher">教育者</option><option value="researcher">研究者</option></select></div><div class="reader-pass-field"><label for="reader-pass-interest">関心を寄せる学問</label><select id="reader-pass-interest" name="interest"><option value="classics">古典・漢学</option><option value="history">歴史・文学</option><option value="philosophy">西洋思想・哲学</option><option value="science">自然科学</option><option value="education">近代教育学</option><option value="arts">美術・美意識</option></select></div><button class="reader-pass-submit" type="submit">閲覧者証を刻む　／　REGISTER</button><p class="reader-pass-privacy">登録内容はこの端末のブラウザー内に保存され、外部へ送信されません。</p></form><div class="reader-pass-preview"><div class="reader-pass-seal">學</div><div><small>THE IMPERIAL READER　／　玲瓏百八年</small><strong id="reader-pass-preview-name">閲覧者</strong><p id="reader-pass-preview-detail">知を敬い、問いを愛し、文化を未来へ。</p><button class="reader-pass-remove" type="button" id="reader-pass-remove">閲覧者証を返納する</button></div></div><div class="reader-pass-status" id="reader-pass-status" role="status"></div></div>';
 document.body.appendChild(dialog);
 const form=$("#reader-pass-form",dialog),name=$("#reader-pass-name",dialog),role=$("#reader-pass-role",dialog),interest=$("#reader-pass-interest",dialog);
 function renderPreview(){
  const label=name.value.trim()||"閲覧者",selected=interests[interest.value];
  $("#reader-pass-preview-name",dialog).textContent=label;
  $("#reader-pass-preview-detail",dialog).textContent=(roleLabels[role.value]||"閲覧者")+"　／　"+selected.label+"を探究する";
 }
 name.value=profile?.name||"";role.value=profile?.role||"reader";interest.value=profile?.interest||"classics";
 [name,role,interest].forEach(el=>el.addEventListener("input",renderPreview));
 renderPreview();
 button.addEventListener("click",()=>{name.value=profile?.name||"";role.value=profile?.role||"reader";interest.value=profile?.interest||"classics";renderPreview();openDialog(dialog)});
 $(".reader-pass-close",dialog).addEventListener("click",()=>closeDialog(dialog));
 dialog.addEventListener("click",event=>{if(event.target===dialog)closeDialog(dialog)});
 dialog.addEventListener("close",()=>button.focus());
 form.addEventListener("submit",event=>{
  event.preventDefault();
  profile={name:name.value.trim().slice(0,24),role:role.value,interest:interest.value};
  if(!safeWrite(PROFILE_KEY,profile)){profile=null;$("#reader-pass-status",dialog).textContent="この端末に保存できませんでした。ブラウザーの保存設定をご確認ください。";return}
  $("#reader-pass-status",dialog).textContent="閲覧者証を登録しました。あなたの知の航路がひらかれます。";
  renderPreview();recommendation();
 });
 $("#reader-pass-remove",dialog).addEventListener("click",()=>{
  try{localStorage.removeItem(PROFILE_KEY);profile=null;name.value="";role.value="reader";interest.value="classics";renderPreview();recommendation();$("#reader-pass-status",dialog).textContent="閲覧者証を返納しました。"}
  catch(_){$("#reader-pass-status",dialog).textContent="返納できませんでした。"}
 });
 recommendation();
}
function setupVault(){
 if(page!=="astral-vault.html")return;
 const buttons=$$("[data-vault-fragment]"),progress=$("#vault-progress"),final=$("#vault-final");
 const KEY="hinomoto-astral-vault-fragments-v1";
 let found=safeRead(KEY,[]);if(!Array.isArray(found))found=[];
 const draw=()=>{
  buttons.forEach(button=>{
   const open=found.includes(button.dataset.vaultFragment);
   button.setAttribute("aria-expanded",String(open));
   button.classList.toggle("is-found",open);
  });
  if(progress)$$("i",progress).forEach((mark,index)=>mark.classList.toggle("is-found",index<found.length));
  if(final)final.classList.toggle("is-open",found.length===4);
 };
 buttons.forEach(button=>button.addEventListener("click",()=>{
  const id=button.dataset.vaultFragment;
  if(!found.includes(id)){found.push(id);safeWrite(KEY,found)}
  draw();
  if(found.length===4&&final)final.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});
 }));
 const reset=$("#vault-reset");
 if(reset)reset.addEventListener("click",()=>{found=[];try{localStorage.removeItem(KEY)}catch(_){}draw()});
 draw();
}
setupRegistry();
setupVault();
if($("#reader-route-recommendation"))recommendation();
})();