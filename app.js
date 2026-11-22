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
/* fala — guia por voz no estilo da COMPSISTEM (Web Speech API do navegador, sem serviços externos) */
var fb=document.getElementById("fala-btn"),bar=document.getElementById("voz-bar"),vtxt=document.getElementById("voz-txt"),synth=window.speechSynthesis,on=false,voz=null,ultimaFala="",passo=-1,ult=null;
var PREF=[/francisca/i,/thalita/i,/luciana/i,/google portugu[eê]s do brasil/i,/maria/i,/vit[oó]ria/i,/fernanda/i,/raquel/i,/camila/i,/joana/i,/leila/i,/feminin|female|mulher/i];
var MASC=/daniel|ricardo|ant[oô]nio|felipe|f[aá]bio|j[uú]lio|humberto|donato|val[eé]rio|nicolau|macerio|\bmale\b/i;
function pegaVoz(){if(!synth)return null;var vs=synth.getVoices()||[];if(!vs.length)return null;
 var br=vs.filter(function(v){return /pt[-_]BR/i.test(v.lang)});var pt=br.length?br:vs.filter(function(v){return /^pt/i.test(v.lang)});if(!pt.length)return null;
 for(var i=0;i<PREF.length;i++){for(var k=0;k<pt.length;k++){if(PREF[i].test(pt[k].name)&&!MASC.test(pt[k].name)){voz=pt[k];try{document.documentElement.dataset.voz=voz.name}catch(e){}return voz}}}
 for(k=0;k<pt.length;k++){if(!MASC.test(pt[k].name)){voz=pt[k];break}}if(!voz)voz=pt[0];try{if(voz)document.documentElement.dataset.voz=voz.name}catch(e){}return voz}
if(synth){pegaVoz();if("onvoiceschanged" in synth)synth.onvoiceschanged=pegaVoz;else synth.addEventListener&&synth.addEventListener("voiceschanged",pegaVoz);setTimeout(pegaVoz,300);setTimeout(pegaVoz,1500)}else{fb.hidden=true}
function limpa(t){return String(t||"").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}←▶◀🔁]/gu,"").replace(/\[.*?\]/g,"a confirmar").replace(/\bR\. /g,"Rua ").replace(/ · /g,", ").replace(/\s+/g," ").trim()}
function partes(t){var out=[],cur="";t.split(/(?<=[.!?:;])\s+/).forEach(function(f){if((cur+" "+f).length>180&&cur){out.push(cur);cur=f}else cur=cur?cur+" "+f:f});if(cur)out.push(cur);return out}
var falaTm;
function falar(t,guardar){if(!on||!synth||!t)return;t=limpa(t);if(!t)return;if(guardar!==false)ultimaFala=t;if(!voz)pegaVoz();synth.cancel();clearTimeout(falaTm);
 falaTm=setTimeout(function(){if(!on||!synth)return;partes(t).forEach(function(p){var u=new SpeechSynthesisUtterance(p);u.lang=voz?voz.lang:"pt-BR";if(voz)u.voice=voz;u.rate=.97;u.pitch=1.1;u.volume=1;synth.speak(u)});if(synth.paused)synth.resume()},60)}
