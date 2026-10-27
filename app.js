/* Creative Technology Academy — Business Launch Dashboard
   Vanilla JS, no backend. All data lives in localStorage in this browser. */
(function () {
  'use strict';

  var SEED = window.CTA_SEED;
  var STORAGE_KEY = 'cta-launch-dashboard';
  var DATA_VERSION = 1;
  var STATUSES = ['Not Started', 'In Progress', 'Waiting', 'Blocked', 'Complete'];
  var PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
  var PRI_RANK = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  var VERIF = ['Verify Current Requirements', 'Verified Current', 'User Confirmed', 'Planning Assumption', 'Internal Task'];
  var RES_VERIF = ['Verify Current Requirements', 'Verified Current', 'User-provided', 'Planning Assumption'];
  var CAT_LIST = Object.keys(SEED.categories).map(function (k) { return SEED.categories[k]; });
  var PHASE_KEYS = Object.keys(SEED.phases);

  /* ===================== Utilities ===================== */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function thisMonth() { return today().slice(0, 7); }
  function nowIso() { return new Date().toISOString(); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function hasNum(v) { return v !== '' && v != null && isFinite(parseFloat(v)); }
  function money(n) { if (n == null || !isFinite(n)) return '—'; var s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); return (n < 0 ? '−$' : '$') + s; }
  function pct(n) { return (n == null || !isFinite(n)) ? '—' : (Math.round(n * 1000) / 10) + '%'; }
  function fmtDate(s) { if (!s) return '—'; var d = new Date(s.length === 10 ? s + 'T00:00:00' : s); return isNaN(d) ? esc(s) : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }
  function fmtDateTime(s) { if (!s) return '—'; var d = new Date(s); return isNaN(d) ? '—' : d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }); }
  function validDate(s) { return !s || (/^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00:00'))); }
  function validUrl(s) { return !s || /^https?:\/\/[^\s]+\.[^\s]+/i.test(s); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, ''); }
  function getPath(o, path) { return path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function setPath(o, path, val) { var ks = path.split('.'); var last = ks.pop(); var t = ks.reduce(function (a, k) { return a[k]; }, o); t[last] = val; }

  /* ===================== State ===================== */
  function seedTask(t, i) {
    return {
      id: t.id, phase: t.id.split('-')[0], order: i, title: t.title, instructions: t.instructions || '', category: t.category,
      priority: t.priority, status: 'Not Started', required: !!t.required, effort: t.effort, actualTime: '', target: '', completedDate: '',
      deps: (t.deps || []).slice(), notes: t.notes || '', resource: t.resource || '', verification: t.verification, verifiedDate: '', verifiedSource: '',
      evidenceVerified: false, criteria: t.criteria || '', gate: t.gate || null, milestone: !!t.milestone, seed: true, depOverride: null, overrides: [], history: []
    };
  }
  function defaultPricing() {
    return {
      scenario: 'mod', selected: 0,
      models: [
        { name: 'Individual lessons', unit: 'per lesson', pricePerSession: 60, sessions: 4, sessionHours: 1, prepPerSession: 0.5, classSize: 1, materials: 0, operating: 50, cons: 2, mod: 4, opt: 6 },
        { name: 'Small-group instruction', unit: 'per student per session', pricePerSession: 30, sessions: 4, sessionHours: 1.5, prepPerSession: 1, classSize: 6, materials: 5, operating: 75, cons: 4, mod: 8, opt: 12 },
        { name: 'Multi-week course', unit: 'per student per session', pricePerSession: 25, sessions: 8, sessionHours: 1.5, prepPerSession: 1, classSize: 8, materials: 10, operating: 75, cons: 4, mod: 8, opt: 14 },
        { name: 'Monthly educational program', unit: 'per student per session', pricePerSession: 35, sessions: 4, sessionHours: 2, prepPerSession: 1, classSize: 8, materials: 10, operating: 100, cons: 4, mod: 8, opt: 16 },
        { name: 'Online instruction', unit: 'per student per session', pricePerSession: 25, sessions: 4, sessionHours: 1, prepPerSession: 0.5, classSize: 8, materials: 0, operating: 30, cons: 3, mod: 8, opt: 15 }
      ]
    };
  }
  function defaultState() {
    var t = nowIso();
    return {
      app: 'cta-launch-dashboard', version: DATA_VERSION, seedVersion: SEED.version, created: t, lastUpdated: t,
      settings: { businessName: 'Creative Technology Academy', ownerName: '', depMode: 'flexible', guideSeen: false },
      tasks: SEED.tasks.map(seedTask), deletedSeedIds: [],
      courses: clone(SEED.courses), lessonTemplates: clone(SEED.lessonTemplates),
      finance: { startupBudget: '', startupExpenses: '', revenueTarget: '', actualRevenue: '', opExpenses: '', students: '', activeCourses: '' },
      ledger: [], pricing: defaultPricing(), comms: [],
      apps: [{ id: uid(), org: 'Heartland Charter School', appDate: '', status: 'Researching', ref: '', docs: '', outstanding: '', lastContact: '', nextFollowUp: '', approvalDate: '', notes: 'Application not yet submitted.' }],
      docs: [], resources: SEED.resources.map(function (r) { return Object.assign({ id: uid() }, r); }),
      funnel: [], projectNotes: ''
    };
  }

  function validateState(d) {
    if (!d || typeof d !== 'object' || Array.isArray(d)) return 'The file does not contain a dashboard data object.';
    if (typeof d.version !== 'number') return 'Missing data version number — this does not look like a dashboard backup.';
    if (d.version > DATA_VERSION) return 'This backup was made by a newer version of the dashboard (data version ' + d.version + ').';
    if (!Array.isArray(d.tasks)) return 'Missing task list.';
    for (var i = 0; i < d.tasks.length; i++) {
      var t = d.tasks[i];
      if (!t || typeof t.id !== 'string' || typeof t.title !== 'string') return 'Task #' + (i + 1) + ' is missing an id or title.';
      if (t.status && STATUSES.indexOf(t.status) < 0) return 'Task ' + t.id + ' has an unknown status "' + t.status + '".';
    }
    var arrays = ['courses', 'ledger', 'comms', 'apps', 'docs', 'resources', 'funnel'];
    for (var j = 0; j < arrays.length; j++) { if (d[arrays[j]] != null && !Array.isArray(d[arrays[j]])) return '"' + arrays[j] + '" must be a list.'; }
    return null;
  }

  function migrate(d) {
    var def = defaultState();
    Object.keys(def).forEach(function (k) { if (d[k] == null) d[k] = def[k]; });
    d.settings = Object.assign({}, def.settings, d.settings);
    d.finance = Object.assign({}, def.finance, d.finance);
    if (!d.pricing || !Array.isArray(d.pricing.models)) d.pricing = def.pricing;
    var blank = seedTask({ id: 'X-0', title: '', category: CAT_LIST[0], priority: 'Medium', verification: 'Internal Task' }, 0);
    var seedById = {}; SEED.tasks.forEach(function (t, i) { seedById[t.id] = { t: t, i: i }; });
    d.tasks.forEach(function (t, i) {
      Object.keys(blank).forEach(function (k) { if (t[k] === undefined) t[k] = clone(blank[k]); });
      if (!t.phase) t.phase = t.id.split('-')[0];
      if (seedById[t.id]) { t.order = seedById[t.id].i; if (!t.gate && seedById[t.id].t.gate) t.gate = seedById[t.id].t.gate; }
      else if (typeof t.order !== 'number') t.order = 1000 + i;
      if (!Array.isArray(t.deps)) t.deps = [];
    });
    // Add seed tasks introduced by newer versions without touching existing progress.
    var have = {}; d.tasks.forEach(function (t) { have[t.id] = true; });
    SEED.tasks.forEach(function (t, i) { if (!have[t.id] && d.deletedSeedIds.indexOf(t.id) < 0) d.tasks.push(seedTask(t, i)); });
    d.version = DATA_VERSION; d.seedVersion = SEED.version;
    return d;
  }

  var storageOK = true, startupNotice = null, state;
  (function load() {
    var raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { storageOK = false; }
    if (!storageOK) { state = defaultState(); startupNotice = 'Browser storage is unavailable (private mode or blocked site data). Changes will NOT be saved after you close this page — use Settings & Backup → Export to keep your work.'; return; }
    if (!raw) { state = defaultState(); return; }
    try {
      var parsed = JSON.parse(raw); var err = validateState(parsed); if (err) throw new Error(err);
      state = migrate(parsed);
    } catch (e) {
      var key = STORAGE_KEY + '-unreadable-' + Date.now();
      try { localStorage.setItem(key, raw); } catch (_) { }
      state = defaultState();
      startupNotice = 'Saved data could not be read (' + e.message + '). The unreadable copy was kept under "' + key + '" and the dashboard started fresh. Restore a JSON backup in Settings & Backup if you have one.';
    }
  })();

  var saveTimer = null;
  function save() {
    state.lastUpdated = nowIso();
    var ind = $('#saveIndicator');
    ind.className = 'save-indicator saving'; ind.textContent = 'Saving…';
    var ok = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { ok = false; }
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      if (ok) { ind.className = 'save-indicator'; ind.textContent = 'Saved locally · ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
      else { ind.className = 'save-indicator error'; ind.textContent = 'Not saved — export a backup'; }
    }, 250);
    $('#lastUpdated').textContent = fmtDateTime(state.lastUpdated);
    return ok;
  }

  /* ===================== Task logic ===================== */
  function taskMap() { var m = {}; state.tasks.forEach(function (t) { m[t.id] = t; }); return m; }
  function getTask(id) { for (var i = 0; i < state.tasks.length; i++) if (state.tasks[i].id === id) return state.tasks[i]; return null; }
  function isDone(t) { return t.status === 'Complete'; }
  function incompleteDeps(t, m) { m = m || taskMap(); return t.deps.map(function (id) { return m[id]; }).filter(function (d) { return d && !isDone(d); }); }
  function strictMode() { return state.settings.depMode === 'strict'; }
  function depsPending(t, m) { return !isDone(t) && !t.depOverride && incompleteDeps(t, m).length > 0; }
  function depBlocked(t, m) { return strictMode() && depsPending(t, m); }
  function isReady(t, m) { return !isDone(t) && t.status !== 'Waiting' && t.status !== 'Blocked' && !depsPending(t, m); }
  function depthMap() {
    var m = taskMap(), memo = {};
    function d(id, seen) { if (memo[id] != null) return memo[id]; var t = m[id]; if (!t || seen[id]) return 0; seen[id] = true; var v = t.deps.reduce(function (mx, x) { return Math.max(mx, 1 + d(x, seen)); }, 0); seen[id] = false; memo[id] = v; return v; }
    state.tasks.forEach(function (t) { d(t.id, {}); }); return memo;
  }
  function sortRecommended(list) {
    var m = taskMap(), dm = depthMap();
    return list.sort(function (a, b) {
      return (isDone(a) - isDone(b)) || ((isReady(b, m) ? 1 : 0) - (isReady(a, m) ? 1 : 0)) || (b.required - a.required) || (dm[a.id] - dm[b.id]) || (PRI_RANK[a.priority] - PRI_RANK[b.priority]) || sortDefault(a, b);
    });
  }
  function isBlocked(t, m) { return !isDone(t) && (t.status === 'Blocked' || depBlocked(t, m)); }
  function isOverdue(t) { return !isDone(t) && t.target && t.target < today(); }
  function unblocksCount(id) { return state.tasks.filter(function (t) { return !isDone(t) && t.deps.indexOf(id) >= 0; }).length; }
  function hist(t, msg) { t.history.push({ at: nowIso(), msg: msg }); if (t.history.length > 50) t.history.shift(); }
  function sortDefault(a, b) { return PHASE_KEYS.indexOf(a.phase) - PHASE_KEYS.indexOf(b.phase) || a.order - b.order; }

  function stats() {
    var m = taskMap(), req = state.tasks.filter(function (t) { return t.required; });
    var done = req.filter(isDone).length;
    var open = state.tasks.filter(function (t) { return !isDone(t); });
    return {
      total: req.length, done: done, remaining: req.length - done, pct: req.length ? done / req.length : 0,
      optDone: state.tasks.filter(function (t) { return !t.required && isDone(t); }).length,
      optTotal: state.tasks.filter(function (t) { return !t.required; }).length,
      blocked: open.filter(function (t) { return isBlocked(t, m); }).length,
      overdue: open.filter(isOverdue).length,
      inProgress: open.filter(function (t) { return t.status === 'In Progress'; }).length,
      waiting: open.filter(function (t) { return t.status === 'Waiting'; }).length,
      ready: open.filter(function (t) { return isReady(t, m); }).length
    };
  }
  function groupProgress(filterFn) {
    var list = state.tasks.filter(function (t) { return t.required && filterFn(t); });
    var d = list.filter(isDone).length;
    return { done: d, total: list.length, pct: list.length ? d / list.length : 0 };
  }

  function nextActions(n) {
    var m = taskMap(), t0 = today();
    var cand = state.tasks.filter(function (t) { return !isDone(t) && t.status !== 'Waiting' && t.status !== 'Blocked' && !depBlocked(t, m); });
    var unb = {}, rdy = {}; cand.forEach(function (t) { unb[t.id] = unblocksCount(t.id); rdy[t.id] = isReady(t, m) ? 1 : 0; });
    cand.sort(function (a, b) {
      return (b.required - a.required) || (rdy[b.id] - rdy[a.id]) || (PRI_RANK[a.priority] - PRI_RANK[b.priority]) ||
        ((isOverdue(b) ? 1 : 0) - (isOverdue(a) ? 1 : 0)) || (unb[b.id] - unb[a.id]) ||
        ((a.target || '9999') < (b.target || '9999') ? -1 : (a.target || '9999') > (b.target || '9999') ? 1 : 0) ||
        (a.status === 'In Progress' ? -1 : 0) - (b.status === 'In Progress' ? -1 : 0) || sortDefault(a, b);
    });
    return cand.slice(0, n).map(function (t) {
      var why = [t.priority + ' priority'];
      if (unb[t.id]) why.push('unblocks ' + unb[t.id] + ' task' + (unb[t.id] > 1 ? 's' : ''));
      if (isOverdue(t)) why.push('overdue since ' + fmtDate(t.target)); else if (t.target) why.push('due ' + fmtDate(t.target));
      if (t.status === 'In Progress') why.push('already in progress');
      if (!t.required) why.push('optional');
      if (!rdy[t.id]) why.push('suggested prerequisites not done yet');
      return { t: t, why: why.join(' · ') };
    });
  }

  /* ===================== Badges ===================== */
  function priBadge(p) { return '<span class="badge b-' + slug(p) + '">' + esc(p) + '</span>'; }
  function statusBadge(s) { var c = { 'Complete': 'complete', 'In Progress': 'progress', 'Waiting': 'waiting', 'Blocked': 'blocked', 'Not Started': 'notstarted' }[s] || 'notstarted'; return '<span class="badge b-' + c + '">' + esc(s) + '</span>'; }
  function verBadge(v) {
    var c = { 'Verify Current Requirements': 'verify', 'Verified Current': 'verified', 'User Confirmed': 'user', 'User-provided': 'user', 'Planning Assumption': 'assume', 'Internal Task': 'internal' }[v] || 'internal';
    var label = v === 'Verify Current Requirements' ? '⚠ Verify Current Requirements' : v === 'Verified Current' ? '✓ Verified Current' : v;
    return '<span class="badge b-' + c + '" title="Evidence label">' + esc(label) + '</span>';
  }
  function legendHtml() {
    return '<div class="legend" aria-label="Evidence labels">' + verBadge('Verified Current') + verBadge('Verify Current Requirements') + verBadge('User Confirmed') + verBadge('Planning Assumption') + verBadge('Internal Task') + '</div>';
  }

  /* ===================== Modal system ===================== */
  var modal = $('#modal'), modalButtons = [], modalOnClose = null;
  function openModal(o) {
    $('#modalTitle').textContent = o.title;
    $('#modalBody').innerHTML = o.body;
    modalButtons = o.buttons || [{ label: 'Close' }];
    modalOnClose = o.onClose || null;
    $('#modalFoot').innerHTML = modalButtons.map(function (b, i) {
      return '<button type="button" class="btn ' + (b.cls || (b.primary ? 'btn-primary' : '')) + '" data-mbtn="' + i + '">' + esc(b.label) + '</button>';
    }).join('');
    if (!modal.open) modal.showModal();
    if (o.onOpen) o.onOpen($('#modalBody'));
    var first = $('#modalBody input:not([type=checkbox]), #modalBody textarea, #modalBody select');
    if (first && o.autofocus !== false) first.focus(); else { var pb = $('#modalFoot .btn-primary') || $('#modalFoot .btn'); if (pb) pb.focus(); }
  }
  function closeModal() { modalOnClose = null; if (modal.open) modal.close(); }
  modal.addEventListener('close', function () { if (!modal.open && modalOnClose) { var f = modalOnClose; modalOnClose = null; f(); } });
  $('#modalClose').addEventListener('click', function () { var f = modalOnClose; closeModal(); if (f) f(); });
  $('#modalFoot').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mbtn]'); if (!b) return;
    var def = modalButtons[+b.dataset.mbtn];
    if (def.handler && def.handler($('#modalBody')) === false) return;
    var after = def.after; closeModal(); if (after) after();
  });
  $('#modalForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target && document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;
    var i = modalButtons.findIndex(function (b) { return b.primary; }); if (i >= 0) $('#modalFoot [data-mbtn="' + i + '"]').click();
  });

  function fieldError(body, name, msg) {
    var f = body.querySelector('[name="' + name + '"]'); if (!f) return;
    var wrap = f.closest('.field'); if (!wrap) return;
    wrap.classList.add('invalid');
    var e = document.createElement('div'); e.className = 'error'; e.textContent = msg; wrap.appendChild(e);
  }
  function clearErrors(body) { $$('.field.invalid', body).forEach(function (f) { f.classList.remove('invalid'); }); $$('.field .error', body).forEach(function (e) { e.remove(); }); }

  function confirmDialog(o) {
    return new Promise(function (resolve) {
      var body = '<p>' + o.message + '</p>';
      if (o.requireReason) body += '<div class="field"><label for="cdReason">' + esc(o.reasonLabel || 'Reason (recorded with the task)') + '</label><textarea id="cdReason" name="reason" rows="3"></textarea></div>';
      if (o.requireText) body += '<div class="field"><label for="cdText">Type <strong>' + esc(o.requireText) + '</strong> to confirm</label><input type="text" id="cdText" name="typed" autocomplete="off"></div>';
      openModal({
        title: o.title, body: body, autofocus: !!(o.requireReason || o.requireText),
        buttons: [
          { label: 'Cancel', handler: function () { resolve({ ok: false }); } },
          { label: o.confirmLabel || 'Confirm', cls: o.danger ? 'btn-danger-solid' : 'btn-primary', primary: true, handler: function (b) {
            clearErrors(b);
            var reason = o.requireReason ? $('[name=reason]', b).value.trim() : '';
            if (o.requireReason && !reason) { fieldError(b, 'reason', 'Please enter a reason.'); return false; }
            if (o.requireText && $('[name=typed]', b).value.trim() !== o.requireText) { fieldError(b, 'typed', 'Type ' + o.requireText + ' exactly.'); return false; }
            resolve({ ok: true, reason: reason });
          } }
        ],
        onClose: function () { resolve({ ok: false }); }
      });
    });
  }

  function gateDialog(t) {
    return new Promise(function (resolve) {
      var body = '<div class="note warn">This milestone can only be marked complete with real evidence. Opening a link, sending an inquiry, or a student expressing interest does not count.</div>' +
        t.gate.map(function (g, i) { return '<label class="check-row"><input type="checkbox" name="g' + i + '"> <span>' + esc(g) + '</span></label>'; }).join('') +
        '<div class="field"><label for="gEvidence">Evidence (what proves this?)</label><textarea id="gEvidence" name="evidence" rows="3" placeholder="e.g., Approval email from vendor department dated …"></textarea><div class="hint">Saved to the task notes and history. Do not paste sensitive personal information.</div></div><div id="gateErr" class="error" role="alert"></div>';
      openModal({
        title: 'Confirm completion — ' + t.id, body: body,
        buttons: [
          { label: 'Cancel', handler: function () { resolve({ ok: false }); } },
          { label: 'Confirm completion', primary: true, handler: function (b) {
            clearErrors(b);
            var all = t.gate.every(function (_, i) { return $('[name=g' + i + ']', b).checked; });
            var ev = $('[name=evidence]', b).value.trim();
            $('#gateErr', b).textContent = all ? '' : 'Every statement must be true and checked.';
            if (!ev) fieldError(b, 'evidence', 'Describe the evidence.');
            if (!all || !ev) return false;
            resolve({ ok: true, evidence: ev });
          } }
        ],
        onClose: function () { resolve({ ok: false }); }
      });
    });
  }

  function toast(msg) {
    var el = $('#toast'); el.textContent = msg; el.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(function () { el.hidden = true; }, 2600);
  }

  /* ===================== Task actions ===================== */
  function completeTask(id) {
    var t = getTask(id); if (!t || isDone(t)) return Promise.resolve(false);
    var inc = incompleteDeps(t);
    var override = null;
    var p = Promise.resolve({ ok: true });
    if (inc.length && !t.depOverride && !strictMode()) {
      p = Promise.resolve({ ok: true, early: inc.map(function (d) { return d.id; }) });
    } else if (inc.length && !t.depOverride) {
      p = confirmDialog({
        title: 'Prerequisites are not complete',
        message: '<strong>' + esc(t.id + ' — ' + t.title) + '</strong> depends on tasks that are not complete:</p><ul>' + inc.map(function (d) { return '<li>' + esc(d.id + ' — ' + d.title) + '</li>'; }).join('') + '</ul><p>You can override the dependency. The override and your reason will be recorded on the task.',
        confirmLabel: 'Override and continue', requireReason: true
      }).then(function (r) { if (r.ok) override = { at: nowIso(), deps: inc.map(function (d) { return d.id; }), reason: r.reason }; return r; });
    }
    var early = null;
    return p.then(function (r) {
      if (!r.ok) return { ok: false };
      if (r.early) early = r.early;
      if (t.gate && t.gate.length) return gateDialog(t);
      return { ok: true };
    }).then(function (g) {
      if (!g.ok) { render(); return false; }
      if (override) { t.depOverride = override; t.overrides.push(override); hist(t, 'Dependency override (' + override.deps.join(', ') + '): ' + override.reason); }
      if (early) hist(t, 'Completed before suggested prerequisites: ' + early.join(', '));
      t.status = 'Complete'; t.completedDate = today();
      hist(t, 'Marked complete' + (g.evidence ? ' — evidence: ' + g.evidence : ''));
      if (g.evidence) t.notes = (t.notes ? t.notes + '\n' : '') + '[' + today() + '] Completion evidence: ' + g.evidence;
      save(); render(); toast(t.id + ' marked complete');
      return true;
    });
  }
  function reopenTask(id, status) {
    var t = getTask(id); if (!t) return;
    t.status = status || 'In Progress'; t.completedDate = '';
    hist(t, 'Reopened (status: ' + t.status + ')');
    save(); render(); toast(t.id + ' reopened');
  }
  function setStatus(id, val) {
    var t = getTask(id); if (!t || t.status === val) return;
    if (val === 'Complete') { completeTask(id); return; }
    if (isDone(t)) { reopenTask(id, val); return; }
    t.status = val; hist(t, 'Status → ' + val); save(); render();
  }
  function overrideDeps(id) {
    var t = getTask(id); var inc = incompleteDeps(t);
    confirmDialog({ title: 'Override dependencies for ' + t.id, message: 'This lets you treat <strong>' + esc(t.title) + '</strong> as actionable even though ' + inc.map(function (d) { return esc(d.id); }).join(', ') + ' ' + (inc.length > 1 ? 'are' : 'is') + ' not complete. The override will be recorded.', confirmLabel: 'Record override', requireReason: true })
      .then(function (r) {
        if (!r.ok) return;
        var o = { at: nowIso(), deps: inc.map(function (d) { return d.id; }), reason: r.reason };
        t.depOverride = o; t.overrides.push(o); hist(t, 'Dependency override (' + o.deps.join(', ') + '): ' + r.reason); save(); render();
      });
  }
  function removeOverride(id) { var t = getTask(id); t.depOverride = null; hist(t, 'Dependency override removed'); save(); render(); }
  function deleteTask(id) {
    var t = getTask(id); var users = state.tasks.filter(function (x) { return x.deps.indexOf(id) >= 0; });
    confirmDialog({ title: 'Delete task ' + id + '?', message: 'Delete <strong>' + esc(t.title) + '</strong>? Its notes and history will be lost.' + (users.length ? ' It will also be removed as a prerequisite from ' + users.length + ' other task(s).' : '') + ' This cannot be undone (unless you restore a backup).', confirmLabel: 'Delete task', danger: true })
      .then(function (r) {
        if (!r.ok) return;
        state.tasks = state.tasks.filter(function (x) { return x.id !== id; });
        users.forEach(function (u) { u.deps = u.deps.filter(function (d) { return d !== id; }); });
        if (t.seed) state.deletedSeedIds.push(id);
        save(); render(); toast('Task deleted');
      });
  }

  function hasCycle(id, deps) {
    var m = taskMap(); var seen = {};
    function visit(x) { if (x === id) return true; if (seen[x]) return false; seen[x] = true; var t = m[x]; return t ? t.deps.some(visit) : false; }
    return deps.some(visit);
  }

  function opts(list, sel) { return list.map(function (v) { return '<option' + (v === sel ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join(''); }
  function optsKV(list, sel) { return list.map(function (kv) { return '<option value="' + esc(kv[0]) + '"' + (kv[0] === sel ? ' selected' : '') + '>' + esc(kv[1]) + '</option>'; }).join(''); }

  function editTask(id) {
    var isNew = !id;
    var t = isNew ? { id: '', phase: (ui.filters.phase || 'P1'), title: '', instructions: '', category: CAT_LIST[0], priority: 'Medium', status: 'Not Started', required: true, effort: '', actualTime: '', target: '', completedDate: '', deps: [], notes: '', resource: '', verification: 'Internal Task', verifiedDate: '', verifiedSource: '', evidenceVerified: false, criteria: '' } : getTask(id);
    var f = function (name, label, input, cls, hint) { return '<div class="field ' + (cls || '') + '"><label for="te_' + name + '">' + label + '</label>' + input + (hint ? '<div class="hint">' + hint + '</div>' : '') + '</div>'; };
    var body = '<div class="form-grid">' +
      f('title', 'Task title *', '<input type="text" id="te_title" name="title" value="' + esc(t.title) + '">', 'span-2') +
      f('phase', 'Phase', '<select id="te_phase" name="phase">' + optsKV(PHASE_KEYS.map(function (k) { return [k, SEED.phases[k]]; }), t.phase) + '</select>') +
      f('category', 'Category', '<select id="te_category" name="category">' + opts(CAT_LIST, t.category) + '</select>') +
      f('priority', 'Priority', '<select id="te_priority" name="priority">' + opts(PRIORITIES, t.priority) + '</select>') +
      f('status', 'Status', '<select id="te_status" name="status">' + opts(STATUSES, t.status) + '</select>', '', 'Choosing Complete runs the completion checks.') +
      f('required', 'Required or optional', '<select id="te_required" name="required">' + optsKV([['true', 'Required'], ['false', 'Optional']], String(t.required)) + '</select>', '', 'Optional tasks do not count toward the launch percentage.') +
      f('effort', 'Estimated effort (hours)', '<input type="number" min="0" step="0.25" id="te_effort" name="effort" value="' + esc(t.effort) + '">') +
      f('target', 'Target completion date', '<input type="date" id="te_target" name="target" value="' + esc(t.target) + '">') +
      f('actualTime', 'Actual time spent (hours)', '<input type="number" min="0" step="0.25" id="te_actualTime" name="actualTime" value="' + esc(t.actualTime) + '">') +
      (isDone(t) ? f('completedDate', 'Actual completion date', '<input type="date" id="te_completedDate" name="completedDate" value="' + esc(t.completedDate) + '">') : f('completedDateRO', 'Actual completion date', '<input type="text" id="te_completedDateRO" value="Set automatically when completed" disabled>')) +
      f('deps', 'Dependencies (task IDs, comma-separated)', '<input type="text" id="te_deps" name="deps" value="' + esc(t.deps.join(', ')) + '" placeholder="e.g., P2-04, P4-01">', 'span-2') +
      f('instructions', 'Detailed instructions', '<textarea id="te_instructions" name="instructions" rows="3">' + esc(t.instructions) + '</textarea>', 'span-2') +
      f('criteria', 'Completion criteria (evidence of completion)', '<textarea id="te_criteria" name="criteria" rows="2">' + esc(t.criteria) + '</textarea>', 'span-2') +
      f('resource', 'Official website or resource', '<input type="url" id="te_resource" name="resource" value="' + esc(t.resource) + '" placeholder="https://">', 'span-2') +
      f('verification', 'Verification status (evidence label)', '<select id="te_verification" name="verification">' + opts(VERIF, t.verification) + '</select>', '', '"Verified Current" requires a source and date.') +
      f('verifiedDate', 'Date verified', '<input type="date" id="te_verifiedDate" name="verifiedDate" value="' + esc(t.verifiedDate) + '">') +
      f('verifiedSource', 'Verification source (official URL or written confirmation)', '<input type="text" id="te_verifiedSource" name="verifiedSource" value="' + esc(t.verifiedSource) + '">', 'span-2') +
      '<div class="field span-2"><label class="check-row"><input type="checkbox" name="evidenceVerified"' + (t.evidenceVerified ? ' checked' : '') + '> <span>Verification checkbox: I have checked the evidence for this task</span></label></div>' +
      f('notes', 'Notes', '<textarea id="te_notes" name="notes" rows="3">' + esc(t.notes) + '</textarea>', 'span-2') +
      '</div><p class="small muted">Do not store passwords, ID numbers, or student information here.</p>';
    var buttons = [{ label: 'Cancel' }];
    if (!isNew) buttons.unshift({ label: 'Delete', cls: 'btn-danger', handler: function () { }, after: function () { deleteTask(t.id); } });
    var wantComplete = false;
    buttons.push({ label: isNew ? 'Add task' : 'Save changes', primary: true, handler: function (b) {
      clearErrors(b);
      var v = function (n) { var el = $('[name=' + n + ']', b); return el ? (el.type === 'checkbox' ? el.checked : el.value.trim()) : ''; };
      var ok = true;
      if (!v('title')) { fieldError(b, 'title', 'Title is required.'); ok = false; }
      ['effort', 'actualTime'].forEach(function (n) { if (v(n) !== '' && (!hasNum(v(n)) || num(v(n)) < 0)) { fieldError(b, n, 'Enter 0 or a positive number.'); ok = false; } });
      ['target', 'verifiedDate', 'completedDate'].forEach(function (n) { if (!validDate(v(n))) { fieldError(b, n, 'Enter a valid date.'); ok = false; } });
      if (!validUrl(v('resource'))) { fieldError(b, 'resource', 'Enter a full URL starting with http:// or https://'); ok = false; }
      var deps = v('deps').split(/[\s,]+/).map(function (s) { return s.trim().toUpperCase(); }).filter(Boolean);
      deps = deps.filter(function (d, i) { return deps.indexOf(d) === i; });
      var m = taskMap();
      var bad = deps.filter(function (d) { return !m[d]; });
      if (bad.length) { fieldError(b, 'deps', 'Unknown task ID(s): ' + bad.join(', ')); ok = false; }
      else if (!isNew && deps.indexOf(t.id) >= 0) { fieldError(b, 'deps', 'A task cannot depend on itself.'); ok = false; }
      else if (!isNew && hasCycle(t.id, deps)) { fieldError(b, 'deps', 'These dependencies would create a circular chain.'); ok = false; }
      if (v('verification') === 'Verified Current' && (!v('verifiedSource') || !v('verifiedDate'))) { fieldError(b, 'verifiedSource', 'Verified Current needs a source and a verification date.'); ok = false; }
      if (!ok) { var fi = $('.field.invalid input, .field.invalid textarea, .field.invalid select', b); if (fi) fi.focus(); return false; }
      var target = t;
      if (isNew) {
        var ph = v('phase'), n = 1; while (m[ph + '-U' + n]) n++;
        target = Object.assign(seedTask({ id: ph + '-U' + n, title: '', category: CAT_LIST[0], priority: 'Medium', verification: 'Internal Task' }, 1000 + state.tasks.length), { seed: false });
        state.tasks.push(target); hist(target, 'Created');
      }
      ['title', 'phase', 'category', 'priority', 'instructions', 'criteria', 'resource', 'verification', 'verifiedDate', 'verifiedSource', 'notes', 'target'].forEach(function (k) { target[k] = v(k); });
      target.effort = v('effort') === '' ? '' : num(v('effort'));
      target.actualTime = v('actualTime') === '' ? '' : num(v('actualTime'));
      target.required = v('required') === 'true';
      target.deps = deps;
      target.evidenceVerified = v('evidenceVerified');
      if (isDone(target) && v('completedDate')) target.completedDate = v('completedDate');
      var st = v('status');
      if (st !== target.status) {
        if (st === 'Complete') wantComplete = target.id;
        else if (isDone(target)) { target.status = st; target.completedDate = ''; hist(target, 'Reopened (status: ' + st + ')'); }
        else { target.status = st; hist(target, 'Status → ' + st); }
      }
      if (!isNew) hist(target, 'Edited');
      save();
    }, after: function () { render(); if (wantComplete) completeTask(wantComplete); toast(isNew ? 'Task added' : 'Task saved'); } });
    openModal({ title: isNew ? 'Add task' : 'Edit task ' + t.id, body: body, buttons: buttons });
  }

  function taskDetailHtml(t, m) {
    var deps = t.deps.length ? '<ul class="dep-list">' + t.deps.map(function (d) {
      var x = m[d]; if (!x) return '<li><span class="dep-no">?</span> ' + esc(d) + ' (missing task)</li>';
      return '<li>' + (isDone(x) ? '<span class="dep-ok" aria-label="complete">✓</span>' : '<span class="dep-no" aria-label="incomplete">✗</span>') + ' <button class="btn btn-sm btn-ghost" data-action="open-task" data-id="' + esc(d) + '">' + esc(d) + '</button> ' + esc(x.title) + (isDone(x) ? '' : ' <em class="small">— must be completed first</em>') + '</li>';
    }).join('') + '</ul>' : '<span class="muted">None</span>';
    var inc = incompleteDeps(t, m);
    var actions = '<div class="btn-row">' +
      (isDone(t) ? '<button class="btn btn-sm" data-action="reopen" data-id="' + esc(t.id) + '">Reopen task</button>' : '<button class="btn btn-sm btn-primary" data-action="complete" data-id="' + esc(t.id) + '">Mark complete</button>') +
      (strictMode() && !isDone(t) && inc.length && !t.depOverride ? '<button class="btn btn-sm" data-action="override" data-id="' + esc(t.id) + '">Override dependencies…</button>' : '') +
      (t.depOverride ? '<button class="btn btn-sm" data-action="remove-override" data-id="' + esc(t.id) + '">Remove override</button>' : '') +
      '<button class="btn btn-sm" data-action="edit-task" data-id="' + esc(t.id) + '">Edit</button>' +
      (t.resource ? '<a class="btn btn-sm" href="' + esc(t.resource) + '" target="_blank" rel="noopener noreferrer">Open resource ↗</a>' : '') +
      '<button class="btn btn-sm btn-danger" data-action="delete-task" data-id="' + esc(t.id) + '">Delete</button></div>';
    return '<dl class="detail-grid">' +
      '<div><dt>Instructions</dt><dd>' + esc(t.instructions || '—') + '</dd></div>' +
      '<div><dt>Completion criteria</dt><dd>' + esc(t.criteria || '—') + '</dd></div>' +
      '<div><dt>Dependencies</dt><dd>' + deps + (t.depOverride ? '<div class="note warn">Override recorded ' + fmtDateTime(t.depOverride.at) + ': ' + esc(t.depOverride.reason) + '</div>' : '') + '</dd></div>' +
      '<div><dt>Details</dt><dd>' + esc(SEED.phases[t.phase] || t.phase) + '\n' + esc(t.category) + '\n' + (t.required ? 'Required' : 'Optional') + ' · Est. ' + (t.effort === '' ? '—' : esc(t.effort) + 'h') + ' · Actual ' + (t.actualTime === '' ? '—' : esc(t.actualTime) + 'h') + '\nTarget: ' + fmtDate(t.target) + ' · Completed: ' + fmtDate(t.completedDate) + '</dd></div>' +
      '<div><dt>Verification</dt><dd>' + verBadge(t.verification) + (t.verifiedDate ? ' on ' + fmtDate(t.verifiedDate) : '') + (t.verifiedSource ? '\nSource: ' + esc(t.verifiedSource) : '') +
      '\n<label class="check-row" style="margin-top:.4rem"><input type="checkbox" data-tfield="evidenceVerified" data-id="' + esc(t.id) + '"' + (t.evidenceVerified ? ' checked' : '') + '> <span>Evidence checked</span></label></dd></div>' +
      '<div><dt>Resource</dt><dd>' + (t.resource ? '<a href="' + esc(t.resource) + '" target="_blank" rel="noopener noreferrer">' + esc(t.resource) + '</a><div class="small muted">Opening a link does not complete or verify anything.</div>' : '—') + '</dd></div>' +
      '<div style="grid-column:1/-1"><dt><label for="notes_' + esc(t.id) + '" style="margin:0">Notes (auto-saved)</label></dt><dd><textarea id="notes_' + esc(t.id) + '" data-tfield="notes" data-id="' + esc(t.id) + '" rows="3">' + esc(t.notes) + '</textarea></dd></div>' +
      (t.history.length ? '<div style="grid-column:1/-1"><dt>History</dt><dd><ul class="history">' + t.history.slice(-6).reverse().map(function (h) { return '<li>' + fmtDateTime(h.at) + ' — ' + esc(h.msg) + '</li>'; }).join('') + '</ul></dd></div>' : '') +
      '</dl>' + actions;
  }

  function openTaskModal(id) {
    var t = getTask(id); if (!t) { toast('Task ' + id + ' not found'); return; }
    openModal({ title: t.id + ' — ' + t.title, body: '<div class="task-meta" style="margin-bottom:.75rem">' + priBadge(t.priority) + statusBadge(t.status) + (t.required ? '' : '<span class="badge b-optional">Optional</span>') + (isBlocked(t, taskMap()) ? '<span class="badge b-blocked">Blocked</span>' : '') + (isOverdue(t) ? '<span class="badge b-overdue">Overdue</span>' : '') + '</div>' + taskDetailHtml(t, taskMap()), buttons: [{ label: 'Close' }], autofocus: false });
  }

  /* ===================== Task table ===================== */
  var ui = { expanded: {}, filters: { q: '', phase: '', category: '', priority: '', status: '', req: 'all', verification: '', incompleteOnly: false, blockedOnly: false, readyOnly: false, overdueOnly: false, sort: 'default' }, course: 0, doc: null };

  function taskRow(t, m, o) {
    var inc = incompleteDeps(t, m), done = isDone(t), overdue = isOverdue(t), dblock = depBlocked(t, m);
    var badges = (t.milestone ? '<span class="badge b-progress">Milestone</span>' : '') + (t.required ? '' : '<span class="badge b-optional">Optional</span>') +
      (overdue ? '<span class="badge b-overdue">Overdue</span>' : '') +
      (dblock ? '<span class="badge b-blocked" title="Complete prerequisites first">Blocked by ' + esc(inc.map(function (d) { return d.id; }).join(', ')) + '</span>' : (!done && inc.length && !t.depOverride ? '<span class="badge b-notstarted" title="Suggested order only — you can work on this now">Suggested after ' + esc(inc.map(function (d) { return d.id; }).join(', ')) + '</span>' : (!done && t.status !== 'Waiting' && t.status !== 'Blocked' ? '<span class="badge b-complete" title="All prerequisites done">Ready</span>' : ''))) +
      (t.depOverride && !done ? '<span class="badge b-high">Override</span>' : '') + verBadge(t.verification);
    var exp = !!ui.expanded[t.id];
    var cols = o.showPhase ? 9 : 8;
    return '<tr class="' + (done ? 'is-complete ' : '') + (overdue ? 'is-overdue' : '') + '" data-row="' + esc(t.id) + '">' +
      '<td data-label="Done"><input type="checkbox" data-action="toggle" data-id="' + esc(t.id) + '"' + (done ? ' checked' : '') + ' aria-label="Complete: ' + esc(t.title) + '"></td>' +
      '<td data-label="ID"><span class="task-id">' + esc(t.id) + '</span></td>' +
      '<td data-label="Task"><div class="task-title">' + esc(t.title) + '</div><div class="task-meta">' + badges + '</div></td>' +
      (o.showPhase ? '<td data-label="Category" class="small">' + esc(t.category) + '</td>' : '') +
      '<td data-label="Priority">' + priBadge(t.priority) + '</td>' +
      '<td data-label="Status"><select class="status-select" data-action="status" data-id="' + esc(t.id) + '" aria-label="Status: ' + esc(t.title) + '">' + opts(STATUSES, t.status) + '</select></td>' +
      '<td data-label="Target">' + (t.target ? fmtDate(t.target) : '<span class="muted">—</span>') + '</td>' +
      '<td data-label="Effort" class="num">' + (t.effort === '' ? '—' : esc(t.effort) + 'h') + '</td>' +
      '<td data-label="Actions"><div class="btn-row" style="flex-wrap:nowrap"><button class="btn btn-sm" data-action="expand" data-id="' + esc(t.id) + '" aria-expanded="' + exp + '">' + (exp ? 'Hide' : 'Details') + '</button><button class="btn btn-sm" data-action="edit-task" data-id="' + esc(t.id) + '">Edit</button></div></td></tr>' +
      (exp ? '<tr class="detail-row"><td colspan="' + cols + '">' + taskDetailHtml(t, m) + '</td></tr>' : '');
  }
  function taskTable(list, o) {
    o = o || {};
    if (!list.length) return '<div class="empty"><strong>No tasks match.</strong>' + (o.emptyHint || 'Try clearing filters or add a task.') + '</div>';
    var m = taskMap();
    return '<div class="table-wrap"><table class="responsive"><thead><tr><th scope="col"><span class="sr-only">Done</span>✓</th><th scope="col">ID</th><th scope="col">Task</th>' + (o.showPhase ? '<th scope="col">Category</th>' : '') + '<th scope="col">Priority</th><th scope="col">Status</th><th scope="col">Target</th><th scope="col" class="num">Effort</th><th scope="col">Actions</th></tr></thead><tbody>' +
      list.map(function (t) { return taskRow(t, m, o); }).join('') + '</tbody></table></div>';
  }

  function filteredTasks() {
    var f = ui.filters, m = taskMap(), q = f.q.toLowerCase();
    var list = state.tasks.filter(function (t) {
      if (q && (t.id + ' ' + t.title + ' ' + t.instructions + ' ' + t.notes + ' ' + t.category).toLowerCase().indexOf(q) < 0) return false;
      if (f.phase && t.phase !== f.phase) return false;
      if (f.category && t.category !== f.category) return false;
      if (f.priority && t.priority !== f.priority) return false;
      if (f.status && t.status !== f.status) return false;
      if (f.verification && t.verification !== f.verification) return false;
      if (f.req === 'required' && !t.required) return false;
      if (f.req === 'optional' && t.required) return false;
      if (f.incompleteOnly && isDone(t)) return false;
      if (f.blockedOnly && !isBlocked(t, m)) return false;
      if (f.readyOnly && !isReady(t, m)) return false;
      if (f.overdueOnly && !isOverdue(t)) return false;
      return true;
    });
    var s = f.sort;
    if (s === 'recommended') return sortRecommended(list);
    list.sort(function (a, b) {
      if (s === 'deadline') { var x = a.target || '9999-99', y = b.target || '9999-99'; return x < y ? -1 : x > y ? 1 : sortDefault(a, b); }
      if (s === 'priority') return PRI_RANK[a.priority] - PRI_RANK[b.priority] || sortDefault(a, b);
      if (s === 'effort') return num(a.effort) - num(b.effort) || sortDefault(a, b);
      if (s === 'effort-desc') return num(b.effort) - num(a.effort) || sortDefault(a, b);
      return sortDefault(a, b);
    });
    return list;
  }

  /* ===================== Views ===================== */
  var NAV = [
    ['dashboard', 'Dashboard'], ['guide', 'Guide — how to use this'], ['checklist', 'Master Checklist'], ['heartland', 'Heartland Application', ['P2']], ['setup', 'Business Setup', ['P1', 'P3']],
    ['compliance', 'Compliance', ['P4']], ['courses', 'Course Catalog', ['P5']], ['pricing', 'Pricing Calculator', ['P6']], ['website', 'Website Launch', ['P7']],
    ['marketing', 'Marketing', ['P8']], ['operations', 'Operations', ['P9']], ['enrollment', 'Student Enrollment', ['P10']], ['growth', 'Growth (optional)', ['P11']],
    ['finance', 'Financial Tracking'], ['schools', 'Charter School Tracker'], ['comms', 'Notes & Communications'], ['documents', 'Documents'],
    ['resources', 'Resource Library'], ['settings', 'Settings & Backup']
  ];
  var current = 'dashboard';

  function renderNav() {
    $('#nav').innerHTML = NAV.map(function (n) {
      var count = '';
      if (n[2]) { var open = state.tasks.filter(function (t) { return n[2].indexOf(t.phase) >= 0 && !isDone(t); }).length; count = '<span class="nav-count" aria-label="' + open + ' open tasks">' + open + '</span>'; }
      return '<li><a href="#' + n[0] + '"' + (n[0] === current ? ' aria-current="page"' : '') + '><span>' + esc(n[1]) + '</span>' + count + '</a></li>';
    }).join('');
  }

  function bar(p, cls) { return '<div class="bar ' + (cls || '') + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(p * 100) + '"><span style="width:' + (p * 100).toFixed(1) + '%"></span></div>'; }

  /* ---------- Dashboard ---------- */
  function financeCalc() {
    var f = state.finance;
    return {
      remaining: hasNum(f.startupBudget) ? num(f.startupBudget) - num(f.startupExpenses) : null,
      gross: hasNum(f.actualRevenue) ? num(f.actualRevenue) : null,
      profit: hasNum(f.actualRevenue) || hasNum(f.opExpenses) ? num(f.actualRevenue) - num(f.opExpenses) : null,
      progress: num(f.revenueTarget) > 0 && hasNum(f.actualRevenue) ? num(f.actualRevenue) / num(f.revenueTarget) : null,
      avg: num(f.students) > 0 && hasNum(f.actualRevenue) ? num(f.actualRevenue) / num(f.students) : null
    };
  }

  function readyNowCard() {
    var m = taskMap();
    var ready = state.tasks.filter(function (t) { return isReady(t, m); });
    var groups = PHASE_KEYS.map(function (p) { return [p, sortRecommended(ready.filter(function (t) { return t.phase === p; }))]; }).filter(function (g) { return g[1].length; });
    return '<div class="card"><div class="card-head"><h2>Ready now — work on these in parallel</h2><button class="btn btn-sm" data-action="metric-filter" data-filter="readyOnly">See all ' + ready.length + '</button></div>' +
      '<p class="small muted">Every task below has its prerequisites done. Do them in any order, across phases, at the same time. ' + (strictMode() ? '' : 'Other tasks aren\'t locked either — prerequisites are only a suggested order.') + '</p>' +
      (groups.length ? groups.map(function (g, gi) {
        return '<details' + (gi < 2 ? ' open' : '') + ' style="margin-bottom:.5rem"><summary style="cursor:pointer;font-weight:600">' + esc(SEED.phases[g[0]]) + ' <span class="badge">' + g[1].length + '</span></summary><ul class="next-list" style="margin-top:.5rem">' +
          g[1].map(function (t) { return '<li><div class="row"><label class="check-row" style="margin:0;flex:1"><input type="checkbox" data-action="toggle" data-id="' + esc(t.id) + '" aria-label="Complete: ' + esc(t.title) + '"> <span><span class="task-id">' + esc(t.id) + '</span> ' + esc(t.title) + '</span></label>' + priBadge(t.priority) + '<button class="btn btn-sm" data-action="open-task" data-id="' + esc(t.id) + '">Details</button></div></li>'; }).join('') + '</ul></details>';
      }).join('') : '<div class="empty"><strong>Nothing is ready right now.</strong>Check tasks marked Waiting or Blocked.</div>') + '</div>';
  }

  function viewDashboard(el) {
    var s = stats(), next = nextActions(5), top = next[0], m = taskMap(), fc = financeCalc(), f = state.finance;
    var heroNext;
    if (top) {
      heroNext = '<div class="card next-hero"><div class="kicker">What should I do next?</div><h2>' + esc(top.t.id + ' — ' + top.t.title) + '</h2><p class="why">' + esc(top.why) + ' · ' + esc(top.t.category) + '</p><p>' + esc(top.t.instructions) + '</p><p class="small"><strong>Done when:</strong> ' + esc(top.t.criteria) + '</p><div class="btn-row"><button class="btn btn-primary" data-action="complete" data-id="' + esc(top.t.id) + '">Mark complete</button><button class="btn" data-action="open-task" data-id="' + esc(top.t.id) + '">Open details</button>' + (top.t.resource ? '<a class="btn" href="' + esc(top.t.resource) + '" target="_blank" rel="noopener noreferrer">Open resource ↗</a>' : '') + (top.t.status === 'Not Started' ? '<button class="btn" data-action="start" data-id="' + esc(top.t.id) + '">Start (In Progress)</button>' : '') + '</div></div>';
    } else {
      var waiting = state.tasks.filter(function (t) { return t.status === 'Waiting'; });
      heroNext = '<div class="card next-hero"><div class="kicker">What should I do next?</div>' + (waiting.length ? '<h2>Follow up on items awaiting a response</h2><p>Everything actionable is done or blocked. ' + waiting.length + ' task(s) are waiting on others — check the Charter School Tracker and Communication Log for follow-up dates.</p>' : s.remaining === 0 ? '<h2>All required launch tasks are complete.</h2><p>Review the optional Growth tasks.</p>' : '<h2>Everything left is blocked.</h2><p>Open the Master Checklist with "Show blocked tasks" to see which prerequisites are holding things up.</p>') + '</div>';
    }
    var metrics = '<div class="grid grid-metrics">' +
      '<div class="card metric hero"><div class="label">Overall launch progress</div><div class="value">' + pct(s.pct) + '</div>' + bar(s.pct) + '<div class="sub" style="margin-top:.35rem">' + s.done + ' of ' + s.total + ' required tasks · optional tasks excluded (' + s.optDone + '/' + s.optTotal + ' done)</div></div>' +
      metric('Completed', s.done, 'required tasks') + metric('Remaining', s.remaining, 'required tasks') +
      metric('Ready now', s.ready, 'prerequisites done — work on any of these', 'readyOnly') +
      metric('Blocked', s.blocked, strictMode() ? 'waiting on prerequisites or marked Blocked' : 'tasks you marked Blocked', s.blocked ? 'blockedOnly' : null) + metric('Overdue', s.overdue, 'past target date', s.overdue ? 'overdueOnly' : null, s.overdue > 0) +
      metric('In progress', s.inProgress, 'tasks', null, false, 'In Progress') + metric('Awaiting external approval', s.waiting, 'status "Waiting"', null, false, 'Waiting') + '</div>';
    var readiness = '<ul class="readiness">' + CAT_LIST.map(function (c, i) {
      var g = groupProgress(function (t) { return t.category === c; });
      if (!g.total) { var all = state.tasks.filter(function (t) { return t.category === c; }); var ad = all.filter(isDone).length; g = { done: ad, total: all.length, pct: all.length ? ad / all.length : 0, optional: true }; }
      return '<li><button data-action="filter-category" data-cat="' + esc(c) + '" aria-label="' + esc(c) + ': ' + g.done + ' of ' + g.total + ' complete. Open in checklist"><div class="row"><span>' + (i + 1) + '. ' + esc(c) + '</span><span class="muted">' + g.done + '/' + g.total + (g.optional ? ' optional' : '') + ' · ' + pct(g.pct) + '</span></div>' + bar(g.pct, g.pct === 1 ? 'ok' : '') + '</button></li>';
    }).join('') + '</ul>';
    var nextList = next.length ? '<ol class="next-list">' + next.map(function (n) {
      var t = n.t; var deps = t.deps.length ? t.deps.map(function (d) { return (m[d] && isDone(m[d]) ? '✓ ' : '○ ') + d; }).join(', ') : 'None';
      return '<li><div class="row"><div><span class="task-id">' + esc(t.id) + '</span> <strong>' + esc(t.title) + '</strong><div class="task-meta">' + priBadge(t.priority) + '<span class="badge">' + esc(t.category) + '</span>' + (t.target ? '<span class="badge ' + (isOverdue(t) ? 'b-overdue' : '') + '">Due ' + fmtDate(t.target) + '</span>' : '<span class="badge">No deadline</span>') + '</div><div class="why" style="margin-top:.25rem">Dependencies: ' + esc(deps) + (t.depOverride ? ' (override recorded)' : '') + '</div></div>' +
        '<div class="btn-row"><button class="btn btn-sm" data-action="open-task" data-id="' + esc(t.id) + '">Details</button><button class="btn btn-sm btn-primary" data-action="complete" data-id="' + esc(t.id) + '">Mark complete</button></div></div></li>';
    }).join('') + '</ol>' : '<div class="empty"><strong>No actionable tasks.</strong>Remaining tasks are waiting, blocked, or complete.</div>';
    var phaseProg = '<ul class="readiness">' + PHASE_KEYS.map(function (p) { var g = groupProgress(function (t) { return t.phase === p; }); var allP = state.tasks.filter(function (t) { return t.phase === p; }); var dAll = allP.filter(isDone).length; return '<li><div class="row"><span>' + esc(SEED.phases[p]) + '</span><span class="muted">' + (g.total ? g.done + '/' + g.total : dAll + '/' + allP.length + ' optional') + '</span></div>' + bar(g.total ? g.pct : (allP.length ? dAll / allP.length : 0), (g.total && g.pct === 1) ? 'ok' : '') + '</li>'; }).join('') + '</ul>';
    var upcoming = state.tasks.filter(function (t) { return !isDone(t) && t.target; }).sort(function (a, b) { return a.target < b.target ? -1 : 1; }).slice(0, 6);
    var fin = '<div class="card"><div class="card-head"><h2>Financial overview</h2><a class="btn btn-sm" href="#finance">Edit figures</a></div>' +
      '<p class="small"><span class="badge b-actual">ACTUAL</span> figures you entered. Nothing here is projected or guaranteed.</p><dl class="kv">' +
      '<dt>Startup budget</dt><dd>' + (hasNum(f.startupBudget) ? money(num(f.startupBudget)) : '—') + '</dd>' +
      '<dt>Actual startup expenses</dt><dd>' + (hasNum(f.startupExpenses) ? money(num(f.startupExpenses)) : '—') + '</dd>' +
      '<dt>Remaining startup budget</dt><dd class="' + (fc.remaining < 0 ? 'neg' : '') + '">' + money(fc.remaining) + '</dd>' +
      '<dt>Gross revenue (actual, this month)</dt><dd>' + money(fc.gross) + '</dd>' +
      '<dt>Est. operating profit before taxes</dt><dd class="' + (fc.profit < 0 ? 'neg' : '') + '">' + money(fc.profit) + '</dd>' +
      '<dt>Progress toward monthly target</dt><dd>' + pct(fc.progress) + '</dd>' +
      '<dt>Average revenue per student</dt><dd>' + money(fc.avg) + '</dd>' +
      '<dt>Enrolled students · Active courses</dt><dd>' + (f.students || 0) + ' · ' + (f.activeCourses || 0) + '</dd></dl>' +
      (fc.progress != null ? '<div style="margin-top:.5rem">' + bar(Math.min(1, fc.progress), 'ok') + '</div>' : '') + '</div>';
    el.innerHTML = (startupNotice ? '' : '') +
      (state.settings.guideSeen ? '' : '<div class="card note info" style="margin:0 0 1rem;display:flex;gap:1rem;align-items:center;justify-content:space-between;flex-wrap:wrap"><span><strong>New here?</strong> The step-by-step guide explains how to use this dashboard, what to do first, and how your data is saved.</span><span class="btn-row"><a class="btn btn-primary btn-sm" href="#guide">Open the guide</a><button class="btn btn-sm" data-action="dismiss-welcome">Dismiss</button></span></div>') +
      '<p class="page-intro">Pre-launch command center for an educational services business in Santa Barbara County. Progress is calculated from <strong>required</strong> checklist tasks. Nothing is marked approved, submitted, or earned unless you confirm it.</p>' +
      metrics +
      '<div class="grid dash-main" style="margin-top:1rem"><div class="stack">' + heroNext +
      '<div class="card"><div class="card-head"><h2>Next actions</h2><span class="small muted">Top 5 actionable, by priority and impact</span></div>' + nextList + '</div>' + readyNowCard() +
      '<div class="card"><div class="card-head"><h2>Business readiness</h2><span class="small muted">Click a category to filter the checklist</span></div>' + readiness + '</div></div>' +
      '<div class="stack">' + fin +
      '<div class="card"><div class="card-head"><h2>Upcoming deadlines</h2></div>' + (upcoming.length ? '<ul class="next-list">' + upcoming.map(function (t) { return '<li><div class="row"><span><span class="task-id">' + esc(t.id) + '</span> ' + esc(t.title) + '</span>' + '<span class="badge ' + (isOverdue(t) ? 'b-overdue' : '') + '">' + fmtDate(t.target) + '</span></div></li>'; }).join('') + '</ul>' : '<div class="empty"><strong>No deadlines set.</strong>Add target dates when you edit tasks.</div>') + '</div>' +
      '<div class="card"><div class="card-head"><h2>Phase progress</h2></div>' + phaseProg + '</div>' +
      '<div class="card"><h2>Evidence labels</h2><p class="small">Every requirement carries one of these labels. Items start as <strong>Verify Current Requirements</strong> until you confirm them from current official sources or in writing.</p>' + legendHtml() + '</div>' +
      '</div></div>';
  }
  function metric(label, value, sub, filter, alert, status) {
    var inner = '<div class="label">' + esc(label) + '</div><div class="value">' + value + '</div><div class="sub">' + esc(sub) + '</div>';
    if (filter || status) return '<button class="card metric ' + (alert ? 'alert' : '') + '" style="text-align:left;cursor:pointer;font:inherit" data-action="metric-filter" data-filter="' + (filter || '') + '" data-status="' + (status || '') + '" aria-label="' + esc(label + ': ' + value + '. Show in checklist') + '">' + inner + '</button>';
    return '<div class="card metric">' + inner + '</div>';
  }

  /* ---------- Master checklist ---------- */
  function viewChecklist(el) {
    var f = ui.filters;
    el.innerHTML = '<p class="page-intro">All ' + state.tasks.length + ' tasks across 11 phases. ' + (strictMode() ? 'Strict mode: completing a task before its prerequisites asks for a reason.' : 'Work in any order — "Suggested after" shows a recommended sequence, not a lock. Use <strong>Ready now</strong> to see everything you can do in parallel, or sort by <strong>Recommended order</strong> to go step by step.') + ' Milestones still require evidence; opening a link never completes a task.</p>' +
      '<div class="card no-print" style="margin-bottom:1rem"><div class="toolbar" role="search">' +
      '<div class="field search"><label for="fq">Search</label><input type="search" id="fq" data-filter="q" value="' + esc(f.q) + '" placeholder="Title, ID, notes…"></div>' +
      '<div class="field"><label for="fphase">Phase</label><select id="fphase" data-filter="phase"><option value="">All phases</option>' + optsKV(PHASE_KEYS.map(function (k) { return [k, SEED.phases[k]]; }), f.phase) + '</select></div>' +
      '<div class="field"><label for="fcat">Category</label><select id="fcat" data-filter="category"><option value="">All categories</option>' + optsKV(CAT_LIST.map(function (c) { return [c, c]; }), f.category) + '</select></div>' +
      '<div class="field"><label for="fpri">Priority</label><select id="fpri" data-filter="priority"><option value="">All</option>' + optsKV(PRIORITIES.map(function (p) { return [p, p]; }), f.priority) + '</select></div>' +
      '<div class="field"><label for="fst">Status</label><select id="fst" data-filter="status"><option value="">All</option>' + optsKV(STATUSES.map(function (p) { return [p, p]; }), f.status) + '</select></div>' +
      '<div class="field"><label for="freq">Required / optional</label><select id="freq" data-filter="req">' + optsKV([['all', 'All'], ['required', 'Required only'], ['optional', 'Optional only']], f.req) + '</select></div>' +
      '<div class="field"><label for="fver">Evidence label</label><select id="fver" data-filter="verification"><option value="">All</option>' + optsKV(VERIF.map(function (p) { return [p, p]; }), f.verification) + '</select></div>' +
      '<div class="field"><label for="fsort">Sort by</label><select id="fsort" data-filter="sort">' + optsKV([['default', 'Phase order'], ['recommended', 'Recommended order'], ['deadline', 'Deadline'], ['priority', 'Priority'], ['effort', 'Effort (low → high)'], ['effort-desc', 'Effort (high → low)']], f.sort) + '</select></div>' +
      '<div class="toggles"><label><input type="checkbox" data-filter="readyOnly"' + (f.readyOnly ? ' checked' : '') + '> Ready now</label><label><input type="checkbox" data-filter="incompleteOnly"' + (f.incompleteOnly ? ' checked' : '') + '> Show incomplete tasks only</label><label><input type="checkbox" data-filter="blockedOnly"' + (f.blockedOnly ? ' checked' : '') + '> Show blocked tasks</label><label><input type="checkbox" data-filter="overdueOnly"' + (f.overdueOnly ? ' checked' : '') + '> Overdue only</label></div>' +
      '</div><div class="btn-row"><button class="btn btn-primary" data-action="new-task">+ Add task</button><button class="btn" data-action="clear-filters">Clear filters</button><button class="btn" data-action="print-checklist">Print checklist</button></div></div>' +
      '<div id="taskResults"></div>';
    renderResults();
  }
  function renderResults() {
    var box = $('#taskResults'); if (!box) return;
    var list = filteredTasks();
    box.innerHTML = '<div class="result-count" role="status">' + list.length + ' task' + (list.length === 1 ? '' : 's') + ' shown</div>' + taskTable(list, { showPhase: true });
  }

  /* ---------- Phase pages ---------- */
  var PHASE_INTROS = {
    heartland: 'Goal: become an approved Heartland vendor. Everything Heartland-specific starts as <strong>Verify Current Requirements</strong>. Approval only counts when confirmed in writing.',
    setup: 'Business model research (Phase 1) and registration & tax administration (Phase 3). Registrations depend on your structure and location — investigate before paying for anything.',
    compliance: 'Student safety and vendor compliance. Do not invent obligations: confirm each one with Heartland or the relevant agency. Never store ID documents or student records in this app.',
    courses: 'Course development tasks and the editable catalog. No course is approved until a school confirms it.',
    pricing: 'Confirm Heartland\'s pricing rules, then model scenarios. All calculator values are editable example assumptions — not Heartland rates.',
    website: 'Build an accurate business website. No invented testimonials, credentials, approvals, or partnerships.',
    marketing: 'Reach homeschool families accurately — never imply that school funding or reimbursement is guaranteed.',
    operations: 'Day-to-day systems for teaching, records, and payment requests.',
    enrollment: 'From an approved order to the first payment. "First paid student" requires delivered instruction AND received payment.',
    growth: 'Optional tasks — not counted in the launch percentage. Start after the first paid enrollment.'
  };
  function phaseSection(phases) {
    var list = state.tasks.filter(function (t) { return phases.indexOf(t.phase) >= 0; }).sort(sortDefault);
    var g = groupProgress(function (t) { return phases.indexOf(t.phase) >= 0; });
    var head = '<div class="card" style="margin-bottom:1rem"><div class="card-head"><h2>' + phases.map(function (p) { return esc(SEED.phases[p]); }).join(' + ') + '</h2><div class="btn-row"><button class="btn btn-sm" data-action="new-task" data-phase="' + phases[0] + '">+ Add task</button><button class="btn btn-sm" data-action="phase-in-checklist" data-phase="' + phases[0] + '">Open in Master Checklist</button></div></div>' +
      (g.total ? '<div class="row small" style="display:flex;justify-content:space-between"><span>' + g.done + ' of ' + g.total + ' required tasks complete</span><span>' + pct(g.pct) + '</span></div>' + bar(g.pct) : '<p class="small muted">All tasks in this section are optional.</p>') + '</div>';
    return head + taskTable(list, { showPhase: phases.length > 1 });
  }
  function viewPhase(key, phases, extraTop, extraBottom) {
    return function (el) {
      el.innerHTML = '<p class="page-intro">' + PHASE_INTROS[key] + '</p>' + (extraTop ? extraTop() : '') + phaseSection(phases) + (extraBottom ? extraBottom() : '');
      if (key === 'courses') bindCourseView();
    };
  }

  function heartlandTop() {
    var app = state.apps.find(function (a) { return /heartland/i.test(a.org); });
    var links = SEED.resources.filter(function (r) { return r.group === 'Heartland official documentation'; });
    return '<div class="grid grid-2" style="margin-bottom:1rem"><div class="card"><div class="card-head"><h2>Application status</h2><a class="btn btn-sm" href="#schools">Open tracker</a></div>' +
      (app ? '<dl class="kv"><dt>Status</dt><dd>' + esc(app.status) + '</dd><dt>Application date</dt><dd>' + fmtDate(app.appDate) + '</dd><dt>Reference #</dt><dd>' + esc(app.ref || '—') + '</dd><dt>Next follow-up</dt><dd>' + fmtDate(app.nextFollowUp) + '</dd><dt>Approval date</dt><dd>' + fmtDate(app.approvalDate) + '</dd></dl>' : '<div class="empty"><strong>No Heartland entry.</strong>Add one in the Charter School Tracker.</div>') +
      '</div><div class="card"><h2>Official starting points</h2><p class="small">Listed here ≠ verified. Read the current pages and record what you confirm.</p><div class="btn-row">' +
      links.map(function (r) { return '<a class="btn btn-sm" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.name) + ' ↗</a>'; }).join('') +
      '</div><div class="btn-row" style="margin-top:.75rem"><button class="btn btn-primary btn-sm" data-action="new-doc-type" data-type="Vendor inquiry email">Draft vendor inquiry email</button><button class="btn btn-sm" data-action="new-comm" data-org="Heartland Charter School">Log a contact</button></div></div></div>';
  }

  /* ---------- Course catalog ---------- */
  var APPROVAL = ['Not submitted', 'Submitted — awaiting decision', 'Approved (confirmed in writing)', 'Not approved', 'Withdrawn'];
  var CATALOG = ['Not listed', 'Listing requested', 'Listed — verified by me'];
  var CURRIC = ['Idea', 'Outlining', 'Drafting', 'Ready to teach', 'Piloted'];
  var FORMATS = ['Undecided', 'In person', 'Online', 'In person and online'];
  function courseTop() {
    var cs = state.courses; if (ui.course >= cs.length) ui.course = 0;
    var c = cs[ui.course];
    var list = ['A', 'B'].map(function (d) {
      var items = cs.map(function (x, i) { return [x, i]; }).filter(function (p) { return p[0].division === d; });
      return '<div class="division-label">' + (d === 'A' ? 'Audio Engineering & Music Production' : 'Software Development & App Building') + '</div><ul class="course-list">' +
        (items.length ? items.map(function (p) { return '<li><button data-action="select-course" data-i="' + p[1] + '" aria-current="' + (p[1] === ui.course) + '">' + esc(p[0].id + ' · ' + p[0].title) + '<div class="task-meta">' + (p[0].launchCandidate ? '<span class="badge b-progress">Launch candidate</span>' : '') + '<span class="badge ' + (/^Approved/.test(p[0].approvalStatus) ? 'b-verified' : 'b-verify') + '">' + esc(p[0].approvalStatus) + '</span></div></button></li>'; }).join('') : '<li class="small muted" style="padding:.5rem .7rem">No courses</li>') + '</ul>';
    }).join('');
    var other = cs.filter(function (x) { return x.division !== 'A' && x.division !== 'B'; });
    var editor = c ? courseEditor(c, ui.course) : '<div class="empty"><strong>No courses yet.</strong>Add a course to start building your catalog.</div>';
    return '<div class="note warn">Courses are <strong>proposals</strong>. None are approved by Heartland or any school until you record written approval.</div>' +
      '<div class="course-layout" style="margin:1rem 0"><div class="card"><div class="card-head"><h2>Catalog</h2><button class="btn btn-sm btn-primary" data-action="new-course">+ Course</button></div>' + list + (other.length ? '' : '') + '</div><div class="card" id="courseEditor">' + editor + '</div></div>';
  }
  function cf(i, key, label, type, extra) {
    var c = state.courses[i]; var id = 'c_' + key; var path = 'courses.' + i + '.' + key; var v = c[key];
    var input;
    if (type === 'textarea') input = '<textarea id="' + id + '" data-bind="' + path + '" rows="' + (extra || 3) + '">' + esc(v) + '</textarea>';
    else if (type === 'select') input = '<select id="' + id + '" data-bind="' + path + '"' + (key === 'approvalStatus' ? ' data-gate="approval"' : '') + ' data-rerender="1">' + opts(extra, v) + '</select>';
    else input = '<input type="' + (type || 'text') + '" id="' + id + '" data-bind="' + path + '" value="' + esc(v) + '"' + (type === 'number' ? ' min="0" step="any"' : '') + (key === 'title' ? ' data-rerender="1"' : '') + '>';
    return '<div class="field' + (type === 'textarea' ? ' span-2' : '') + '"><label for="' + id + '">' + label + '</label>' + input + '</div>';
  }
  function courseEditor(c, i) {
    var mods = (c.modules || []).map(function (mod, mi) {
      var base = 'courses.' + i + '.modules.' + mi;
      return '<div class="module"><div class="card-head"><h3>Module ' + (mi + 1) + '</h3><button class="btn btn-sm btn-danger" data-action="del-module" data-mi="' + mi + '">Remove module</button></div>' +
        '<div class="form-grid"><div class="field span-2"><label for="m' + mi + 't">Module title</label><input type="text" id="m' + mi + 't" data-bind="' + base + '.title" value="' + esc(mod.title) + '"></div>' +
        '<div class="field span-2"><label for="m' + mi + 'o">Module learning objectives</label><textarea id="m' + mi + 'o" rows="2" data-bind="' + base + '.objectives">' + esc(mod.objectives) + '</textarea></div></div>' +
        (mod.lessons || []).map(function (l, li) {
          var lb = base + '.lessons.' + li, pid = 'm' + mi + 'l' + li;
          return '<div class="lesson"><div class="card-head"><strong>Lesson ' + (mi + 1) + '.' + (li + 1) + '</strong><button class="btn btn-sm btn-danger" data-action="del-lesson" data-mi="' + mi + '" data-li="' + li + '">Remove</button></div><div class="form-grid">' +
            '<div class="field span-2"><label for="' + pid + 't">Lesson title</label><input type="text" id="' + pid + 't" data-bind="' + lb + '.title" value="' + esc(l.title) + '"></div>' +
            '<div class="field"><label for="' + pid + 'o">Learning objectives</label><textarea id="' + pid + 'o" rows="3" data-bind="' + lb + '.objectives">' + esc(l.objectives) + '</textarea></div>' +
            '<div class="field"><label for="' + pid + 'a">Activities</label><textarea id="' + pid + 'a" rows="3" data-bind="' + lb + '.activities">' + esc(l.activities) + '</textarea></div>' +
            '<div class="field"><label for="' + pid + 's">Assignment</label><textarea id="' + pid + 's" rows="2" data-bind="' + lb + '.assignment">' + esc(l.assignment) + '</textarea></div>' +
            '<div class="field"><label for="' + pid + 'm">Required materials</label><textarea id="' + pid + 'm" rows="2" data-bind="' + lb + '.materials">' + esc(l.materials) + '</textarea></div></div></div>';
        }).join('') +
        '<div class="btn-row"><label for="tpl' + mi + '" class="sr-only">Lesson template</label><select id="tpl' + mi + '" style="max-width:260px"><option value="">Blank lesson</option>' + state.lessonTemplates.map(function (t, ti) { return '<option value="' + ti + '">' + esc(t.name) + '</option>'; }).join('') + '</select><button class="btn btn-sm" data-action="add-lesson" data-mi="' + mi + '">+ Add lesson</button></div></div>';
    }).join('');
    return '<div class="card-head"><h2>' + esc(c.id + ' · ' + c.title) + '</h2><div class="btn-row"><label class="check-row" style="margin:0"><input type="checkbox" data-bind="courses.' + i + '.launchCandidate" data-rerender="1"' + (c.launchCandidate ? ' checked' : '') + '> <span>Launch candidate</span></label><button class="btn btn-sm btn-danger" data-action="del-course">Delete course</button></div></div>' +
      '<div class="fieldset-title">Course details</div><div class="form-grid">' +
      cf(i, 'title', 'Course title') + '<div class="field"><label for="c_division">Division</label><select id="c_division" data-bind="courses.' + i + '.division" data-rerender="1">' + optsKV([['A', 'A · Audio Engineering'], ['B', 'B · Software Development']], c.division) + '</select></div>' +
      cf(i, 'description', 'Course description', 'textarea') + cf(i, 'purpose', 'Educational purpose', 'textarea', 2) + cf(i, 'objectives', 'Learning objectives', 'textarea') +
      cf(i, 'ageRange', 'Recommended age range') + cf(i, 'prerequisites', 'Prerequisite knowledge') + cf(i, 'duration', 'Course duration (e.g., 8 weeks)') + cf(i, 'hoursPerMonth', 'Instruction hours per month', 'number') +
      cf(i, 'format', 'Delivery format', 'select', FORMATS) + cf(i, 'maxClassSize', 'Maximum class size', 'number') + cf(i, 'equipment', 'Required equipment') + cf(i, 'software', 'Required software') +
      cf(i, 'prepTime', 'Instructor preparation time (hours)', 'number') + cf(i, 'proposedPrice', 'Proposed price ($, proposal only)', 'number') + cf(i, 'pricePerStudent', 'Price per student ($)', 'number') + cf(i, 'materialsCost', 'Materials cost per student ($)', 'number') +
      cf(i, 'approvalStatus', 'School approval status', 'select', APPROVAL) + cf(i, 'catalogStatus', 'Catalog listing status', 'select', CATALOG) + cf(i, 'curriculumStatus', 'Curriculum development status', 'select', CURRIC) +
      '</div><div class="fieldset-title">Course builder</div><div class="form-grid">' + cf(i, 'finalProject', 'Final project', 'textarea', 2) + cf(i, 'assessment', 'Assessment criteria', 'textarea', 2) + cf(i, 'materials', 'Required materials (course)', 'textarea', 2) + '</div>' +
      (mods || '<div class="empty" style="margin-bottom:.75rem"><strong>No modules yet.</strong>Add a module, then add lessons from reusable templates.</div>') +
      '<div class="btn-row"><button class="btn" data-action="add-module">+ Add module</button></div>';
  }
  function bindCourseView() { }

  /* ---------- Pricing ---------- */
  function priceCalc(md, students) {
    students = Math.max(0, num(students));
    var applicable = num(md.pricePerSession) * num(md.sessions);
    var gross = students * applicable;
    var groups = students > 0 ? Math.ceil(students / Math.max(1, num(md.classSize))) : 0;
    var instr = groups * num(md.sessions) * num(md.sessionHours);
    var prep = groups * num(md.sessions) * num(md.prepPerSession);
    var expenses = num(md.operating) + num(md.materials) * students;
    var profit = gross - expenses; var hrs = instr + prep;
    return { applicable: applicable, gross: gross, groups: groups, instr: instr, prep: prep, hours: hrs, expenses: expenses, profit: profit, hourly: hrs > 0 ? profit / hrs : null };
  }
  var SCEN = [['cons', 'Conservative'], ['mod', 'Moderate'], ['opt', 'Optimistic']];
  function pricingTop() {
    var pr = state.pricing; if (pr.selected >= pr.models.length) pr.selected = 0;
    var md = pr.models[pr.selected], i = pr.selected;
    var inp = function (k, label, step, hint) { return '<div class="field"><label for="pm_' + k + '">' + label + '</label><input type="number" min="0" step="' + (step || 'any') + '" id="pm_' + k + '" data-bind="pricing.models.' + i + '.' + k + '" value="' + esc(md[k]) + '">' + (hint ? '<div class="hint">' + hint + '</div>' : '') + '</div>'; };
    return '<div class="note warn"><strong>EXAMPLE ASSUMPTIONS — editable.</strong> These figures are placeholders for planning. They are not Heartland rates, Planning Amounts, or approved prices, and results are not guaranteed income.</div>' +
      '<div class="grid grid-2" style="margin:1rem 0"><div class="card"><div class="card-head"><h2>Model inputs</h2><div class="btn-row"><label for="pmSel" class="sr-only">Pricing model</label><select id="pmSel" data-action="select-model" style="max-width:240px">' + pr.models.map(function (m2, k) { return '<option value="' + k + '"' + (k === i ? ' selected' : '') + '>' + esc(m2.name) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="form-grid">' + inp('pricePerSession', 'Price per student per session ($)', '0.01') + inp('sessions', 'Number of sessions (per month or per course)', '1') + inp('sessionHours', 'Duration of each session (hours)', '0.25') + inp('prepPerSession', 'Instructor prep per group session (hours)', '0.25') +
      inp('classSize', 'Class size (max students per group)', '1') + inp('materials', 'Materials cost per student ($)', '0.01') + inp('operating', 'Operating costs for the period ($)', '0.01') + '<div></div>' +
      inp('cons', 'Conservative enrollment (students)', '1') + inp('mod', 'Moderate / expected enrollment', '1') + inp('opt', 'Optimistic enrollment', '1') + '</div>' +
      '<div class="btn-row"><button class="btn btn-sm" data-action="reset-pricing">Reset example assumptions</button></div></div>' +
      '<div class="card"><h2>Results for “' + esc(md.name) + '”</h2><div id="pricingResults"></div><details class="small" style="margin-top:.75rem"><summary>Formulas</summary><p>Applicable price per student = price per session × sessions.<br>Gross revenue = paying students × applicable price.<br>Groups needed = ⌈students ÷ class size⌉.<br>Instruction hours = groups × sessions × session hours; prep hours = groups × sessions × prep per session.<br>Estimated operating profit = gross revenue − (operating costs + materials × students).<br>Estimated hourly earnings = profit ÷ (instruction + prep hours). Before taxes.</p></details></div></div>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-head"><h2>Compare models</h2><div><label for="scSel" class="sr-only">Scenario</label><select id="scSel" data-action="select-scenario">' + optsKV(SCEN, pr.scenario) + '</select></div></div><div id="pricingCompare"></div></div>';
  }
  function updatePricing() {
    var pr = state.pricing, md = pr.models[pr.selected]; var r = $('#pricingResults'), c = $('#pricingCompare'); if (!r) return;
    r.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Scenario</th><th class="num">Students</th><th class="num">Gross revenue</th><th class="num">Expenses</th><th class="num">Est. profit</th><th class="num">Hours</th><th class="num">Est. $/hour</th></tr></thead><tbody>' +
      SCEN.map(function (s) { var x = priceCalc(md, md[s[0]]); return '<tr><td>' + s[1] + '</td><td class="num">' + num(md[s[0]]) + '</td><td class="num">' + money(x.gross) + '</td><td class="num">' + money(x.expenses) + '</td><td class="num ' + (x.profit < 0 ? 'neg' : '') + '">' + money(x.profit) + '</td><td class="num">' + x.hours.toFixed(1) + '</td><td class="num">' + money(x.hourly) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="small muted" style="margin-top:.5rem">Applicable price per student: ' + money(num(md.pricePerSession) * num(md.sessions)) + ' · <span class="badge b-projected">HYPOTHETICAL</span></p>';
    c.innerHTML = '<div class="table-wrap"><table class="responsive"><thead><tr><th>Model</th><th class="num">Price / student</th><th class="num">Students</th><th class="num">Gross revenue</th><th class="num">Est. profit</th><th class="num">Hours</th><th class="num">Est. $/hour</th></tr></thead><tbody>' +
      pr.models.map(function (m2) { var x = priceCalc(m2, m2[pr.scenario]); return '<tr><td data-label="Model">' + esc(m2.name) + '</td><td data-label="Price / student" class="num">' + money(x.applicable) + '</td><td data-label="Students" class="num">' + num(m2[pr.scenario]) + '</td><td data-label="Gross" class="num">' + money(x.gross) + '</td><td data-label="Profit" class="num ' + (x.profit < 0 ? 'neg' : '') + '">' + money(x.profit) + '</td><td data-label="Hours" class="num">' + x.hours.toFixed(1) + '</td><td data-label="$/hour" class="num">' + money(x.hourly) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    $$('[data-bind^="pricing.models"]').forEach(function (inp) { var w = inp.closest('.field'); var bad = inp.value !== '' && (!hasNum(inp.value) || num(inp.value) < 0); w.classList.toggle('invalid', bad); var e = $('.error', w); if (bad && !e) { e = document.createElement('div'); e.className = 'error'; e.textContent = 'Enter 0 or a positive number.'; w.appendChild(e); } if (!bad && e) e.remove(); });
  }

  /* ---------- Marketing funnel ---------- */
  function marketingBottom() {
    var rows = state.funnel.slice().sort(function (a, b) { return a.month < b.month ? 1 : -1; });
    var tot = rows.reduce(function (a, r) { a.i += num(r.inquiries); a.c += num(r.consults); a.e += num(r.enrollments); return a; }, { i: 0, c: 0, e: 0 });
    return '<div class="card" style="margin-top:1rem"><div class="card-head"><h2>Parent inquiry funnel</h2><button class="btn btn-sm btn-primary" data-action="add-rec" data-coll="funnel">+ Add month</button></div><p class="small">Counts only — no names or contact details are stored here. Use this for P8-08 and P8-16.</p>' +
      (rows.length ? '<div class="table-wrap"><table class="responsive"><thead><tr><th>Month</th><th class="num">Inquiries</th><th class="num">Consultations</th><th class="num">Enrollments</th><th class="num">Conversion</th><th>Notes</th><th>Actions</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td data-label="Month">' + esc(r.month) + '</td><td data-label="Inquiries" class="num">' + num(r.inquiries) + '</td><td data-label="Consultations" class="num">' + num(r.consults) + '</td><td data-label="Enrollments" class="num">' + num(r.enrollments) + '</td><td data-label="Conversion" class="num">' + (num(r.inquiries) ? pct(num(r.enrollments) / num(r.inquiries)) : '—') + '</td><td data-label="Notes">' + esc(r.notes) + '</td><td data-label="Actions">' + recActions('funnel', r.id) + '</td></tr>'; }).join('') +
        '<tr><th>Total</th><th class="num">' + tot.i + '</th><th class="num">' + tot.c + '</th><th class="num">' + tot.e + '</th><th class="num">' + (tot.i ? pct(tot.e / tot.i) : '—') + '</th><th colspan="2"></th></tr></tbody></table></div>' : '<div class="empty"><strong>No inquiry data yet.</strong>Add a month once parents start contacting you.</div>') + '</div>';
  }

  /* ---------- Enrollment ---------- */
  function enrollmentTop() {
    var ms = getTask('P10-17');
    var done = ms && isDone(ms);
    return '<div class="card next-hero" style="margin-bottom:1rem"><div class="kicker">Milestone</div><h2>First paid student: ' + (done ? '✓ Confirmed ' + fmtDate(ms.completedDate) : 'Not yet') + '</h2>' +
      '<p>This milestone can only be marked complete after you confirm that authorized instruction actually occurred <strong>and</strong> payment was received. Interest, inquiries, or pending orders do not count.</p>' +
      (ms ? (done ? '<button class="btn" data-action="open-task" data-id="P10-17">View evidence</button>' : '<button class="btn btn-primary" data-action="complete" data-id="P10-17">Confirm first paid student…</button>') : '<p class="small muted">The milestone task (P10-17) was deleted. Restore default tasks in Settings to bring it back.</p>') +
      '</div><div class="note info">Privacy: track enrollment numbers in Financial Tracking. Do not store student names, schools, records, or contact details in this app.</div>';
  }

  /* ---------- Generic records (comms, apps, ledger, resources, funnel) ---------- */
  var SCHEMAS = {
    comms: { title: 'communication', fields: [
      ['date', 'Date *', 'date', true], ['org', 'Organization *', 'text', true], ['person', 'Contact person', 'text'], ['method', 'Contact method', 'select', false, ['Email', 'Phone', 'Video call', 'In person', 'Web form', 'Portal message', 'Other']],
      ['subject', 'Subject *', 'text', true, null, 'span-2'], ['questions', 'Questions asked', 'textarea'], ['answers', 'Answers received', 'textarea'], ['followUp', 'Follow-up required', 'select', false, ['No', 'Yes']], ['followUpDate', 'Follow-up date', 'date'],
      ['task', 'Related task ID', 'task'], ['notes', 'Notes', 'textarea']] },
    apps: { title: 'school application', fields: [
      ['org', 'Organization *', 'text', true, null, 'span-2'], ['appDate', 'Application date', 'date'], ['status', 'Current status', 'select', false, ['Researching', 'Inquiry sent', 'Preparing application', 'Submitted', 'Additional info requested', 'Approved (confirmed in writing)', 'Not approved', 'On hold']],
      ['ref', 'Reference number', 'text'], ['lastContact', 'Last contact date', 'date'], ['nextFollowUp', 'Next follow-up date', 'date'], ['approvalDate', 'Approval date', 'date'],
      ['docs', 'Documents submitted', 'textarea'], ['outstanding', 'Outstanding requirements', 'textarea'], ['notes', 'Notes', 'textarea']] },
    ledger: { title: 'ledger entry', fields: [
      ['date', 'Date *', 'date', true], ['type', 'Type', 'select', false, ['Revenue', 'Startup expense', 'Operating expense']], ['basis', 'Basis', 'select', false, ['Actual', 'Projected']],
      ['amount', 'Amount ($) *', 'number', true], ['description', 'Description *', 'text', true, null, 'span-2'], ['notes', 'Notes', 'textarea']] },
    resources: { title: 'resource', fields: [
      ['name', 'Name *', 'text', true], ['group', 'Section', 'select', false, ['Heartland official documentation', 'California government resources', 'Federal government resources', 'Santa Barbara local requirements', 'Insurance and compliance', 'Course development', 'Marketing and business operations']],
      ['url', 'URL *', 'url', true, null, 'span-2'], ['description', 'Description', 'textarea'], ['tasks', 'Relevant task IDs (comma-separated)', 'tasklist'], ['verification', 'Verification status', 'select', false, RES_VERIF], ['lastVerified', 'Last verification date', 'date'], ['notes', 'Notes', 'textarea']] },
    funnel: { title: 'month', fields: [['month', 'Month (YYYY-MM) *', 'month', true], ['inquiries', 'Inquiries', 'number'], ['consults', 'Consultations / demos', 'number'], ['enrollments', 'Enrollments', 'number'], ['notes', 'Notes', 'textarea']] }
  };
  function recActions(coll, id) { return '<div class="btn-row" style="flex-wrap:nowrap"><button class="btn btn-sm" data-action="edit-rec" data-coll="' + coll + '" data-id="' + esc(id) + '">Edit</button><button class="btn btn-sm btn-danger" data-action="del-rec" data-coll="' + coll + '" data-id="' + esc(id) + '">Delete</button></div>'; }
  function editRecord(coll, id, preset) {
    var sc = SCHEMAS[coll], rec = id ? state[coll].find(function (r) { return r.id === id; }) : Object.assign({}, preset || {});
    if (!rec) return;
    var body = '<div class="form-grid">' + sc.fields.map(function (f) {
      var k = f[0], v = rec[k] == null ? (f[2] === 'date' && !id && (k === 'date') ? today() : (f[2] === 'month' && !id ? thisMonth() : '')) : rec[k];
      if (k === 'tasks' && Array.isArray(v)) v = v.join(', ');
      var inp;
      if (f[2] === 'textarea') inp = '<textarea id="r_' + k + '" name="' + k + '" rows="3">' + esc(v) + '</textarea>';
      else if (f[2] === 'select') inp = '<select id="r_' + k + '" name="' + k + '">' + opts(f[4], v || f[4][0]) + '</select>';
      else if (f[2] === 'task') inp = '<select id="r_' + k + '" name="' + k + '"><option value="">— None —</option>' + state.tasks.slice().sort(sortDefault).map(function (t) { return '<option value="' + esc(t.id) + '"' + (t.id === v ? ' selected' : '') + '>' + esc(t.id + ' — ' + t.title) + '</option>'; }).join('') + '</select>';
      else inp = '<input id="r_' + k + '" name="' + k + '" type="' + (f[2] === 'tasklist' ? 'text' : f[2] === 'month' ? 'text' : f[2]) + '"' + (f[2] === 'number' ? ' min="0" step="any"' : '') + (f[2] === 'month' ? ' placeholder="2026-11" pattern="\\d{4}-\\d{2}"' : '') + ' value="' + esc(v) + '">';
      return '<div class="field ' + (f[5] || (f[2] === 'textarea' ? 'span-2' : '')) + '"><label for="r_' + k + '">' + esc(f[1]) + '</label>' + inp + '</div>';
    }).join('') + '</div>' +
      (coll === 'apps' ? '<label class="check-row"><input type="checkbox" name="approvalConfirm"' + (/^Approved/.test(rec.status || '') ? ' checked' : '') + '> <span>If status is Approved: I have written approval from this school.</span></label>' : '') +
      (coll === 'resources' ? '<p class="small muted">"Verified Current" means you checked the current official page yourself on the date entered — a link being listed here does not verify it.</p>' : '') +
      (coll === 'ledger' ? '<p class="small muted">Use <strong>Projected</strong> for anything not yet received or paid. Projected entries never count as actual results.</p>' : '') +
      '<p class="small muted">Do not enter passwords, ID numbers, payment credentials, or student information.</p>';
    openModal({
      title: (id ? 'Edit ' : 'Add ') + sc.title, body: body,
      buttons: [{ label: 'Cancel' }, { label: id ? 'Save' : 'Add', primary: true, handler: function (b) {
        clearErrors(b); var ok = true; var out = {};
        sc.fields.forEach(function (f) {
          var el = $('[name=' + f[0] + ']', b); var v = el.value.trim();
          if (f[3] && v === '') { fieldError(b, f[0], 'Required.'); ok = false; return; }
          if (f[2] === 'date' && !validDate(v)) { fieldError(b, f[0], 'Enter a valid date.'); ok = false; }
          if (f[2] === 'month' && v && !/^\d{4}-(0[1-9]|1[0-2])$/.test(v)) { fieldError(b, f[0], 'Use the format YYYY-MM.'); ok = false; }
          if (f[2] === 'number' && v !== '' && (!hasNum(v) || num(v) < 0)) { fieldError(b, f[0], 'Enter 0 or a positive number.'); ok = false; }
          if (f[2] === 'url' && !validUrl(v)) { fieldError(b, f[0], 'Enter a full URL starting with https://'); ok = false; }
          if (f[2] === 'tasklist') { var ids = v.split(/[\s,]+/).map(function (s) { return s.toUpperCase(); }).filter(Boolean); var m = taskMap(); var bad = ids.filter(function (x) { return !m[x]; }); if (bad.length) { fieldError(b, f[0], 'Unknown task ID(s): ' + bad.join(', ')); ok = false; } v = ids; }
          out[f[0]] = v;
        });
        if (coll === 'apps' && /^Approved/.test(out.status)) {
          if (!$('[name=approvalConfirm]', b).checked) { fieldError(b, 'status', 'Check the written-approval confirmation below, or choose another status.'); ok = false; }
          if (!out.approvalDate) { fieldError(b, 'approvalDate', 'Enter the approval date.'); ok = false; }
        }
        if (coll === 'resources' && out.verification === 'Verified Current' && !out.lastVerified) { fieldError(b, 'lastVerified', 'Enter the date you verified it.'); ok = false; }
        if (!ok) return false;
        if (id) Object.assign(rec, out); else state[coll].push(Object.assign({ id: uid() }, out));
        save();
      }, after: function () { render(); toast('Saved'); } }]
    });
  }
  function deleteRecord(coll, id) {
    var sc = SCHEMAS[coll];
    confirmDialog({ title: 'Delete ' + sc.title + '?', message: 'This ' + sc.title + ' will be permanently removed.', confirmLabel: 'Delete', danger: true }).then(function (r) {
      if (!r.ok) return; state[coll] = state[coll].filter(function (x) { return x.id !== id; }); save(); render(); toast('Deleted');
    });
  }

  /* ---------- Finance ---------- */
  function viewFinance(el) {
    var f = state.finance;
    var inp = function (k, label, hint) { return '<div class="field"><label for="f_' + k + '">' + label + '</label><input type="number" min="0" step="any" id="f_' + k + '" data-bind="finance.' + k + '" value="' + esc(f[k]) + '" inputmode="decimal">' + (hint ? '<div class="hint">' + hint + '</div>' : '') + '</div>'; };
    var pr = state.pricing, md = pr.models[pr.selected] || pr.models[0], proj = md ? priceCalc(md, md.mod) : null;
    el.innerHTML = '<p class="page-intro">Enter real figures only. <span class="badge b-actual">ACTUAL</span> means money that has actually been spent or received. <span class="badge b-projected">PROJECTED</span> figures are hypothetical and never guaranteed.</p>' +
      '<div class="grid grid-2"><div class="card"><h2>Your figures <span class="badge b-actual">ACTUAL</span></h2><div class="form-grid">' +
      inp('startupBudget', 'Startup budget ($)', 'A plan figure — what you intend to spend.') + inp('startupExpenses', 'Actual startup expenses ($)') +
      inp('revenueTarget', 'Monthly revenue target ($)', 'A goal, not a forecast.') + inp('actualRevenue', 'Actual monthly revenue ($)', 'Payments actually received this month.') +
      inp('opExpenses', 'Monthly operating expenses ($)') + inp('students', 'Number of enrolled students') + inp('activeCourses', 'Number of active courses') +
      '</div><div class="btn-row"><button class="btn btn-sm" data-action="apply-ledger">Fill from ledger actuals</button></div></div>' +
      '<div class="stack"><div class="card"><h2>Calculated</h2><dl class="kv" id="finOut"></dl><div id="finBar" style="margin-top:.6rem"></div></div>' +
      '<div class="card"><h2>Projection <span class="badge b-projected">HYPOTHETICAL</span></h2>' + (proj ? '<p class="small">From the Pricing Calculator model “' + esc(md.name) + '” at its moderate enrollment (' + num(md.mod) + ' students). Based on example assumptions — not guaranteed income and not based on verified Heartland funding.</p><dl class="kv"><dt>Projected gross revenue</dt><dd>' + money(proj.gross) + '</dd><dt>Projected operating profit</dt><dd class="' + (proj.profit < 0 ? 'neg' : '') + '">' + money(proj.profit) + '</dd><dt>Projected $/hour</dt><dd>' + money(proj.hourly) + '</dd></dl><a class="btn btn-sm" href="#pricing" style="margin-top:.5rem">Adjust in Pricing Calculator</a>' : '') + '</div></div></div>' +
      ledgerSection();
    updateFinance();
  }
  function ledgerTotals() {
    var mo = thisMonth(), t = { startup: 0, rev: 0, op: 0, pStartup: 0, pRev: 0, pOp: 0 };
    state.ledger.forEach(function (r) {
      var a = num(r.amount), act = r.basis !== 'Projected';
      if (r.type === 'Startup expense') { if (act) t.startup += a; else t.pStartup += a; }
      if (r.type === 'Revenue' && (r.date || '').slice(0, 7) === mo) { if (act) t.rev += a; else t.pRev += a; }
      if (r.type === 'Operating expense' && (r.date || '').slice(0, 7) === mo) { if (act) t.op += a; else t.pOp += a; }
    });
    return t;
  }
  function ledgerSection() {
    var rows = state.ledger.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }), t = ledgerTotals();
    return '<div class="card" style="margin-top:1rem"><div class="card-head"><h2>Ledger</h2><button class="btn btn-sm btn-primary" data-action="add-rec" data-coll="ledger">+ Add entry</button></div>' +
      '<p class="small">This month (' + thisMonth() + '): actual revenue ' + money(t.rev) + ' · actual operating expenses ' + money(t.op) + ' · all-time actual startup expenses ' + money(t.startup) + (t.pRev || t.pOp || t.pStartup ? ' · <span class="badge b-projected">projected entries excluded</span>' : '') + '</p>' +
      (rows.length ? '<div class="table-wrap"><table class="responsive"><thead><tr><th>Date</th><th>Type</th><th>Basis</th><th>Description</th><th class="num">Amount</th><th>Actions</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td data-label="Date">' + fmtDate(r.date) + '</td><td data-label="Type">' + esc(r.type) + '</td><td data-label="Basis"><span class="badge ' + (r.basis === 'Projected' ? 'b-projected' : 'b-actual') + '">' + esc(r.basis) + '</span></td><td data-label="Description">' + esc(r.description) + '</td><td data-label="Amount" class="num">' + money(num(r.amount)) + '</td><td data-label="Actions">' + recActions('ledger', r.id) + '</td></tr>'; }).join('') + '</tbody></table></div>' :
        '<div class="empty"><strong>No ledger entries yet.</strong>Record startup expenses as you spend and revenue only when it is received.</div>') + '</div>';
  }
  function updateFinance() {
    var o = $('#finOut'); if (!o) return; var fc = financeCalc(), f = state.finance;
    o.innerHTML = '<dt>Remaining startup budget</dt><dd class="' + (fc.remaining < 0 ? 'neg' : '') + '">' + money(fc.remaining) + '</dd>' +
      '<dt>Gross revenue (actual)</dt><dd>' + money(fc.gross) + '</dd>' +
      '<dt>Estimated operating profit before taxes</dt><dd class="' + (fc.profit < 0 ? 'neg' : '') + '">' + money(fc.profit) + '</dd>' +
      '<dt>Progress toward monthly revenue goal</dt><dd>' + (num(f.revenueTarget) > 0 ? pct(fc.progress) : '<span class="small muted">Set a target</span>') + '</dd>' +
      '<dt>Average revenue per student</dt><dd>' + (num(f.students) > 0 ? money(fc.avg) : '<span class="small muted">No students</span>') + '</dd>';
    $('#finBar').innerHTML = fc.progress != null ? bar(Math.min(1, fc.progress), 'ok') : '';
    $$('[data-bind^="finance."]').forEach(function (inp) { var w = inp.closest('.field'); var bad = inp.value !== '' && (!hasNum(inp.value) || num(inp.value) < 0); w.classList.toggle('invalid', bad); var e = $('.error', w); if (bad && !e) { e = document.createElement('div'); e.className = 'error'; e.setAttribute('role', 'alert'); e.textContent = 'Enter 0 or a positive number.'; w.appendChild(e); } if (!bad && e) e.remove(); });
  }

  /* ---------- Charter school tracker ---------- */
  function viewSchools(el) {
    el.innerHTML = '<p class="page-intro">Track each charter school independently. Mark a school "Approved" only with written approval.</p>' +
      '<div class="btn-row" style="margin-bottom:1rem"><button class="btn btn-primary" data-action="add-rec" data-coll="apps">+ Add school</button></div>' +
      (state.apps.length ? '<div class="table-wrap"><table class="responsive"><thead><tr><th>Organization</th><th>Status</th><th>Applied</th><th>Reference #</th><th>Documents submitted</th><th>Outstanding</th><th>Last contact</th><th>Next follow-up</th><th>Approved</th><th>Actions</th></tr></thead><tbody>' +
        state.apps.map(function (a) { var due = a.nextFollowUp && a.nextFollowUp <= today(); return '<tr><td data-label="Organization"><strong>' + esc(a.org) + '</strong>' + (a.notes ? '<div class="small muted">' + esc(a.notes) + '</div>' : '') + '</td><td data-label="Status"><span class="badge ' + (/^Approved/.test(a.status) ? 'b-verified' : a.status === 'Not approved' ? 'b-blocked' : 'b-waiting') + '">' + esc(a.status) + '</span></td><td data-label="Applied">' + fmtDate(a.appDate) + '</td><td data-label="Reference #">' + esc(a.ref || '—') + '</td><td data-label="Documents" class="small">' + esc(a.docs || '—') + '</td><td data-label="Outstanding" class="small">' + esc(a.outstanding || '—') + '</td><td data-label="Last contact">' + fmtDate(a.lastContact) + '</td><td data-label="Next follow-up">' + (a.nextFollowUp ? '<span class="badge ' + (due ? 'b-overdue' : '') + '">' + fmtDate(a.nextFollowUp) + '</span>' : '—') + '</td><td data-label="Approved">' + fmtDate(a.approvalDate) + '</td><td data-label="Actions">' + recActions('apps', a.id) + '</td></tr>'; }).join('') + '</tbody></table></div>' :
        '<div class="empty"><strong>No schools tracked.</strong>Add Heartland and any other charter schools you are researching.</div>');
  }

  /* ---------- Communications ---------- */
  function viewComms(el) {
    var rows = state.comms.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    el.innerHTML = '<p class="page-intro">Log every interaction with Heartland and other organizations: what you asked, what they answered, and what happens next. Written answers are the evidence for "Verified Current".</p>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-head"><h2>Communication log</h2><button class="btn btn-sm btn-primary" data-action="add-rec" data-coll="comms">+ Log interaction</button></div>' +
      (rows.length ? '<div class="table-wrap"><table class="responsive"><thead><tr><th>Date</th><th>Organization</th><th>Contact</th><th>Method</th><th>Subject</th><th>Questions → Answers</th><th>Follow-up</th><th>Task</th><th>Actions</th></tr></thead><tbody>' +
        rows.map(function (c) { return '<tr><td data-label="Date">' + fmtDate(c.date) + '</td><td data-label="Organization">' + esc(c.org) + '</td><td data-label="Contact">' + esc(c.person || '—') + '</td><td data-label="Method">' + esc(c.method) + '</td><td data-label="Subject"><strong>' + esc(c.subject) + '</strong>' + (c.notes ? '<div class="small muted">' + esc(c.notes) + '</div>' : '') + '</td><td data-label="Q → A" class="small" style="white-space:pre-wrap">' + (c.questions ? '<strong>Q:</strong> ' + esc(c.questions) + '\n' : '') + (c.answers ? '<strong>A:</strong> ' + esc(c.answers) : '') + '</td><td data-label="Follow-up">' + (c.followUp === 'Yes' ? '<span class="badge ' + (c.followUpDate && c.followUpDate <= today() ? 'b-overdue' : 'b-waiting') + '">' + (c.followUpDate ? fmtDate(c.followUpDate) : 'Yes') + '</span>' : 'No') + '</td><td data-label="Task">' + (c.task ? '<button class="btn btn-sm btn-ghost" data-action="open-task" data-id="' + esc(c.task) + '">' + esc(c.task) + '</button>' : '—') + '</td><td data-label="Actions">' + recActions('comms', c.id) + '</td></tr>'; }).join('') + '</tbody></table></div>' :
        '<div class="empty"><strong>No interactions logged.</strong>When you email or call Heartland, record it here.</div>') + '</div>' +
      '<div class="card"><h2><label for="projNotes" style="font-size:inherit;color:inherit;margin:0">Project notes</label></h2><p class="small muted">Auto-saved. General decisions and ideas. No passwords or student information.</p><textarea id="projNotes" data-bind="projectNotes" rows="10">' + esc(state.projectNotes) + '</textarea></div>';
  }

  /* ---------- Documents ---------- */
  function viewDocuments(el) {
    var d = state.docs.find(function (x) { return x.id === ui.doc; }) || state.docs[0];
    if (d) ui.doc = d.id;
    var di = d ? state.docs.indexOf(d) : -1;
    el.innerHTML = '<p class="page-intro">Draft and save documents from editable templates. <strong>Drafts only:</strong> this app never sends email or submits anything, and saving a document does not mean it was sent or approved.</p>' +
      '<div class="course-layout"><div class="card"><div class="card-head"><h2>Documents</h2></div><div class="field"><label for="tplSel">New from template</label><select id="tplSel">' + SEED.docTemplates.map(function (t, i) { return '<option value="' + i + '">' + esc(t.type) + '</option>'; }).join('') + '</select></div><div class="btn-row" style="margin-bottom:.75rem"><button class="btn btn-sm btn-primary" data-action="new-doc">Create draft</button></div>' +
      (state.docs.length ? '<ul class="course-list">' + state.docs.map(function (x) { return '<li><button data-action="select-doc" data-id="' + esc(x.id) + '" aria-current="' + (x.id === ui.doc) + '">' + esc(x.title || 'Untitled') + '<div class="task-meta"><span class="badge">' + esc(x.type) + '</span><span class="badge ' + (x.status === 'Final' ? 'b-complete' : '') + '">' + esc(x.status) + '</span></div></button></li>'; }).join('') + '</ul>' : '<div class="empty"><strong>No drafts yet.</strong>Pick a template and create a draft.</div>') + '</div>' +
      '<div class="card doc-editor">' + (d ? '<div class="form-grid"><div class="field"><label for="d_title">Title</label><input type="text" id="d_title" data-bind="docs.' + di + '.title" data-rerender="1" value="' + esc(d.title) + '"></div><div class="field"><label for="d_status">Status</label><select id="d_status" data-bind="docs.' + di + '.status" data-rerender="1">' + opts(['Draft', 'Ready for review', 'Final'], d.status) + '</select></div></div>' +
        '<div class="field"><label for="d_body">Content <span class="muted small">(' + esc(d.type) + ' · edited ' + fmtDateTime(d.updated) + ')</span></label><textarea id="d_body" data-bind="docs.' + di + '.body">' + esc(d.body) + '</textarea></div>' +
        '<div class="btn-row"><button class="btn btn-primary" data-action="copy-doc">Copy to clipboard</button><button class="btn" data-action="dup-doc">Duplicate</button><button class="btn btn-danger" data-action="del-doc">Delete</button></div><p class="small muted" style="margin-top:.5rem">Replace every [bracketed placeholder]. Include only true, verifiable information.</p>'
        : '<div class="empty"><strong>Select or create a document.</strong>Templates include a Heartland vendor inquiry email with the key questions to confirm.</div>') + '</div></div>';
  }
  function newDoc(i) {
    var t = SEED.docTemplates[i]; var d = { id: uid(), type: t.type, title: t.title, status: 'Draft', body: t.body, created: nowIso(), updated: nowIso() };
    state.docs.unshift(d); ui.doc = d.id; save();
  }
  function copyText(text) {
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) { } ta.remove(); toast(ok ? 'Copied to clipboard' : 'Copy failed — select the text and copy manually'); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { toast('Copied to clipboard'); }, fallback); else fallback();
  }

  /* ---------- Resources ---------- */
  function viewResources(el) {
    var groups = SCHEMAS.resources.fields[1][4];
    var m = taskMap();
    el.innerHTML = '<p class="page-intro">Official and useful resources. Buttons open in a new tab. <strong>A resource listed here is not verified</strong> — set "Verified Current" only after you check the current page yourself, and record the date.</p>' +
      '<div class="card" style="margin-bottom:1rem"><div class="card-head"><h2>How to read labels</h2><button class="btn btn-sm btn-primary" data-action="add-rec" data-coll="resources">+ Add resource</button></div><div class="legend">' + verBadge('Verified Current') + verBadge('Verify Current Requirements') + verBadge('User-provided') + verBadge('Planning Assumption') + '</div><p class="small muted" style="margin-top:.5rem">Verified current information · Information requiring confirmation · Information you provided · Assumptions used for planning.</p></div>' +
      groups.map(function (g, gi) {
        var rs = state.resources.filter(function (r) { return r.group === g; });
        return '<h2 class="section-title">' + (gi + 1) + '. ' + esc(g) + '</h2>' + (rs.length ? '<div class="table-wrap"><table class="responsive"><thead><tr><th>Resource</th><th>Related tasks</th><th>Verification</th><th>Last verified</th><th>Actions</th></tr></thead><tbody>' +
          rs.map(function (r) {
            var ids = (Array.isArray(r.tasks) ? r.tasks : []).slice(); state.tasks.forEach(function (t) { if (t.resource && t.resource === r.url && ids.indexOf(t.id) < 0) ids.push(t.id); });
            return '<tr><td data-label="Resource"><strong>' + esc(r.name) + '</strong><div class="small">' + esc(r.description) + '</div><div class="small muted" style="word-break:break-all">' + esc(r.url) + '</div>' + (r.notes ? '<div class="small">Notes: ' + esc(r.notes) + '</div>' : '') + '</td>' +
              '<td data-label="Related tasks">' + (ids.length ? ids.filter(function (x) { return m[x]; }).map(function (x) { return '<button class="btn btn-sm btn-ghost" data-action="open-task" data-id="' + esc(x) + '">' + esc(x) + '</button>'; }).join(' ') : '—') + '</td>' +
              '<td data-label="Verification">' + verBadge(r.verification) + '</td><td data-label="Last verified">' + fmtDate(r.lastVerified) + '</td>' +
              '<td data-label="Actions"><div class="btn-row" style="flex-wrap:nowrap"><a class="btn btn-sm btn-primary" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">Open ↗</a>' + recActions('resources', r.id).replace('<div class="btn-row" style="flex-wrap:nowrap">', '') + '</div></td></tr>';
          }).join('') + '</tbody></table></div>' : '<div class="empty"><strong>No resources in this section.</strong></div>');
      }).join('');
  }

  /* ---------- Guide ---------- */
  var GUIDE_SECTIONS = [
    ['g-start', 'Start here: your first 15 minutes'],
    ['g-daily', 'Your weekly routine'],
    ['g-order', 'Order vs. doing things in parallel'],
    ['g-task', 'Working a single task'],
    ['g-labels', 'What the evidence labels mean'],
    ['g-milestones', 'Milestones that need proof'],
    ['g-pages', 'What each page is for'],
    ['g-heartland', 'Heartland: the path to your first payment'],
    ['g-money', 'Money: actual vs. projected'],
    ['g-data', 'Saving, backups, and devices'],
    ['g-update', 'Updating your live site on GitHub'],
    ['g-faq', 'Quick answers']
  ];
  function viewGuide(el) {
    var tLink = function (id) { var t = getTask(id); return '<button class="btn btn-sm btn-ghost" data-action="open-task" data-id="' + id + '" style="padding:.1rem .35rem;min-height:0">' + id + (t ? ' — ' + esc(t.title) : '') + '</button>'; };
    var go = function (view, label) { return '<a href="#' + view + '">' + esc(label) + '</a>'; };
    var sec = function (id, title, body) { return '<section class="card guide-sec" id="' + id + '" tabindex="-1"><h2>' + esc(title) + '</h2>' + body + '<p class="small" style="margin:.75rem 0 0"><button class="btn btn-sm btn-ghost" data-action="guide-top">↑ Back to contents</button></p></section>'; };
    var s = stats();
    el.innerHTML = '<div class="guide">' +
      '<div class="card next-hero"><div class="kicker">How to use this dashboard</div><h2>One place to go from idea to first paid student</h2>' +
      '<p>This dashboard holds every step for launching your creative technology courses and getting approved as a Heartland vendor, from setting up the business to receiving your first payment. Right now you have <strong>' + s.remaining + ' required tasks</strong> left and <strong>' + s.ready + ' ready to start</strong>.</p>' +
      '<p class="small muted" style="margin:0">Short version: open the <a href="#dashboard">Dashboard</a>, do what "What should I do next?" says (or anything in "Ready now"), check it off, and repeat. Everything saves automatically.</p></div>' +
      '<nav class="card" aria-label="Guide contents" id="g-toc"><h2>Contents</h2><ol class="guide-toc">' + GUIDE_SECTIONS.map(function (g) { return '<li><button class="btn btn-ghost btn-sm" data-action="guide-jump" data-target="' + g[0] + '">' + esc(g[1]) + '</button></li>'; }).join('') + '</ol></nav>' +

      sec('g-start', 'Start here: your first 15 minutes', '<ol class="guide-steps">' +
        '<li><strong>Bookmark this page.</strong> Your progress lives in this browser on this device (see "Saving, backups, and devices").</li>' +
        '<li><strong>Set your details.</strong> In ' + go('settings', 'Settings & Backup') + ', change the business name if you have one. "Creative Technology Academy" is only a working title.</li>' +
        '<li><strong>Do the first task.</strong> ' + tLink('P1-01') + ': write a short description of the business in the task\'s Notes, then check it off.</li>' +
        '<li><strong>Start the Heartland research.</strong> ' + tLink('P2-01') + ': open the official page from the task, read it, and write down what it requires and today\'s date in Notes.</li>' +
        '<li><strong>Draft your inquiry email.</strong> Go to ' + go('documents', 'Documents') + ' → "Vendor inquiry email" → Create draft. Fill in the [brackets], copy it, and send it from your own email. Then log it in ' + go('comms', 'Notes & Communications') + ' and check off ' + tLink('P2-04') + '.</li>' +
        '<li><strong>Export a backup.</strong> ' + go('settings', 'Settings & Backup') + ' → Export JSON backup. Do this every week or so.</li></ol>') +

      sec('g-daily', 'Your weekly routine', '<ol class="guide-steps">' +
        '<li>Open the ' + go('dashboard', 'Dashboard') + '. Look at <em>What should I do next?</em> and <em>Ready now</em>.</li>' +
        '<li>Pick 3–5 tasks. Set each one\'s status to <strong>In Progress</strong> so they show up together.</li>' +
        '<li>Work on them, and put what you learned in each task\'s <strong>Notes</strong>: names, dates, answers, links.</li>' +
        '<li>Check off tasks once you meet their <strong>Done when</strong> criteria.</li>' +
        '<li>If you\'re waiting on someone else (Heartland, an insurer), set the status to <strong>Waiting</strong> and add a follow-up date in the ' + go('schools', 'Charter School Tracker') + ' or the communication log.</li>' +
        '<li>At the end of the week, export a backup.</li></ol>') +

      sec('g-order', 'Order vs. doing things in parallel', '<p>You do <strong>not</strong> have to finish things in order. You\'re in <strong>' + (strictMode() ? 'Strict' : 'Flexible') + ' mode</strong>. ' + (strictMode() ? 'Completing a task early asks you for a reason, which is recorded.' : 'You can check off any task at any time.') + '</p>' +
        '<ul><li><span class="badge b-complete">Ready</span> All of its earlier steps are done. Start it now.</li>' +
        '<li><span class="badge b-notstarted">Suggested after P2-04</span> There\'s a recommended earlier step, but nothing stops you from working on this now.</li>' +
        '<li><strong>Ready now</strong> (on the Dashboard, and as a filter in the Master Checklist) lists everything you can work on at the same time, across all phases.</li>' +
        '<li>Want to go step by step instead? In the ' + go('checklist', 'Master Checklist') + ', choose <em>Sort by → Recommended order</em>.</li>' +
        '<li>To require a reason for skipping ahead, change <em>Dependency mode</em> to Strict in ' + go('settings', 'Settings') + '.</li></ul>') +

      sec('g-task', 'Working a single task', '<ul>' +
        '<li><strong>Details</strong> opens the instructions, the "Done when" criteria, the official link, Notes, and history.</li>' +
        '<li><strong>Checkbox or status</strong> marks it complete. Uncheck it, or click <em>Reopen task</em>, to undo.</li>' +
        '<li><strong>Edit</strong> lets you set a target date, change the priority, make the task optional, track hours, or change its earlier steps.</li>' +
        '<li><strong>+ Add task</strong> (Master Checklist or any phase page) adds your own tasks.</li>' +
        '<li>Overdue tasks get a red edge and an <span class="badge b-overdue">Overdue</span> badge.</li>' +
        '<li>Optional tasks (like Growth) don\'t count toward your launch percentage.</li></ul>') +

      sec('g-labels', 'What the evidence labels mean', '<p>Every requirement carries a label so you always know what\'s confirmed and what\'s still a guess.</p><ul>' +
        '<li>' + verBadge('Verify Current Requirements') + ': plausible, but not yet confirmed. Most Heartland and government items start here.</li>' +
        '<li>' + verBadge('Verified Current') + ': you confirmed it from a current official page or in writing. The app requires a source and a date.</li>' +
        '<li>' + verBadge('User Confirmed') + ': something you personally did or confirmed.</li>' +
        '<li>' + verBadge('Planning Assumption') + ': a number or choice you\'re using for planning. It\'s not a fact.</li>' +
        '<li>' + verBadge('Internal Task') + ': your own decision or work, with nothing to verify externally.</li></ul>' +
        '<p class="small">To upgrade a label: Edit the task → Verification status → enter the official URL (or "Email from vendor dept") and the date.</p>') +

      sec('g-milestones', 'Milestones that need proof', '<p>A few tasks ask you to tick confirmation boxes and describe your evidence before they can be checked off. This keeps the dashboard honest:</p><ul>' +
        '<li>' + tLink('P2-18') + '</li><li>' + tLink('P2-24') + '</li><li>' + tLink('P4-05') + '</li><li>' + tLink('P10-08') + '</li><li>' + tLink('P10-10') + '</li><li>' + tLink('P10-11') + '</li><li>' + tLink('P10-17') + '</li></ul>' +
        '<p class="small">Interest from a parent, a sent email, or a pending order never counts as a milestone. The ' + go('enrollment', 'Student Enrollment') + ' page has the "First paid student" button.</p>') +

      sec('g-pages', 'What each page is for', '<dl class="kv guide-pages">' +
        [['dashboard', 'Dashboard', 'Progress, what to do next, Ready now, money summary.'],
         ['checklist', 'Master Checklist', 'All tasks: search, filter, sort, print.'],
         ['heartland', 'Heartland Application', 'Phase 2 tasks, application status, official links, inquiry email.'],
         ['setup', 'Business Setup', 'Business model research plus registration and taxes (Phases 1 & 3).'],
         ['compliance', 'Compliance', 'Background checks, insurance, student safety and privacy.'],
         ['courses', 'Course Catalog', 'Your 14 proposed courses; flag 2–4 launch candidates and build lessons.'],
         ['pricing', 'Pricing Calculator', 'Compare lesson, group, course, monthly and online pricing.'],
         ['website', 'Website Launch', 'Steps to build an accurate business website.'],
         ['marketing', 'Marketing', 'Outreach tasks and an inquiry counter (numbers only).'],
         ['operations', 'Operations', 'Scheduling, attendance, invoicing systems.'],
         ['enrollment', 'Student Enrollment', 'Order → authorization → teach → invoice → paid.'],
         ['growth', 'Growth (optional)', 'After your first paid student.'],
         ['finance', 'Financial Tracking', 'Your real numbers and a ledger.'],
         ['schools', 'Charter School Tracker', 'One row per school you apply to.'],
         ['comms', 'Notes & Communications', 'Log every email/call; free-form notes.'],
         ['documents', 'Documents', 'Draft emails, bios, descriptions from templates.'],
         ['resources', 'Resource Library', 'Official links, grouped by type.'],
         ['settings', 'Settings & Backup', 'Name, dependency mode, backup/restore, reset.']].map(function (p) { return '<dt>' + go(p[0], p[1]) + '</dt><dd>' + esc(p[2]) + '</dd>'; }).join('') + '</dl>') +

      sec('g-heartland', 'Heartland: the path to your first payment', '<ol class="guide-steps">' +
        '<li><strong>Research:</strong> read the official pages (' + tLink('P2-01') + ', ' + tLink('P2-02') + ').</li>' +
        '<li><strong>Ask:</strong> send the inquiry email with all your questions in one message (' + tLink('P2-04') + '). Each answer completes several tasks in Phases 2, 4 and 6.</li>' +
        '<li><strong>Prepare:</strong> bio, résumé, course descriptions, prices, website (P2-12 to P2-17).</li>' +
        '<li><strong>Apply:</strong> submit it yourself, then record the date and reference number in the ' + go('schools', 'tracker') + '.</li>' +
        '<li><strong>Get approved:</strong> answer follow-ups, sign the agreement, finish onboarding, check your catalog listing.</li>' +
        '<li><strong>Teach and get paid:</strong> follow the ' + go('enrollment', 'Student Enrollment') + ' steps in order. Never teach before the authorization exists.</li></ol>' +
        '<div class="note warn">Nothing in this app is a verified Heartland rule until you confirm it. Funding amounts, pricing limits and payment timelines must come from Heartland directly.</div>') +

      sec('g-money', 'Money: actual vs. projected', '<ul>' +
        '<li>' + go('finance', 'Financial Tracking') + ' is for <span class="badge b-actual">ACTUAL</span> money that has really been spent or received.</li>' +
        '<li>The ' + go('pricing', 'Pricing Calculator') + ' shows <span class="badge b-projected">HYPOTHETICAL</span> scenarios. Its starting numbers are examples, so replace them once Heartland confirms its rules.</li>' +
        '<li>Use the ledger for each expense or payment. "Fill from ledger actuals" copies the totals into the overview.</li></ul>') +

      sec('g-data', 'Saving, backups, and devices', '<ul>' +
        '<li>Everything saves automatically. Look for <span class="save-indicator" style="display:inline">Saved locally</span> at the top.</li>' +
        '<li>Data is stored <strong>in this browser on this device only</strong>. Your phone, a different browser, or private mode each start empty.</li>' +
        '<li><strong>Move your progress:</strong> Export a backup here, then Import it on the other device or browser (' + go('settings', 'Settings & Backup') + ').</li>' +
        '<li>Clearing your browser data erases your progress. Export backups regularly.</li>' +
        '<li>Your live link is public, but your checkmarks and notes are not. They never leave your browser.</li>' +
        '<li>Never enter passwords, Social Security or tax ID numbers, ID documents, or student information.</li></ul>') +

      sec('g-update', 'Updating your live site on GitHub', '<ol class="guide-steps">' +
        '<li>Open <a href="https://github.com/palmtreefeen/cta-launch-dashboard/upload/main" target="_blank" rel="noopener noreferrer">your repo\'s upload page ↗</a>.</li>' +
        '<li>Click <strong>choose your files</strong>, select the updated files (for example from Documents → cta-launch-dashboard), and click <strong>Commit changes</strong>.</li>' +
        '<li>Wait about a minute, then refresh the site. Your saved progress stays.</li></ol>') +

      sec('g-faq', 'Quick answers', '<dl class="guide-faq">' +
        '<dt>I checked something by mistake.</dt><dd>Uncheck it, or open Details → Reopen task.</dd>' +
        '<dt>A task doesn\'t apply to me.</dt><dd>Edit it → set "Optional" (it stops counting toward launch %), or delete it. Settings → "Restore deleted default tasks" brings deleted ones back.</dd>' +
        '<dt>Why does progress say 0% after I did something?</dt><dd>Only <em>required</em> tasks count, and only when checked complete.</dd>' +
        '<dt>Does the app send emails or submit my application?</dt><dd>No. It only drafts. You send and submit everything yourself.</dd>' +
        '<dt>How do I print?</dt><dd>Master Checklist → Print checklist, or the "Print view" button at the top of any page.</dd>' +
        '<dt>I want to start over.</dt><dd>Settings & Backup → Reset application (export first if you might want it back).</dd></dl>') +
      '</div>';
  }

  /* ---------- Settings ---------- */
  function viewSettings(el) {
    var size = 0; try { size = (localStorage.getItem(STORAGE_KEY) || '').length; } catch (e) { }
    el.innerHTML = '<div class="grid grid-2"><div class="stack"><div class="card"><h2>Business details</h2><div class="field"><label for="s_name">Business name (working title until registered)</label><input type="text" id="s_name" data-bind="settings.businessName" value="' + esc(state.settings.businessName) + '"></div><div class="field"><label for="s_owner">Owner name</label><input type="text" id="s_owner" data-bind="settings.ownerName" value="' + esc(state.settings.ownerName) + '"></div></div>' +
      '<div class="card"><h2>Where your data lives</h2><p><strong>' + (storageOK ? 'Saved locally in this browser.' : 'Browser storage unavailable — changes will be lost when you close the page.') + '</strong></p><ul class="small"><li>Data is stored with localStorage on this device, in this browser only. It does not sync to other browsers or devices.</li><li>Clearing browser data, using private browsing, or some browser cleanup tools will erase it.</li><li>Export a JSON backup regularly and keep it somewhere safe.</li><li>Never store passwords, Social Security numbers, identity documents, student records, or payment credentials here.</li></ul>' +
      '<dl class="kv"><dt>Last updated</dt><dd>' + fmtDateTime(state.lastUpdated) + '</dd><dt>Created</dt><dd>' + fmtDateTime(state.created) + '</dd><dt>Data version</dt><dd>' + state.version + '</dd><dt>Stored size</dt><dd>' + (size / 1024).toFixed(1) + ' KB</dd><dt>Tasks</dt><dd>' + state.tasks.length + '</dd></dl></div></div>' +
      '<div class="stack"><div class="card"><h2>Backup &amp; restore</h2><p class="small">Export downloads a JSON file containing everything in this dashboard. Import replaces current data after validation and confirmation.</p><div class="btn-row"><button class="btn btn-primary" data-action="export">Export JSON backup</button><label class="btn" for="importFile" style="margin:0">Import JSON backup…</label><input type="file" id="importFile" accept="application/json,.json" class="sr-only"></div><div id="importMsg" role="alert" class="small" style="margin-top:.6rem"></div></div>' +
      '<div class="card"><h2>How tasks unlock</h2><div class="field"><label for="s_dep">Dependency mode</label><select id="s_dep" data-bind="settings.depMode" data-rerender="1">' + optsKV([['flexible', 'Flexible — work on anything, in any order'], ['strict', 'Strict — confirm and give a reason before skipping ahead']], state.settings.depMode) + '</select><div class="hint">Flexible: prerequisites are shown as a suggested order, and you can check off any task at any time (the app notes it in the task history). Evidence checks on milestones like Heartland approval and first paid student always apply.</div></div></div>' +
      '<div class="card"><h2>Print</h2><div class="btn-row"><button class="btn" data-action="print-checklist">Print full checklist</button><button class="btn" data-action="print-dashboard">Print dashboard</button></div></div>' +
      '<div class="card"><h2>Maintenance</h2><p class="small">Restore any default tasks you deleted (your edited tasks are untouched).</p><div class="btn-row"><button class="btn" data-action="restore-defaults">Restore deleted default tasks</button></div>' +
      '<hr style="border:none;border-top:1px solid var(--border);margin:1rem 0"><h3 class="neg">Danger zone</h3><p class="small">Reset erases all progress, notes, courses, logs, and documents in this browser and reloads the default checklist.</p><button class="btn btn-danger-solid" data-action="reset">Reset application…</button></div></div></div>';
    $('#importFile').addEventListener('change', importFile);
  }
  function exportData() {
    var payload = JSON.stringify({ app: 'cta-launch-dashboard', exportedAt: nowIso(), data: state }, null, 2);
    var blob = new Blob([payload], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'cta-dashboard-backup-' + today() + '.json';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('Backup downloaded');
  }
  function importFile(e) {
    var file = e.target.files[0], msg = $('#importMsg'); e.target.value = '';
    if (!file) return;
    msg.className = 'small'; msg.textContent = '';
    var reader = new FileReader();
    reader.onerror = function () { msg.className = 'small neg'; msg.textContent = 'Could not read the file.'; };
    reader.onload = function () { importText(String(reader.result), file.name); };
    reader.readAsText(file);
  }
  function importText(text, name) {
    var msg = $('#importMsg');
    var fail = function (m) { if (msg) { msg.className = 'small neg'; msg.textContent = 'Import failed: ' + m + ' Your current data was not changed.'; } return false; };
    var parsed;
    try { parsed = JSON.parse(text); } catch (err) { return fail('“' + name + '” is not valid JSON (' + err.message + ').'); }
    var data = parsed && parsed.data && parsed.app === 'cta-launch-dashboard' ? parsed.data : parsed;
    var err2 = validateState(data); if (err2) return fail(err2);
    var done = data.tasks.filter(function (t) { return t.status === 'Complete'; }).length;
    confirmDialog({ title: 'Replace current progress?', message: 'The backup contains <strong>' + data.tasks.length + ' tasks (' + done + ' complete)</strong>, ' + (data.comms || []).length + ' log entries, and ' + (data.docs || []).length + ' documents, last updated ' + fmtDateTime(data.lastUpdated) + '.<br><br>Importing will <strong>replace everything</strong> currently in this browser. Consider exporting a backup first.', confirmLabel: 'Replace with backup', danger: true }).then(function (r) {
      if (!r.ok) { if (msg) msg.textContent = 'Import cancelled. Nothing changed.'; return; }
      state = migrate(data); clearBanner(); save(); render(); toast('Backup restored');
      var m2 = $('#importMsg'); if (m2) { m2.className = 'small'; m2.textContent = 'Backup restored successfully.'; }
    });
    return true;
  }

  /* ---------- Print ---------- */
  function printChecklist() {
    var html = '<h1>' + esc(state.settings.businessName) + ' — Launch Checklist</h1><p>Printed ' + fmtDateTime(nowIso()) + ' · ' + stats().done + '/' + stats().total + ' required tasks complete (' + pct(stats().pct) + ')</p>';
    PHASE_KEYS.forEach(function (p) {
      var list = state.tasks.filter(function (t) { return t.phase === p; }).sort(sortDefault); if (!list.length) return;
      html += '<h2>' + esc(SEED.phases[p]) + '</h2><table><thead><tr><th></th><th>ID</th><th>Task</th><th>Priority</th><th>Status</th><th>Target</th><th>Label</th></tr></thead><tbody>' +
        list.map(function (t) { return '<tr><td><span class="print-box">' + (isDone(t) ? '✓' : '') + '</span></td><td>' + esc(t.id) + '</td><td>' + esc(t.title) + (t.required ? '' : ' (optional)') + '</td><td>' + esc(t.priority) + '</td><td>' + esc(t.status) + '</td><td>' + (t.target ? fmtDate(t.target) : '') + '</td><td>' + esc(t.verification) + '</td></tr>'; }).join('') + '</tbody></table>';
    });
    $('#printArea').innerHTML = html;
    document.body.classList.add('print-checklist');
    setTimeout(function () { window.print(); }, 50);
  }
  window.addEventListener('afterprint', function () { document.body.classList.remove('print-checklist'); });

  /* ===================== Router ===================== */
  var VIEWS = {
    dashboard: viewDashboard, guide: viewGuide, checklist: viewChecklist,
    heartland: viewPhase('heartland', ['P2'], heartlandTop), setup: viewPhase('setup', ['P1', 'P3']), compliance: viewPhase('compliance', ['P4']),
    courses: viewPhase('courses', ['P5'], courseTop), pricing: viewPhase('pricing', ['P6'], pricingTop), website: viewPhase('website', ['P7']),
    marketing: viewPhase('marketing', ['P8'], null, marketingBottom), operations: viewPhase('operations', ['P9']), enrollment: viewPhase('enrollment', ['P10'], enrollmentTop), growth: viewPhase('growth', ['P11']),
    finance: viewFinance, schools: viewSchools, comms: viewComms, documents: viewDocuments, resources: viewResources, settings: viewSettings
  };
  function render() {
    var y = window.scrollY;
    var view = $('#view');
    VIEWS[current](view);
    if (current === 'pricing') updatePricing();
    renderNav();
    var n = NAV.find(function (x) { return x[0] === current; });
    $('#pageTitle').textContent = n ? n[1] : '';
    document.title = (n ? n[1] + ' · ' : '') + 'Launch Dashboard — ' + state.settings.businessName;
    $('#brandName').textContent = state.settings.businessName || 'Launch Dashboard';
    $('#lastUpdated').textContent = fmtDateTime(state.lastUpdated);
    window.scrollTo(0, y);
  }
  function route() {
    var h = (location.hash || '#dashboard').slice(1);
    var changed = h !== current;
    current = VIEWS[h] ? h : 'dashboard';
    render();
    if (changed) { window.scrollTo(0, 0); $('#view').focus({ preventScroll: true }); }
    document.body.classList.remove('sidebar-open'); $('#scrim').hidden = true;
  }
  window.addEventListener('hashchange', route);
  function go(view) { if (location.hash === '#' + view) route(); else location.hash = view; }

  /* ===================== Event delegation ===================== */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]'); if (!el || el.tagName === 'SELECT' || (el.tagName === 'INPUT' && el.type === 'checkbox')) return;
    var a = el.dataset.action, id = el.dataset.id;
    switch (a) {
      case 'expand': ui.expanded[id] = !ui.expanded[id]; if (current === 'checklist') renderResults(); else render(); var b = $('[data-action="expand"][data-id="' + id + '"]'); if (b) b.focus(); break;
      case 'edit-task': if (modal.open) closeModal(); editTask(id); break;
      case 'new-task': if (el.dataset.phase) ui.filters.phase = el.dataset.phase; editTask(null); break;
      case 'delete-task': if (modal.open) closeModal(); deleteTask(id); break;
      case 'complete': if (modal.open) closeModal(); completeTask(id); break;
      case 'reopen': if (modal.open) closeModal(); reopenTask(id); break;
      case 'start': setStatus(id, 'In Progress'); break;
      case 'override': if (modal.open) closeModal(); overrideDeps(id); break;
      case 'remove-override': if (modal.open) closeModal(); removeOverride(id); break;
      case 'open-task': openTaskModal(id); break;
      case 'filter-category': resetFilters(); ui.filters.category = el.dataset.cat; go('checklist'); break;
      case 'metric-filter': resetFilters(); if (el.dataset.filter) ui.filters[el.dataset.filter] = true; if (el.dataset.status) ui.filters.status = el.dataset.status; go('checklist'); break;
      case 'phase-in-checklist': resetFilters(); ui.filters.phase = el.dataset.phase; go('checklist'); break;
      case 'clear-filters': resetFilters(); render(); break;
      case 'print-checklist': printChecklist(); break;
      case 'guide-jump': var gt = document.getElementById(el.dataset.target); if (gt) { gt.scrollIntoView({ behavior: 'smooth', block: 'start' }); gt.focus({ preventScroll: true }); } break;
      case 'guide-top': var toc = document.getElementById('g-toc'); if (toc) toc.scrollIntoView({ behavior: 'smooth', block: 'start' }); break;
      case 'dismiss-welcome': state.settings.guideSeen = true; save(); render(); break;
      case 'print-dashboard': go('dashboard'); setTimeout(function () { window.print(); }, 100); break;
      case 'select-course': ui.course = +el.dataset.i; render(); break;
      case 'new-course': newCourse(); break;
      case 'del-course': delCourse(); break;
      case 'add-module': state.courses[ui.course].modules.push({ title: 'New module', objectives: '', lessons: [] }); save(); render(); break;
      case 'del-module': delModule(+el.dataset.mi); break;
      case 'add-lesson': addLesson(+el.dataset.mi); break;
      case 'del-lesson': delLesson(+el.dataset.mi, +el.dataset.li); break;
      case 'reset-pricing': confirmDialog({ title: 'Reset pricing assumptions?', message: 'Replace all five pricing models with the original example assumptions?', confirmLabel: 'Reset', danger: true }).then(function (r) { if (r.ok) { state.pricing = defaultPricing(); save(); render(); } }); break;
      case 'add-rec': editRecord(el.dataset.coll, null, el.dataset.coll === 'comms' && el.dataset.org ? { org: el.dataset.org } : null); break;
      case 'new-comm': editRecord('comms', null, { org: el.dataset.org }); break;
      case 'edit-rec': editRecord(el.dataset.coll, id); break;
      case 'del-rec': deleteRecord(el.dataset.coll, id); break;
      case 'apply-ledger': applyLedger(); break;
      case 'new-doc': newDoc(+$('#tplSel').value); render(); var t = $('#d_title'); if (t) t.focus(); break;
      case 'new-doc-type': var ti = SEED.docTemplates.findIndex(function (x) { return x.type === el.dataset.type; }); newDoc(Math.max(0, ti)); go('documents'); break;
      case 'select-doc': ui.doc = id; render(); break;
      case 'copy-doc': var d = state.docs.find(function (x) { return x.id === ui.doc; }); if (d) copyText(d.body); break;
      case 'dup-doc': var d2 = state.docs.find(function (x) { return x.id === ui.doc; }); if (d2) { var c = Object.assign({}, d2, { id: uid(), title: d2.title + ' (copy)', status: 'Draft', created: nowIso(), updated: nowIso() }); state.docs.unshift(c); ui.doc = c.id; save(); render(); } break;
      case 'del-doc': confirmDialog({ title: 'Delete document?', message: 'This draft will be permanently deleted.', confirmLabel: 'Delete', danger: true }).then(function (r) { if (r.ok) { state.docs = state.docs.filter(function (x) { return x.id !== ui.doc; }); ui.doc = null; save(); render(); } }); break;
      case 'export': exportData(); break;
      case 'reset': confirmDialog({ title: 'Reset the entire application?', message: 'This permanently erases <strong>all</strong> tasks progress, notes, courses, logs, finances, and documents stored in this browser. Export a backup first if you might want them.', confirmLabel: 'Erase everything', danger: true, requireText: 'RESET' }).then(function (r) { if (!r.ok) return; state = defaultState(); ui.expanded = {}; resetFilters(); clearBanner(); save(); go('dashboard'); toast('Application reset'); }); break;
      case 'restore-defaults': var n0 = state.tasks.length; state.deletedSeedIds = []; state = migrate(state); save(); render(); toast((state.tasks.length - n0) + ' default task(s) restored'); break;
    }
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.dataset.action === 'toggle') { if (el.checked) completeTask(el.dataset.id); else reopenTask(el.dataset.id); return; }
    if (el.dataset.action === 'status') { setStatus(el.dataset.id, el.value); return; }
    if (el.dataset.action === 'select-model') { state.pricing.selected = +el.value; save(); render(); return; }
    if (el.dataset.action === 'select-scenario') { state.pricing.scenario = el.value; save(); updatePricing(); return; }
    if (el.dataset.tfield === 'evidenceVerified') { var t = getTask(el.dataset.id); t.evidenceVerified = el.checked; hist(t, 'Evidence checkbox ' + (el.checked ? 'checked' : 'cleared')); save(); return; }
    if (el.dataset.filter && (el.type === 'checkbox' || el.tagName === 'SELECT')) { ui.filters[el.dataset.filter] = el.type === 'checkbox' ? el.checked : el.value; renderResults(); return; }
    if (el.dataset.bind && (el.type === 'checkbox' || el.tagName === 'SELECT')) {
      if (el.dataset.gate === 'approval' && /^Approved/.test(el.value)) {
        var prev = getPath(state, el.dataset.bind), path = el.dataset.bind;
        confirmDialog({ title: 'Record school approval?', message: 'Only choose "Approved" if you have <strong>written confirmation</strong> from the school that this specific course is approved. Describe the evidence below.', confirmLabel: 'Record approval', requireReason: true, reasonLabel: 'Evidence (e.g., approval email date and sender)' }).then(function (r) {
          if (r.ok) { setPath(state, path, el.value); var c = state.courses[ui.course]; c.approvalEvidence = r.reason + ' (' + today() + ')'; save(); } else setPath(state, path, prev);
          render();
        });
        return;
      }
      setPath(state, el.dataset.bind, el.type === 'checkbox' ? el.checked : el.value); afterBind(el);
      if (el.dataset.rerender) render();
      return;
    }
    if (el.dataset.bind && el.dataset.rerender) render();
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.dataset.filter === 'q') { ui.filters.q = el.value; renderResults(); return; }
    if (el.dataset.tfield === 'notes') { var t = getTask(el.dataset.id); t.notes = el.value; save(); return; }
    if (el.dataset.bind && el.type !== 'checkbox' && el.tagName !== 'SELECT') { setPath(state, el.dataset.bind, el.value); afterBind(el); }
  });
  function afterBind(el) {
    var b = el.dataset.bind;
    if (/^docs\./.test(b)) { var d = state.docs[+b.split('.')[1]]; if (d) d.updated = nowIso(); }
    save();
    if (/^finance\./.test(b)) updateFinance();
    if (/^pricing\./.test(b)) updatePricing();
    if (/^settings\.businessName/.test(b)) $('#brandName').textContent = state.settings.businessName || 'Launch Dashboard';
  }
  function clearBanner() { startupNotice = null; var bn = $('#banner'); bn.hidden = true; bn.textContent = ''; }
  function resetFilters() { ui.filters = { q: '', phase: '', category: '', priority: '', status: '', req: 'all', verification: '', incompleteOnly: false, blockedOnly: false, readyOnly: false, overdueOnly: false, sort: 'default' }; }

  /* ---------- Course helpers ---------- */
  function newCourse() {
    openModal({ title: 'Add course', body: '<div class="form-grid"><div class="field"><label for="nc_id">Course code *</label><input type="text" id="nc_id" name="cid" placeholder="e.g., A8"></div><div class="field"><label for="nc_div">Division</label><select id="nc_div" name="div">' + optsKV([['A', 'A · Audio Engineering'], ['B', 'B · Software Development']], 'A') + '</select></div><div class="field span-2"><label for="nc_title">Course title *</label><input type="text" id="nc_title" name="title"></div></div>',
      buttons: [{ label: 'Cancel' }, { label: 'Add course', primary: true, handler: function (b) {
        clearErrors(b); var id = $('[name=cid]', b).value.trim().toUpperCase(), title = $('[name=title]', b).value.trim(), ok = true;
        if (!id) { fieldError(b, 'cid', 'Required.'); ok = false; } else if (state.courses.some(function (c) { return c.id.toUpperCase() === id; })) { fieldError(b, 'cid', 'That code is already used.'); ok = false; }
        if (!title) { fieldError(b, 'title', 'Required.'); ok = false; }
        if (!ok) return false;
        var base = clone(SEED.courses[0]); Object.keys(base).forEach(function (k) { if (typeof base[k] === 'string') base[k] = ''; });
        Object.assign(base, { id: id, title: title, division: $('[name=div]', b).value, format: 'Undecided', approvalStatus: 'Not submitted', catalogStatus: 'Not listed', curriculumStatus: 'Idea', launchCandidate: false, modules: [] });
        state.courses.push(base); ui.course = state.courses.length - 1; save();
      }, after: function () { render(); } }] });
  }
  function delCourse() {
    var c = state.courses[ui.course];
    confirmDialog({ title: 'Delete course ' + c.id + '?', message: 'Delete <strong>' + esc(c.title) + '</strong> with its ' + c.modules.length + ' module(s) and all lesson content?', confirmLabel: 'Delete course', danger: true }).then(function (r) { if (r.ok) { state.courses.splice(ui.course, 1); ui.course = 0; save(); render(); } });
  }
  function delModule(mi) {
    var mod = state.courses[ui.course].modules[mi];
    var go2 = function () { state.courses[ui.course].modules.splice(mi, 1); save(); render(); };
    if (!mod.lessons.length && !mod.objectives) return go2();
    confirmDialog({ title: 'Remove module?', message: 'Remove “' + esc(mod.title) + '” and its ' + mod.lessons.length + ' lesson(s)?', confirmLabel: 'Remove', danger: true }).then(function (r) { if (r.ok) go2(); });
  }
  function addLesson(mi) {
    var sel = $('#tpl' + mi), t = sel && sel.value !== '' ? state.lessonTemplates[+sel.value] : null;
    state.courses[ui.course].modules[mi].lessons.push({ title: t ? t.name : 'New lesson', objectives: t ? t.objectives : '', activities: t ? t.activities : '', assignment: t ? t.assignment : '', materials: t ? t.materials : '' });
    save(); render();
  }
  function delLesson(mi, li) {
    var l = state.courses[ui.course].modules[mi].lessons[li];
    var go2 = function () { state.courses[ui.course].modules[mi].lessons.splice(li, 1); save(); render(); };
    if (!(l.objectives || l.activities || l.assignment)) return go2();
    confirmDialog({ title: 'Remove lesson?', message: 'Remove “' + esc(l.title) + '” and its content?', confirmLabel: 'Remove', danger: true }).then(function (r) { if (r.ok) go2(); });
  }
  function applyLedger() {
    var t = ledgerTotals();
    confirmDialog({ title: 'Fill from ledger?', message: 'Set Actual startup expenses to ' + money(t.startup) + ', Actual monthly revenue to ' + money(t.rev) + ', and Monthly operating expenses to ' + money(t.op) + ' (this month, Actual entries only)?', confirmLabel: 'Apply' }).then(function (r) {
      if (!r.ok) return; state.finance.startupExpenses = String(t.startup); state.finance.actualRevenue = String(t.rev); state.finance.opExpenses = String(t.op); save(); render();
    });
  }

  /* ===================== Shell ===================== */
  $('#sidebarToggle').addEventListener('click', function () {
    var mobile = window.matchMedia('(max-width: 900px)').matches;
    if (mobile) { var open = !document.body.classList.contains('sidebar-open'); document.body.classList.remove('sidebar-collapsed'); document.body.classList.toggle('sidebar-open', open); $('#scrim').hidden = !open; this.setAttribute('aria-expanded', open); }
    else { var col = document.body.classList.toggle('sidebar-collapsed'); this.setAttribute('aria-expanded', !col); }
  });
  $('#scrim').addEventListener('click', function () { document.body.classList.remove('sidebar-open'); this.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('sidebar-open') && !modal.open) { document.body.classList.remove('sidebar-open'); $('#scrim').hidden = true; } });
  $('#printBtn').addEventListener('click', function () { if (current === 'checklist') printChecklist(); else window.print(); });
  if (window.matchMedia('(max-width: 900px)').matches) $('#sidebarToggle').setAttribute('aria-expanded', 'false');

  if (startupNotice) { var bn = $('#banner'); bn.textContent = startupNotice; bn.hidden = false; }
  $('#saveIndicator').textContent = storageOK ? 'Saved locally' : 'Not saving — storage unavailable';
  if (!storageOK) $('#saveIndicator').className = 'save-indicator error';
  if (storageOK) { try { if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { } }
  route();

  // Test hook (read-only helpers for automated checks)
  window.__CTA = { get state() { return state; }, stats: stats, nextActions: nextActions, priceCalc: priceCalc, financeCalc: financeCalc, filteredTasks: filteredTasks, ui: ui, importText: importText, validateState: validateState };
})();
