const checkBtn = document.getElementById("checkBtn");
const urlInput = document.getElementById("urlInput");
const statusDisplay = document.getElementById("statusDisplay");
const logList = document.getElementById("logList");

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

checkBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) return alert("Enter a valid URL.");

  statusDisplay.textContent = "Checking...";

  try {
    const res = await fetch("/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    const statusText = data.status === "online" ? "🟢 Online" : "🔴 Offline";
    const logEntry = `${formatTime()} — ${url} is ${statusText}`;
    
    const li = document.createElement("li");
    li.textContent = logEntry;
    logList.prepend(li);
    statusDisplay.textContent = logEntry;
  } catch (err) {
    statusDisplay.textContent = "Error checking status.";
  }
});