function marca(el){document.querySelectorAll(".guia-atual,.falando").forEach(function(x){x.classList.remove("guia-atual","falando")});if(el)el.classList.add("guia-atual")}
function centra(el){var hd=document.querySelector(".topo").getBoundingClientRect().bottom+(bar.hidden?0:bar.offsetHeight);var r=el.getBoundingClientRect(),livre=Math.max(innerHeight-hd,160);var y=scrollY+r.top-hd-Math.max(12,(livre-Math.min(r.height,livre-24))/2);scrollTo({top:Math.max(0,y),behavior:reduz?"auto":"smooth"})}
function txtDe(sel){var e=document.querySelector(sel);return e?Array.prototype.map.call(e.querySelectorAll("p,blockquote"),function(x){return x.innerText}).join(" "):""}
var PASSOS=[
 {s:"#inicio .hero-txt",r:"Abertura",t:function(){return "Abertura do Studio Vilela: olhar, beleza e expressão. Unhas, maquiagem, sobrancelha, cílios e tranças. Aqui fica o botão Agendar pelo WhatsApp."}},
 {s:"#servicos",r:"Serviços",t:function(){return "Serviços. Unhas e maquiagem são com a Rafaela. Sobrancelha, cílios e tranças são com a Jennyfer. Em cada card, toque em Agendar para abrir o WhatsApp da profissional certa, com a mensagem pronta. Os valores são sob consulta com a profissional."}},
 {s:"#infos",r:"Pagamento, duração e eventos",t:function(){return "Informações importantes. O pagamento é em dinheiro. A duração vai de 20 minutos a 3 horas e meia, ou mais, dependendo do procedimento. Atendemos casamentos e eventos com hora marcada; confirme antes com as profissionais."}},
 {s:"#sobre",r:"Sobre o studio",t:function(){return "Sobre o studio. "+txtDe("#sobre")}},
 {s:"#galeria",r:"Galeria",t:function(){return "Galeria com trabalhos reais do studio: cílios, sobrancelhas e unhas. Toque em uma foto para ampliar. No fim tem o link Veja mais no Instagram."}},
 {s:"#depoimentos",r:"Depoimentos",t:function(){return "Depoimentos de clientes. "+txtDe("#depoimentos")}},
 {s:"#agendar",r:"Como agendar",t:function(){return "Como agendar. Escolha o serviço, chame no WhatsApp e confirme dia e horário. Para unhas e maquiagem, toque em Rafaela. Para sobrancelha, cílios e tranças, toque em Jennyfer. A mensagem já vai pronta; é só tocar em enviar."}},
 {s:"#faq",r:"Dúvidas",t:function(){return "Perguntas frequentes. Toque em uma pergunta para abrir a resposta, e eu leio para você."}},
 {s:"#local",r:"Onde estamos",t:function(){return "Localização e horário. Estamos na "+ENDERECO+". Terça a sábado, somente com hora marcada. Domingo e segunda, fechado. Toque em Como chegar para abrir o mapa."}},
 {s:"#fada-btn",r:"Assistente Vily",t:function(){return "Esta sou eu, a Vily, no canto da tela. Toque em mim para abrir o meu menu de ajuda: agendar, serviços, valores, duração, eventos, horário e onde fica."}}];
var INTRO="Fala ligada. Oi! Eu sou a Vily e vou te guiar pelo site do Studio Vilela. Na barra, o botão 1 é Desativar a fala. Ao lado, Ouvir de novo. O botão 2 é Anterior, e o 3 é Próximo. Toque em Próximo para começar. Você também pode tocar em um texto, ou em mim, no canto da tela.";
function irPasso(n){n=Math.max(0,Math.min(PASSOS.length-1,n));passo=n;var p=PASSOS[n],el=document.querySelector(p.s);if(!el)return;
 var fim=n===PASSOS.length-1,txtp="Passo "+(n+1)+" de "+PASSOS.length+". "+p.t()+" "+(fim?"Este é o último passo. Toque em Anterior para voltar, ou em mim para abrir o menu.":"Toque em Próximo para continuar, ou em Anterior para voltar.");
 vtxt.textContent="Passo "+(n+1)+" de "+PASSOS.length+" — "+p.r+". "+(fim?"Último passo. Toque em Anterior para voltar, ou em mim para abrir o menu.":"Toque em Próximo para continuar.");marca(el);if(!el.hasAttribute("tabindex"))el.setAttribute("tabindex","-1");try{el.focus({preventScroll:true})}catch(e){}centra(el);setTimeout(function(){centra(el)},450);falar(txtp)}
function setFala(v,silencio){on=v;fb.setAttribute("aria-pressed",v);fb.classList.toggle("ligada",v);fb.innerHTML=(v?"🔊 <span>Fala ligada</span>":"🔈 <span>Ativar a fala</span>");fb.setAttribute("aria-label",v?"Fala ligada. Toque para desligar.":"Ativar a fala");
 bar.hidden=!v;try{localStorage.setItem("sv-fala",v?"1":"0")}catch(e){}if(!v){clearTimeout(falaTm);if(synth)synth.cancel();marca(null);passo=-1;vtxt.textContent="Toque em Próximo para começar."}}
