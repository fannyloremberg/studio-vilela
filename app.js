/* Studio Vilela — assistente Vily (regras, sem IA) + fala (Web Speech API do navegador, sem serviços externos).
   Troque WA pelo número real (só dígitos, 55 + DDD + número). */
(function(){
var WA="5511942694714", WA_JEN="5511995965175";               // Rafaela Vilela (11) 94269-4714: unhas e maquiagem · Jennyfer Vilela (11) 99596-5175: sobrancelha, cílios e tranças
var HORARIO="Terça a sábado: somente com hora marcada. Domingo e segunda: fechado", ENDERECO="R. Padre Marçal, 112 - Centro, São Roque - SP, CEP 18120-000", MAPS="https://www.google.com/maps/search/?api=1&query=R.%20Padre%20Mar%C3%A7al%2C%20112%20-%20Centro%2C%20S%C3%A3o%20Roque%20-%20SP%2C%2018120-000%2C%20Brasil";
var reduz=matchMedia("(prefers-reduced-motion: reduce)").matches;
function wa(m,n){n=n||WA;return n?"https://wa.me/"+n+"?text="+encodeURIComponent(m):"#agendar";}
document.querySelectorAll(".js-wa").forEach(function(a){a.href="#fada-agendar"});
/* menu */
var mb=document.querySelector(".menu-btn"),ul=document.getElementById("menu");
mb.onclick=function(){var o=ul.classList.toggle("aberto");mb.setAttribute("aria-expanded",o)};
ul.onclick=function(e){if(e.target.tagName==="A"){ul.classList.remove("aberto");mb.setAttribute("aria-expanded",false)}};
/* entrada */
var revs=document.querySelectorAll(".rev");
if(reduz||/print/.test(location.search)||!("IntersectionObserver" in window))revs.forEach(function(r){r.classList.add("vis")});
else{revs.forEach(function(r){r.classList.add("aguarda")});
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("vis");e.target.classList.remove("aguarda");io.unobserve(e.target)}})},{threshold:0,rootMargin:"0px 0px -6% 0px"});
 revs.forEach(function(r){io.observe(r)});
 setTimeout(function(){revs.forEach(function(r){r.classList.add("vis");r.classList.remove("aguarda")})},1600)}
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
/* fala — linhas fixas em MP3 (voz neural, como a COMPSISTEM) + Web Speech só como reserva para texto dinâmico */
var fb=document.getElementById("fala-btn"),bar=document.getElementById("voz-bar"),vtxt=document.getElementById("voz-txt"),aviso=document.getElementById("voz-aviso");
var synth=window.speechSynthesis,on=false,voz=null,ultimaFala="",ultimaChave=null,passo=-1,ult=null,player=null,somTm,falaTm,keepTm;
var isDeskChrome=/Chrome\//.test(navigator.userAgent)&&!/Edg\/|OPR\/|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
var PREF=[/francisca/i,/thalita/i,/luciana/i,/google portugu[eê]s do brasil/i,/maria/i,/vit[oó]ria/i,/fernanda/i,/raquel/i,/camila/i,/joana/i,/leila/i,/feminin|female|mulher/i];
var MASC=/daniel|ricardo|ant[oô]nio|felipe|f[aá]bio|j[uú]lio|humberto|donato|val[eé]rio|nicolau|macerio|\bmale\b/i;
function pegaVoz(){if(!synth)return null;var vs=synth.getVoices()||[];if(!vs.length)return null;
 var br=vs.filter(function(v){return /pt[-_]BR/i.test(v.lang)});var pt=br.length?br:vs.filter(function(v){return /^pt/i.test(v.lang)});if(!pt.length)return null;
 for(var i=0;i<PREF.length;i++){for(var k=0;k<pt.length;k++){if(PREF[i].test(pt[k].name)&&!MASC.test(pt[k].name)){voz=pt[k];return voz}}}
 for(k=0;k<pt.length;k++){if(!MASC.test(pt[k].name)){voz=pt[k];break}}if(!voz)voz=pt[0];return voz}
