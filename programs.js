const PROGRAMS = [
  {
    id: "cse_bsc",
    name: "B.Sc. in Computer Science & Engineering",
    faculty: "Engineering & Technology",
    level: "Undergraduate",
    durationYears: 4,
    credits: 148,
    tuition: 380000,
    intake: "3 intakes/year",
    eligibility: "HSC/Equivalent (Science preferred), minimum GPA requirements apply",
    highlights: ["Programming & Algorithms", "AI/ML basics", "Industry projects"],
    
  },
  {
    id: "swe_bsc",
    name: "B.Sc. in Software Engineering",
    faculty: "Engineering & Technology",
    level: "Undergraduate",
    durationYears: 4,
    credits: 148,
    tuition: 365000,
    intake: "3 intakes/year",
    eligibility: "HSC/Equivalent, minimum GPA requirements apply",
    highlights: ["SDLC & Agile", "Testing & QA", "DevOps foundations"],
    
  },
  {
    id: "eee_bsc",
    name: "B.Sc. in Electrical & Electronic Engineering",
    faculty: "Engineering & Technology",
    level: "Undergraduate",
    durationYears: 4,
    credits: 150,
    tuition: 360000,
    intake: "3 intakes/year",
    eligibility: "HSC/Equivalent (Science), minimum GPA requirements apply",
    highlights: ["Circuits & Electronics", "Power Systems", "Embedded basics"],
    
  },
  {
    id: "bba",
    name: "Bachelor of Business Administration (BBA)",
    faculty: "Business & Entrepreneurship",
    level: "Undergraduate",
    durationYears: 4,
    credits: 120,
    tuition: 300000,
    intake: "3 intakes/year",
    eligibility: "HSC/Equivalent, minimum GPA requirements apply",
    highlights: ["Management", "Marketing", "Finance basics"],
    
  },
  {
    id: "english_ba",
    name: "B.A. in English",
    faculty: "Humanities & Social Sciences",
    level: "Undergraduate",
    durationYears: 4,
    credits: 120,
    tuition: 260000,
    intake: "3 intakes/year",
    eligibility: "HSC/Equivalent, minimum GPA requirements apply",
    highlights: ["Literature", "Linguistics", "Communication"],
    
  },
  {
    id: "law_llb",
    name: "LL.B (Honours)",
    faculty: "Law",
    level: "Undergraduate",
    durationYears: 4,
    credits: 120,
    tuition: 320000,
    intake: "2-3 intakes/year",
    eligibility: "HSC/Equivalent, minimum GPA requirements apply",
    highlights: ["Core law subjects", "Moot court exposure", "Legal writing"],
    
  },
  {
    id: "cse_msc",
    name: "M.Sc. in Computer Science & Engineering",
    faculty: "Engineering & Technology",
    level: "Graduate",
    durationYears: 2,
    credits: 36,
    tuition: 180000,
    intake: "2-3 intakes/year",
    eligibility: "Relevant bachelor degree, minimum CGPA requirements apply",
    highlights: ["Advanced computing", "Research methods", "Thesis/Project"],
    
  },
  {
    id: "mba",
    name: "Master of Business Administration (MBA)",
    faculty: "Business & Entrepreneurship",
    level: "Graduate",
    durationYears: 2,
    credits: 60,
    tuition: 220000,
    intake: "2-3 intakes/year",
    eligibility: "Relevant bachelor degree, minimum CGPA requirements apply",
    highlights: ["Strategy", "Leadership", "Business analytics"],
    
  },
];

const PER_PAGE = 6;

const els = {
  header: document.getElementById("header"),
  navToggle: document.getElementById("navToggle"),
  navLinks: document.getElementById("navLinks"),
  themeBtn: document.getElementById("themeBtn"),
  authButtons: document.getElementById("authButtons"),

  q: document.getElementById("q"),
  faculty: document.getElementById("faculty"),
  level: document.getElementById("level"),
  resetBtn: document.getElementById("resetBtn"),

  resultMeta: document.getElementById("resultMeta"),
  cards: document.getElementById("cards"),

  viewGrid: document.getElementById("viewGrid"),
  viewList: document.getElementById("viewList"),

  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),
  pageMeta: document.getElementById("pageMeta"),

  modal: document.getElementById("modal"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  modalClose: document.getElementById("modalClose"),
  modalTitle: document.getElementById("modalTitle"),
  modalFaculty: document.getElementById("modalFaculty"),
  modalBody: document.getElementById("modalBody"),
};

