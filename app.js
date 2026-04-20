/* ============================================================
   Operation Password Shield — app.js
   ============================================================ */

/* ---------- STATE ---------- */
var state = { points: 0, badges: [], levelsDone: [], levelScores: {}, l3correct: 0, l5score: 0, l5health: 3};

/* ---------- LEVEL META ---------- */
var levels = [
  { id: 1, icon: '🔍', color: 'badge-red',    title: 'Der Tatort',      sub: 'Warum Passwörter wichtig sind',   pts: 150 },
  { id: 2, icon: '🧪', color: 'badge-amber',  title: 'Passwort-Labor',  sub: 'Was macht ein Passwort sicher?',  pts: 200 },
  { id: 3, icon: '🎣', color: 'badge-purple', title: 'Die Falle',       sub: 'Phishing erkennen',               pts: 200 },
  { id: 4, icon: '🧑‍💼', color: 'badge-blue',   title: 'Geheimwaffe',     sub: 'Passwort-Manager verstehen',      pts: 150 },
  { id: 5, icon: '👑', color: 'badge-dark',   title: 'Boss-Kampf',      sub: 'Abschluss-Quiz',                  pts: 300 }
];

/* ---------- RANKS ---------- */
function getRank(p) {
  if (p <= 200) return 'Rookie Agent';
  if (p <= 400) return 'Field Agent';
  if (p <= 600) return 'Senior Investigator';
  if (p <= 800) return 'Security Specialist';
  return 'Elite Shield Commander';
}

/* ---------- HUD ---------- */
function addPoints(n) {
  state.points = Math.min(1000, state.points + n);
  updateHUD();
}

function addBadge(emoji, name) {
  if (!state.badges.find(function(b) { return b.name === name; })) {
    state.badges.push({ emoji: emoji, name: name });
    updateHUD();
  }
}

function updateHUD() {
  var done = state.levelsDone.length;
  setText('map-pts',          state.points);
  setText('lv-pts',           state.points);
  setText('map-rank',         getRank(state.points));
  setText('map-badges',       state.badges.map(function(b) { return b.emoji; }).join(' ') || '—');
  setText('map-progress-txt', done + ' / 5 Level abgeschlossen');
  var bar = document.getElementById('map-progress');
  if (bar) bar.style.width = (done / 5 * 100) + '%';
}

function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ---------- SCREENS ---------- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

function showMap() {
  removeDisclaimer();
  renderMap();
  showScreen('map');
  updateHUD();
}

function restart() {
  state = { points: 0, badges: [], levelsDone: [], levelScores: {}, l3correct: 0, l5score: 0 };
  updateHUD();
  showScreen('intro');
}

/* ---------- MAP ---------- */
function renderMap() {
  var g = document.getElementById('level-grid');
  g.innerHTML = '';
  levels.forEach(function(lv) {
    var done   = state.levelsDone.includes(lv.id);
    var locked = lv.id > 1 && !state.levelsDone.includes(lv.id - 1);
    var d = document.createElement('div');
    d.className = 'level-card' + (done ? ' done' : '') + (locked ? ' locked' : '');
    d.innerHTML =
      '<div class="level-card-icon">' + lv.icon + '</div>' +
      '<div class="level-card-title">' + lv.title + '</div>' +
      '<div class="level-card-sub">'  + lv.sub   + '</div>' +
      (done
        ? '<span class="badge badge-green">✓ ' + Math.round(state.levelScores[lv.id] || 0) + ' Pkt.</span>'
        : '<span class="muted" style="font-size:12px">' + lv.pts + ' Pkt. möglich</span>');
    if (!locked) {
      d.onclick = (function(id) { return function() { startLevel(id); }; })(lv.id);
    }
    g.appendChild(d);
  });
}

function removeDisclaimer(){
  document.getElementById("disclaimer")?.remove();
}