if(synth){pegaVoz();if("onvoiceschanged" in synth)synth.onvoiceschanged=pegaVoz;else synth.addEventListener&&synth.addEventListener("voiceschanged",pegaVoz);setTimeout(pegaVoz,300);setTimeout(pegaVoz,1500)}
var MP3={"intro-cel":"voz/intro-cel.mp3","intro-pc":"voz/intro-pc.mp3","passo-1-cel":"voz/passo-1-cel.mp3","passo-1-pc":"voz/passo-1-pc.mp3","passo-2":"voz/passo-2.mp3","passo-3-cel":"voz/passo-3-cel.mp3","passo-3-pc":"voz/passo-3-pc.mp3","passo-4":"voz/passo-4.mp3","passo-5-cel":"voz/passo-5-cel.mp3","passo-5-pc":"voz/passo-5-pc.mp3","passo-6-cel":"voz/passo-6-cel.mp3","passo-6-pc":"voz/passo-6-pc.mp3","passo-7":"voz/passo-7.mp3","passo-8-cel":"voz/passo-8-cel.mp3","passo-8-pc":"voz/passo-8-pc.mp3","passo-9":"voz/passo-9.mp3","passo-10-cel":"voz/passo-10-cel.mp3","passo-10-pc":"voz/passo-10-pc.mp3","passo-11":"voz/passo-11.mp3","vily-menu":"voz/vily-menu.mp3","vily-menu-volta":"voz/vily-menu-volta.mp3","vily-servicos":"voz/vily-servicos.mp3","vily-agendar":"voz/vily-agendar.mp3","vily-unhas":"voz/vily-unhas.mp3","vily-curso":"voz/vily-curso.mp3","vily-make":"voz/vily-make.mp3","vily-sobr":"voz/vily-sobr.mp3","vily-cilios":"voz/vily-cilios.mp3","vily-trancas":"voz/vily-trancas.mp3","vily-preco":"voz/vily-preco.mp3","vily-duracao":"voz/vily-duracao.mp3","vily-eventos":"voz/vily-eventos.mp3","vily-horario":"voz/vily-horario.mp3","vily-onde":"voz/vily-onde.mp3","vily-falar":"voz/vily-falar.mp3","vily-fechado":"voz/vily-fechado.mp3"};
var VOZ_TXT={"intro-cel":"Fala ligada. Oi! Eu sou a Vily e vou te guiar pelo site do Studio Vilela. Na faixa aqui em cima: à esquerda, Desativar a fala; à direita, Ouvir de novo. Abaixo, Anterior. E abaixo dele, Próximo. Toque em Próximo pra eu te mostrar onde fica cada coisa da página.","intro-pc":"Fala ligada. Oi! Eu sou a Vily e vou te guiar pelo site do Studio Vilela. Na faixa aqui em cima, da esquerda pra direita, ficam: Desativar a fala, Ouvir de novo, Anterior e Próximo. Toque em Próximo pra eu te mostrar onde fica cada coisa da página.","passo-1-cel":"Passo 1 de 11. Lá em cima, à direita, tem o botão Menu. Toque nele pra ver as opções: Serviços, Sobre, Galeria, Dúvidas e Onde estamos. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-1-pc":"Passo 1 de 11. Lá em cima, no menu, você encontra Serviços, Sobre, Galeria, Dúvidas e Onde estamos. Do lado direito, o botão dourado Agendar leva direto à parte de marcar horário. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-2":"Passo 2 de 11. Esta é a abertura do Studio Vilela: olhar, beleza e expressão. Unhas, maquiagem, sobrancelha, cílios e tranças. Aqui embaixo, o botão dourado Agendar pelo WhatsApp leva você até o agendamento. Ao lado, Ver Instagram abre o perfil do studio. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-3-cel":"Passo 3 de 11. Aqui embaixo estão os cartões de serviço. Role pra baixo pra ver todos. Unhas e maquiagem são com a Rafaela. Nas unhas, ela faz manicure, pedicure, esmaltação em gel e curso de manicure. Sobrancelha, cílios e tranças são com a Jennyfer. Toque em Agendar com a Rafaela ou com a Jennyfer pra abrir o WhatsApp, com a mensagem pronta. Os valores são sob consulta com a profissional. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-3-pc":"Passo 3 de 11. Aqui embaixo estão os cartões de serviço. Unhas e maquiagem são com a Rafaela. Nas unhas, ela faz manicure, pedicure, esmaltação em gel e curso de manicure. Sobrancelha, cílios e tranças são com a Jennyfer. Toque em Agendar com a Rafaela ou com a Jennyfer pra abrir o WhatsApp, com a mensagem pronta. Os valores são sob consulta com a profissional. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-4":"Passo 4 de 11. Logo abaixo dos serviços, estão as informações importantes. O pagamento é em dinheiro, Pix ou cartão. A duração vai de 20 minutos a 3 horas e meia, ou mais, dependendo do procedimento. Atendemos casamentos e eventos com hora marcada; confirme antes com as profissionais. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-5-cel":"Passo 5 de 11. Aqui é o Sobre o studio. Em cima está a foto do logo, e abaixo, a nossa história. O Studio Vilela é um negócio de família, nascido de um sonho de infância das primas Rafaela Vilela e Jennyfer Vilela. Cada cliente é recebida com carinho, amor e atenção aos detalhes. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-5-pc":"Passo 5 de 11. Aqui é o Sobre o studio, à direita da foto do logo. O Studio Vilela é um negócio de família, nascido de um sonho de infância das primas Rafaela Vilela e Jennyfer Vilela. Cada cliente é recebida com carinho, amor e atenção aos detalhes. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-6-cel":"Passo 6 de 11. Esta é a galeria, com trabalhos reais do studio: cílios, sobrancelhas e unhas. As fotos ficam em duas colunas. Role pra baixo pra ver mais, e toque numa foto para ampliar. No fim tem o link Veja mais no Instagram. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-6-pc":"Passo 6 de 11. Esta é a galeria, com trabalhos reais do studio: cílios, sobrancelhas e unhas. Toque numa foto para ampliar. Mais abaixo tem o link Veja mais no Instagram. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-7":"Passo 7 de 11. Aqui estão os depoimentos de quem já veio. Ivania Ferreira Cezar conta que foi recebida com tanto carinho que se sentiu em casa. Stefani Cezar Vilela fala do atendimento caprichado e do amor em cada trabalho. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-8-cel":"Passo 8 de 11. Chegamos no agendamento. Primeiro escolha o serviço, depois chame no WhatsApp e confirme dia e horário. Aqui embaixo, os botões dourados são a Rafaela, para unhas e maquiagem, e a Jennyfer, para sobrancelha, cílios e tranças. Abaixo deles, o botão do Instagram. Toque em Rafaela ou em Jennyfer pra abrir o WhatsApp com a mensagem pronta; é só enviar. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-8-pc":"Passo 8 de 11. Chegamos no agendamento, no meio da página. Primeiro escolha o serviço, depois chame no WhatsApp e confirme dia e horário. Aqui embaixo, o botão dourado da esquerda é a Rafaela, para unhas e maquiagem. O do meio é a Jennyfer, para sobrancelha, cílios e tranças. O da direita abre o Instagram. Toque em Rafaela ou em Jennyfer pra abrir o WhatsApp com a mensagem pronta; é só enviar. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-9":"Passo 9 de 11. Aqui estão as perguntas frequentes. Toque numa pergunta para abrir a resposta, e eu leio pra você. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-10-cel":"Passo 10 de 11. Aqui é a localização e o horário. Estamos na Rua Padre Marçal, 112, Centro, São Roque, São Paulo. Terça a sábado, somente com hora marcada. Domingo e segunda, fechado. Em cima está o endereço. Toque em Como chegar, o botão dourado, para abrir o mapa. Logo abaixo fica o mapa. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-10-pc":"Passo 10 de 11. Aqui é a localização e o horário. Estamos na Rua Padre Marçal, 112, Centro, São Roque, São Paulo. Terça a sábado, somente com hora marcada. Domingo e segunda, fechado. À esquerda está o endereço e o botão dourado Como chegar. À direita, o mapa. Toque em Como chegar para abrir o mapa. Toque em Próximo pra continuar, ou em Anterior pra voltar.","passo-11":"Passo 11 de 11. No cantinho de baixo, à direita, estou eu, a Vily. Toque em mim para ver as opções: agendar, serviços, valores, duração, eventos, horário e onde fica. Este é o último passo. Toque em Anterior pra voltar, ou em mim pra abrir o menu.","vily-menu":"Oi! Eu sou a Vily. Aqui no meu painel, logo abaixo, estão as opções: Agendar horário, Serviços, Valores e pagamento, Duração, Eventos e casamentos, Horário, Onde fica, e Falar com o studio. Toque numa opção. Por exemplo, toque em Serviços pra conhecer unhas, maquiagem, sobrancelha, cílios e tranças.","vily-menu-volta":"Como posso te ajudar? Aqui embaixo estão as opções: Agendar horário, Serviços, Valores e pagamento, Duração, Eventos e casamentos, Horário, Onde fica, e Falar com o studio. Toque numa opção, ou em Voltar se você já estava em outra tela.","vily-servicos":"Qual serviço você quer? Aqui embaixo: Unhas, Curso de manicure e Maquiagem são com a Rafaela. Sobrancelha, Cílios e Tranças são com a Jennyfer. Toque numa opção, ou em Voltar.","vily-agendar":"Escolha com quem falar. Aqui embaixo, o primeiro botão é a Rafaela, para unhas e maquiagem. O segundo é a Jennyfer, para sobrancelha, cílios e tranças. Vou abrir o WhatsApp com a mensagem pronta; é só apertar enviar. Ou toque em Voltar.","vily-unhas":"Nas unhas, a Rafaela faz manicure, pedicure, esmaltação em gel e curso de manicure. O horário e o valor ficam por confirmação dela. Aqui embaixo, toque em Pedir agendamento. Ou toque em Voltar.","vily-curso":"Curso de manicure com a Rafaela. O horário e o valor ficam por confirmação dela. Aqui embaixo, toque em Pedir agendamento. Ou toque em Voltar.","vily-make":"Make pra arrasar com a Rafaela! Aqui embaixo, o botão dourado abre o WhatsApp dela, com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-sobr":"Sobrancelha perfeita pro seu olhar! Quem cuida é a Jennyfer. Aqui embaixo, o botão dourado abre o WhatsApp dela, com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-cilios":"Cílios lindos com a Jennyfer! Aqui embaixo, o botão dourado abre o WhatsApp dela, com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-trancas":"Tranças com a Jennyfer! Aqui embaixo, o botão dourado abre o WhatsApp dela, com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-preco":"Valores sob consulta com a profissional. O pagamento é em dinheiro, Pix ou cartão. Aqui embaixo, escolha com quem falar: Rafaela, para unhas e maquiagem, ou Jennyfer, para sobrancelha, cílios e tranças. O WhatsApp abre com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-duracao":"A duração varia de 20 minutos a 3 horas e meia, ou mais, dependendo do procedimento. Quer agendar? Aqui embaixo, toque em Rafaela, para unhas e maquiagem, ou em Jennyfer, para sobrancelha, cílios e tranças. O WhatsApp abre com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-eventos":"Atendemos casamentos e eventos com hora marcada. Confirme antes com as profissionais. Aqui embaixo, toque em Rafaela, para unhas e maquiagem, ou em Jennyfer, para sobrancelha, cílios e tranças. O WhatsApp abre com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-horario":"Terça a sábado: somente com hora marcada. Domingo e segunda: fechado. Chame o studio no WhatsApp para combinar o seu horário. Aqui embaixo, toque em Rafaela, para unhas e maquiagem, ou em Jennyfer, para sobrancelha, cílios e tranças. O WhatsApp abre com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-onde":"Estamos na Rua Padre Marçal, 112, Centro, São Roque, São Paulo, CEP 18120-000. Aqui embaixo, o primeiro botão, Como chegar, abre o mapa. Depois, você pode chamar a Rafaela ou a Jennyfer no WhatsApp, com a mensagem pronta. Ou toque em Voltar.","vily-falar":"Com quem você quer falar? Aqui embaixo, toque em Rafaela, para unhas e maquiagem, ou em Jennyfer, para sobrancelha, cílios e tranças. O WhatsApp abre com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar.","vily-fechado":"Menu da Vily fechado. Se quiser, toque de novo em mim, no cantinho de baixo à direita."};
try{var preIntro=new Audio(MP3[matchMedia("(max-width:700px)").matches?"intro-cel":"intro-pc"]);preIntro.preload="auto"}catch(e){}
function isCel(){return matchMedia("(max-width:900px)").matches}
function isBarCel(){return matchMedia("(max-width:700px)").matches}
function chaveIntro(){return isBarCel()?"intro-cel":"intro-pc"}
function chavePasso(p){return p.split?p.mp3+(isCel()?"-cel":"-pc"):p.mp3}
function alvoPasso(p){var s=p.s;if(s.indexOf("cel:")===0){var parts=s.slice(4).split("|");s=isCel()?parts[0]:(parts[1]||parts[0])}return document.querySelector(s)}
var setaEl=document.getElementById("guia-seta");
function escondeSeta(){if(setaEl)setaEl.hidden=true}
function posSeta(el){if(!setaEl||!el){escondeSeta();return}var r=el.getBoundingClientRect(),topo=document.querySelector(".topo"),hd=(topo?topo.getBoundingClientRect().bottom:0)+(bar.hidden?0:(bar.offsetHeight||0));
 var visTop=Math.max(r.top,hd+8),visBot=Math.min(r.bottom,innerHeight-40);if(visBot-visTop<12){visTop=Math.min(Math.max(r.top,hd+8),innerHeight-48);visBot=visTop+24}
 var x=Math.max(20,Math.min(innerWidth-20,r.left+r.width/2)),acima=visTop-hd>52;
 setaEl.classList.toggle("abaixo",!acima);setaEl.style.left=Math.round(x)+"px";setaEl.style.top=Math.round(acima?visTop:visBot)+"px";setaEl.hidden=false}