let state = {
  q: "",
  faculty: "all",
  level: "all",
  view: "grid",
  page: 1,
};

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shorten(s, n){
  if(!s) return "";
  return s.length > n ? (s.slice(0, n-1) + "…") : s;
}

function formatBDT(n){
  return "৳ " + Number(n).toLocaleString("en-US");
}

function clampPage(p, total){
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
  return Math.min(Math.max(1, p), maxPage);
}


function loadStateFromURL(){
  const url = new URL(window.location.href);
  state.q = url.searchParams.get("q") || "";
  state.faculty = url.searchParams.get("faculty") || "all";
  state.level = url.searchParams.get("level") || "all";
  state.view = (url.searchParams.get("view") === "list") ? "list" : "grid";
  state.page = Number(url.searchParams.get("page") || 1) || 1;
}

function pushURL(){
  const url = new URL(window.location.href);
  url.searchParams.set("q", state.q);
  url.searchParams.set("faculty", state.faculty);
  url.searchParams.set("level", state.level);
  url.searchParams.set("view", state.view);
  url.searchParams.set("page", String(state.page));
  window.history.replaceState({}, "", url);
}

function syncControls(){
  els.q.value = state.q;
  els.faculty.value = state.faculty;
  els.level.value = state.level;
  setView(state.view);
}


function populateFaculties(){
  const facs = Array.from(new Set(PROGRAMS.map(p=>p.faculty))).sort();
  for(const f of facs){
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    els.faculty.appendChild(opt);
  }
}

