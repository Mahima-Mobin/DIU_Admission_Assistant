const TIMELINE_KEY = "daa_admission_timeline";
const CHECKLIST_KEY = "daa_admission_checklist";

const steps = [
  {
    id: "choose_program",
    title: "Choose a Program",
    desc: "Browse programs, compare tuition, credits, duration and shortlist your preferred program.",
    tags: ["Programs & Fees", "Shortlist"],
    cta: { text: "Browse Programs", href: "programs.html" }
  },
  {
    id: "check_eligibility",
    title: "Check Eligibility",
    desc: "Use SSC/HSC GPA + background to get an instant guidance result and recommendations.",
    tags: ["Eligibility", "Guidance"],
    cta: { text: "Check Eligibility", href: "eligibility.html" }
  },
  {
    id: "collect_documents",
    title: "Prepare Documents",
    desc: "Collect certificates, transcripts, photos and scan them as PDF/JPG for online submission.",
    tags: ["Documents", "Scan"],
    cta: { text: "See Checklist", href: "#docs" }
  },
  {
    id: "apply_online",
    title: "Apply Online / Submit Form",
    desc: "Fill the online admission form with correct details and upload required documents.",
    tags: ["Online Form", "Upload"],
    cta: { text: "Ask Assistant", href: "assistant.html" }
  },
  {
    id: "payment",
    title: "Pay Application / Admission Fees",
    desc: "Complete required payment (as per notice). Keep transaction slip for verification.",
    tags: ["Payment", "Receipt"],
    cta: { text: "Payment Help", href: "assistant.html" }
  },
  {
    id: "admission_test",
    title: "Admission Test / Interview (if applicable)",
    desc: "Some programs may require test/interview. Prepare basics and attend on schedule.",
    tags: ["Test", "Interview"],
    cta: { text: "Preparation Tips", href: "assistant.html" }
  },
  {
    id: "confirmation",
    title: "Final Confirmation & Enrollment",
    desc: "After verification, complete admission confirmation and finalize enrollment.",
    tags: ["Verification", "Enrollment"],
    cta: { text: "Final Steps", href: "assistant.html" }
  },
];

const docs = [
  { id:"ssc_mark", title:"SSC Marksheet", desc:"Original/attested copy (scan)."},
  { id:"ssc_cert", title:"SSC Certificate", desc:"Original/attested copy (scan)."},
  { id:"hsc_mark", title:"HSC Marksheet", desc:"Original/attested copy (scan)."},
  { id:"hsc_cert", title:"HSC Certificate", desc:"Original/attested copy (scan)."},
  { id:"photo", title:"Passport-size Photo", desc:"Recent, clear background (JPG)."},
  { id:"nid_birth", title:"NID / Birth Certificate", desc:"Any valid ID proof (scan)."},
  { id:"guardian", title:"Guardian Contact Info", desc:"Phone number and address details."},
  { id:"payment", title:"Payment Slip (if paid)", desc:"Transaction receipt/screenshot."},
];

const faqs = [
  { q: "Do I need an admission test?", a: "It depends on the program and current policy. Some programs may require a test or interview. Always check official notices." },
  { q: "Can Diploma/A-Level students apply?", a: "Yes, but eligibility varies by program. Use Eligibility Checker and confirm program-wise requirements." },
  { q: "What file format for documents?", a: "Usually PDF/JPG is accepted. Keep scans clear and readable, and ensure file size is reasonable." },
  { q: "How can I confirm tuition & fees?", a: "Check Programs & Fees page, then verify with official admission circular for the latest updates." },
];

const els = {
  header: document.getElementById("header"),
  navToggle: document.getElementById("navToggle"),
  navLinks: document.getElementById("navLinks"),
  themeBtn: document.getElementById("themeBtn"),
  authButtons: document.getElementById("authButtons"),

  timeline: document.getElementById("timeline"),
  timelineMeta: document.getElementById("timelineMeta"),

  checklist: document.getElementById("checklist"),
  checkMeta: document.getElementById("checkMeta"),

  faq: document.getElementById("faq"),

  resetProgress: document.getElementById("resetProgress"),
  printBtn: document.getElementById("printBtn"),
};

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadState(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    const obj = raw ? JSON.parse(raw) : null;
    return obj && typeof obj === "object" ? obj : fallback;
  }catch{
    return fallback;
  }
}