function atualizaSeta(){var el=document.querySelector(".guia-atual");if(el&&on)posSeta(el);else escondeSeta()}
addEventListener("scroll",atualizaSeta,{passive:true});addEventListener("resize",atualizaSeta);
function menuAberto(o){if(!ul||!mb)return;ul.classList.toggle("aberto",!!o);mb.setAttribute("aria-expanded",!!o)}
function limpa(t){return String(t||"").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}←▶◀🔁]/gu,"").replace(/\[.*?\]/g,"a confirmar").replace(/\bR\. /g,"Rua ").replace(/ · /g,", ").replace(/\s+/g," ").trim()}
function partes(t){var out=[],cur="";t.split(/(?<=[.!?:;])\s+/).forEach(function(f){if((cur+" "+f).length>180&&cur){out.push(cur);cur=f}else cur=cur?cur+" "+f:f});if(cur)out.push(cur);return out}
function escondeAviso(){if(aviso)aviso.hidden=true}
function mostraAviso(){if(aviso)aviso.hidden=false}
function armaAviso(){clearTimeout(somTm);escondeAviso();somTm=setTimeout(function(){mostraAviso()},1500)}
function somComecou(){clearTimeout(somTm);escondeAviso()}
function paraFala(){clearTimeout(somTm);clearTimeout(falaTm);clearInterval(keepTm);escondeAviso();
 if(player){try{player.onended=null;player.onerror=null;player.pause()}catch(e){}player=null}
 if(synth)synth.cancel()}
function tocaMp3(src){
 if(player){try{player.onended=null;player.onerror=null;player.pause()}catch(e){}player=null}
 if(synth)synth.cancel();clearTimeout(falaTm);clearInterval(keepTm);
 var a=new Audio(src);a.preload="auto";player=a;
 a.addEventListener("playing",somComecou);a.addEventListener("play",somComecou);
 a.onerror=function(){if(player===a)mostraAviso()};
 armaAviso();
 var p=a.play();if(p&&p.catch)p.catch(function(){mostraAviso()})}