try{setFala(localStorage.getItem("sv-fala")==="1",true)}catch(e){setFala(false,true)}
function ajustaBar(){var t=document.querySelector(".topo");if(t)document.documentElement.style.setProperty("--topo-h",t.offsetHeight+"px")}
ajustaBar();addEventListener("resize",ajustaBar);
fb.onclick=function(){if(on){setFala(false);return}setFala(true);ajustaBar();passo=-1;vtxt.textContent="Toque em Próximo para começar.";falar(INTRO)};
document.getElementById("voz-off").onclick=function(){setFala(false);fb.focus()};
document.getElementById("voz-rep").onclick=function(){if(!ultimaFala)ultimaFala=INTRO;falar(ultimaFala)};
document.getElementById("voz-prox").onclick=function(){irPasso(passo+1)};
document.getElementById("voz-ant").onclick=function(){irPasso(passo<=0?0:passo-1)};
/* toque, foco e (no computador) passar o mouse lê o texto */
var alvo="h1,h2,h3,p,li,summary,blockquote,a.btn,dt,dd",tmHover,semHover=matchMedia("(hover:none)").matches;
function ler(el){if(!on||!el||el.closest("#voz-bar,.fada"))return;marca(null);el.classList.add("falando");falar(el.getAttribute("aria-label")||el.innerText)}
document.addEventListener("focusin",function(e){if(!on||e.target.closest("#voz-bar,.fada")||e.target===ult)return;var el=e.target.closest(alvo);if(el&&e.target.matches(":focus-visible")){ult=el;ler(el)}});
document.addEventListener("mouseover",function(e){if(!on||semHover)return;var el=e.target.closest&&e.target.closest(alvo);if(!el||el.closest("#voz-bar,.fada")||el===ult)return;clearTimeout(tmHover);tmHover=setTimeout(function(){ult=el;ler(el)},800)});
document.addEventListener("mouseout",function(e){var el=e.target.closest&&e.target.closest(alvo);if(el&&!el.contains(e.relatedTarget))clearTimeout(tmHover)});
document.addEventListener("click",function(e){if(!on)return;var d=e.target.closest("summary");if(d){var det=d.parentNode;setTimeout(function(){ler(det.open?det.querySelector("p"):d)},30);return}
 var s=e.target.closest("[data-fala] p,[data-fala] h2,[data-fala] h3,[data-fala] blockquote,footer p");if(s&&!e.target.closest("a,button"))ler(s)});
