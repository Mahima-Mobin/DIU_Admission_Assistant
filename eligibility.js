const PROGRAMS = [
  {id:"cse_bsc", name:"B.Sc. in CSE", background:"science", interest:"problem_solving"},
  {id:"swe_bsc", name:"B.Sc. in SWE", background:"science", interest:"problem_solving"},
  {id:"eee_bsc", name:"B.Sc. in EEE", background:"science", interest:"problem_solving"},
  {id:"bba", name:"BBA", background:"commerce", interest:"management"},
  {id:"english_ba", name:"B.A. in English", background:"arts", interest:"communication"},
  {id:"law_llb", name:"LL.B", background:"arts", interest:"communication"},
  {id:"cse_msc", name:"M.Sc. in CSE", background:"science", interest:"problem_solving"},
  {id:"mba", name:"MBA", background:"commerce", interest:"management"}
];

const form = document.getElementById("eligForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", e=>{
  e.preventDefault();
  const ssc = parseFloat(document.getElementById("ssc").value);
  const hsc = parseFloat(document.getElementById("hsc").value);
  const background = document.getElementById("background").value;
  const interest = document.getElementById("interest").value;

  const avgGPA = (ssc + hsc)/2;

  let suggestions = PROGRAMS.filter(p=>{
    if(background === p.background && interest === p.interest){
      if(avgGPA >= 4.0) return true;
      if(avgGPA >= 3.5 && (p.id==="bba" || p.id==="english_ba" || p.id==="law_llb")) return true;
    }
    return false;
  });

  if(suggestions.length === 0){
    resultDiv.innerHTML = "<p>No recommended programs based on your input.</p>";
  } else {
    resultDiv.innerHTML = suggestions.map(p=>{
      return `
        <div class="result-card">
          <h3>${p.name}</h3>
          <p>Background: ${p.background.charAt(0).toUpperCase()+p.background.slice(1)}</p>
          <p>Interest: ${p.interest.replace("_"," ")}</p>
          <a href="programs.html?q=${p.id}">View in Programs →</a>
        </div>
      `;
    }).join("");
  }
});