/* ---------- LEVEL ROUTER ---------- */
function startLevel(id) {
  var level = levels.find(l => l.id === id); // ✅ define it

  showScreen('level');

  showLevelIntro(level.title, level.sub, level.icon); // ✅ now works
  var lv = levels[id - 1];
  setText('lv-title-hud', lv.icon + ' Level ' + id + ': ' + lv.title);
  var c = document.getElementById('level-content');
  c.innerHTML = '';
  if (id === 1) renderL1(c);
  else if (id === 2) renderL2(c);
  else if (id === 3) renderL3(c);
  else if (id === 4) renderL4(c);
  else if (id === 5) renderL5(c);
}

/* ============================================================
   LEVEL 1 — Der Tatort
   ============================================================ */
function renderL1(c) {
    c.innerHTML =
    '<div class="card">' +
      '<span class="badge badge-red" style="margin-bottom:0.75rem">Level 1 — Der Tatort</span>' +
      '<h2>Was ist passiert?</h2>' +
      '<div class="alert alert-danger">' +
        '<strong>Sicherheitsvorfall bei Password Secure Gmbh:</strong> Ein Mitarbeiter nutzte das Passwort „Sommer2023". ' +
        'Ein Angreifer knackte es in wenigen Minuten und stahl vertrauliche Kundendaten. Schaden: 85 000 CHF.' +
      '</div>' +
      '<p>Passwörter sind der erste Schutzwall deiner digitalen Identität. Schwache Passwörter sind wie eine Haustür ohne Schloss.</p>' +
    '</div>' +
    '<div class="card" id="l1-q1">' +
      '<h3>Aufgabe 1 von 2 — Was war das Problem?</h3>' +
      '<p class="muted">Wähle die beste Antwort:</p>' +
      '<button class="opt-btn" onclick="l1ans(this, true)">Das Passwort war zu vorhersehbar und enthielt keine Sonderzeichen</button>' +
      '<button class="opt-btn" onclick="l1ans(this, false)">Der Mitarbeiter hatte kein Antivirenprogramm installiert</button>' +
      '<button class="opt-btn" onclick="l1ans(this, false)">Das Passwort war zu lang und zu kompliziert</button>' +
    '</div>' +
    '<div class="card" id="l1-q2" style="display:none">' +
      '<h3>Aufgabe 2 von 2 — Was wäre ein besseres Passwort?</h3>' +
      '<button class="opt-btn" onclick="l1ans2(this, false)">Sommer2024!</button>' +
      '<button class="opt-btn" onclick="l1ans2(this, true)">T!g3r#Mond-42</button>' +
      '<button class="opt-btn" onclick="l1ans2(this, false)">Secure2023</button>' +
    '</div>';
}

function l1ans(btn, correct) {
  disableOpts('#l1-q1');
  btn.classList.add(correct ? 'correct' : 'wrong');
  var fb = makeFeedback(correct,
    correct
      ? 'Richtig! Jahreszeiten + Jahreszahl sind für Angreifer sehr einfach zu erraten. Wörterbuch-Angriffe testen solche Kombinationen als erstes.'
      : 'Leider falsch. Das Hauptproblem war das schwache, vorhersehbare Passwort.'
  );
  document.getElementById('l1-q1').appendChild(fb);
  if (correct) addPoints(50);
  setTimeout(function() { document.getElementById('l1-q2').style.display = 'block'; }, 600);
}

function l1ans2(btn, correct) {
  disableOpts('#l1-q2');
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) { addPoints(50); addBadge('🔍', 'Tatort-Detektiv'); }
  var fb = makeFeedback(correct,
    correct
      ? 'Ausgezeichnet! T!g3r#Mond-42 hat Gross- und Kleinbuchstaben, Zahlen und Sonderzeichen und basiert auf keinem Wörterbuch.'
      : 'Nicht optimal. "Sommer2024!" ist immer noch wörterbuchbasiert; "Secure2023" enthält den Firmennamen. Das gehört zum ersten, was Angreifer ausprobieren.',
    true
  );
  document.getElementById('l1-q2').appendChild(fb);
  markLevelDone(1);
}