function falarTTS(t){if(!synth||!t)return;if(!voz)pegaVoz();
 function start(){if(!on||!synth)return;partes(t).forEach(function(p){var u=new SpeechSynthesisUtterance(p);u.lang="pt-BR";if(voz)u.voice=voz;u.rate=.97;u.pitch=1.1;u.volume=1;u.onstart=somComecou;synth.speak(u)});if(synth.paused)synth.resume();
  if(isDeskChrome){clearInterval(keepTm);keepTm=setInterval(function(){if(!on||!synth||!synth.speaking){clearInterval(keepTm);return}try{synth.resume()}catch(e){}},8000)}}
 armaAviso();
 if(isDeskChrome){synth.cancel();clearTimeout(falaTm);falaTm=setTimeout(start,60)}
 else{if(synth.speaking||synth.pending)synth.cancel();start()}}
function falar(t,guardar,chave){if(!on||!t)return;t=limpa(t);if(!t)return;if(guardar!==false){ultimaFala=t;ultimaChave=chave||null}if(chave&&MP3[chave]){tocaMp3(MP3[chave]);return}falarTTS(t)}
function marca(el){document.querySelectorAll(".guia-atual,.falando").forEach(function(x){x.classList.remove("guia-atual","falando")});if(el){el.classList.add("guia-atual");posSeta(el)}else escondeSeta()}
function centra(el){var hd=document.querySelector(".topo").getBoundingClientRect().bottom+(bar.hidden?0:bar.offsetHeight);var r=el.getBoundingClientRect(),livre=Math.max(innerHeight-hd,160);var y=scrollY+r.top-hd-Math.max(12,(livre-Math.min(r.height,livre-24))/2);scrollTo({top:Math.max(0,y),behavior:reduz?"auto":"smooth"})}
function txtDe(sel){var e=document.querySelector(sel);return e?Array.prototype.map.call(e.querySelectorAll("p,blockquote"),function(x){return x.innerText}).join(" "):""}
var PASSOS=[
 {s:"#menu",r:"Menu",mp3:"passo-1",split:true,menu:true},
 {s:"#inicio .botoes",r:"Abertura",mp3:"passo-2"},
 {s:"#servicos .cards",r:"Servi\u00e7os",mp3:"passo-3",split:true},
 {s:"#infos",r:"Informa\u00e7\u00f5es",mp3:"passo-4"},
 {s:"#sobre .duo",r:"Sobre o studio",mp3:"passo-5",split:true},
 {s:"#galeria .galeria2",r:"Galeria",mp3:"passo-6",split:true},
 {s:"#depoimentos .depo2",r:"Depoimentos",mp3:"passo-7"},
 {s:"#agendar .botoes",r:"Como agendar",mp3:"passo-8",split:true},
 {s:"#faq .faq",r:"D\u00favidas",mp3:"passo-9"},
 {s:"#local .btn.ouro",r:"Onde estamos",mp3:"passo-10",split:true},
 {s:"#fada-btn",r:"Assistente Vily",mp3:"passo-11"}
];
function irPasso(n){n=Math.max(0,Math.min(PASSOS.length-1,n));passo=n;var p=PASSOS[n];
 if(p.menu&&isCel())menuAberto(true);else menuAberto(false);
 var el=alvoPasso(p);if(!el)return;
 var chave=chavePasso(p),txtp=VOZ_TXT[chave]||"",fim=n===PASSOS.length-1;
 vtxt.textContent="Passo "+(n+1)+" de "+PASSOS.length+" — "+p.r+". "+(fim?"Último passo. Toque em Anterior para voltar, ou em mim para abrir o menu.":"Toque em Próximo para continuar.");
 marca(el);if(!el.hasAttribute("tabindex"))el.setAttribute("tabindex","-1");try{el.focus({preventScroll:true})}catch(e){}centra(el);setTimeout(function(){centra(el);posSeta(el)},450);falar(txtp,true,chave)}
function setFala(v){on=v;fb.setAttribute("aria-pressed",v);fb.classList.toggle("ligada",v);fb.innerHTML=(v?"🔊 <span>Fala ligada</span>":"🔈 <span>Ativar a fala</span>");fb.setAttribute("aria-label",v?"Fala ligada. Toque para desligar.":"Ativar a fala");
 bar.hidden=!v;try{localStorage.setItem("sv-fala",v?"1":"0")}catch(e){}if(!v){paraFala();marca(null);menuAberto(false);passo=-1;vtxt.textContent="Toque em Próximo para começar."}}
try{setFala(localStorage.getItem("sv-fala")==="1")}catch(e){setFala(false)}
function ajustaBar(){var t=document.querySelector(".topo");if(t)document.documentElement.style.setProperty("--topo-h",t.offsetHeight+"px")}
ajustaBar();addEventListener("resize",ajustaBar);
fb.onclick=function(){if(on){setFala(false);return}setFala(true);ajustaBar();passo=-1;vtxt.textContent="Toque em Próximo para começar.";var k=chaveIntro();ultimaFala=VOZ_TXT[k]||"";ultimaChave=k;tocaMp3(MP3[k])};
document.getElementById("voz-off").onclick=function(){setFala(false);fb.focus()};
document.getElementById("voz-rep").onclick=function(){if(!ultimaChave){ultimaChave=chaveIntro();ultimaFala=VOZ_TXT[ultimaChave]}falar(ultimaFala||VOZ_TXT[ultimaChave]||"",false,ultimaChave)};
document.getElementById("voz-prox").onclick=function(){irPasso(passo+1)};
document.getElementById("voz-ant").onclick=function(){irPasso(passo<=0?0:passo-1)};
/* toque, foco e (no computador) passar o mouse lê o texto (Web Speech, texto dinâmico) */
var alvo="h1,h2,h3,p,li,summary,blockquote,a.btn,dt,dd",tmHover,semHover=matchMedia("(hover:none)").matches;
function ler(el){if(!on||!el||el.closest("#voz-bar,.fada"))return;marca(null);el.classList.add("falando");falar(el.getAttribute("aria-label")||el.innerText)}
document.addEventListener("focusin",function(e){if(!on||e.target.closest("#voz-bar,.fada")||e.target===ult)return;var el=e.target.closest(alvo);if(el&&e.target.matches(":focus-visible")){ult=el;ler(el)}});
document.addEventListener("mouseover",function(e){if(!on||semHover)return;var el=e.target.closest&&e.target.closest(alvo);if(!el||el.closest("#voz-bar,.fada")||el===ult)return;clearTimeout(tmHover);tmHover=setTimeout(function(){ult=el;ler(el)},800)});
document.addEventListener("mouseout",function(e){var el=e.target.closest&&e.target.closest(alvo);if(el&&!el.contains(e.relatedTarget))clearTimeout(tmHover)});
document.addEventListener("click",function(e){if(!on)return;var d=e.target.closest("summary");if(d){var det=d.parentNode;setTimeout(function(){ler(det.open?det.querySelector("p"):d)},30);return}
 var s=e.target.closest("[data-fala] p,[data-fala] h2,[data-fala] h3,[data-fala] blockquote,footer p");if(s&&!e.target.closest("a,button"))ler(s)});
