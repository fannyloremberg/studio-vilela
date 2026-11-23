/**
 * Agenda do Studio Vilela — código do Apps Script
 * Cole este arquivo no editor do Apps Script (veja GUIA-AGENDA.txt).
 *
 * Propriedades do script (Engrenagem > Propriedades do script):
 *   SENHA  = a senha do estúdio (obrigatória)
 *   SEGREDO = gerado sozinho na primeira entrada (não precisa criar)
 *
 * Publicação: Implantar > Nova implantação > Tipo: App da Web
 *   Executar como: Eu
 *   Quem pode acessar: Qualquer pessoa
 */

var PROFISSIONAIS = { Rafaela: true, Jennyfer: true };
var STATUS_OK = { aguardando: true, confirmado: true, recusado: true };
var COLUNAS = ['id', 'data', 'horario', 'periodo', 'cliente', 'servico', 'profissional', 'status', 'obs', 'criado', 'atualizado'];
var TOKEN_HORAS = 12;
var MAX_PEDIDOS_10MIN = 20;
var MAX_PEDIDOS_MESMO_NOME_1H = 4;
var TAM_MAX = { cliente: 80, servico: 80, periodo: 20, horario: 8, obs: 400, profissional: 20, data: 10 };

function doGet() {
  return json_({ ok: true, servico: 'agenda-studio-vilela' });
}

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    return json_(tratar_(body || {}));
  } catch (err) {
    return json_({ ok: false, erro: 'Não foi possível processar o pedido.' });
  }
}

function tratar_(b) {
  var acao = String(b.acao || '').toLowerCase();
  if (acao === 'pedido') return criarPedidoPublico_(b);
  if (acao === 'entrar') return entrar_(b);

  var sess = validarSessao_(b.token);
  if (!sess) {
    return { ok: false, codigo: 'nao_autorizado', erro: 'Sessão expirada. Entre de novo, por favor.' };
  }
  if (acao === 'listar') return listar_(b);
  if (acao === 'salvar') return salvar_(b, sess);
  if (acao === 'apagar') return apagar_(b);
  if (acao === 'confirmar') return confirmar_(b, sess);
  if (acao === 'recusar') return recusar_(b, sess);
  return { ok: false, erro: 'Ação não reconhecida.' };
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- entrada ---------- */

function entrar_(b) {
  var nome = normalizarProf_(b.nome);
  if (!PROFISSIONAIS[nome]) {
    return { ok: false, erro: 'Escolha Rafaela ou Jennyfer.' };
  }
  var senhaEsperada = PropertiesService.getScriptProperties().getProperty('SENHA');
  if (!senhaEsperada) {
    return { ok: false, erro: 'A senha ainda não foi configurada. Veja o GUIA-AGENDA.txt.' };
  }
  if (String(b.senha || '') !== senhaEsperada) {
    Utilities.sleep(400);
    return { ok: false, erro: 'Senha incorreta. Tente de novo, por favor.' };
  }
  return { ok: true, token: emitirToken_(nome), nome: nome };
}

function segredo_() {
  var p = PropertiesService.getScriptProperties();
  var s = p.getProperty('SEGREDO');
  if (!s) {
    s = Utilities.getUuid() + Utilities.getUuid();
    p.setProperty('SEGREDO', s);
  }
  return s;
}

function hmacHex_(texto) {
  var raw = Utilities.computeHmacSha256Signature(texto, segredo_());
  return raw.map(function (byte) {
    var v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? '0' + v : v;
  }).join('');
}

function emitirToken_(nome) {
  var exp = Date.now() + TOKEN_HORAS * 60 * 60 * 1000;
  var payload = nome + '.' + exp;
  return payload + '.' + hmacHex_(payload);
}

function validarSessao_(token) {
  token = String(token || '');
  var i = token.lastIndexOf('.');
  if (i < 1) return null;
  var payload = token.substring(0, i);
  var sig = token.substring(i + 1);
  if (!sig || hmacHex_(payload) !== sig) return null;
  var partes = payload.split('.');
  var nome = partes[0];
  var exp = Number(partes[1]);
  if (!PROFISSIONAIS[nome] || !exp || Date.now() > exp) return null;
  return { nome: nome };
}

/* ---------- planilha ---------- */

function planilha_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Agenda');
  if (!sh) {
    sh = ss.insertSheet('Agenda');
    sh.appendRow(COLUNAS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    sh.setColumnWidths(1, COLUNAS.length, 120);
    sh.setColumnWidth(5, 180);
    sh.setColumnWidth(6, 160);
    sh.setColumnWidth(9, 220);
  }
  return sh;
}

function linhas_() {
  var sh = planilha_();
  var vals = sh.getDataRange().getDisplayValues();
  if (!vals.length) return [];
  var cab = vals[0].map(function (c) { return String(c).trim(); });
  var idx = {};
  COLUNAS.forEach(function (c) { idx[c] = cab.indexOf(c); });
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    var row = vals[i];
    if (!row[idx.id]) continue;
    var item = { _linha: i + 1 };
    COLUNAS.forEach(function (c) {
      item[c] = idx[c] >= 0 ? String(row[idx[c]] || '').trim() : '';
    });
    out.push(item);
  }
  return out;
}

