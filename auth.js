// Auth handlers for signup and login pages

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAuthButtons(){
  const container = document.getElementById("authButtons");
  if(!container) return;
  const userRaw = localStorage.getItem("daa_user");
  const authOnlyEls = document.querySelectorAll('.auth-only');
  if(userRaw){
    const u = JSON.parse(userRaw);
    container.innerHTML = `
      <span class="user-pill" title="${escapeHtml(u.email || "")}">👋 ${escapeHtml(u.name || "User")}</span>
      <button class="btn btn-outline" id="logoutBtn" type="button">Logout</button>
    `;
    authOnlyEls.forEach(el=>el.style.display='inline-block');
    container.querySelector("#logoutBtn")?.addEventListener("click", async ()=>{
      try{ await fetch('/logout'); }catch(e){}
      localStorage.removeItem("daa_user");
      window.location.href = 'index.html';
    });
  }else{
    container.innerHTML = `
      <a class="btn btn-outline" href="login.html">Login</a>
    `;
    authOnlyEls.forEach(el=>el.style.display='none');
  }
}

(function addAuthStyles(){
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
  `;
  document.head.appendChild(s);
})();

document.addEventListener('DOMContentLoaded', ()=>{
  renderAuthButtons();
  const signup = document.getElementById('signup-form');
  if(signup){
    signup.addEventListener('submit', async function(e){
      e.preventDefault();
      const name = document.getElementById('fname').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm-password').value;
      if(password !== confirm){ alert('Passwords do not match'); return; }
      try{
        const res = await fetch('/api/register', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({name, email, password})
        });
        const json = await res.json();
        if(res.ok) { alert(json.message); window.location.href = '/login.html'; }
        else alert(json.message || 'Registration failed');
      }catch(err){ alert('Error: '+err.message); }
    });
  }

  const login = document.getElementById('login-form');
  if(login){
    login.addEventListener('submit', async function(e){
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      try{
        const res = await fetch('/api/login', {
          method: 'POST', headers: {'Content-Type':'application/json'},
          body: JSON.stringify({email, password})
        });
        const json = await res.json();
        if(res.ok) { 
          if(json.user) localStorage.setItem('daa_user', JSON.stringify(json.user));
          window.location.href = '/programs.html'; 
        }
        else alert(json.message || 'Login failed');
      }catch(err){ alert('Error: '+err.message); }
    });
  }
});
