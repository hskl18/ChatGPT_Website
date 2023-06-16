import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval

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

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
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
  //fetch data

  const response = await fetch("http://localhost:5000/",{
    method: "POST",
    headers:{
      "Content-Type": "application/json"

    },
    body: JSON.stringify({
        prompt: data.get("prompt")
    }
    )

  })
  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const { data } = await response.json();
    const parsedData = data.bot.trim();
    typeText(messageDiv, parsedData);
  }else{
    const err = await response.json();
    messageDiv.innerHTML = "something went wrong";
    alert(err.message);

  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e)=>{
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})