/* ============================================================
   LEVEL 2 — Passwort-Labor
   ============================================================ */
function renderL2(c) {
  c.innerHTML =
    '<div class="card">' +
      '<span class="badge badge-amber" style="margin-bottom:0.75rem">Level 2 — Passwort-Labor</span>' +
      '<h2>Der Passwort-Stärke-Simulator</h2>' +
      '<p>Gib ein Testpasswort ein und sieh sofort, wie sicher es wäre. Bitte kein echtes Passwort verwenden!</p>' +
      '<input type="password" id="pw-input" placeholder="Testpasswort eingeben…" oninput="checkPW(this.value)">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:4px">' +
        '<span class="muted" style="font-size:12px">Stärke</span>' +
        '<span id="pw-label" class="muted" style="font-size:12px">—</span>' +
      '</div>' +
      '<div class="progress-bar-wrap"><div id="pw-bar" class="pw-strength-bar" style="width:0%;background:#e24b4a"></div></div>' +
      '<div id="pw-time" class="muted" style="font-size:13px;margin-top:8px"></div>' +
      '<div id="pw-tips" style="margin-top:12px"></div>' +
    '</div>' +
    '<div class="card" id="l2-quiz" style="display:none">' +
      '<h3>Quiz — Welches Passwort ist am sichersten?</h3>' +
      '<button class="opt-btn" onclick="l2ans(this, false)">Passwort123!</button>' +
      '<button class="opt-btn" onclick="l2ans(this, false)">IchLiebeMeinenHund</button>' +
      '<button class="opt-btn" onclick="l2ans(this, true)">xK#9!mQ2@rL5</button>' +
      '<button class="opt-btn" onclick="l2ans(this, false)">Admin2024</button>' +
    '</div>';
}

function checkPW(v) {
  if (!v) {
    document.getElementById('pw-bar').style.width = '0%';
    setText('pw-label', '—');
    setText('pw-time', '');
    document.getElementById('pw-tips').innerHTML = '';
    return;
  }
  var score = 0, tips = [];
  if (v.length >= 8)  score += 20; else tips.push('Mindestens 8 Zeichen verwenden');
  if (v.length >= 12) score += 20; else if (v.length >= 8) tips.push('12+ Zeichen sind noch besser');
  if (/[A-Z]/.test(v))       score += 15; else tips.push('Grossbuchstaben hinzufügen (A–Z)');
  if (/[a-z]/.test(v))       score += 15; else tips.push('Kleinbuchstaben hinzufügen (a–z)');
  if (/[0-9]/.test(v))       score += 15; else tips.push('Zahlen hinzufügen (0–9)');
  if (/[^A-Za-z0-9]/.test(v)) score += 15; else tips.push('Sonderzeichen hinzufügen (!@#$%…)');
  score = Math.min(100, score);

  var colors  = ['#e24b4a','#e24b4a','#ba7517','#ba7517','#3b6d11','#3b6d11'];
  var labels  = ['Sehr schwach','Schwach','Mittel','Gut','Stark','Sehr stark'];
  var times   = ['sofort','wenige Sekunden','einige Minuten','mehrere Stunden','viele Jahre','Millionen von Jahren'];
  var ti = Math.min(Math.floor(score / 20), 5);

  var bar = document.getElementById('pw-bar');
  bar.style.width = score + '%';
  bar.style.background = colors[ti];
  setText('pw-label', labels[ti]);
  setText('pw-time', 'Geschätzte Knackzeit: ' + times[ti]);

  var tipsHtml = '';
  if (tips.length > 0) {
    tipsHtml = '<div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:10px 14px">';
    tips.forEach(function(t) { tipsHtml += '<div class="muted" style="font-size:13px;padding:2px 0">• ' + t + '</div>'; });
    tipsHtml += '</div>';
  } else {
    tipsHtml = '<div class="feedback-box feedback-correct">Ausgezeichnet! Dieses Passwort ist sehr stark.</div>';
  }
  document.getElementById('pw-tips').innerHTML = tipsHtml;
  if (score >= 60) document.getElementById('l2-quiz').style.display = 'block';
}

