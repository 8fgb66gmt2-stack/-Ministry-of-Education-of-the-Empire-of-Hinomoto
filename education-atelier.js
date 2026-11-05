(function(){
"use strict";
const form=document.getElementById("imperial-inquiry-form");
if(!form||form.dataset.ready==="true")return;
form.dataset.ready="true";
const domains={
 classics:{title:"古典・漢学",opening:"古典に遺された言葉を、時代を越えて読み直すとき、",href:"index.html#codex",link:"九条院春臣 教育思想閲覧室をひらく"},
 history:{title:"歴史・文学",opening:"歴史と文学に刻まれた人々の営みから、",href:"archives.html#history",link:"帝國教育史・史料分類を読む"},
 western:{title:"西洋思想・哲学",opening:"異なる思想や哲学を比較し、",href:"index.html#two-libraries",link:"古き知と新しき知の対話を読む"},
 science:{title:"自然科学",opening:"自然を観察し、事実を確かめる営みから、",href:"institutions.html#university",link:"帝國大學の学びを訪ねる"},
 education:{title:"近代教育学",opening:"教育と自由の関係を見つめ直すとき、",href:"archives.html#education-theory",link:"『教育侖』をひらく"},
 arts:{title:"美術・美意識",opening:"美術と文学に宿る感性を手がかりに、",href:"archives.html#publications",link:"刊行物・著作の書架へ"}
};
const lenses={
 inherit:"何を受け継ぎ、何を新たに読み直すべきだろうか。",
 compare:"異なる時代や思想のあいだに、どのような共通点と相違点があるだろうか。",
 rethink:"当然とされてきた前提を、どのような根拠から問い直せるだろうか。",
 future:"この知を、これからの社会や一人ひとりの生にどう結びつけられるだろうか。"
};
const methods={
 read:"書物から一節を選び、成立した時代と今日の意味を照らし合わせる。",
 compare:"二つ以上の資料を並べ、共通点と異なる視点を記録する。",
 observe:"対象を観察し、確かめられた事実と自分の解釈を分けて記す。",
 dialogue:"異なる立場の言葉を読み、対話を始めるための問いを組み立てる。"
};
const $=id=>document.getElementById(id);
const title=$("atelier-result-title"),question=$("atelier-result-question"),method=$("atelier-result-method"),link=$("atelier-result-link"),save=$("atelier-save"),status=$("atelier-save-status");
let current=null;
form.addEventListener("submit",event=>{
 event.preventDefault();
 const domain=domains[$("atelier-domain").value],lens=lenses[$("atelier-lens").value],methodText=methods[$("atelier-method").value];
 if(!domain||!lens||!methodText)return;
 current={domain:domain.title,question:domain.opening+lens,method:methodText,href:domain.href,link:domain.link};
 title.textContent=domain.title+"から、問いをひらく。";
 question.textContent=current.question;
 method.textContent="探究の第一歩　／　"+methodText;
 link.href=domain.href;link.textContent=domain.link+"　→";
 save.disabled=false;status.textContent="問いがひとつ、かたちになりました。";
 $("atelier-result").classList.remove("is-forged");
 requestAnimationFrame(()=>$("atelier-result").classList.add("is-forged"));
});
save.addEventListener("click",()=>{
 if(!current)return;
 const entry="【問いの錬成室】\n領域："+current.domain+"\n問い："+current.question+"\n探究の第一歩："+current.method+"\n参照頁："+current.link;
 let previous="";
 try{previous=localStorage.getItem("hinomoto-imperial-scholar-notebook-v1")||"";const next=previous?(previous+"\n\n"+entry):entry;localStorage.setItem("hinomoto-imperial-scholar-notebook-v1",next);window.dispatchEvent(new CustomEvent("imperial:notebook:update",{detail:{value:next}}));status.textContent="問いを學問手帖に収めました。"}
 catch(_){status.textContent="保存できませんでした。ブラウザーの保存設定をご確認ください。"}
});
})();