function saveState(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

/* Header UX */
function initHeaderUX(){
  window.addEventListener("scroll", () => {
    els.header?.classList.toggle("scrolled", window.scrollY > 10);
  });

  els.navToggle?.addEventListener("click", ()=>{
    els.navLinks.classList.toggle("open");
  });

  document.addEventListener("click", (e)=>{
    if(window.innerWidth > 980) return;
    const inside = els.navLinks.contains(e.target) || els.navToggle.contains(e.target);
    if(!inside) els.navLinks.classList.remove("open");
  });
}

/* Theme */
function initTheme(){
  els.themeBtn?.addEventListener("click", ()=>{
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    els.themeBtn.textContent = isDark ? "☾" : "☀";
  });
}

/* Auth */
function renderAuthButtons(){
  const container = els.authButtons;
  if(!container) return;

  const userRaw = localStorage.getItem("daa_user");
  if(userRaw){
    const u = JSON.parse(userRaw);
    container.innerHTML = `
      <span class="user-pill" title="${escapeHtml(u.email || "")}">👋 ${escapeHtml(u.name || "User")}</span>
      <button class="btn btn-outline" id="logoutBtn" type="button">Logout</button>
    `;
    container.querySelector("#logoutBtn")?.addEventListener("click", ()=>{
      localStorage.removeItem("daa_user");
      window.location.reload();
    });
  }else{
    container.innerHTML = `
      <a class="btn btn-outline" href="login.html">Login</a>
      
    `;
  }
}

/* Timeline render */
function renderTimeline(){
  const done = loadState(TIMELINE_KEY, {});
  els.timeline.innerHTML = steps.map((s, idx)=>{
    const checked = !!done[s.id];
    return `
      <li class="step">
        <div class="step-left">${idx + 1}</div>
        <div class="step-main">
          <div class="step-title">${escapeHtml(s.title)}</div>
          <div class="step-desc">${escapeHtml(s.desc)}</div>
          <div class="step-meta">
            ${s.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("")}
          </div>
          <div class="step-actions">
            <label class="step-check">
              <input type="checkbox" data-step="${escapeHtml(s.id)}" ${checked ? "checked" : ""}>
              Mark as done
            </label>
            <a class="btn btn-outline no-print" href="${escapeHtml(s.cta.href)}">${escapeHtml(s.cta.text)}</a>
          </div>
        </div>
      </li>
    `;
  }).join("");

  els.timeline.querySelectorAll("input[type='checkbox'][data-step]").forEach(cb=>{
    cb.addEventListener("change", ()=>{
      const key = cb.getAttribute("data-step");
      const state = loadState(TIMELINE_KEY, {});
      state[key] = cb.checked;
      saveState(TIMELINE_KEY, state);
      updateMeta();
    });
  });

  updateMeta();
}

/* Checklist render */
function renderChecklist(){
  const state = loadState(CHECKLIST_KEY, {});
  els.checklist.id = "docs"; // anchor target

  els.checklist.innerHTML = docs.map(d=>{
    const checked = !!state[d.id];
    return `
      <label class="check">
        <input type="checkbox" data-doc="${escapeHtml(d.id)}" ${checked ? "checked" : ""}>
        <div>
          <div class="t">${escapeHtml(d.title)}</div>
          <div class="d">${escapeHtml(d.desc)}</div>
        </div>
      </label>
    `;
  }).join("");

  els.checklist.querySelectorAll("input[type='checkbox'][data-doc]").forEach(cb=>{
    cb.addEventListener("change", ()=>{
      const key = cb.getAttribute("data-doc");
      const st = loadState(CHECKLIST_KEY, {});
      st[key] = cb.checked;
      saveState(CHECKLIST_KEY, st);
      updateMeta();
    });
  });

  updateMeta();
}

/* FAQ render */
function renderFAQ(){
  els.faq.innerHTML = faqs.map((f, i)=>`
    <div class="faq-item">
      <button class="faq-q" type="button" data-faq="${i}">
        <span>${escapeHtml(f.q)}</span>
        <span class="chev">▾</span>
      </button>
      <div class="faq-a">${escapeHtml(f.a)}</div>
    </div>
  `).join("");

  els.faq.querySelectorAll("[data-faq]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const item = btn.closest(".faq-item");
      item.classList.toggle("open");
    });
  });
}

/* Meta update */
function updateMeta(){
  const t = loadState(TIMELINE_KEY, {});
  const c = loadState(CHECKLIST_KEY, {});
  const tDone = steps.filter(s=>t[s.id]).length;
  const tPct = Math.round((tDone / steps.length) * 100);
  els.timelineMeta.textContent = `${tPct}% completed`;

  const cDone = docs.filter(d=>c[d.id]).length;
  els.checkMeta.textContent = `${cDone} / ${docs.length}`;
}

/* Reset + Print */
function bindActions(){
  els.resetProgress.addEventListener("click", ()=>{
    if(confirm("Reset timeline & checklist progress?")){
      localStorage.removeItem(TIMELINE_KEY);
      localStorage.removeItem(CHECKLIST_KEY);
      renderTimeline();
      renderChecklist();
    }
  });

  els.printBtn.addEventListener("click", ()=>{
    window.print();
  });
}

/* Init */
function init(){
  initHeaderUX();
  initTheme();
  renderAuthButtons();
  renderTimeline();
  renderChecklist();
  renderFAQ();
  bindActions();
}

init();