function l2ans(btn, correct) {
  disableOpts('#l2-quiz');
  btn.classList.add(correct ? 'correct' : 'wrong');
  if (correct) { addPoints(100); addBadge('🧪', 'Passwort-Wissenschaftler'); }
  var msg = correct
    ? 'Richtig! xK#9!mQ2@rL5 hat 12 Zeichen, Gross-/Kleinbuchstaben, Zahlen und Sonderzeichen — ohne erkennbare Wörter oder Muster.'
    : 'Nicht ganz. xK#9!mQ2@rL5 ist die sicherste Wahl. Wörterbuchwörter (auch lange) sind anfälliger für gezielte Angriffe.';
  document.getElementById('l2-quiz').appendChild(makeFeedback(correct, msg, true));
  markLevelDone(2);
}

/* ============================================================
   LEVEL 3 — Die Falle (Phishing)
   ============================================================ */
var phishingEmails = [
  {
    from: 'IT-Support@password-secure-helpdesk.net',
    subject: 'Dringend! Ihr Konto wird gesperrt',
    body: 'Guten Tag,<br><br>Ihr Konto zeigt verdächtige Aktivitäten. Bitte klicken Sie <a href="#" title="HackerLink!" onclick="faultyLink()">hier</a> und geben Sie Ihr Passwort zur sofortigen Verifikation ein.<br><br>Andernfalls wird Ihr Konto in 24 Stunden gesperrt.<br><br>IT-Support Password Secure Gmbh',
    isPhishing: true,
    hint: 'Falsche Domain (password-secure-helpdesk.net statt password-secure.ch), künstlicher Zeitdruck und Passwort-Abfrage per Link — klassische Phishing-Merkmale.'
  },
  {
    from: 'newsletter@password-secure-helpdesk.ch',
    subject: 'Monatlicher IT-Sicherheits-Newsletter — März 2026',
    body: 'Liebe Mitarbeitende,<br><br>Im heutigen Newsletter: Neue Passwort-Richtlinien ab April, Reminder für das Sicherheits-Update und ein Rückblick auf den IT-Tag vom 15. März.<br><br>Bei Fragen: it@password-secure.ch<br><br>Ihr IT-Team',
    isPhishing: false,
    hint: 'Legitime Absender-Domain, kein Druck, keine Passwort-Abfrage — diese Mail ist sicher.'
  },
  {
    from: 'ceo.mueller@password-secure-global.com',
    subject: 'Vertraulich — Dringende Überweisung benötigt',
    body: 'Hallo,<br><br>Ich bin gerade im Meeting und kann nicht telefonieren. Wir brauchen dringend eine Überweisung von 12 000 CHF an einen Geschäftspartner. Bitte erledige das diskret.<br><br>Danke, CEO Müller',
    isPhishing: true,
    hint: 'CEO-Fraud: Falsche Domain (password-secure-global.com), Geheimhaltungsaufforderung und ungewöhnliche finanzielle Bitte ohne offizielle Kanäle.'
  }
];

var l3idx = 0;

function renderL3(c) {
  l3idx = 0;
  state.l3correct = 0;
  c.innerHTML =
    '<div class="card">' +
      '<span class="badge badge-purple" style="margin-bottom:0.75rem">Level 3 — Die Falle</span>' +
      '<h2>Phishing erkennen</h2>' +
      '<p>Du erhältst 3 E-Mails. Entscheide jeweils: Legitim oder Phishing-Versuch?</p>' +
      '<div id="l3-content"></div>' +
    '</div>';
  renderL3Email();
}