/* Filter */
function applyFilters(){
  const q = state.q.trim().toLowerCase();
  return PROGRAMS.filter(p=>{
    if(state.faculty !== "all" && p.faculty !== state.faculty) return false;
    if(state.level !== "all" && p.level !== state.level) return false;

    if(q){
      const hay = `${p.name} ${p.faculty} ${p.level} ${p.description} ${p.highlights.join(" ")}`.toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}

/* Render */
function cardHTML(p){
  return `
    <article class="card">
      <div class="card-top">
        <div>
          <div class="badge">${escapeHtml(p.level)}</div>
          <div class="title">${escapeHtml(p.name)}</div>
          <div class="sub">${escapeHtml(p.faculty)}</div>
        </div>
        <div class="pill-fee">${formatBDT(p.tuition)}</div>
      </div>

      <div class="metrics">
        <div class="metric">
          <div class="k">Duration</div>
          <div class="v">${p.durationYears} year(s)</div>
        </div>
        <div class="metric">
          <div class="k">Credits</div>
          <div class="v">${p.credits}</div>
        </div>
        <div class="metric">
          <div class="k">Intake</div>
          <div class="v">${escapeHtml(p.intake)}</div>
        </div>
      </div>

      <div class="desc">${escapeHtml(shorten(p.description, 120))}</div>

      <div class="card-actions">
        <button class="btn btn-primary" data-open="${p.id}" type="button">View Details</button>
        <a class="link" href="assistant.html">Ask Assistant →</a>
      </div>
    </article>
  `;
}

function render(){
  const filtered = applyFilters();
  state.page = clampPage(state.page, filtered.length);
  pushURL();

  const total = filtered.length;
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const start = (state.page - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  els.resultMeta.textContent = `${total} program(s) found • Showing ${Math.min(total, start+1)}–${Math.min(total, start+pageItems.length)}`;
  els.pageMeta.textContent = `Page ${state.page} / ${maxPage}`;

  els.prevPage.disabled = state.page <= 1;
  els.nextPage.disabled = state.page >= maxPage;

  els.cards.innerHTML = pageItems.map(cardHTML).join("");

  els.cards.querySelectorAll("[data-open]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      openModal(btn.getAttribute("data-open"));
    });
  });
}

/* View */
function setView(view){
  state.view = view;
  els.cards.classList.remove("grid","list");
  els.cards.classList.add(view);
}

/* Modal */
function openModal(id){
  const p = PROGRAMS.find(x=>x.id===id);
  if(!p) return;

  els.modalFaculty.textContent = p.faculty;
  els.modalTitle.textContent = p.name;

  els.modalBody.innerHTML = `
    <div class="detail-grid">
      <div class="detail"><div class="k">Level</div><div class="v">${escapeHtml(p.level)}</div></div>
      <div class="detail"><div class="k">Duration</div><div class="v">${p.durationYears} year(s)</div></div>
      <div class="detail"><div class="k">Credits</div><div class="v">${p.credits}</div></div>
      <div class="detail"><div class="k">Estimated Tuition</div><div class="v">${formatBDT(p.tuition)}</div></div>
      <div class="detail"><div class="k">Intake</div><div class="v">${escapeHtml(p.intake)}</div></div>
      <div class="detail"><div class="k">Eligibility</div><div class="v">${escapeHtml(p.eligibility)}</div></div>
    </div>

    <div class="detail">
      <div class="k">About</div>
      <div class="v" style="font-weight:800; margin-top:6px;">${escapeHtml(p.description)}</div>
    </div>

    <div class="detail">
      <div class="k">Highlights</div>
      <div class="v" style="font-weight:900; margin-top:8px;">
        ${p.highlights.map(h=>`• ${escapeHtml(h)}`).join("<br>")}
      </div>
    </div>
  `;

  els.modalBackdrop.style.display = "block";
  els.modal.style.display = "grid";
  els.modal.setAttribute("aria-hidden","false");
}

function closeModal(){
  els.modalBackdrop.style.display = "none";
  els.modal.style.display = "none";
  els.modal.setAttribute("aria-hidden","true");
}

/* Header + Theme */
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

function initTheme(){
  els.themeBtn?.addEventListener("click", ()=>{
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    els.themeBtn.textContent = isDark ? "☾" : "☀";
  });
}

/* Auth buttons */
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

(function addMinorStyles(){
  const s = document.createElement("style");
  s.textContent = `
    .user-pill{
      display:inline-flex;align-items:center;
      height:42px;padding:0 12px;border-radius:12px;
      border:1px solid var(--line); color:var(--text);
      font-weight:900; font-size:13px;
      background:linear-gradient(180deg, rgba(27,102,201,.06), transparent 60%);
      white-space:nowrap;
      max-width: 180px;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .pill-fee{
      display:inline-flex;align-items:center;
      height:32px;padding:0 10px;border-radius:999px;
      border:1px solid rgba(27,102,201,.18);
      background:rgba(27,102,201,.10);
      color:var(--accent);
      font-weight:900; font-size:12px;
      white-space:nowrap;
    }
  `;
  document.head.appendChild(s);
})();

/* Bind controls */
function bindControls(){
  const rerun = ()=>{ state.page = 1; render(); };

  els.q.addEventListener("input", ()=>{
    state.q = els.q.value;
    rerun();
  });

  els.faculty.addEventListener("change", ()=>{
    state.faculty = els.faculty.value;
    rerun();
  });

  els.level.addEventListener("change", ()=>{
    state.level = els.level.value;
    rerun();
  });

  els.resetBtn.addEventListener("click", ()=>{
    state.q = "";
    state.faculty = "all";
    state.level = "all";
    state.page = 1;
    syncControls();
    render();
  });

  els.viewGrid.addEventListener("click", ()=>{
    setView("grid");
    pushURL();
  });
  els.viewList.addEventListener("click", ()=>{
    setView("list");
    pushURL();
  });

  els.prevPage.addEventListener("click", ()=>{
    state.page = Math.max(1, state.page - 1);
    render();
  });
  els.nextPage.addEventListener("click", ()=>{
    state.page = state.page + 1;
    render();
  });

  els.modalClose.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeModal();
  });
}

/* Init */
function init(){
  loadStateFromURL();
  populateFaculties();
  initHeaderUX();
  initTheme();
  renderAuthButtons();
  syncControls();
  bindControls();
  render();
}

init();