/* Vily */
var btn=document.getElementById("fada-btn"),pn=document.getElementById("fada-painel"),txt=document.getElementById("fada-txt"),bx=document.getElementById("fada-botoes");
var M={agendar:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de agendar um horário, por favor.\nServiço:\nDia/horário de preferência:",unhas:"Olá, Rafaela! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar unhas, por favor.\nDia/horário de preferência:",make:"Olá, Rafaela! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar maquiagem, por favor.\nÉ para evento? Qual:\nDia/horário:",sobr:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar design de sobrancelha, por favor.\nDia/horário de preferência:",cilios:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar cílios (lash), por favor.\nDia/horário de preferência:",trancas:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar tranças, por favor.\nModelo/tamanho:\nDia/horário de preferência:",preco:"Olá, Studio Vilela! Tudo bem? Gostaria de saber os preços de:",horario:"Olá, Studio Vilela! Tudo bem? Gostaria de marcar um horário. Quais dias vocês têm disponíveis?",onde:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de agendar uma visita.",eventos:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de saber sobre atendimento para casamento/evento, por favor.\nData do evento:\nCidade/local:\nServiços desejados:\nQuantas pessoas:",falar:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de mais informações, por favor."};
var V={menu:["Como posso te ajudar? 🦋",[["📅 Agendar horário","agendar"],["💅 Serviços","servicos"],["💬 Valores e pagamento","preco"],["⏱️ Duração","duracao"],["💍 Eventos e casamentos","eventos"],["🕘 Horário","horario"],["📍 Onde fica","onde"],["📲 Falar com o studio","falar"]]],
servicos:["Qual serviço você quer?",[["💅 Unhas","unhas"],["💄 Maquiagem","make"],["✨ Sobrancelha","sobr"],["👁️ Cílios (lash)","cilios"],["💫 Tranças","trancas"],["← Voltar","menu"]]],
agendar:["Escolha com quem falar. Vou abrir o WhatsApp com a mensagem pronta, é só apertar enviar.","agendar"],unhas:["Unhas lindas com a Rafaela!","unhas"],make:["Make pra arrasar com a Rafaela!","make"],sobr:["Sobrancelha perfeita pro seu olhar! Quem cuida é a Jennyfer.","sobr"],cilios:["Cílios lindos com a Jennyfer!","cilios"],trancas:["Tranças com a Jennyfer!","trancas"],
preco:["Valores sob consulta com a profissional. O pagamento é em dinheiro. Com quem você quer falar?","preco"],duracao:["A duração varia de 20 minutos a 3h30, ou mais, dependendo do procedimento. Quer agendar?","agendar"],eventos:["Atendemos casamentos e eventos com hora marcada. Confirme antes com as profissionais. Com quem você quer falar?","eventos"],horario:[HORARIO+". Chame o studio no WhatsApp para combinar o seu horário.","horario"],onde:["Estamos na "+ENDERECO.replace("R. ","Rua ")+". Toque em Como chegar para abrir o mapa.","onde"],falar:["Com quem você quer falar?","falar"]};
var QUEM={unhas:"raf",make:"raf",sobr:"jen",cilios:"jen",trancas:"jen"};
function link(t,m,n){return '<a class="wa" href="'+wa(m,n)+'" target="_blank" rel="noopener">'+t+'</a>'}
function links(k,m){var q=QUEM[k];if(q==="raf")return link("WhatsApp da Rafaela",m,WA);if(q==="jen")return link("WhatsApp da Jennyfer",m,WA_JEN);
return link("Rafaela · unhas e maquiagem",m.replace("Olá, Studio Vilela!","Olá, Rafaela!"),WA)+link("Jennyfer · sobrancelha, cílios e tranças",m.replace("Olá, Studio Vilela!","Olá, Jennyfer!"),WA_JEN)}
var GUIA={servicos:"Toque em Unhas ou Maquiagem para falar com a Rafaela. Toque em Sobrancelha, Cílios ou Tranças para falar com a Jennyfer."};
function falaVily(k,v,prim){var t=(prim?"Oi! Eu sou a Vily. ":"")+v[0]+" ";
 if(Array.isArray(v[1])){t+=(GUIA[k]||"")+" Opções: "+v[1].filter(function(b){return b[1]!=="menu"}).map(function(b){return limpa(b[0])}).join(", ")+". "+(k==="menu"?"Toque em uma opção. Por exemplo, toque em Serviços para conhecer unhas, maquiagem, sobrancelha, cílios e tranças.":"Ou toque em Voltar.")}
 else{var q=QUEM[v[1]];t+=(k==="onde"?" Toque em Como chegar para abrir o mapa. ":"")+(q==="raf"?"Toque em WhatsApp da Rafaela.":q==="jen"?"Toque em WhatsApp da Jennyfer.":"Toque em Rafaela, para unhas e maquiagem, ou em Jennyfer, para sobrancelha, cílios e tranças.")+" O WhatsApp abre com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar."}
 falar(t)}
function show(k,prim){var v=V[k];txt.textContent=v[0];falaVily(k,v,prim);
if(Array.isArray(v[1]))bx.innerHTML=v[1].map(function(b){return '<button data-k="'+b[1]+'">'+b[0]+'</button>'}).join("");
else bx.innerHTML=(k==='onde'?'<a class="wa" href="'+MAPS+'" target="_blank" rel="noopener">📍 Como chegar</a>':'')+links(v[1],M[v[1]])+'<button data-k="menu">← Voltar</button>'}
bx.onclick=function(e){var b=e.target.closest("[data-k]");if(b){ult=b;show(b.dataset.k)}};
function abrir(o){pn.hidden=!o;btn.setAttribute("aria-expanded",o);if(o){show("menu",true);pn.querySelector("button").focus({preventScroll:true})}else{btn.focus({preventScroll:true});if(synth&&on)falar("Menu da Vily fechado.",false)}}
btn.onclick=function(){abrir(pn.hidden)};document.getElementById("fada-fechar").onclick=function(){abrir(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!pn.hidden)abrir(false)});
if(location.hash==="#fada")abrir(true);if(location.hash==="#fada-onde"){abrir(true);show("onde")}if(location.hash==="#fada-horario"){abrir(true);show("horario")}if(location.hash==="#fada-agendar"){abrir(true);show("agendar")}var hv=location.hash.match(/^#fada-v-(\w+)$/);if(hv&&V[hv[1]]){abrir(true);show(hv[1])}
})();