function renderL3Email() {
  var email = phishingEmails[l3idx];
  var d = document.getElementById('l3-content');
  d.innerHTML =
    '<p class="muted" style="font-size:12px;margin-bottom:0.5rem">E-Mail ' + (l3idx + 1) + ' von 3</p>' +
    '<div class="email-mock">' +
      '<div class="email-header"><strong>Von:</strong> ' + email.from + '<br><strong>Betreff:</strong> ' + email.subject + '</div>' +
      '<div class="email-body">' + email.body + '</div>' +
    '</div>' +
    '<div class="gap-row">' +
      '<button class="btn btn-success" onclick="l3ans(true)">✓ Legitim</button>' +
      '<button class="btn btn-danger"  onclick="l3ans(false)">⚠ Phishing</button>' +
    '</div>' +
    '<div id="l3-fb"></div>';
}

function l3ans(guessLegit) {
  var email = phishingEmails[l3idx];
  var correct = (guessLegit === !email.isPhishing);
  if (correct) { addPoints(50); state.l3correct++; }
  var fb = document.getElementById('l3-fb');
  fb.innerHTML =
    '<div class="feedback-box ' + (correct ? 'feedback-correct' : 'feedback-wrong') + '">' +
    email.hint +
    '<div style="margin-top:10px"><button class="btn btn-primary" onclick="l3next()">Nächste E-Mail →</button></div>' +
    '</div>';
}

function l3next() {
  l3idx++;
  if (l3idx >= phishingEmails.length) {
    if (state.l3correct === 3) addBadge('🎣', 'Phishing-Profi');
    var d = document.getElementById('l3-content');
    d.innerHTML =
      '<div class="feedback-box feedback-correct">' +
      'Level abgeschlossen! Du hast ' + state.l3correct + ' von 3 E-Mails korrekt erkannt.' +
      '<div style="margin-top:10px"><button class="btn btn-primary" onclick="showMap()">Zurück zur Karte →</button></div>' +
      '</div>';
    markLevelDone(3);
    return;
  }
  renderL3Email();
}

function faultyLink() {
  var div = document.createElement('div');
  div.className = 'level-intro';
  div.innerHTML = `
    <div class="level-intro-content">    
      <div class="modal">
        <h1>🚨 ACHTUNG 🚨</h1>
        <p>Klicke nie auf Links ohne diese zu überprüfen</p>
        <button class="btn btn-sm" onclick="deletePopUp()">OK</button>
      <div>
    </div>
  `;
  div.id = 'popUp'
  document.body.appendChild(div);
}

function deletePopUp(){
  var div = document.getElementById('popUp');
  div.remove();
}

/* ============================================================
   LEVEL 4 — Geheimwaffe (Passwort-Manager)
   ============================================================ */
function renderL4(c) {
  c.innerHTML =
    '<div class="card">' +
      '<span class="badge badge-blue" style="margin-bottom:0.75rem">Level 4 — Geheimwaffe Passwort-Manager</span>' +
      '<h2>Das Schlüssel-Problem</h2>' +
      '<div class="alert alert-warning">' +
        'Der Angreifer hat dein Passwort bei einem anderen Dienst gefunden — weil es überall gleich war. Das nennt sich "Credential Stuffing".' +
      '</div>' +
      '<p>Stell dir vor, dein Hausschlüssel öffnet auch das Büro, das Auto und den Tresor. Verlierst du ihn, verlierst du alles.</p>' +
      '<p>Ein Passwort-Manager speichert für jeden Dienst ein eigenes, zufällig generiertes Passwort. Du musst dir nur noch <strong>ein</strong> Master-Passwort merken.</p>' +
    '</div>' +
    '<div class="card" id="l4-quiz">' +
      '<h3>Quiz — Wähle die sicherste Strategie</h3>' +
      '<p class="muted">Max hat 10 Online-Konten. Was ist die beste Lösung?</p>' +
      '<button class="opt-btn" onclick="l4ans(this,false)">Überall dasselbe Passwort, aber ein sehr starkes</button>' +
      '<button class="opt-btn" onclick="l4ans(this,false)">10 verschiedene Passwörter in einer Excel-Datei notieren</button>' +
      '<button class="opt-btn" onclick="l4ans(this,true)">Einen Passwort-Manager mit 10 einzigartigen, zufälligen Passwörtern verwenden</button>' +
      '<button class="opt-btn" onclick="l4ans(this,false)">Das Passwort nach jedem Login löschen und neu erstellen</button>' +
    '</div>';
}

