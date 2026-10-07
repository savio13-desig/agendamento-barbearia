/* Agendamento em 4 passos: serviço, profissional, data e horário, dados. */
(function () {
  "use strict";
  var A = Agenda, C = A.C;
  var $ = function (s) { return document.querySelector(s); };
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var q = new URLSearchParams(location.search);
  var s = { passo: 1, servId: 0, profId: -1, data: "", hora: "", profReal: 0, antigo: "" };

  /* remarcar: reaproveita serviço e profissional do agendamento antigo */
  var ant = q.get("remarcar") && A.porCodigo(q.get("remarcar"));
  if (ant && ant.status === "agendado") { s.servId = ant.servId; s.profId = ant.profId; s.antigo = ant.cod; s.passo = 3; }

  function cabecalho() {
    document.title = C.nome + " · Agende seu horário";
    $("#nome-casa").textContent = C.nome; $("#slogan").textContent = C.slogan;
  }
  function indicador() {
    $("#passos").innerHTML = [1, 2, 3, 4].map(function (n) { return '<li class="' + (n <= s.passo ? "ok" : "") + '"' + (n === s.passo ? ' aria-current="step"' : "") + "></li>"; }).join("");
    $("#passos").hidden = s.passo > 4;
  }
  function ir(n) { s.passo = n; desenhar(); $("#passo").focus({ preventScroll: true }); window.scrollTo({ top: 0 }); }
  function voltar() { return '<div class="acoes"><button class="btn btn-contorno" data-voltar>Voltar</button></div>'; }

  function passo1() {
    return '<h2 class="passo-titulo">Qual serviço?</h2><p class="passo-sub">Escolha o que você quer fazer hoje.</p><div class="lista">' +
      A.servicos().filter(function (x) { return x.ativo; }).map(function (x) {
        return '<button class="escolha" data-serv="' + x.id + '" aria-pressed="' + (s.servId === x.id) + '">' + (x.foto ? '<img class="thumb" src="img/' + x.foto + '-120.webp" width="56" height="56" alt="" loading="lazy">' : "") + '<span class="corpo"><b>' + esc(x.nome) + (x.tag ? '<span class="tag">' + esc(x.tag) + "</span>" : "") +
          "</b><small>" + esc(x.desc) + " · " + x.dur + ' min</small></span><span class="preco">' + A.brl(x.preco) + "</span></button>";
      }).join("") + '</div><div class="acoes"><button class="btn btn-primario" data-ir2 ' + (s.servId ? "" : "disabled") + ">Continuar</button></div>";
  }
  function passo2() {
    return '<h2 class="passo-titulo">Com quem?</h2><p class="passo-sub">Escolha o profissional ou deixe a gente encaixar no primeiro horário livre.</p><div class="lista duas">' +
      '<button class="escolha" data-prof="0" aria-pressed="' + (s.profId === 0) + '"><span class="avatar" aria-hidden="true">★</span><span class="corpo"><b>Sem preferência</b><small>O primeiro horário disponível</small></span></button>' +
      C.profissionais.map(function (p) {
        return '<button class="escolha" data-prof="' + p.id + '" aria-pressed="' + (s.profId === p.id) + '"><span class="avatar" aria-hidden="true">' + esc(p.nome.charAt(0)) + '</span><span class="corpo"><b>' + esc(p.nome) + "</b><small>" + esc(p.esp) + "</small></span></button>";
      }).join("") + "</div>" + voltar();
  }
  function passo3() {
    var sv = A.servico(s.servId), hoje = new Date(), dias = "";
    for (var i = 0; i < C.diasAFrente; i++) {
      var d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i), ds = A.dstr(d), aberto = A.slots(ds, s.profId, sv.dur, { ignorar: ant ? ant.id : 0 }).length > 0;
      dias += '<button class="dia" data-dia="' + ds + '" aria-pressed="' + (s.data === ds) + '"' + (aberto ? "" : " disabled") + ' aria-label="' + A.dataLonga(ds) + (aberto ? "" : ", sem horários") + '"><small>' + (i === 0 ? "hoje" : A.DIAS[d.getDay()].slice(0, 3)) + "</small><b>" + d.getDate() + "</b><small>" + A.MESES[d.getMonth()] + "</small></button>";
    }
    var horas = "";
    if (s.data) {
      var sl = A.slots(s.data, s.profId, sv.dur, { ignorar: ant ? ant.id : 0 });
      horas = sl.length ? '<h3 style="margin:0 0 12px">Horários em ' + A.dataLonga(s.data) + '</h3><div class="horas">' + sl.map(function (x) {
        return '<button class="hora" data-hora="' + x.hora + '" data-p="' + x.prof + '" aria-pressed="' + (s.hora === x.hora) + '">' + x.hora + "</button>";
      }).join("") + "</div>" : '<p class="vazio">Sem horários livres neste dia. Escolha outra data.</p>';
    } else horas = '<p class="vazio">Escolha um dia para ver os horários.</p>';
    return '<h2 class="passo-titulo">Quando?</h2><p class="passo-sub">' + esc(sv.nome) + " · " + sv.dur + " min" + (s.antigo ? " · remarcando" : "") + '</p><div class="dias" role="group" aria-label="Dias">' + dias + "</div>" + horas +
      '<div class="acoes"><button class="btn btn-contorno" data-voltar>Voltar</button><button class="btn btn-primario" data-ir4 ' + (s.hora ? "" : "disabled") + ">Continuar</button></div>";
  }
  function passo4() {
    var sv = A.servico(s.servId), p = A.prof(s.profReal);
    return '<h2 class="passo-titulo">Seus dados</h2><p class="passo-sub">Para confirmar o horário.</p><div class="resumo">' +
      "<div><span>Serviço</span><b>" + esc(sv.nome) + "</b></div><div><span>Profissional</span><b>" + esc(p.nome) + "</b></div><div><span>Quando</span><b>" + A.dataLonga(s.data) + " às " + s.hora + "</b></div><div><span>Valor</span><b>" + A.brl(sv.preco) + " (paga na barbearia)</b></div></div>" +
      '<form id="dados" novalidate><label for="nome">Seu nome</label><input type="text" id="nome" autocomplete="name" maxlength="50" required>' +
      '<label for="tel">WhatsApp</label><input type="tel" id="tel" autocomplete="tel" inputmode="tel" placeholder="(11) 99999-9999" maxlength="16" required>' +
      '<p class="erro" id="erro" role="alert" hidden></p><div class="acoes"><button type="button" class="btn btn-contorno" data-voltar>Voltar</button><button type="submit" class="btn btn-primario">Confirmar horário</button></div></form>';
  }

  /* ---------- confirmação ---------- */
  function ics(a) {
    var d = a.data.replace(/-/g, ""), ini = a.hora.replace(":", "") + "00", f = A.hm(A.min(a.hora) + a.dur).replace(":", "") + "00";
    return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//novapicks//agendamento//PT", "BEGIN:VEVENT", "UID:" + a.cod + "@navalha", "DTSTAMP:" + d + "T" + ini,
      "DTSTART:" + d + "T" + ini, "DTEND:" + d + "T" + f, "SUMMARY:" + a.servNome + " · " + C.nome, "LOCATION:" + C.endereco, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  }
  function confirmado(a) {
    var p = A.prof(a.profId), msg = "Olá, " + C.nome + "! Agendei *" + a.servNome + "* com " + p.nome + " para " + A.dataLonga(a.data) + " às " + a.hora + ". Nome: " + a.nome + " · código " + a.cod;
    s.passo = 5; indicador();
    $("#passo").innerHTML = '<div class="confirmado"><div class="selo" aria-hidden="true">✓</div><h2 class="passo-titulo">Horário confirmado</h2><p class="passo-sub">Guarde seu código para remarcar ou cancelar.</p><p class="codigo" aria-label="Código ' + a.cod.split("").join(" ") + '">' + a.cod + "</p>" +
      '<div class="resumo" style="text-align:left"><div><span>Serviço</span><b>' + esc(a.servNome) + "</b></div><div><span>Profissional</span><b>" + esc(p.nome) + "</b></div><div><span>Quando</span><b>" + A.dataLonga(a.data) + " às " + a.hora + "</b></div><div><span>Onde</span><b>" + esc(C.endereco) + "</b></div></div>" +
      '<div class="acoes" style="flex-direction:column"><a class="btn btn-primario" target="_blank" rel="noopener" href="https://wa.me/' + C.whatsapp + "?text=" + encodeURIComponent(msg) + '">Enviar confirmação pelo WhatsApp</a>' +
      '<button class="btn btn-contorno" id="baixar-ics">Adicionar ao calendário</button><a class="btn btn-contorno" href="minha-reserva.html?c=' + a.cod + '">Ver, remarcar ou cancelar</a><a class="btn btn-contorno" href="index.html">Fazer outro agendamento</a></div></div>';
    $("#baixar-ics").addEventListener("click", function () {
      var u = URL.createObjectURL(new Blob([ics(a)], { type: "text/calendar" })), l = document.createElement("a");
      l.href = u; l.download = "agendamento-" + a.cod + ".ics"; l.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
    });
    $("#passo").focus();
  }

  function desenhar() {
    indicador();
    $("#passo").innerHTML = [passo1, passo2, passo3, passo4][s.passo - 1]();
    var f = $("#dados");
    if (f) {
      $("#tel").addEventListener("input", function () {
        var d = A.soDigitos(this.value).slice(0, 11), c = d.length > 10 ? 7 : 6, r = d;
        if (d.length > 2) r = "(" + d.slice(0, 2) + ") " + d.slice(2, c) + (d.length > c ? "-" + d.slice(c) : "");
        this.value = r;
      });
      f.addEventListener("submit", enviar);
    }
  }

  function enviar(e) {
    e.preventDefault();
    var nome = $("#nome").value.trim(), tel = A.soDigitos($("#tel").value), er = $("#erro");
    if (nome.length < 2) { er.textContent = "Informe seu nome."; er.hidden = false; $("#nome").focus(); return; }
    if (tel.length < 10) { er.textContent = "Informe um WhatsApp com DDD."; er.hidden = false; $("#tel").focus(); return; }
    var a = A.criar({ servId: s.servId, profId: s.profReal, data: s.data, hora: s.hora, nome: nome, tel: tel, origem: "site" }, { ignorar: ant ? ant.id : 0 });
    if (!a) { s.hora = ""; ir(3); $("#passo").insertAdjacentHTML("afterbegin", '<p class="erro" role="alert">Esse horário acabou de ser ocupado. Escolha outro.</p>'); return; }
    if (s.antigo) A.mudar(ant.id, { status: "cancelado", motivo: "remarcado" });
    A.lembrar(a.cod); confirmado(a);
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; var d = b.dataset;
    if (d.serv) { s.servId = Number(d.serv); s.hora = ""; s.data = ""; desenhar(); }
    else if ("ir2" in d) ir(2);
    else if (d.prof !== undefined) { s.profId = Number(d.prof); s.hora = ""; s.data = ""; ir(3); }
    else if (d.dia) { s.data = d.dia; s.hora = ""; desenhar(); }
    else if (d.hora) { s.hora = d.hora; s.profReal = Number(d.p); desenhar(); }
    else if ("ir4" in d) ir(4);
    else if ("voltar" in d) { if (s.antigo && s.passo === 3) location.href = "minha-reserva.html?c=" + s.antigo; else ir(Math.max(1, s.passo - 1)); }
  });

  cabecalho(); desenhar();
})();
