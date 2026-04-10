// Auth handlers for signup and login pages
document.addEventListener('DOMContentLoaded', ()=>{
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
          window.location.href = '/dashboard'; 
        }
        else alert(json.message || 'Login failed');
      }catch(err){ alert('Error: '+err.message); }
    });
  }
});