function l4ans(btn, correct) {
  disableOpts('#l4-quiz');
  btn.classList.add(correct ? 'correct' : 'wrong');
  var msg;
  if (correct) {
    msg = 'Perfekt! Ein Passwort-Manager erzeugt und speichert komplexe, einzigartige Passwörter für jeden Dienst — sicher verschlüsselt hinter einem einzigen Master-Passwort.';
    addPoints(100); addBadge('🗝️', 'Schlüsselmeister');
  } else if (btn.textContent.includes('Excel')) {
    msg = 'Excel-Dateien sind unverschlüsselt und leicht zugänglich — kein sicherer Speicherort für Passwörter.';
  } else if (btn.textContent.includes('dasselbe')) {
    msg = 'Credential Stuffing: Ein einziges kompromittiertes Konto öffnet damit alle anderen Dienste.';
  } else {
    msg = 'Das wäre extrem unpraktisch und führt schnell zu schwächeren Passwörtern.';
  }
  document.getElementById('l4-quiz').appendChild(makeFeedback(correct, msg, true));
  markLevelDone(4);
}

/* ============================================================
   LEVEL 5 — Boss-Kampf
   ============================================================ */
var bossQuestions = [
  {
    q: 'Was bedeutet "Credential Stuffing"?',
    opts: ['Zu viele Anmeldungen in kurzer Zeit', 'Gestohlene Login-Daten werden auf anderen Diensten ausprobiert', 'Ein sehr langes Passwort eingeben', 'Ein Passwort mit Leerzeichen'],
    a: 1,
    exp: 'Bei Credential Stuffing nutzen Angreifer geleakte Passwörter von Dienst A, um sich bei Dienst B einzuloggen — deshalb braucht jeder Dienst ein eigenes Passwort.'
  },
  {
    q: 'Welches Passwort wäre am schwersten zu knacken?',
    opts: ['Passwort123!', 'MeinGeburtstag1990', 'r#K9@xL2!mP4', 'Admin2024'],
    a: 2,
    exp: 'r#K9@xL2!mP4 hat keine erkennbaren Muster, Wörter oder persönliche Daten und kombiniert alle Zeichentypen.'
  },
  {
    q: 'Ein Kollege schickt dir einen Link und bittet dich, dein Passwort einzugeben. Was tust du?',
    opts: ['Sofort eingeben, der Kollege ist vertrauenswürdig', 'Den Link öffnen, aber nur das alte Passwort eingeben', 'Den Kollegen telefonisch fragen, ob er den Link wirklich geschickt hat', 'Das Passwort eingeben, dann schnell ändern'],
    a: 2,
    exp: 'Konten können kompromittiert sein. Immer den Absender über einen anderen Kanal bestätigen, bevor Zugangsdaten eingegeben werden.'
  },
  {
    q: 'Was ist Zwei-Faktor-Authentifizierung (2FA)?',
    opts: ['Zwei verschiedene Passwörter nacheinander eingeben', 'Ein zweiter Bestätigungsschritt zusätzlich zum Passwort (z.B. SMS-Code)', 'Ein Passwort mit mindestens zwei Sonderzeichen', 'Den Account auf zwei Geräten einloggen'],
    a: 1,
    exp: '2FA ist wie ein zweites Schloss: Selbst wenn jemand dein Passwort kennt, braucht er noch deinen zweiten Faktor (z.B. dein Smartphone).'
  },
  {
    q: 'Wie oft sollte ein Passwort idealerweise geändert werden?',
    opts: ['Täglich', 'Monatlich', 'Nur wenn es kompromittiert wurde oder du Verdacht hegst', 'Nie, gute Passwörter halten ewig'],
    a: 2,
    exp: 'Moderne Empfehlungen (NIST, BSI): Passwörter nur bei konkretem Verdacht einer Kompromittierung ändern — häufige Änderungen führen oft zu schwächeren Passwörtern.'
  }
];

