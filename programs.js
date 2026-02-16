/***********************
 * Programs Page JS
 * - data + filtering + sorting + pagination
 * - modal details
 * - URL state (q, faculty, level, sort, fee, page)
 * - auth buttons (login/signup or logout)
 ************************/

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
    description: "A comprehensive CSE program focused on modern computing, problem solving, and software development."
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
    description: "Focused on building reliable software systems with engineering best practices and teamwork."
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
    description: "Covers core electrical engineering principles with lab work and practical applications."
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
    description: "Business fundamentals with modern skills in leadership, communication, and analytics."
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
    description: "Strong foundation in English studies and communication for diverse career paths."
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
    description: "Builds legal knowledge and practical legal research and communication skills."
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
    description: "Graduate program to specialize in computing areas with research/project focus."
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
    description: "Career-focused MBA with modern business strategy and leadership skills."
  },
];

const PER_PAGE = 6;

const els = {
  header: document.getElementById("header"),
  navToggle: document.getElementById("navToggle"),
  navLinks: document.getElementById("navLinks"),

  openSearch: document.getElementById("openSearch"),
  searchbar: document.getElementById("searchbar"),
  globalSearch: document.getElementById("globalSearch"),
  searchClose: document.getElementById("searchClose"),

  q: document.getElementById("q"),
  faculty: document.getElementById("faculty"),
  level: document.getElementById("level"),
  sort: document.getElementById("sort"),
  feeMax: document.getElementById("feeMax"),
  feeLabel: document.getElementById("feeLabel"),
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

  themeBtn: document.getElementById("themeBtn"),
  authButtons: document.getElementById("authButtons"),
};

let state = {
  q: "",
  faculty: "all",
  level: "all",
  sort: "recommended",
  feeMax: 400000,
  view: "grid",
  page: 1,
};

function formatBDT(n){
  return "৳ " + Number(n).toLocaleString("en-US");
}

function clampPage(p, total){
  const maxPage = Math.max(1, Math.ceil(total / PER_PAGE));
  return Math.min(Math.max(1, p), maxPage);
}

/* ===== URL State ===== */
function loadStateFromURL(){
  const url = new URL(window.location.href);
  const q = url.searchParams.get("q") || "";
  const faculty = url.searchParams.get("faculty") || "all";
  const level = url.searchParams.get("level") || "all";
  const sort = url.searchParams.get("sort") || "recommended";
  const fee = Number(url.searchParams.get("feeMax") || 400000);
  const view = url.searchParams.get("view") || "grid";
  const page = Number(url.searchParams.get("page") || 1);

  state = {
    q,
    faculty,
    level,
    sort,
    feeMax: Number.isFinite(fee) ? fee : 400000,
    view: (view === "list" ? "list" : "grid"),
    page: Number.isFinite(page) ? page : 1,
  };
}

function syncControls(){
  els.q.value = state.q;
  els.faculty.value = state.faculty;
  els.level.value = state.level;
  els.sort.value = state.sort;
  els.feeMax.value = String(state.feeMax);
  els.feeLabel.textContent = state.feeMax >= 400000 ? "Any" : formatBDT(state.feeMax);
  setView(state.view);
}

function pushURL(){
  const url = new URL(window.location.href);
  url.searchParams.set("q", state.q);
  url.searchParams.set("faculty", state.faculty);
  url.searchParams.set("level", state.level);
  url.searchParams.set("sort", state.sort);
  url.searchParams.set("feeMax", String(state.feeMax));
  url.searchParams.set("view", state.view);
  url.searchParams.set("page", String(state.page));
  window.history.replaceState({}, "", url);
}

/* ===== Populate faculty dropdown ===== */
function populateFaculties(){
  const facs = Array.from(new Set(PROGRAMS.map(p=>p.faculty))).sort();
  for(const f of facs){
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    els.faculty.appendChild(opt);
  }
}

/* ===== Filtering + Sorting ===== */
function applyFilters(){
  const q = state.q.trim().toLowerCase();
  const faculty = state.faculty;
  const level = state.level;
  const feeMax = state.feeMax;

  let data = PROGRAMS.filter(p => {
    if(faculty !== "all" && p.faculty !== faculty) return false;
    if(level !== "all" && p.level !== level) return false;
    if(Number.isFinite(feeMax) && p.tuition > feeMax) return false;

    if(q){
      const hay = `${p.name} ${p.faculty} ${p.level} ${p.description} ${p.highlights.join(" ")}`.toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });

  // Sorting
  switch(state.sort){
    case "fee_low":
      data.sort((a,b)=>a.tuition-b.tuition); break;
    case "fee_high":
      data.sort((a,b)=>b.tuition-a.tuition); break;
    case "duration_low":
      data.sort((a,b)=>a.durationYears-b.durationYears); break;
    case "name_az":
      data.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default:
      // Recommended: simple heuristic (UG first then low tuition)
      data.sort((a,b)=>{
        const aScore = (a.level==="Undergraduate"?0:1)*1000000 + a.tuition;
        const bScore = (b.level==="Undergraduate"?0:1)*1000000 + b.tuition;
        return aScore - bScore;
      });
  }

  return data;
}

/* ===== Render cards ===== */
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

  els.cards.innerHTML = pageItems.map(p => cardHTML(p)).join("");

  // attach events
  els.cards.querySelectorAll("[data-open]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-open");
      openModal(id);
    });
  });
}

