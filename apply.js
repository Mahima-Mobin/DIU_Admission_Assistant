const form = document.getElementById("applyForm");
const successBox = document.getElementById("successBox");

form.addEventListener("submit",function(e){

e.preventDefault();

const application = {

name:document.getElementById("name").value,

email:document.getElementById("email").value,

phone:document.getElementById("phone").value,

dob:document.getElementById("dob").value,

background:document.getElementById("background").value,

ssc:document.getElementById("ssc").value,

hsc:document.getElementById("hsc").value,

program:document.getElementById("program").value

};

let apps = JSON.parse(localStorage.getItem("applications")) || [];

apps.push(application);

localStorage.setItem("applications",JSON.stringify(apps));

form.style.display="none";

successBox.style.display="block";

});