var l5idx = 0, l5timer = null, l5start = 0;

function renderL5(c) {
  l5idx = 0; state.l5score = 0; l5start = Date.now();
  c.innerHTML =
    '<div class="card">' +
      '<span class="badge badge-dark" style="margin-bottom:0.75rem">Level 5 — Boss-Kampf</span>' +
      '<h2>Abschluss-Quiz</h2>' +
      '<p>5 Fragen aus allen Bereichen. Du hast jeweils 30 Sekunden pro Frage.</p>' +
      '<div id="l5-content"></div>' +
    '</div>';
  state.l5health = 3;
  updateHealthbar();
  renderL5Q();
}

function renderL5Q() {
  if (l5idx >= bossQuestions.length) { endL5(); return; }
  var q = bossQuestions[l5idx];
  var d = document.getElementById('l5-content');
  d.innerHTML =
    '<p class="muted" style="font-size:12px;margin-bottom:0.5rem">Frage ' + (l5idx + 1) + ' von ' + bossQuestions.length + '</p>' +
    '<div class="timer-bar-wrap"><div class="timer-bar-fill" id="l5-tbar" style="width:100%"></div></div>' +
    '<div class="timer-label" id="l5-timer">30s</div>' +
    '<h3 style="margin-bottom:1rem">' + q.q + '</h3>';
  q.opts.forEach(function(opt, i) {
    d.innerHTML += '<button class="opt-btn" onclick="l5ans(' + i + ')">' + opt + '</button>';
  });
  d.innerHTML += '<div id="l5-fb"></div>';

  var secs = 30;
  if (l5timer) clearInterval(l5timer);
  l5timer = setInterval(function() {
    secs--;
    var el  = document.getElementById('l5-timer');
    var bar = document.getElementById('l5-tbar');
    if (!el) { clearInterval(l5timer); return; }
    el.textContent = secs + 's';
    bar.style.width = (secs / 30 * 100) + '%';
    if (secs <= 10) bar.style.background = '#e24b4a';
    if (secs <= 0) { clearInterval(l5timer); l5ans(-1); }
  }, 1000);
}

function l5ans(chosen) {
  clearInterval(l5timer);
  var q = bossQuestions[l5idx];
  disableOpts('#l5-content');
  var correct = (chosen === q.a);
  if (correct) { addPoints(40); state.l5score++; }
  var btns = document.querySelectorAll('#l5-content .opt-btn');
  if (btns[q.a]) btns[q.a].classList.add('correct');
  if (chosen >= 0 && !correct && btns[chosen]) btns[chosen].classList.add('wrong');
  var fb = document.getElementById('l5-fb');

if (!correct) {
  state.l5health--;
  updateHealthbar();

  if (state.l5health <= 0) {
    fb.innerHTML =
      '<div class="feedback-box feedback-wrong">' +
      'Zu viele Fehler! Du wirst zur Karte zurückgeschickt.' +
      '</div>';

    setTimeout(function () {  
      showMap();
    }, 1500);
    return;
  }
}

var userAnswer = chosen >= 0 ? q.opts[chosen] : "Zeit abgelaufen";

fb.innerHTML =
  '<div class="feedback-box ' + (correct ? 'feedback-correct' : 'feedback-wrong') + '">' +
  (correct
    ? "Richtig!"
    : showWrongAnswer(userAnswer)
  ) +
  '<div style="margin-top:10px"><button class="btn btn-primary" onclick="l5next()">Weiter →</button></div>' +
  '</div>';
}

function l5next() { l5idx++; renderL5Q(); }

