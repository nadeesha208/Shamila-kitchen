/* ====== EDIT HERE ======
   WhatsApp number in international format, digits only, no + or leading 0.
   0761282023 as a Sri Lankan number = 94761282023. Change 94 if the number is in another country. */
const WHATSAPP = "94761282023";
const CURRENCY = "€";

const MENU = [
 {id:"rc",cat:"Rice & curry",name:"Rice & curry packet",si:"බත් පැකට් එක",price:7,img:"rice-curry",desc:"Basmati rice, chicken curry, brinjal moju, cashew curry, dhal, kachumbari salad and papadam."},
 {id:"db",cat:"Dinner boxes",name:"Dinner box: Chicken biryani",si:"රසම රස චිකන් බිරියානි",price:8,img:"dinner-biryani",desc:"Chicken biryani, bulsai egg, fried chicken, garlic chutney and green salad."},
 {id:"df",cat:"Dinner boxes",name:"Dinner box: Chicken fried rice",si:"ඩිනර් එක",price:7,img:"dinner-fried-rice",desc:"Chicken fried rice, devilled chicken drumstick, chilli paste and salad."},
 {id:"br",cat:"Roti & hoppers",name:"Bittara roti",si:"බිත්තර රොටි",price:2,img:"roti",desc:"Egg roti, sold each. Served with curry and dhal sauce."},
 {id:"pa",cat:"Roti & hoppers",name:"Plain appa",si:"",price:1,img:"plain-appa",desc:"Soft, lacy hopper with a crisp edge."},
 {id:"ea",cat:"Roti & hoppers",name:"Egg appa",si:"",price:1.5,img:"egg-appa",desc:"Appa with an egg cooked in the centre."},
 {id:"iw",cat:"Roti & hoppers",name:"Isso wade",si:"",price:1.5,img:"isso-wade",desc:"Crunchy prawn wade, served with chilli paste."}
];
const $=s=>document.querySelector(s);
const money=n=>CURRENCY+(Number.isInteger(n)?n:n.toFixed(2));
let cart={},tab="All";
try{cart=JSON.parse(localStorage.getItem("sk-cart")||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem("sk-cart",JSON.stringify(cart))}catch(e){}};

function renderTabs(){
 const cats=["All",...new Set(MENU.map(m=>m.cat))];
 $("#tabs").innerHTML=cats.map(c=>`<button role="tab" aria-selected="${c===tab}" data-c="${c}">${c}</button>`).join("");
}
function renderGrid(){
 $("#grid").innerHTML=MENU.filter(m=>tab==="All"||m.cat===tab).map(m=>`
 <article class="card"><img src="images/${m.img}.jpg" alt="${m.name}" loading="lazy">
 <div class="body"><h3>${m.name}</h3>${m.si?`<span class="si2">${m.si}</span>`:""}<p>${m.desc}</p>
 <div class="buy"><span class="price">${money(m.price)}</span><button class="add" data-id="${m.id}">Add to order</button></div></div></article>`).join("");
}
function lines(){return Object.entries(cart).filter(([,q])=>q>0).map(([id,q])=>({m:MENU.find(x=>x.id===id),q})).filter(l=>l.m)}
function total(){return lines().reduce((s,l)=>s+l.m.price*l.q,0)}
function renderCart(){
 const L=lines();
 $("#cartCount").textContent=L.reduce((s,l)=>s+l.q,0);
 $("#lines").innerHTML=L.length?L.map(({m,q})=>`<div class="line"><div>${m.name}<small>${money(m.price)} each</small></div>
 <div class="qty"><button data-d="-1" data-id="${m.id}" aria-label="Remove one ${m.name}">−</button><b>${q}</b><button data-d="1" data-id="${m.id}" aria-label="Add one ${m.name}">+</button></div>
 <b>${money(m.price*q)}</b></div>`).join(""):`<p class="empty">Your order is empty. Add something from the menu.</p>`;
 $("#total").textContent=money(total());
 $("#send").disabled=!L.length;$("#send").style.opacity=L.length?1:.5;
}
function change(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);save();renderCart()}
function openCart(o){document.body.classList.toggle("open",o);$("#drawer").setAttribute("aria-hidden",!o)}

document.addEventListener("click",e=>{
 const t=e.target;
 if(t.dataset.c){tab=t.dataset.c;renderTabs();renderGrid()}
 if(t.classList.contains("add")){change(t.dataset.id,1);t.textContent="Added ✓";setTimeout(()=>t.textContent="Add to order",900)}
 if(t.dataset.d)change(t.dataset.id,+t.dataset.d);
 if(t.closest("#openCart"))openCart(true);
 if(t.id==="closeCart"||t.id==="scrim")openCart(false);
});
document.addEventListener("keydown",e=>{if(e.key==="Escape")openCart(false)});
document.querySelectorAll('input[name=mode]').forEach(r=>r.addEventListener("change",()=>{$("#addrWrap").hidden=document.querySelector('input[name=mode]:checked').value!=="Delivery"}));

$("#send").addEventListener("click",()=>{
 const L=lines();if(!L.length)return;
 const mode=document.querySelector('input[name=mode]:checked').value,name=$("#name").value.trim(),addr=$("#addr").value.trim(),note=$("#note").value.trim();
 if(!name){$("#name").focus();$("#name").placeholder="Please enter your name";return}
 if(mode==="Delivery"&&!addr){$("#addr").focus();return}
 let msg=`Hello Shamila Kitchen, I would like to order:\n\n`+L.map(({m,q})=>`• ${q} x ${m.name} (${money(m.price*q)})`).join("\n")+
 `\n\nTotal: ${money(total())}\nName: ${name}\n${mode}`+(mode==="Delivery"?`\nAddress: ${addr}`:"")+(note?`\nNotes: ${note}`:"")+`\n\nThank you!`;
 window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
});
const hello=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Shamila Kitchen, I would like to place an order.")}`;
$("#quickWa").href=hello;$("#footWa").href=hello;
renderTabs();renderGrid();renderCart();