function publico_(item) {
  return {
    id: item.id,
    data: item.data,
    horario: item.horario,
    periodo: item.periodo,
    cliente: item.cliente,
    servico: item.servico,
    profissional: item.profissional,
    status: item.status,
    obs: item.obs
  };
}

function agoraISO_() {
  return Utilities.formatDate(new Date(), 'America/Sao_Paulo', "yyyy-MM-dd'T'HH:mm:ss");
}

function novoId_() {
  return 'ag-' + Utilities.getUuid().replace(/-/g, '').substring(0, 16);
}

function gravarNovo_(dados) {
  var sh = planilha_();
  var agora = agoraISO_();
  var id = novoId_();
  sh.appendRow([
    id,
    dados.data,
    dados.horario || '',
    dados.periodo || '',
    dados.cliente,
    dados.servico,
    dados.profissional,
    dados.status,
    dados.obs || '',
    agora,
    agora
  ]);
  dados.id = id;
  return dados;
}

function atualizarLinha_(item, campos) {
  var sh = planilha_();
  var cab = sh.getRange(1, 1, 1, sh.getLastColumn()).getDisplayValues()[0];
  var agora = agoraISO_();
  campos.atualizado = agora;
  Object.keys(campos).forEach(function (c) {
    var col = cab.indexOf(c) + 1;
    if (col > 0) sh.getRange(item._linha, col).setValue(campos[c]);
  });
}

/* ---------- validação ---------- */

function cortar_(v, max) {
  return String(v || '').replace(/\s+/g, ' ').trim().substring(0, max);
}

function normalizarProf_(v) {
  var s = String(v || '').replace(/\s+/g, ' ').trim();
  if (/^rafaela$/i.test(s)) return 'Rafaela';
  if (/^jennyfer$/i.test(s)) return 'Jennyfer';
  return s;
}

function validarData_(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return 'Informe o dia no formato AAAA-MM-DD.';
  var p = v.split('-');
  var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  if (isNaN(d.getTime()) || d.getFullYear() !== Number(p[0]) || d.getMonth() + 1 !== Number(p[1]) || d.getDate() !== Number(p[2])) {
    return 'Dia inválido.';
  }
  return '';
}

function validarHorario_(v) {
  if (!v) return '';
  if (!/^\d{2}:\d{2}$/.test(v)) return 'Horário inválido. Use HH:MM.';
  var h = Number(v.slice(0, 2)), m = Number(v.slice(3));
  if (h > 23 || m > 59) return 'Horário inválido.';
  return '';
}

function camposComuns_(b) {
  var dados = {
    cliente: cortar_(b.cliente || b.nome, TAM_MAX.cliente),
    servico: cortar_(b.servico, TAM_MAX.servico),
    profissional: normalizarProf_(b.profissional),
    data: cortar_(b.data, TAM_MAX.data),
    horario: cortar_(b.horario || b.hora, TAM_MAX.horario),
    periodo: cortar_(b.periodo, TAM_MAX.periodo),
    obs: cortar_(b.obs, TAM_MAX.obs)
  };
  if (dados.cliente.length < 2) return { erro: 'Informe o nome da cliente.' };
  if (dados.servico.length < 2) return { erro: 'Informe o serviço.' };
  if (!PROFISSIONAIS[dados.profissional]) return { erro: 'Escolha Rafaela ou Jennyfer.' };
  var ed = validarData_(dados.data);
  if (ed) return { erro: ed };
  var eh = validarHorario_(dados.horario);
  if (eh) return { erro: eh };
  if (dados.periodo && !/^(Manhã|Tarde|Noite)$/.test(dados.periodo)) {
    dados.periodo = cortar_(dados.periodo, TAM_MAX.periodo);
  }
  return { dados: dados };
}

/* ---------- ações ---------- */