function endL5() {
  var elapsed = Math.round((Date.now() - l5start) / 1000);
  if (elapsed < 240) addBadge('⚡', 'Blitzdenker');
  addBadge('🛡️', 'Shield Commander');
  markLevelDone(5);
  document.getElementById('l5-content').innerHTML =
    '<div class="feedback-box feedback-correct">' +
    'Boss-Kampf abgeschlossen! ' + state.l5score + ' von 5 Fragen richtig. Zeit: ' + elapsed + ' Sekunden.' +
    '<div style="margin-top:10px"><button class="btn btn-primary" onclick="showEnd()">Ergebnisse anzeigen →</button></div>' +
    '</div>';
}

/* ============================================================
   END SCREEN
   ============================================================ */
function showEnd() {
  setText('end-pts',    state.points);
  setText('end-rank',   getRank(state.points).split(' ')[0]);
  setText('end-badges', state.badges.length);

  var bl = document.getElementById('end-badge-list');
  bl.innerHTML = '';
  state.badges.forEach(function(b) {
    var span = document.createElement('span');
    span.className = 'badge-pill';
    span.textContent = b.emoji + ' ' + b.name;
    bl.appendChild(span);
  });
  if (state.badges.length === 0) bl.innerHTML = '<span class="muted">Keine Badges erhalten.</span>';

  var fb = document.getElementById('end-feedback');
  var tips = '';
  if (!state.badges.find(function(b) { return b.name === 'Phishing-Profi'; }))
    tips += '<p class="muted" style="font-size:14px">• Phishing-E-Mails: Absender-Domain immer prüfen, misstrauisch bei Zeitdruck und Passwort-Abfragen.</p>';
  if (!state.badges.find(function(b) { return b.name === 'Passwort-Wissenschaftler'; }))
    tips += '<p class="muted" style="font-size:14px">• Passwort-Stärke: 12+ Zeichen mit Gross-/Kleinbuchstaben, Zahlen und Sonderzeichen — kein Wörterbuch.</p>';
  if (!state.badges.find(function(b) { return b.name === 'Schlüsselmeister'; }))
    tips += '<p class="muted" style="font-size:14px">• Passwort-Manager: Für jeden Dienst ein einzigartiges Passwort — sicher und bequem.</p>';
  if (tips === '')
    tips = '<p style="font-size:14px;color:var(--green-text)">Hervorragend! Du hast alle Kernkompetenzen gemeistert.</p>';
  fb.innerHTML = tips;

  showScreen('end');
}

/* ============================================================
   HELPERS
   ============================================================ */
function disableOpts(selector) {
  document.querySelectorAll(selector + ' .opt-btn').forEach(function(b) { b.disabled = true; });
}

function makeFeedback(correct, msg, withNav) {
  var div = document.createElement('div');
  div.className = 'feedback-box ' + (correct ? 'feedback-correct' : 'feedback-wrong');
  div.textContent = msg;
  if (withNav) {
    var btn = document.createElement('div');
    btn.style.marginTop = '10px';
    btn.innerHTML = '<button class="btn btn-primary" onclick="showMap()">Zurück zur Karte →</button>';
    div.appendChild(btn);
  }
  return div;
}

function markLevelDone(id) {
  if (!state.levelsDone.includes(id)) {
    state.levelsDone.push(id);
    state.levelScores[id] = state.points;
  }
  updateHUD();
}

/* ---------- BOOT ---------- */
showScreen('intro');

function showLevelIntro(title, sub, icon) {
  var div = document.createElement('div');
  div.className = 'level-intro';
  div.innerHTML = `
    <div class="level-intro-content">
      <h1>${icon} ${title}</h1>
      <p>${sub}</p>
    </div>
  `;
  document.body.appendChild(div);

  setTimeout(function () {
    div.remove();
  }, 1500);
}

function showWrongAnswer(userAnswer) {
  return `Leider falsch, ${userAnswer} ist hier nicht der Fehler.`;
}

function updateHealthbar() {
  var el = document.getElementById('healthbar');
  if (!el) return;
  el.innerHTML = '❤️'.repeat(state.l5health || 0);
}