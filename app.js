/* Studio Vilela — assistente Vily (regras, sem IA) + fala (Web Speech API do navegador, sem serviços externos).
   Troque WA pelo número real (só dígitos, 55 + DDD + número). */
(function(){
var WA="5511942694714", WA_JEN="5511995965175";               // Rafaela Vilela (11) 94269-4714: unhas e maquiagem · Jennyfer Vilela (11) 99596-5175: sobrancelha, cílios e tranças
var HORARIO="Terça a sábado: somente com hora marcada. Domingo e segunda: fechado", ENDERECO="R. Padre Marçal, 112 - Centro, São Roque - SP, CEP 18120-000", MAPS="https://www.google.com/maps/search/?api=1&query=R.%20Padre%20Mar%C3%A7al%2C%20112%20-%20Centro%2C%20S%C3%A3o%20Roque%20-%20SP%2C%2018120-000%2C%20Brasil";
var reduz=matchMedia("(prefers-reduced-motion: reduce)").matches;
function wa(m,n){n=n||WA;return n?"https://wa.me/"+n+"?text="+encodeURIComponent(m):"#agendar";}
document.querySelectorAll(".js-wa").forEach(function(a){a.href=wa(a.dataset.msg,a.dataset.quem==="jen"?WA_JEN:WA);if(WA){a.target="_blank";a.rel="noopener"}});
/* menu */
var mb=document.querySelector(".menu-btn"),ul=document.getElementById("menu");
mb.onclick=function(){var o=ul.classList.toggle("aberto");mb.setAttribute("aria-expanded",o)};
ul.onclick=function(e){if(e.target.tagName==="A"){ul.classList.remove("aberto");mb.setAttribute("aria-expanded",false)}};
/* entrada */
var revs=document.querySelectorAll(".rev");
if(reduz||/print/.test(location.search)||!("IntersectionObserver" in window))revs.forEach(function(r){r.classList.add("vis")});
else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vis");io.unobserve(e.target)}})},{threshold:.12});revs.forEach(function(r){io.observe(r)})}
/* vídeo */
var vid=document.querySelector(".hero-vid");if(reduz&&vid){vid.pause();vid.removeAttribute("autoplay")}
/* brilhos */
var cv=document.querySelector(".brilhos");
if(cv&&!reduz){var cx=cv.getContext("2d"),P=[],W,H;function rs(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight}rs();addEventListener("resize",rs);
for(var i=0;i<46;i++)P.push({x:Math.random(),y:Math.random(),r:Math.random()*1.8+.4,v:Math.random()*.0006+.0002,f:Math.random()*6.28});
(function loop(t){cx.clearRect(0,0,W,H);P.forEach(function(p){p.y-=p.v;if(p.y<0)p.y=1;var a=.35+.45*Math.sin(t/700+p.f);cx.beginPath();cx.fillStyle="rgba(246,227,161,"+a+")";cx.shadowColor="#f6e3a1";cx.shadowBlur=8;cx.arc(p.x*W,p.y*H,p.r,0,6.28);cx.fill()});requestAnimationFrame(loop)})(0)}
/* faíscas da borboleta */
var borb=document.querySelector(".borb");
if(borb&&!reduz){setInterval(function(){if(document.hidden)return;var f=document.createElement("span");f.className="faisca";var a=Math.random()*6.28,r=60+Math.random()*90;f.style.setProperty("--dx",(Math.cos(a)*r)+"px");f.style.setProperty("--dy",(Math.sin(a)*r)+"px");borb.appendChild(f);setTimeout(function(){f.remove()},1900)},260)}
/* lightbox */
var lb=document.getElementById("lightbox"),lbi=lb.querySelector("img");
document.querySelectorAll(".g,.g2").forEach(function(g){g.onclick=function(){var im=g.querySelector("img");lbi.src=g.dataset.src;lbi.alt=im.alt;lb.showModal();falar("Foto: "+im.alt)}});
lb.querySelector(".lb-x").onclick=function(){lb.close()};lb.onclick=function(e){if(e.target===lb)lb.close()};
/* fala */
var fb=document.getElementById("fala-btn"),synth=window.speechSynthesis,on=false,voz=null,tm;
function pegaVoz(){if(!synth)return;var vs=synth.getVoices();voz=vs.filter(function(v){return /pt[-_]BR/i.test(v.lang)})[0]||vs.filter(function(v){return /^pt/i.test(v.lang)})[0]||null}
if(synth){pegaVoz();synth.onvoiceschanged=pegaVoz}else{fb.hidden=true}
function falar(t){if(!on||!synth||!t)return;synth.cancel();var u=new SpeechSynthesisUtterance(t.replace(/\s+/g," ").trim());u.lang="pt-BR";if(voz)u.voice=voz;u.rate=1;synth.speak(u)}
function setFala(v){on=v;fb.setAttribute("aria-pressed",v);fb.querySelector("span").textContent=v?"Desativar a fala":"Ativar a fala";try{localStorage.setItem("sv-fala",v?"1":"0")}catch(e){}if(!v&&synth)synth.cancel()}
try{setFala(localStorage.getItem("sv-fala")==="1")}catch(e){setFala(false)}
fb.onclick=function(){setFala(!on);if(on)falar("Fala ativada. Passe o mouse ou o foco sobre os textos para ouvir.")};
var alvo="h1,h2,h3,p,li,summary,blockquote,a.btn,.fp-botoes button,.fp-botoes a",ult=null;
function ler(e){if(!on)return;var el=e.target.closest&&e.target.closest(alvo);if(!el||el===ult||el.closest(".fada-btn"))return;ult=el;clearTimeout(tm);tm=setTimeout(function(){document.querySelectorAll(".falando").forEach(function(x){x.classList.remove("falando")});el.classList.add("falando");falar(el.getAttribute("aria-label")||el.innerText)},e.type==="mouseover"?350:0)}
document.addEventListener("mouseover",ler);document.addEventListener("focusin",ler);
document.addEventListener("click",function(e){if(!on)return;var s=e.target.closest&&e.target.closest("[data-fala] p,[data-fala] h2,[data-fala] h3");if(s){ult=null;ler({target:s,type:"click"})}});
/* Vily */
var btn=document.getElementById("fada-btn"),pn=document.getElementById("fada-painel"),txt=document.getElementById("fada-txt"),bx=document.getElementById("fada-botoes");
var M={agendar:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de agendar um horário, por favor.\nServiço:\nDia/horário de preferência:",unhas:"Olá, Rafaela! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar unhas, por favor.\nDia/horário de preferência:",make:"Olá, Rafaela! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar maquiagem, por favor.\nÉ para evento? Qual:\nDia/horário:",sobr:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar design de sobrancelha, por favor.\nDia/horário de preferência:",cilios:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar cílios (lash), por favor.\nDia/horário de preferência:",trancas:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar tranças, por favor.\nModelo/tamanho:\nDia/horário de preferência:",preco:"Olá, Studio Vilela! Tudo bem? Gostaria de saber os preços de:",horario:"Olá, Studio Vilela! Tudo bem? Gostaria de marcar um horário. Quais dias vocês têm disponíveis?",onde:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de agendar uma visita.",eventos:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de saber sobre atendimento para casamento/evento, por favor.\nData do evento:\nCidade/local:\nServiços desejados:\nQuantas pessoas:",falar:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de mais informações, por favor."};
var V={menu:["Como posso te ajudar? 🦋",[["📅 Agendar horário","agendar"],["💅 Serviços","servicos"],["💬 Preços e pagamento","preco"],["⏱️ Duração","duracao"],["💍 Eventos e casamentos","eventos"],["🕘 Horário","horario"],["📍 Onde fica","onde"],["📲 Falar com o studio","falar"]]],
servicos:["Qual serviço você quer?",[["💅 Unhas","unhas"],["💄 Maquiagem","make"],["✨ Sobrancelha","sobr"],["👁️ Cílios (lash)","cilios"],["💫 Tranças","trancas"],["← Voltar","menu"]]],
agendar:["Escolha com quem falar. Vou abrir o WhatsApp com a mensagem pronta, é só apertar enviar.","agendar"],unhas:["Unhas lindas com a Rafaela!","unhas"],make:["Make pra arrasar com a Rafaela!","make"],sobr:["Sobrancelha perfeita pro seu olhar! Quem cuida é a Jennyfer.","sobr"],cilios:["Cílios lindos com a Jennyfer!","cilios"],trancas:["Tranças com a Jennyfer!","trancas"],
preco:["Os preços variam por serviço. O pagamento é em dinheiro (aceita dinheiro). Pergunte o valor direto para a profissional:","preco"],duracao:["A duração varia de 20 minutos a 3h30, ou mais, dependendo do procedimento. Quer agendar?","agendar"],eventos:["Atendemos casamentos e eventos com hora marcada. Confirme antes com as profissionais. Com quem você quer falar?","eventos"],horario:[HORARIO+". Chame o studio no WhatsApp para combinar o seu horário.","horario"],onde:["Estamos na "+ENDERECO.replace("R. ","Rua ")+". Toque em Como chegar para abrir o mapa.","onde"],falar:["Com quem você quer falar?","falar"]};
var QUEM={unhas:"raf",make:"raf",sobr:"jen",cilios:"jen",trancas:"jen"};
function link(t,m,n){return '<a class="wa" href="'+wa(m,n)+'" target="_blank" rel="noopener">'+t+'</a>'}
function links(k,m){var q=QUEM[k];if(q==="raf")return link("WhatsApp da Rafaela",m,WA);if(q==="jen")return link("WhatsApp da Jennyfer",m,WA_JEN);
return link("Rafaela · unhas e maquiagem",m.replace("Olá, Studio Vilela!","Olá, Rafaela!"),WA)+link("Jennyfer · sobrancelha, cílios e tranças",m.replace("Olá, Studio Vilela!","Olá, Jennyfer!"),WA_JEN)}
function show(k){var v=V[k];txt.textContent=v[0];falar("Vily diz: "+v[0].replace(/\[.*?\]/g,"a confirmar"));
if(Array.isArray(v[1]))bx.innerHTML=v[1].map(function(b){return '<button data-k="'+b[1]+'">'+b[0]+'</button>'}).join("");
else bx.innerHTML=(k==='onde'?'<a class="wa" href="'+MAPS+'" target="_blank" rel="noopener">📍 Como chegar</a>':'')+links(v[1],M[v[1]])+'<button data-k="menu">← Voltar</button>'}
bx.onclick=function(e){var b=e.target.closest("[data-k]");if(b){ult=b;show(b.dataset.k)}};
function abrir(o){pn.hidden=!o;btn.setAttribute("aria-expanded",o);if(o){show("menu");pn.querySelector("button").focus()}else{btn.focus();if(synth)synth.cancel()}}
btn.onclick=function(){abrir(pn.hidden)};document.getElementById("fada-fechar").onclick=function(){abrir(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!pn.hidden)abrir(false)});
if(location.hash==="#fada")abrir(true);if(location.hash==="#fada-onde"){abrir(true);show("onde")}if(location.hash==="#fada-horario"){abrir(true);show("horario")}if(location.hash==="#fada-agendar"){abrir(true);show("agendar")}var hv=location.hash.match(/^#fada-v-(\w+)$/);if(hv&&V[hv[1]]){abrir(true);show(hv[1])}
})();