/* Vily */
var btn=document.getElementById("fada-btn"),pn=document.getElementById("fada-painel"),txt=document.getElementById("fada-txt"),bx=document.getElementById("fada-botoes");
var M={agendar:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de agendar um horário, por favor.\nServiço:\nDia/horário de preferência:",unhas:"Olá, Rafaela! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar unhas, por favor.\nDia/horário de preferência:",curso:"Olá, Rafaela! Tudo bem? Vim pelo site do Studio Vilela e gostaria de saber sobre o curso de manicure, por favor.",make:"Olá, Rafaela! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar maquiagem, por favor.\nÉ para evento? Qual:\nDia/horário:",sobr:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar design de sobrancelha, por favor.\nDia/horário de preferência:",cilios:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar cílios (lash), por favor.\nDia/horário de preferência:",trancas:"Olá, Jennyfer! Tudo bem? Vim pelo site do Studio Vilela e gostaria de agendar tranças, por favor.\nModelo/tamanho:\nDia/horário de preferência:",preco:"Olá, Studio Vilela! Tudo bem? Gostaria de saber os preços de:",horario:"Olá, Studio Vilela! Tudo bem? Gostaria de marcar um horário. Quais dias vocês têm disponíveis?",onde:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de agendar uma visita.",eventos:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de saber sobre atendimento para casamento/evento, por favor.\nData do evento:\nCidade/local:\nServiços desejados:\nQuantas pessoas:",falar:"Olá, Studio Vilela! Tudo bem? Vim pelo site e gostaria de mais informações, por favor."};
var V={menu:["Como posso te ajudar? 🦋",[["📅 Agendar horário","agendar"],["💅 Serviços","servicos"],["💬 Valores e pagamento","preco"],["⏱️ Duração","duracao"],["💍 Eventos e casamentos","eventos"],["🕘 Horário","horario"],["📍 Onde fica","onde"],["📲 Falar com o studio","falar"]]],
servicos:["Qual serviço você quer?",[["💅 Unhas","unhas"],["💅 Curso de manicure","curso"],["💄 Maquiagem","make"],["✨ Sobrancelha","sobr"],["👁️ Cílios (lash)","cilios"],["💫 Tranças","trancas"],["← Voltar","menu"]]],
agendar:["Vamos montar o seu pedido de agendamento.","pedido"],unhas:["Nas unhas, a Rafaela faz manicure, pedicure, esmaltação em gel e curso de manicure. O horário e o valor ficam por confirmação dela. Quer fazer um pedido de agendamento?",[["📅 Pedir agendamento","pedido-unhas"],["← Voltar","servicos"]]],curso:["Curso de manicure com a Rafaela. O horário e o valor ficam por confirmação dela. Quer fazer um pedido?",[["📅 Pedir agendamento","pedido-curso"],["← Voltar","servicos"]]],make:["Maquiagem com a Rafaela. O horário e o valor ficam por confirmação dela. Quer fazer um pedido de agendamento?",[["📅 Pedir agendamento","pedido-make"],["← Voltar","servicos"]]],sobr:["Sobrancelha com a Jennyfer. O horário e o valor ficam por confirmação dela. Quer fazer um pedido de agendamento?",[["📅 Pedir agendamento","pedido-sobr"],["← Voltar","servicos"]]],cilios:["Cílios com a Jennyfer. O horário e o valor ficam por confirmação dela. Quer fazer um pedido de agendamento?",[["📅 Pedir agendamento","pedido-cilios"],["← Voltar","servicos"]]],trancas:["Tranças com a Jennyfer. O horário e o valor ficam por confirmação dela. Quer fazer um pedido de agendamento?",[["📅 Pedir agendamento","pedido-trancas"],["← Voltar","servicos"]]],
preco:["Valores sob consulta com a profissional. O pagamento é em dinheiro, Pix ou cartão. Com quem você quer falar?","preco"],duracao:["A duração varia de 20 minutos a 3h30, ou mais, dependendo do procedimento. Quer fazer um pedido de agendamento?",[["📅 Pedir agendamento","agendar"],["← Voltar","menu"]]],eventos:["Atendemos casamentos e eventos com hora marcada. O horário e o valor ficam por confirmação da profissional. Quer fazer um pedido?",[["💍 Pedir para casamento/evento","pedido-evento"],["← Voltar","menu"]]],horario:[HORARIO+". Chame o studio no WhatsApp para combinar o seu horário.","horario"],onde:["Estamos na "+ENDERECO.replace("R. ","Rua ")+". Toque em Como chegar para abrir o mapa.","onde"],falar:["Com quem você quer falar?","falar"]};
var QUEM={unhas:"raf",curso:"raf",make:"raf",sobr:"jen",cilios:"jen",trancas:"jen"};
function link(t,m,n){return '<a class="wa" href="'+wa(m,n)+'" target="_blank" rel="noopener">'+t+'</a>'}
function links(k,m){var q=QUEM[k];if(q==="raf")return link("WhatsApp da Rafaela",m,WA);if(q==="jen")return link("WhatsApp da Jennyfer",m,WA_JEN);
return link("Rafaela · unhas e maquiagem",m.replace("Olá, Studio Vilela!","Olá, Rafaela!"),WA)+link("Jennyfer · sobrancelha, cílios e tranças",m.replace("Olá, Studio Vilela!","Olá, Jennyfer!"),WA_JEN)}
var GUIA={servicos:"Toque em Unhas, Curso de manicure ou Maquiagem para falar com a Rafaela. Toque em Sobrancelha, Cílios ou Tranças para falar com a Jennyfer."};

/* Pedido de agendamento, passo a passo, na conversa da Vily. É um pedido: a profissional confirma horário e valor. */
var SERVICOS_PED=[
 {id:"unhas",nome:"Unhas",quem:"raf"},
 {id:"curso",nome:"Curso de manicure",quem:"raf"},
 {id:"make",nome:"Maquiagem",quem:"raf"},
 {id:"sobr",nome:"Sobrancelha",quem:"jen"},
 {id:"cilios",nome:"Cílios",quem:"jen"},
 {id:"trancas",nome:"Tranças",quem:"jen"},
 {id:"evento",nome:"Casamento/Evento",quem:null}
];
var ped=null,pedPasso="servico";
function servicoPorId(id){for(var i=0;i<SERVICOS_PED.length;i++)if(SERVICOS_PED[i].id===id)return SERVICOS_PED[i];return null}
function hojeZero(){var d=new Date();d.setHours(0,0,0,0);return d}
function isoLocal(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function parseISO(v){var p=String(v||"").split("-");if(p.length!==3)return null;var d=new Date(+p[0],+p[1]-1,+p[2]);return isNaN(d)?null:d}
function proxAberto(d){d=new Date(d.getTime());while(d.getDay()===0||d.getDay()===1)d.setDate(d.getDate()+1);return d}
function minData(){return isoLocal(proxAberto(hojeZero()))}
function maxData(){var d=hojeZero();d.setMonth(d.getMonth()+8);return isoLocal(d)}
function fmtData(v){var d=parseISO(v);if(!d)return v;return d.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
function fmtHora(v){if(!v)return "";var p=v.split(":");return p[0]+"h"+(p[1]&&p[1]!=="00"?p[1]:"")}
function quandoPed(){var p=ped.periodo||"",h=fmtHora(ped.hora);if(p&&h)return p+" · "+h;return p||h||""}
function errData(v){var d=parseISO(v);if(!d)return "Escolha um dia, por favor.";if(d<hojeZero())return "Escolha um dia a partir de hoje, de terça a sábado.";if(d.getDay()===0||d.getDay()===1)return "O studio fecha domingo e segunda. Escolha um dia de terça a sábado, por favor.";return ""}
function profNome(){return ped.quem==="jen"?"Jennyfer":"Rafaela"}
function msgPedido(){
 var linhas=["Oi, "+profNome()+"! 🦋","","Meu nome é "+ped.nome+". Vim pelo site do Studio Vilela e queria agendar um horário com você.","","Serviço: "+ped.servico.nome,"Dia de preferência: "+fmtData(ped.data),"Período/horário de preferência: "+quandoPed()];
 if(ped.obs)linhas.push("Observação: "+ped.obs);
 linhas.push("","Quando você puder, me confirma se esse dia e horário ficam bons, e também o valor, tá bem? Obrigada! 💛");
 return linhas.join("\n");
}
function agendaUrl(){return (typeof AGENDA_WEB_APP_URL==="string"&&AGENDA_WEB_APP_URL.trim())?AGENDA_WEB_APP_URL.trim():""}
function enviarPedidoPendente(){
 var url=agendaUrl();if(!url||!ped||!ped.servico)return;
 var corpo={acao:"pedido",nome:ped.nome,cliente:ped.nome,servico:ped.servico.nome,profissional:profNome(),data:ped.data,periodo:ped.periodo||"",horario:ped.hora||"",obs:ped.obs||""};
 try{fetch(url,{method:"POST",mode:"cors",redirect:"follow",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(corpo)}).catch(function(){})}catch(e){}
}
function listaServicosPed(){return SERVICOS_PED.filter(function(s){if(ped.filtroQuem==="raf")return s.quem==="raf"||!s.quem;if(ped.filtroQuem==="jen")return s.quem==="jen"||!s.quem;return true})}
function iniciarPedido(pre){
 ped={servico:null,nome:"",data:"",periodo:"",hora:"",obs:"",quem:null,filtroQuem:null};
 pre=pre||{};
 if(pre.servico){var s=typeof pre.servico==="string"?servicoPorId(pre.servico):pre.servico;if(s){ped.servico=s;if(s.quem)ped.quem=s.quem}}
 if(pre.quem&&!ped.servico)ped.filtroQuem=pre.quem;
 if(pre.quem&&ped.servico&&!ped.servico.quem)ped.quem=pre.quem;
 pn.hidden=false;btn.setAttribute("aria-expanded","true");pn.classList.add("pedido-aberto");
 if(!ped.servico)pedPasso="servico";
 else if(!ped.quem)pedPasso="quem";
 else pedPasso="nome";
 renderPedido();
}
function voltarPedido(){
 if(pedPasso==="servico"){pn.classList.remove("pedido-aberto");show("menu");return}
 var ordem=["servico","quem","nome","data","periodo","obs","resumo"],i=ordem.indexOf(pedPasso);
 if(pedPasso==="nome"&&ped.servico&&ped.servico.quem)pedPasso="servico";
 else if(i>0)pedPasso=ordem[i-1];
 if(pedPasso==="quem"&&ped.servico&&ped.servico.quem)pedPasso="servico";
 renderPedido();
}
function txtPassoPedido(){
 if(pedPasso==="servico")return ped.filtroQuem==="raf"?"Qual serviço da Rafaela você quer pedir? Também pode ser casamento ou evento.":ped.filtroQuem==="jen"?"Qual serviço da Jennyfer você quer pedir? Também pode ser casamento ou evento.":"Qual serviço você quer pedir?";
 if(pedPasso==="quem")return "Para casamento ou evento, com quem você prefere falar: Rafaela ou Jennyfer?";
 if(pedPasso==="nome")return "Qual é o seu nome?";
 if(pedPasso==="data")return "Qual dia você prefere? Atendemos de terça a sábado; domingo e segunda o studio está fechado.";
 if(pedPasso==="periodo")return "Prefere manhã, tarde ou noite? Se quiser, pode indicar também um horário.";
 if(pedPasso==="obs")return "Quer deixar algum recado? É opcional.";
 return "Prontinho! 🦋 Seu pedido de horário vai chegar com carinho pra "+profNome()+". Assim que ela ver, ela te responde pra confirmar o horário e o valor, tá bom? 💛";
}
function nPasso(){var s=["servico","quem","nome","data","periodo","obs","resumo"];if(ped.servico&&ped.servico.quem)s=s.filter(function(x){return x!=="quem"});return {i:s.indexOf(pedPasso)+1,n:s.length}}
function renderPedido(){
 var np=nPasso(),fala=txtPassoPedido();
 txt.innerHTML="";
 var passo=document.createElement("p");passo.className="fp-passo";passo.textContent="Pedido "+np.i+" de "+np.n;txt.appendChild(passo);
 var p=document.createElement("span");p.textContent=fala;txt.appendChild(p);
 bx.innerHTML="";
 if(pedPasso==="servico"){
  listaServicosPed().forEach(function(s){var b=document.createElement("button");b.type="button";b.textContent=s.nome;if(ped.servico&&ped.servico.id===s.id)b.className="fp-sel";b.addEventListener("click",function(){ped.servico=s;ped.quem=s.quem||null;pedPasso=s.quem?"nome":"quem";renderPedido()});bx.appendChild(b)});
  var back=document.createElement("button");back.type="button";back.textContent="← Voltar";back.addEventListener("click",voltarPedido);bx.appendChild(back);
 }else if(pedPasso==="quem"){
  [["raf","Rafaela · unhas e maquiagem"],["jen","Jennyfer · sobrancelha, cílios e tranças"]].forEach(function(q){var b=document.createElement("button");b.type="button";b.textContent=q[1];if(ped.quem===q[0])b.className="fp-sel";b.addEventListener("click",function(){ped.quem=q[0];pedPasso="nome";renderPedido()});bx.appendChild(b)});
  var back=document.createElement("button");back.type="button";back.textContent="← Voltar";back.addEventListener("click",voltarPedido);bx.appendChild(back);
 }else if(pedPasso==="nome"){
  bx.appendChild(formPedido('<label for="ped-nome">Seu nome</label><input id="ped-nome" name="nome" type="text" autocomplete="name" enterkeyhint="next" required minlength="2" maxlength="80" placeholder="Como podemos te chamar?">',function(fd,err){var n=String(fd.get("nome")||"").replace(/\s+/g," ").trim();if(n.length<2){err("Escreva o seu nome, por favor.");return}ped.nome=n;pedPasso="data";renderPedido()}));
 }else if(pedPasso==="data"){
  bx.appendChild(formPedido('<label for="ped-data">Dia de preferência</label><input id="ped-data" name="data" type="date" required min="'+minData()+'" max="'+maxData()+'"><p class="fp-aviso">Terça a sábado. Domingo e segunda o studio está fechado.</p><p class="fp-erro" hidden></p>',function(fd,err){var v=fd.get("data"),e=errData(v);if(e){err(e);return}ped.data=v;pedPasso="periodo";renderPedido()},function(form){var inp=form.querySelector("#ped-data");inp.value=ped.data||minData();inp.addEventListener("change",function(){var e=errData(inp.value),box=form.querySelector(".fp-erro");if(e){box.hidden=false;box.textContent=e;inp.value=ped.data||minData()}else{box.hidden=true}})}));
 }else if(pedPasso==="periodo"){
  var wrap=document.createElement("div");wrap.className="fp-form";
  var labs=document.createElement("p");labs.className="fp-aviso";labs.textContent="Escolha um período, um horário, ou os dois.";wrap.appendChild(labs);
  var per=document.createElement("div");per.className="fp-periodos";
  ["Manhã","Tarde","Noite"].forEach(function(n){var b=document.createElement("button");b.type="button";b.textContent=n;b.setAttribute("aria-pressed",ped.periodo===n?"true":"false");b.addEventListener("click",function(){ped.periodo=ped.periodo===n?"":n;per.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x.textContent===ped.periodo?"true":"false")})});per.appendChild(b)});
  wrap.appendChild(per);
  var lab=document.createElement("label");lab.htmlFor="ped-hora";lab.textContent="Horário (opcional)";wrap.appendChild(lab);
  var hora=document.createElement("input");hora.id="ped-hora";hora.type="time";hora.value=ped.hora||"";wrap.appendChild(hora);
  var er=document.createElement("p");er.className="fp-erro";er.hidden=true;wrap.appendChild(er);
  wrap.appendChild(acoesPedido(function(){ped.hora=hora.value||"";if(!ped.periodo&&!ped.hora){er.hidden=false;er.textContent="Escolha manhã, tarde, noite, ou um horário, por favor.";return}pedPasso="obs";renderPedido()}));
  bx.appendChild(wrap);
 }else if(pedPasso==="obs"){
  bx.appendChild(formPedido('<label for="ped-obs">Recado (opcional)</label><textarea id="ped-obs" name="obs" maxlength="400" placeholder="Algum detalhe que a profissional deva saber?"></textarea>',function(fd){ped.obs=String(fd.get("obs")||"").replace(/\s+/g," ").trim();pedPasso="resumo";renderPedido()},function(form){if(ped.obs)form.querySelector("#ped-obs").value=ped.obs}, "Pular e ver resumo"));
 }else if(pedPasso==="resumo"){
  var box=document.createElement("div");box.className="fp-resumo";
  box.innerHTML="<dl><dt>Serviço</dt><dd></dd><dt>Nome</dt><dd></dd><dt>Dia</dt><dd></dd><dt>Período/horário</dt><dd></dd>"+(ped.obs?"<dt>Recado</dt><dd></dd>":"")+"<dt>Profissional</dt><dd></dd></dl><p class=\"fp-nota\">Assim que ela ver, ela te responde pra confirmar o horário e o valor, tá bom? 💛</p>";
  var dds=box.querySelectorAll("dd"),vals=[ped.servico.nome,ped.nome,fmtData(ped.data),quandoPed()].concat(ped.obs?[ped.obs]:[]).concat([profNome()+" Vilela"]);
  dds.forEach(function(dd,i){dd.textContent=vals[i]});
  bx.appendChild(box);
  var fixo=document.createElement("div");fixo.className="fp-envio-fixo";
  var env=document.createElement("a");env.className="wa wa-envio";env.target="_blank";env.rel="noopener";env.href=wa(msgPedido(),ped.quem==="jen"?WA_JEN:WA);env.textContent="Enviar pedido no WhatsApp";
  env.addEventListener("click",function(){enviarPedidoPendente()});
  var back=document.createElement("button");back.type="button";back.textContent="← Voltar";back.addEventListener("click",voltarPedido);
  fixo.appendChild(env);fixo.appendChild(back);bx.appendChild(fixo);
 }
 if(on)falar(fala,true);
 var foco=bx.querySelector("input,textarea,button,a");if(foco)try{foco.focus({preventScroll:true})}catch(e){}
}
function acoesPedido(ok,okLabel){
 var nav=document.createElement("div");nav.className="fp-acoes";
 var back=document.createElement("button");back.type="button";back.textContent="← Voltar";back.addEventListener("click",voltarPedido);
 var go=document.createElement("button");go.type=ok?"button":"submit";go.className="fp-ok";go.textContent=okLabel||"Continuar";
 nav.appendChild(back);nav.appendChild(go);
 if(typeof ok==="function")go.addEventListener("click",function(e){e.preventDefault();ok()});
 return nav;
}
function formPedido(html,onOk,onReady,okLabel){
 var form=document.createElement("form");form.className="fp-form";form.noValidate=true;form.innerHTML=html;
 var nav=acoesPedido(null,okLabel);form.appendChild(nav);
 form.addEventListener("submit",function(e){e.preventDefault();onOk(new FormData(form),function(msg){var box=form.querySelector(".fp-erro");if(!box){box=document.createElement("p");box.className="fp-erro";form.insertBefore(box,nav)}box.hidden=false;box.textContent=msg})});
 if(onReady)onReady(form);
 return form;
}

