const STORE_KEY = "daa_chat_history";
const PROGRAMS = window.PROGRAMS_DATA || [];

const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const msgInput = document.getElementById("msg");

/* ---------- UI helpers ---------- */

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function formatBDT(n){
  return "৳ " + Number(n).toLocaleString();
}

function timeNow(){
  return new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
}

/* ---------- message render ---------- */

function addMessage(role,text){

  const div = document.createElement("div");
  div.className = `msg ${role}`;

  div.innerHTML = `
    <div class="text">${escapeHtml(text)}</div>
    <div class="meta">${timeNow()}</div>
  `;

  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/* ---------- program card ---------- */

function createProgramCard(program){

  const card = document.createElement("div");
  card.className = "program-card";

  card.innerHTML = `
    <h4>${program.name}</h4>

    <div class="program-grid">

      <div><b>Faculty</b><br>${program.faculty}</div>

      <div><b>Level</b><br>${program.level}</div>

      <div><b>Duration</b><br>${program.durationYears} Years</div>

      <div><b>Credits</b><br>${program.credits}</div>

      <div><b>Tuition</b><br>${formatBDT(program.tuition)}</div>

      <div><b>Intake</b><br>${program.intake}</div>

    </div>

    <p class="program-desc">${program.description}</p>

  `;

  chatBody.appendChild(card);
}

/* ---------- program detection ---------- */

function normalize(text){
  return text.toLowerCase();
}

function detectProgram(text){

  const t = normalize(text);

  return PROGRAMS.find(p =>
    t.includes(p.shortName.toLowerCase()) ||
    t.includes(p.name.toLowerCase())
  );
}

/* ---------- intent detection ---------- */

function isFee(text){
  return /(fee|fees|tuition|cost)/i.test(text);
}

function isCredits(text){
  return /(credit)/i.test(text);
}

function isDuration(text){
  return /(duration|year)/i.test(text);
}

function isIntake(text){
  return /(intake|semester)/i.test(text);
}

/* ---------- response builder ---------- */

function buildProgramReply(program,text){

  if(isFee(text))
    return `${program.shortName} tuition fee is ${formatBDT(program.tuition)}`;

  if(isCredits(text))
    return `${program.name} has ${program.credits} credits`;

  if(isDuration(text))
    return `${program.name} duration is ${program.durationYears} years`;

  if(isIntake(text))
    return `${program.name} intake: ${program.intake}`;

  return `${program.name} program details`;
}

/* ---------- assistant logic ---------- */

function assistantReply(userText){

  const program = detectProgram(userText);

  if(program){

    const reply = buildProgramReply(program,userText);

    setTimeout(()=>{

      addMessage("bot",reply);

      createProgramCard(program);

    },500);

    return;
  }

  /* fallback */

  setTimeout(()=>{

    addMessage("bot",
`I can help with:

• Program details
• Tuition fees
• Credits
• Duration
• Intake

Example questions:

CSE tuition  
BBA program  
EEE credits  
MBA fee`
);

  },500);

}

/* ---------- form submit ---------- */

chatForm.addEventListener("submit",function(e){

  e.preventDefault();

  const text = msgInput.value.trim();

  if(!text) return;

  addMessage("user",text);

  msgInput.value="";

  assistantReply(text);

});

/* suggestion buttons */

document.querySelectorAll("#suggestions button").forEach(btn=>{

btn.addEventListener("click",function(){

const text = this.getAttribute("data-text");

addMessage("user",text);

assistantReply(text);

});

});

/* ===== clear chat ===== */

const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", function(){

if(!confirm("Clear chat history?")) return;

/* chat UI clear */
chatBody.innerHTML = "";

/* localStorage clear */
localStorage.removeItem("daa_chat_history");

/* welcome message again */

addMessage("bot",
`Hello 👋
How can I help you?

You can ask:
• CSE tuition
• MBA fee
• BBA credits
• Admission steps
`);

});