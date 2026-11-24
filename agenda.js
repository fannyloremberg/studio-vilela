/* Agenda interna do Studio Vilela. */
(function () {
  "use strict";

  var URL = (typeof AGENDA_WEB_APP_URL === "string") ? AGENDA_WEB_APP_URL.trim() : "";
  var DEMO = !URL;
  var LS_KEY = "sv-agenda-demo";
  var SS_NOME = "sv-agenda-nome";
  var SS_TOKEN = "sv-agenda-token";
  var SERVICOS = ["Unhas", "Unhas: Pé", "Unhas: Mão", "Unhas: Pé e mão", "Unhas: Esmaltação em gel", "Unhas: Banho de gel", "Unhas: Blindagem", "Unhas: Pedicure em gel", "Unhas: Spa dos pés", "Curso de manicure", "Maquiagem", "Sobrancelha", "Cílios", "Casamento/Evento"];

  var sessao = { nome: "", token: "" };
  var vista = "semana";
  var ancora = hojeZero();
  var itens = [];
  var pendenteConf = null;

  var telaEntrar = document.getElementById("tela-entrar");
  var telaAgenda = document.getElementById("tela-agenda");
  var aviso = document.getElementById("agenda-aviso");
  var formEntrar = document.getElementById("form-entrar");
  var entrarErro = document.getElementById("entrar-erro");
  var lista = document.getElementById("lista-agenda");
  var dlgForm = document.getElementById("dlg-form");
  var formAg = document.getElementById("form-agendamento");
  var formErro = document.getElementById("form-erro");
  var dlgConf = document.getElementById("dlg-confirmar");
  var formConf = document.getElementById("form-confirmar");
  var confErro = document.getElementById("conf-erro");

  function hojeZero() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  function isoLocal(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function parseISO(v) {
    var p = String(v || "").split("-");
    if (p.length !== 3) return null;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return isNaN(d) ? null : d;
  }
  function addDias(d, n) {
    var x = new Date(d.getTime());
    x.setDate(x.getDate() + n);
    return x;
  }
  function inicioSemana(d) {
    var x = new Date(d.getTime());
    var dia = x.getDay();
    var volta = dia === 0 ? 6 : dia - 1;
    x.setDate(x.getDate() - volta);
    x.setHours(0, 0, 0, 0);
    return x;
  }
  function fmtDia(v) {
    var d = typeof v === "string" ? parseISO(v) : v;
    if (!d) return v;
    var s = d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function fmtHora(v) {
    if (!v) return "";
    var p = String(v).split(":");
    return p[0] + "h" + (p[1] && p[1] !== "00" ? p[1] : "");
  }
  function quando(it) {
    var p = it.periodo || "";
    var h = fmtHora(it.horario);
    if (p && h) return p + " · " + h;
    return p || h || "Horário a combinar";
  }
  function uid() {
    return "ag-demo-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function mostrarAviso(html, tipo) {
    aviso.hidden = !html;
    aviso.className = "agenda-aviso" + (tipo ? " " + tipo : "");
    aviso.innerHTML = html || "";
  }

  function avisoDemo() {
    if (DEMO) {
      mostrarAviso(
        "<strong>Modo demonstração.</strong> A agenda ainda não está ligada à planilha do Google. " +
        "Os horários abaixo são exemplos e não são gravados de verdade. " +
        "Senha de exemplo: <kbd>demo</kbd>. O passo a passo está no arquivo <code>GUIA-AGENDA.txt</code>.",
        "demo"
      );
    } else {
      mostrarAviso("");
    }
  }

  /* ---------- demonstração ---------- */
  function seedDemo() {
    var h = hojeZero();
    var ter = addDias(h, 1);
    while (ter.getDay() === 0 || ter.getDay() === 1) ter = addDias(ter, 1);
    var qua = addDias(ter, 1);
    if (qua.getDay() === 0) qua = addDias(qua, 2);
    if (qua.getDay() === 1) qua = addDias(qua, 1);
    var qui = addDias(qua, 1);
    if (qui.getDay() === 0) qui = addDias(qui, 2);
    if (qui.getDay() === 1) qui = addDias(qui, 1);
    return [
      { id: "ex-1", data: isoLocal(ter), horario: "10:00", periodo: "Manhã", cliente: "Ana (exemplo)", servico: "Unhas", profissional: "Rafaela", status: "confirmado", obs: "Exemplo de horário confirmado." },
      { id: "ex-2", data: isoLocal(ter), horario: "14:30", periodo: "Tarde", cliente: "Beatriz (exemplo)", servico: "Sobrancelha", profissional: "Jennyfer", status: "confirmado", obs: "" },
      { id: "ex-3", data: isoLocal(qua), horario: "", periodo: "Tarde", cliente: "Camila (exemplo)", servico: "Cílios", profissional: "Jennyfer", status: "aguardando", obs: "Pedido enviado pelo site. Exemplo." },
      { id: "ex-4", data: isoLocal(qui), horario: "09:30", periodo: "Manhã", cliente: "Daniela (exemplo)", servico: "Maquiagem", profissional: "Rafaela", status: "aguardando", obs: "Pedido de exemplo, aguardando confirmação." }
    ];
  }
  function lerDemo() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) {}
    var seed = seedDemo();
    salvarDemo(seed);
    return seed;
  }
  function salvarDemo(arr) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  /* ---------- API ---------- */
  function api(payload) {
    if (DEMO) return Promise.reject(new Error("demo"));
    return fetch(URL, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.text();
    }).then(function (t) {
      try { return JSON.parse(t); }
      catch (e) { return { ok: false, erro: "Não foi possível conversar com a agenda. Confira a publicação do Apps Script." }; }
    });
  }

  function apiAuth(payload) {
    payload.token = sessao.token;
    return api(payload).then(function (res) {
      if (res && res.codigo === "nao_autorizado") {
        sair();
        mostrarErroEntrar(res.erro || "Sessão expirada. Entre de novo, por favor.");
      }
      return res;
    });
  }

  /* ---------- login ---------- */
  function mostrarErroEntrar(msg) {
    entrarErro.hidden = !msg;
    entrarErro.textContent = msg || "";
  }

  function telaLogada(on) {
    telaEntrar.hidden = on;
    telaAgenda.hidden = !on;
    document.getElementById("nome-sessao").textContent = sessao.nome || "";
  }

  function entrar(nome, senha) {
    mostrarErroEntrar("");
    var btn = document.getElementById("btn-entrar");
    btn.disabled = true;
    function ok(token) {
      sessao = { nome: nome, token: token || "demo" };
      try {
        sessionStorage.setItem(SS_NOME, nome);
        sessionStorage.setItem(SS_TOKEN, sessao.token);
      } catch (e) {}
      telaLogada(true);
      avisoDemo();
      carregar();
    }
    function fim() { btn.disabled = false; }

    if (DEMO) {
      if (senha !== "demo") {
        mostrarErroEntrar("No modo demonstração, a senha de exemplo é: demo");
        fim();
        return;
      }
      ok("demo");
      fim();
      return;
    }
    api({ acao: "entrar", nome: nome, senha: senha }).then(function (res) {
      if (!res || !res.ok) {
        mostrarErroEntrar((res && res.erro) || "Não foi possível entrar.");
        return;
      }
      ok(res.token);
    }).catch(function () {
      mostrarErroEntrar("Não foi possível falar com a agenda. Confira a URL em agenda-config.js e a publicação do Apps Script.");
    }).then(fim);
  }

  function sair() {
    sessao = { nome: "", token: "" };
    try {
      sessionStorage.removeItem(SS_NOME);
      sessionStorage.removeItem(SS_TOKEN);
    } catch (e) {}
    itens = [];
    telaLogada(false);
    avisoDemo();
    formEntrar.reset();
  }

  formEntrar.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(formEntrar);
    var nome = String(fd.get("nome") || "");
    var senha = String(fd.get("senha") || "");
    if (!nome) { mostrarErroEntrar("Escolha Rafaela ou Jennyfer."); return; }
    if (!senha) { mostrarErroEntrar("Digite a senha do estúdio."); return; }
    entrar(nome, senha);
  });
  document.getElementById("btn-sair").addEventListener("click", sair);

  /* ---------- intervalo da vista ---------- */
  function intervalo() {
    if (vista === "dia") {
      return { de: isoLocal(ancora), ate: isoLocal(ancora) };
    }
    var ini = inicioSemana(ancora);
    var fim = addDias(ini, 6);
    return { de: isoLocal(ini), ate: isoLocal(fim) };
  }

  function tituloPeriodo() {
    var i = intervalo();
    var a = parseISO(i.de), b = parseISO(i.ate);
    var el = document.getElementById("periodo-titulo");
    if (vista === "dia") {
      el.textContent = fmtDia(a);
    } else {
      var op = { day: "numeric", month: "short" };
      el.textContent = a.toLocaleDateString("pt-BR", op) + " — " + b.toLocaleDateString("pt-BR", op);
    }
  }

  function setVista(v) {
    vista = v;
    document.getElementById("vista-dia").setAttribute("aria-pressed", v === "dia" ? "true" : "false");
    document.getElementById("vista-semana").setAttribute("aria-pressed", v === "semana" ? "true" : "false");
    carregar();
  }
  document.getElementById("vista-dia").addEventListener("click", function () { setVista("dia"); });
  document.getElementById("vista-semana").addEventListener("click", function () { setVista("semana"); });
  document.getElementById("nav-ant").addEventListener("click", function () {
    ancora = addDias(ancora, vista === "dia" ? -1 : -7);
    carregar();
  });
  document.getElementById("nav-prox").addEventListener("click", function () {
    ancora = addDias(ancora, vista === "dia" ? 1 : 7);
    carregar();
  });
  document.getElementById("nav-hoje").addEventListener("click", function () {
    ancora = hojeZero();
    carregar();
  });

  /* ---------- carregar / desenhar ---------- */
  function carregar() {
    tituloPeriodo();
    lista.innerHTML = "<p class=\"sub\">Carregando…</p>";
    var i = intervalo();
    if (DEMO) {
      itens = lerDemo().filter(function (it) {
        return it.status !== "recusado" && it.data >= i.de && it.data <= i.ate;
      });
      desenhar();
      return;
    }
    apiAuth({ acao: "listar", de: i.de, ate: i.ate }).then(function (res) {
      if (!res || !res.ok) {
        lista.innerHTML = "<p class=\"agenda-erro\">" + esc((res && res.erro) || "Não foi possível carregar a agenda.") + "</p>";
        return;
      }
      itens = res.itens || [];
      desenhar();
    }).catch(function () {
      lista.innerHTML = "<p class=\"agenda-erro\">Não foi possível carregar a agenda.</p>";
    });
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function desenhar() {
    tituloPeriodo();
    var i = intervalo();
    var porDia = {};
    var d = parseISO(i.de);
    var fim = parseISO(i.ate);
    while (d && d <= fim) {
      porDia[isoLocal(d)] = [];
      d = addDias(d, 1);
    }
    itens.forEach(function (it) {
      if (!porDia[it.data]) porDia[it.data] = [];
      porDia[it.data].push(it);
    });
    var html = "";
    Object.keys(porDia).forEach(function (dia) {
      var grupo = porDia[dia].slice().sort(function (a, b) {
        return (a.horario || "99:99") < (b.horario || "99:99") ? -1 : 1;
      });
      var ehHoje = dia === isoLocal(hojeZero());
      html += "<section class=\"agenda-dia" + (ehHoje ? " hoje" : "") + "\">";
      html += "<h3>" + esc(fmtDia(dia)) + (ehHoje ? " <span class=\"agenda-tag-hoje\">hoje</span>" : "") + "</h3>";
      if (!grupo.length) {
        html += "<p class=\"agenda-vazio\">Nenhum horário neste dia.</p>";
      } else {
        grupo.forEach(function (it) {
          var prof = it.profissional === "Jennyfer" ? "jen" : "raf";
          var agd = it.status === "aguardando";
          html += "<article class=\"agenda-item " + prof + (agd ? " aguardando" : "") + "\" data-id=\"" + esc(it.id) + "\">";
          html += "<div class=\"agenda-item-topo\">";
          html += "<p class=\"agenda-quando\">" + esc(quando(it)) + "</p>";
          html += "<p class=\"agenda-prof " + prof + "\">" + esc(it.profissional) + "</p>";
          html += "</div>";
          html += "<h4>" + esc(it.cliente) + "</h4>";
          html += "<p class=\"agenda-serv\">" + esc(it.servico) + "</p>";
          if (it.obs) html += "<p class=\"agenda-obs\">" + esc(it.obs) + "</p>";
          if (agd) html += "<p class=\"agenda-badge\">Aguardando confirmação</p>";
          html += "<div class=\"agenda-item-acoes\">";
          if (agd) {
            html += "<button type=\"button\" class=\"btn ouro mini-cta\" data-acao=\"confirmar\">Confirmar</button>";
            html += "<button type=\"button\" class=\"agenda-recusar\" data-acao=\"recusar\">Recusar</button>";
          }
          html += "<button type=\"button\" class=\"agenda-editar\" data-acao=\"editar\">Editar</button>";
          html += "<button type=\"button\" class=\"agenda-apagar\" data-acao=\"apagar\">Apagar</button>";
          html += "</div></article>";
        });
      }
      html += "</section>";
    });
    lista.innerHTML = html;
  }

  lista.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-acao]");
    if (!btn) return;
    var art = btn.closest(".agenda-item");
    if (!art) return;
    var id = art.getAttribute("data-id");
    var it = itens.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    var acao = btn.getAttribute("data-acao");
    if (acao === "editar") abrirForm(it);
    if (acao === "apagar") apagar(it);
    if (acao === "confirmar") abrirConfirmar(it);
    if (acao === "recusar") recusar(it);
  });

  /* ---------- formulário criar/editar ---------- */
  function abrirForm(it) {
    formErro.hidden = true;
    formAg.reset();
    document.getElementById("dlg-titulo").textContent = it ? "Editar agendamento" : "Novo agendamento";
    document.getElementById("ag-id").value = it ? it.id : "";
    document.getElementById("ag-cliente").value = it ? it.cliente : "";
    document.getElementById("ag-servico").value = it ? it.servico : "";
    document.getElementById("ag-prof").value = it ? it.profissional : (sessao.nome || "Rafaela");
    document.getElementById("ag-data").value = it ? it.data : isoLocal(ancora);
    document.getElementById("ag-horario").value = it ? (it.horario || "") : "";
    document.getElementById("ag-status").value = it ? (it.status === "aguardando" ? "aguardando" : "confirmado") : "confirmado";
    document.getElementById("ag-obs").value = it ? (it.obs || "") : "";
    var per = it ? (it.periodo || "") : "";
    formAg.querySelectorAll("[name=periodo]").forEach(function (r) {
      r.checked = r.value === per;
    });
    if (!dlgForm.open) dlgForm.showModal();
    document.getElementById("ag-cliente").focus();
  }

  document.getElementById("btn-novo").addEventListener("click", function () { abrirForm(null); });
  document.getElementById("btn-cancelar").addEventListener("click", function () { dlgForm.close(); });

  formAg.addEventListener("submit", function (e) {
    e.preventDefault();
    formErro.hidden = true;
    var dados = {
      id: document.getElementById("ag-id").value,
      cliente: document.getElementById("ag-cliente").value.trim(),
      servico: document.getElementById("ag-servico").value.trim(),
      profissional: document.getElementById("ag-prof").value,
      data: document.getElementById("ag-data").value,
      horario: document.getElementById("ag-horario").value,
      periodo: (formAg.querySelector("[name=periodo]:checked") || {}).value || "",
      status: document.getElementById("ag-status").value,
      obs: document.getElementById("ag-obs").value.trim()
    };
    if (dados.cliente.length < 2) { failForm("Informe o nome da cliente."); return; }
    if (dados.servico.length < 2) { failForm("Informe o serviço."); return; }
    if (!dados.data) { failForm("Informe o dia."); return; }
    if (!dados.horario && !dados.periodo) { failForm("Informe um horário ou um período."); return; }

    if (DEMO) {
      var arr = lerDemo();
      if (dados.id) {
        arr = arr.map(function (x) { return x.id === dados.id ? dados : x; });
      } else {
        dados.id = uid();
        arr.push(dados);
      }
      salvarDemo(arr);
      dlgForm.close();
      carregar();
      return;
    }
    var btn = document.getElementById("btn-salvar");
    btn.disabled = true;
    apiAuth({
      acao: "salvar",
      id: dados.id || undefined,
      cliente: dados.cliente,
      servico: dados.servico,
      profissional: dados.profissional,
      data: dados.data,
      horario: dados.horario,
      periodo: dados.periodo,
      status: dados.status,
      obs: dados.obs
    }).then(function (res) {
      if (!res || !res.ok) { failForm((res && res.erro) || "Não foi possível salvar."); return; }
      dlgForm.close();
      carregar();
    }).catch(function () {
      failForm("Não foi possível salvar.");
    }).then(function () { btn.disabled = false; });
  });

  function failForm(msg) {
    formErro.hidden = false;
    formErro.textContent = msg;
  }

  function apagar(it) {
    if (!window.confirm("Apagar o horário de " + it.cliente + " em " + fmtDia(it.data) + "?")) return;
    if (DEMO) {
      salvarDemo(lerDemo().filter(function (x) { return x.id !== it.id; }));
      carregar();
      return;
    }
    apiAuth({ acao: "apagar", id: it.id }).then(function (res) {
      if (!res || !res.ok) { window.alert((res && res.erro) || "Não foi possível apagar."); return; }
      carregar();
    }).catch(function () { window.alert("Não foi possível apagar."); });
  }

  /* ---------- confirmar / recusar ---------- */
  function abrirConfirmar(it) {
    pendenteConf = it;
    confErro.hidden = true;
    document.getElementById("conf-resumo").textContent = it.cliente + " · " + it.servico + " · " + it.profissional;
    document.getElementById("conf-data").value = it.data;
    document.getElementById("conf-horario").value = it.horario || "";
    var per = it.periodo || "";
    formConf.querySelectorAll("[name=periodo]").forEach(function (r) {
      r.checked = r.value === per;
    });
    if (!dlgConf.open) dlgConf.showModal();
    document.getElementById("conf-horario").focus();
  }
  document.getElementById("btn-conf-cancelar").addEventListener("click", function () { dlgConf.close(); pendenteConf = null; });

  formConf.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!pendenteConf) return;
    var data = document.getElementById("conf-data").value;
    var horario = document.getElementById("conf-horario").value;
    var periodo = (formConf.querySelector("[name=periodo]:checked") || {}).value || "";
    if (!data) { confErro.hidden = false; confErro.textContent = "Informe o dia."; return; }
    if (!horario && !periodo) { confErro.hidden = false; confErro.textContent = "Informe um horário ou um período."; return; }

    if (DEMO) {
      var arr = lerDemo().map(function (x) {
        if (x.id !== pendenteConf.id) return x;
        return { id: x.id, cliente: x.cliente, servico: x.servico, profissional: x.profissional, obs: x.obs, data: data, horario: horario, periodo: periodo, status: "confirmado" };
      });
      salvarDemo(arr);
      dlgConf.close();
      pendenteConf = null;
      carregar();
      return;
    }
    apiAuth({ acao: "confirmar", id: pendenteConf.id, data: data, horario: horario, periodo: periodo }).then(function (res) {
      if (!res || !res.ok) { confErro.hidden = false; confErro.textContent = (res && res.erro) || "Não foi possível confirmar."; return; }
      dlgConf.close();
      pendenteConf = null;
      carregar();
    }).catch(function () {
      confErro.hidden = false;
      confErro.textContent = "Não foi possível confirmar.";
    });
  });

  function recusar(it) {
    if (!window.confirm("Recusar o pedido de " + it.cliente + "?")) return;
    if (DEMO) {
      var arr = lerDemo().map(function (x) {
        if (x.id !== it.id) return x;
        var y = {};
        Object.keys(x).forEach(function (k) { y[k] = x[k]; });
        y.status = "recusado";
        return y;
      });
      salvarDemo(arr);
      carregar();
      return;
    }
    apiAuth({ acao: "recusar", id: it.id }).then(function (res) {
      if (!res || !res.ok) { window.alert((res && res.erro) || "Não foi possível recusar."); return; }
      carregar();
    }).catch(function () { window.alert("Não foi possível recusar."); });
  }

  /* ---------- início ---------- */
  avisoDemo();
  try {
    var n = sessionStorage.getItem(SS_NOME) || "";
    var t = sessionStorage.getItem(SS_TOKEN) || "";
    if (n && t && (n === "Rafaela" || n === "Jennyfer")) {
      if (DEMO && t !== "demo") t = "";
      if (t) {
        sessao = { nome: n, token: t };
        telaLogada(true);
        carregar();
      }
    }
  } catch (e) {}
})();