function falaVily(k,v,prim){var t=(prim?"Oi! Eu sou a Vily. ":"")+v[0]+" ";
 if(Array.isArray(v[1])){t+=(GUIA[k]||"")+" Opções: "+v[1].filter(function(b){return b[1]!=="menu"}).map(function(b){return limpa(b[0])}).join(", ")+". "+(k==="menu"?"Toque em uma opção. Por exemplo, toque em Serviços para conhecer unhas, maquiagem, sobrancelha, cílios e tranças.":"Ou toque em Voltar.")}
 else{var q=QUEM[v[1]];t+=(k==="onde"?" Toque em Como chegar para abrir o mapa. ":"")+(q==="raf"?"Toque em WhatsApp da Rafaela.":q==="jen"?"Toque em WhatsApp da Jennyfer.":"Toque em Rafaela, para unhas e maquiagem, ou em Jennyfer, para sobrancelha, cílios e tranças.")+" O WhatsApp abre com a mensagem pronta; é só tocar em enviar. Ou toque em Voltar."}
 falar(t,true,k==="menu"?(prim?"vily-menu":"vily-menu-volta"):"vily-"+k)}
function show(k,prim){if(k==="agendar"||k==="pedido"){iniciarPedido();return}if(k.indexOf("pedido-")===0){iniciarPedido({servico:k.slice(7)});return}pn.classList.remove("pedido-aberto");var v=V[k];if(!v){iniciarPedido();return}txt.textContent=v[0];falaVily(k,v,prim);
if(Array.isArray(v[1]))bx.innerHTML=v[1].map(function(b){return '<button data-k="'+b[1]+'">'+b[0]+'</button>'}).join("");
else bx.innerHTML=(k==='onde'?'<a class="wa" href="'+MAPS+'" target="_blank" rel="noopener">📍 Como chegar</a>':'')+links(v[1],M[v[1]])+'<button data-k="menu">← Voltar</button>'}
bx.onclick=function(e){var b=e.target.closest("[data-k]");if(b){ult=b;show(b.dataset.k)}};
function abrir(o){pn.hidden=!o;btn.setAttribute("aria-expanded",o);if(o){show("menu",true);var f=pn.querySelector("button,input,a");if(f)f.focus({preventScroll:true})}else{pn.classList.remove("pedido-aberto");btn.focus({preventScroll:true});if(on)falar("Menu da Vily fechado.",false,"vily-fechado")}}
btn.onclick=function(){abrir(pn.hidden)};document.getElementById("fada-fechar").onclick=function(){abrir(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!pn.hidden)abrir(false)});
if(location.hash==="#fada")abrir(true);if(location.hash==="#fada-onde"){abrir(true);show("onde")}if(location.hash==="#fada-horario"){abrir(true);show("horario")}if(location.hash==="#fada-agendar")iniciarPedido();var hv=location.hash.match(/^#fada-v-(\w+)$/);if(hv&&V[hv[1]]){abrir(true);show(hv[1])}
document.querySelectorAll(".js-wa").forEach(function(a){a.addEventListener("click",function(e){e.preventDefault();iniciarPedido({servico:a.dataset.servico||"",quem:a.dataset.quem==="jen"?"jen":a.dataset.quem==="raf"?"raf":null})})});

/* borboletas suaves nas seções claras (não no hero, nem no agendar escuro, nem no rodapé).
   Sempre inicializa — inclusive com prefers-reduced-motion (ficam quase paradas, sem bater asa). */
var voos=document.getElementById("voos");
if(voos){voos.hidden=false;if(reduz)voos.classList.add("lento","pausado");
 var fino=matchMedia("(max-width:700px)").matches,nVoo=fino?5:7,claros=["#servicos","#sobre","#galeria","#depoimentos","#faq","#local"].map(function(s){return document.querySelector(s)}).filter(Boolean),bandas=[],vooLista=[],vooHide=false,vooTick=0;
 var servFaixa=null;function atualizaBandas(){var h=innerHeight,band=[];claros.forEach(function(el){var r=el.getBoundingClientRect(),t=Math.max(0,r.top),b=Math.min(h,r.bottom);if(b-t>8)band.push([t,b])});band.sort(function(a,b){return a[0]-b[0]});bandas=[];band.forEach(function(b){if(!bandas.length||b[0]>bandas[bandas.length-1][1]+4)bandas.push(b.slice());else bandas[bandas.length-1][1]=Math.max(bandas[bandas.length-1][1],b[1])});servFaixa=null;var sv=document.getElementById("servicos");if(sv){var r=sv.getBoundingClientRect(),t=Math.max(0,r.top),b=Math.min(h,r.bottom);if(b-t>8)servFaixa=[t,b]}}
 function visivelEm(y){if(!bandas.length)return 0;for(var i=0;i<bandas.length;i++){var t=bandas[i][0],u=bandas[i][1];if(y>=t&&y<=u){var d=Math.min(y-t,u-y);return d<24?d/24:1}}return 0}
 for(var i=0;i<nVoo;i++){var el=document.createElement("span");el.className="voo"+(i%3===2?" prata":"");el.innerHTML='<span class="voo-asa e"></span><span class="voo-asa d"></span>';
  var tam=fino?42+Math.random()*36:30+Math.random()*46,op=fino?.42+Math.random()*.16:.28+Math.random()*.16,dir=Math.random()<.5?1:-1,vx=(reduz?.04+Math.random()*.05:.22+Math.random()*.32)*dir;
  el.style.setProperty("--s",Math.round(tam)+"px");el.style.setProperty("--o",op.toFixed(2));
  vooLista.push({el:el,x:12+Math.random()*Math.max(24,innerWidth-tam-24),y:50+Math.random()*Math.max(80,innerHeight-140),s:tam,op:op,dir:dir,vx:vx,amp:reduz?6:16+Math.random()*34,freq:.00025+Math.random()*.00045,ph:Math.random()*6.28,rot:dir*(6+Math.random()*12)});
  voos.appendChild(el)}
 function passoVoo(t){if(!vooHide){atualizaBandas();vooLista.forEach(function(b){b.x+=b.vx;if(b.dir>0&&b.x>innerWidth+b.s)b.x=-b.s-12;if(b.dir<0&&b.x<-b.s-12)b.x=innerWidth+12;var y=b.y+Math.sin(t*b.freq+b.ph)*b.amp;var cy=y+b.s*0.45,vis=visivelEm(cy);if(servFaixa&&cy>=servFaixa[0]&&cy<=servFaixa[1])vis*=.35;b.el.style.opacity=(b.op*vis).toFixed(2);b.el.style.webkitTransform=b.el.style.transform="translate("+b.x.toFixed(1)+"px,"+y.toFixed(1)+"px) rotate("+b.rot.toFixed(1)+"deg)"})}requestAnimationFrame(passoVoo)}
 document.addEventListener("visibilitychange",function(){vooHide=document.hidden;if(vooHide)voos.classList.add("pausado");else if(!reduz)voos.classList.remove("pausado")});
 function onVooRelayout(){if(vooTick)return;vooTick=1;requestAnimationFrame(function(){atualizaBandas();vooTick=0})}
 addEventListener("scroll",onVooRelayout,{passive:true});addEventListener("resize",onVooRelayout);addEventListener("orientationchange",onVooRelayout);addEventListener("pageshow",onVooRelayout);
 if(window.visualViewport){visualViewport.addEventListener("resize",onVooRelayout);visualViewport.addEventListener("scroll",onVooRelayout)}
 atualizaBandas();setTimeout(atualizaBandas,300);setTimeout(atualizaBandas,1200);requestAnimationFrame(passoVoo)}

})();
