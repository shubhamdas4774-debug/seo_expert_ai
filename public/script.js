const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMsg);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMsg();
});

function addMsg(msg, sender) {
  const div = document.createElement("div");
  div.classList.add("msg", sender);
  div.innerText = msg;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMsg() {
  const text = input.value.trim();
  if (!text) return;

  addMsg(text, "user");
  input.value = "";
  addMsg("💭 Thinking...", "bot");

  try {
    // ✅ send the message to your Node server
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    updateLastBot(data.reply || "⚠ No response.");
  } catch (error) {
    console.error(error);
    updateLastBot("❌ Error connecting to server.");
  }
}

function updateLastBot(text) {
  const bots = document.querySelectorAll(".bot");
  const lastBot = bots[bots.length - 1];
  if (lastBot) lastBot.innerText = text;
}
