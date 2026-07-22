const cards=document.getElementById("cards");
const btn=document.getElementById("createBtn");
const input=document.getElementById("faWord");
const category=document.getElementById("category");
const loading=document.getElementById("loading");
const searchInput=document.getElementById("searchInput");
const myWords=document.getElementById("myWords");
const myWordsBtn=document.getElementById("myWordsBtn");
const backBtn=document.getElementById("backBtn");
const filterCategory=document.getElementById("filterCategory");
const quizBtn=document.getElementById("quizBtn");
const quizModal=document.getElementById("quizModal");
const quizContent=document.getElementById("quizContent");
const startQuiz=document.getElementById("startQuiz");
let data=JSON.parse(localStorage.getItem("flashcards")||"[]");
let learned=JSON.parse(localStorage.getItem("learnedWords")||"[]");

render();
renderLearned();

btn.onclick=async()=>{

const fa=input.value.trim();

if(!fa)return;

loading.style.display="block";

try{

const res=await fetch(
"https://translate.googleapis.com/translate_a/single?client=gtx&sl=fa&tl=en&dt=t&q="+encodeURIComponent(fa)
);

const json=await res.json();

const en=json[0][0][0];

const card={
id:Date.now(),
fa,
en,
category:category.value
};

data.unshift(card);

localStorage.setItem("flashcards",JSON.stringify(data));

render();

input.value="";

}catch{

alert("خطا در ترجمه");

}

loading.style.display="none";

};

function render(){

cards.innerHTML="";

const keyword=searchInput.value.trim().toLowerCase();

data
.filter(item=>
item.fa.toLowerCase().includes(keyword) ||
item.en.toLowerCase().includes(keyword)
)
.forEach(item=>{

const temp=document.getElementById("cardTemplate").content.cloneNode(true);

const card=temp.querySelector(".card");
const en=temp.querySelector(".en");
const fa=temp.querySelector(".fa");
const cat=temp.querySelector(".category");
const ok=temp.querySelector(".ok");
const del=temp.querySelector(".delete");
const speak=temp.querySelector(".speak");

en.textContent=item.en;
fa.textContent=item.fa;
cat.textContent=item.category;

card.onclick=e=>{

if(
e.target.classList.contains("ok")||
e.target.classList.contains("delete")||
e.target.classList.contains("speak")
)return;

card.classList.toggle("flip");

};

speak.onclick=e=>{

e.stopPropagation();

speechSynthesis.cancel();

const u=new SpeechSynthesisUtterance(item.en);

u.lang="en-US";
u.rate=.9;

speechSynthesis.speak(u);

};

ok.onclick=e=>{

e.stopPropagation();

learned.unshift(item);

data=data.filter(x=>x.id!==item.id);

localStorage.setItem("flashcards",JSON.stringify(data));
localStorage.setItem("learnedWords",JSON.stringify(learned));

render();
renderLearned();

};

del.onclick=e=>{

e.stopPropagation();

if(!confirm("فلش کارت حذف شود؟")) return;

data=data.filter(x=>x.id!==item.id);

localStorage.setItem("flashcards",JSON.stringify(data));

render();

};

cards.appendChild(temp);

});

}

function renderLearned(){

myWords.innerHTML="";

let list=learned;

if(filterCategory.value!=="همه"){

list=learned.filter(x=>x.category===filterCategory.value);

}

list.forEach(item=>{

const temp=document.getElementById("cardTemplate").content.cloneNode(true);

const card=temp.querySelector(".card");
const en=temp.querySelector(".en");
const fa=temp.querySelector(".fa");
const cat=temp.querySelector(".category");
const ok=temp.querySelector(".ok");
const del=temp.querySelector(".delete");
const speak=temp.querySelector(".speak");

en.textContent=item.en;
fa.textContent=item.fa;
cat.textContent=item.category;

ok.remove();

card.onclick=e=>{

if(
e.target.classList.contains("delete")||
e.target.classList.contains("speak")
)return;

card.classList.toggle("flip");

};

speak.onclick=e=>{

e.stopPropagation();

speechSynthesis.cancel();

const u=new SpeechSynthesisUtterance(item.en);

u.lang="en-US";
u.rate=.9;

speechSynthesis.speak(u);

};

del.onclick=e=>{

e.stopPropagation();

if(!confirm("کلمه حذف شود؟")) return;

learned=learned.filter(x=>x.id!==item.id);

localStorage.setItem("learnedWords",JSON.stringify(learned));

renderLearned();

};

myWords.appendChild(temp);

});

}

filterCategory.onchange=()=>{

renderLearned();

};

myWordsBtn.onclick=()=>{

document.querySelector(".creator").style.display="none";
cards.style.display="none";
loading.style.display="none";

myWords.style.display="grid";
filterCategory.style.display="block";

myWordsBtn.style.display="none";
backBtn.style.display="block";

renderLearned();

};

backBtn.onclick=()=>{

document.querySelector(".creator").style.display="flex";
cards.style.display="grid";

myWords.style.display="none";

filterCategory.style.display="none";
filterCategory.value="همه";

myWordsBtn.style.display="block";
backBtn.style.display="none";

};
searchInput.addEventListener("input",()=>{
render();
});
quizBtn.onclick=()=>{

if(data.length<10){

alert("برای شروع آزمون باید حداقل ۱۰ فلش کارت داشته باشید.");

return;

}

quizModal.style.display="flex";

};

quizModal.onclick=e=>{

if(e.target===quizModal){

quizModal.style.display="none";

}

};

startQuiz.onclick=()=>{

quizContent.innerHTML=`

<h2>📝 آزمون</h2>

<p>آزمون با موفقیت شروع شد.</p>

<p>این قسمت در مرحله بعد به سوال واقعی تبدیل می‌شود.</p>

<button id="closeQuiz">
پایان آزمون
</button>

`;

document.getElementById("closeQuiz").onclick=()=>{

quizModal.style.display="none";

};

};


const matrix=document.getElementById("matrix");

const words=[
"Apple","Book","House","Hospital","Doctor",
"Nurse","Water","Family","Chair","School",
"Table","Phone","Computer","Friend","Teacher",
"Window","Kitchen","Food","Coffee","Car"
];

setInterval(()=>{

const item=document.createElement("div");

item.className="matrixWord";

item.textContent=
words[Math.floor(Math.random()*words.length)];

item.style.left=Math.random()*100+"vw";

item.style.animationDuration=
(4+Math.random()*5)+"s";

item.style.fontSize=
(14+Math.random()*16)+"px";

matrix.appendChild(item);

setTimeout(()=>{

item.remove();

},9000);

},250);

const particles=document.getElementById("particles");

for(let i=0;i<40;i++){

const p=document.createElement("div");

p.className="particle";

p.style.left=Math.random()*100+"vw";

p.style.animationDuration=
(8+Math.random()*10)+"s";

p.style.animationDelay=
Math.random()*10+"s";

particles.appendChild(p);

}