function limitePedido_(nome) {
  var cache = CacheService.getScriptCache();
  var g = Number(cache.get('rl_global') || '0') + 1;
  if (g > MAX_PEDIDOS_10MIN) {
    return 'Muitos pedidos ao mesmo tempo. Tente de novo em alguns minutos.';
  }
  cache.put('rl_global', String(g), 600);
  var chave = 'rl_' + nome.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
  var n = Number(cache.get(chave) || '0') + 1;
  if (n > MAX_PEDIDOS_MESMO_NOME_1H) {
    return 'Já recebemos pedidos recentes com este nome. Fale direto no WhatsApp, por favor.';
  }
  cache.put(chave, String(n), 3600);
  return '';
}

function criarPedidoPublico_(b) {
  var v = camposComuns_(b);
  if (v.erro) return { ok: false, erro: v.erro };
  if (!v.dados.periodo && !v.dados.horario) {
    return { ok: false, erro: 'Informe um período ou um horário.' };
  }
  var lim = limitePedido_(v.dados.cliente);
  if (lim) return { ok: false, erro: lim };

  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    v.dados.status = 'aguardando';
    var item = gravarNovo_(v.dados);
    return { ok: true, id: item.id, status: 'aguardando' };
  } finally {
    lock.releaseLock();
  }
}

function listar_(b) {
  var de = String(b.de || '');
  var ate = String(b.ate || '');
  var incluirRecusados = !!b.incluirRecusados;
  var itens = linhas_().filter(function (it) {
    if (!incluirRecusados && it.status === 'recusado') return false;
    if (de && it.data < de) return false;
    if (ate && it.data > ate) return false;
    return true;
  });
  itens.sort(function (a, b) {
    if (a.data !== b.data) return a.data < b.data ? -1 : 1;
    var ha = a.horario || '99:99';
    var hb = b.horario || '99:99';
    if (ha !== hb) return ha < hb ? -1 : 1;
    return 0;
  });
  return { ok: true, itens: itens.map(publico_) };
}

function achar_(id) {
  id = String(id || '');
  if (!id) return null;
  var todos = linhas_();
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].id === id) return todos[i];
  }
  return null;
}

function salvar_(b, sess) {
  var v = camposComuns_(b);
  if (v.erro) return { ok: false, erro: v.erro };
  var status = String(b.status || 'confirmado');
  if (!STATUS_OK[status]) return { ok: false, erro: 'Status inválido.' };

  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    if (b.id) {
      var item = achar_(b.id);
      if (!item) return { ok: false, erro: 'Agendamento não encontrado.' };
      atualizarLinha_(item, {
        data: v.dados.data,
        horario: v.dados.horario,
        periodo: v.dados.periodo,
        cliente: v.dados.cliente,
        servico: v.dados.servico,
        profissional: v.dados.profissional,
        status: status,
        obs: v.dados.obs
      });
      item = achar_(b.id);
      return { ok: true, item: publico_(item) };
    }
    v.dados.status = status;
    var novo = gravarNovo_(v.dados);
    return { ok: true, item: publico_(novo) };
  } finally {
    lock.releaseLock();
  }
}

function apagar_(b) {
  var item = achar_(b.id);
  if (!item) return { ok: false, erro: 'Agendamento não encontrado.' };
  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    planilha_().deleteRow(item._linha);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function confirmar_(b, sess) {
  var item = achar_(b.id);
  if (!item) return { ok: false, erro: 'Agendamento não encontrado.' };
  var campos = { status: 'confirmado' };
  if (b.data) {
    var ed = validarData_(cortar_(b.data, TAM_MAX.data));
    if (ed) return { ok: false, erro: ed };
    campos.data = cortar_(b.data, TAM_MAX.data);
  }
  if (b.horario !== undefined && b.horario !== null) {
    var h = cortar_(b.horario, TAM_MAX.horario);
    var eh = validarHorario_(h);
    if (eh) return { ok: false, erro: eh };
    campos.horario = h;
  }
  if (b.periodo !== undefined && b.periodo !== null) {
    campos.periodo = cortar_(b.periodo, TAM_MAX.periodo);
  }
  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    atualizarLinha_(item, campos);
    return { ok: true, item: publico_(achar_(b.id)) };
  } finally {
    lock.releaseLock();
  }
}

function recusar_(b, sess) {
  var item = achar_(b.id);
  if (!item) return { ok: false, erro: 'Agendamento não encontrado.' };
  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    atualizarLinha_(item, { status: 'recusado' });
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}
