import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element){
  // "..."

  element.textContent = "";
  loadInterval =setInterval(()=>{
    element.textContent+=".";
    if(element.textContent === "....."){
      element.textContent=".";
    }
  }, 340)
}

function typeText(element, text){
  let i = 0;
  let interval = setInterval(()=>{
    if(i<text.length){
      element.innerHTML += text.chartAt(i);
      i++;

    }else{clearInterval(interval); }
  },10)
}

function generateUniqueId(){
  const timeStamp = Date.now();
  const randNum = Math.random;
  const hexaDecString =randNum.toString(16);

  return `id-${timeStamp}-${hexaDecString}`;
}

function chatStripe(isAi,value,id){
  return(
    `
      <div class = "wrapper ${isAi && "ai"}">
        <div class"chat">
          <div className = "profile">

            <img src= "${isAi?bot:user}"
              alt="${isAi?"bot":"user"}"
            >
            </img>
          </div>
          <div class="message" id = ${id}>${value}</div>
        </div>
      </div>
    `
  )
} 

const handleSubmit = async(e)=>{
  e.preventDefault();

  const data = new FormData(form);
  
  chatContainer.innerHTML +=chatStripe(false,data.get("prompt"));

  form.reset();

  const id = generateUniqueId();
  chatContainer.innerHTML +=chatStripe(true,"",id);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(id);

  loader(messageDiv);


}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e)=>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})