function cardHTML(p){
  return `
    <article class="card">
      <div class="card-top">
        <div>
          <div class="badge">${p.level}</div>
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

function shorten(s, n){
  if(!s) return "";
  return s.length > n ? (s.slice(0, n-1) + "…") : s;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ===== View toggle ===== */
function setView(view){
  state.view = view;
  els.cards.classList.remove("grid","list");
  els.cards.classList.add(view);
}

/* ===== Modal ===== */
function openModal(id){
  const p = PROGRAMS.find(x=>x.id===id);
  if(!p) return;

  els.modalFaculty.textContent = p.faculty;
  els.modalTitle.textContent = p.name;

  els.modalBody.innerHTML = `
    <div class="detail-grid">
      <div class="detail"><div class="k">Level</div><div class="v">${p.level}</div></div>
      <div class="detail"><div class="k">Duration</div><div class="v">${p.durationYears} year(s)</div></div>
      <div class="detail"><div class="k">Credits</div><div class="v">${p.credits}</div></div>
      <div class="detail"><div class="k">Estimated Tuition</div><div class="v">${formatBDT(p.tuition)}</div></div>
      <div class="detail"><div class="k">Intake</div><div class="v">${p.intake}</div></div>
      <div class="detail"><div class="k">Eligibility</div><div class="v">${escapeHtml(p.eligibility)}</div></div>
    </div>

    <div class="detail">
      <div class="k">About</div>
      <div class="v" style="font-weight:700; margin-top:6px;">${escapeHtml(p.description)}</div>
    </div>

    <div class="detail">
      <div class="k">Highlights</div>
      <div class="v" style="font-weight:800; margin-top:8px;">
        ${p.highlights.map(h=>`• ${escapeHtml(h)}`).join("<br>")}
      </div>
    </div>
  `;

  els.modalBackdrop.style.display = "block";
  els.modal.style.display = "grid";
  els.modal.setAttribute("aria-hidden","false");
  els.modalBackdrop.setAttribute("aria-hidden","false");

  // focus close for accessibility
  setTimeout(()=> els.modalClose?.focus(), 0);
}

function closeModal(){
  els.modalBackdrop.style.display = "none";
  els.modal.style.display = "none";
  els.modal.setAttribute("aria-hidden","true");
  els.modalBackdrop.setAttribute("aria-hidden","true");
}

/* ===== Header shadow + Mobile nav + Searchbar ===== */
function initHeaderUX(){
  window.addEventListener("scroll", () => {
    els.header?.classList.toggle("scrolled", window.scrollY > 10);
  });

  els.navToggle?.addEventListener("click", ()=>{
    els.navLinks.classList.toggle("open");
  });

  // close nav on outside click (mobile)
  document.addEventListener("click", (e)=>{
    if(window.innerWidth > 980) return;
    const inside = els.navLinks.contains(e.target) || els.navToggle.contains(e.target);
    if(!inside) els.navLinks.classList.remove("open");
  });

  // searchbar
  const openSearch = ()=> {
    els.searchbar.classList.add("open");
    setTimeout(()=> els.globalSearch?.focus(), 50);
  };
  els.openSearch?.addEventListener("click", openSearch);
  els.searchClose?.addEventListener("click", ()=> els.searchbar.classList.remove("open"));

  // type in global search -> sync with q
  els.globalSearch?.addEventListener("input", ()=>{
    els.q.value = els.globalSearch.value;
    state.q = els.globalSearch.value;
    state.page = 1;
    render();
  });
}

/* ===== Theme toggle ===== */
function initTheme(){
  els.themeBtn?.addEventListener("click", ()=>{
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    els.themeBtn.textContent = isDark ? "☾" : "☀";
  });
}

/* ===== Auth buttons ===== */
function renderAuthButtons(){
  const container = els.authButtons;
  if(!container) return;

  const userRaw = localStorage.getItem("daa_user");
  if(userRaw){
    const u = JSON.parse(userRaw);
    container.innerHTML = `
      <button class="icon-btn" id="searchBtnInline" type="button" aria-label="Search">🔍</button>
      <span class="user-pill" title="${escapeHtml(u.email || "")}">👋 ${escapeHtml(u.name || "User")}</span>
      <button class="btn btn-outline" id="logoutBtn" type="button">Logout</button>
    `;

    container.querySelector("#logoutBtn")?.addEventListener("click", ()=>{
      localStorage.removeItem("daa_user");
      window.location.reload();
    });

    container.querySelector("#searchBtnInline")?.addEventListener("click", ()=>{
      els.searchbar.classList.toggle("open");
      if(els.searchbar.classList.contains("open")) setTimeout(()=> els.globalSearch?.focus(), 50);
    });

  }else{
    container.innerHTML = `
      <button class="icon-btn" id="searchBtnInline" type="button" aria-label="Search">🔍</button>
      <a class="btn btn-outline" href="login.html">Login</a>
      
    `;

    container.querySelector("#searchBtnInline")?.addEventListener("click", ()=>{
      els.searchbar.classList.toggle("open");
      if(els.searchbar.classList.contains("open")) setTimeout(()=> els.globalSearch?.focus(), 50);
    });
  }
}

/* small style injection for user pill (kept in JS to keep CSS minimal) */
(function addUserPillStyle(){
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

/* ===== Wire events ===== */
function bindControls(){
  const rerun = ()=>{
    state.page = 1;
    render();
  };

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

  els.sort.addEventListener("change", ()=>{
    state.sort = els.sort.value;
    rerun();
  });

  els.feeMax.addEventListener("input", ()=>{
    state.feeMax = Number(els.feeMax.value);
    els.feeLabel.textContent = state.feeMax >= 400000 ? "Any" : formatBDT(state.feeMax);
    rerun();
  });

  els.resetBtn.addEventListener("click", ()=>{
    state = { q:"", faculty:"all", level:"all", sort:"recommended", feeMax:400000, view:state.view, page:1 };
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

  // modal close
  els.modalClose.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeModal();
  });
}

/* ===== Init ===== */
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
