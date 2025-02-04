const apiKeys = {
    chatgpt: "",  
    gemini: "",   
    deepseek: "" 
};

// Function to fetch AI responses based on selected model
async function fetchAIResponse(query, model) {
    let apiUrl = "", headers = {}, body = {};

    if (model === "chatgpt") {
        apiUrl = "https://api.openai.com/v1/chat/completions";
        headers = { "Authorization": `Bearer ${apiKeys.chatgpt}`, "Content-Type": "application/json" };
        body = JSON.stringify({ model: "gpt-4", messages: [{ role: "user", content: query }] });
    } 
    else if (model === "gemini") {
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${apiKeys.gemini}`;
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({ prompt: { text: query } });
    } 
    else if (model === "deepseek") {
        apiUrl = "https://api.deepseek.com/v1/chat/completions";
        headers = { "Authorization": `Bearer ${apiKeys.deepseek}`, "Content-Type": "application/json" };
        body = JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: query }] });
    }

    try {
        const response = await fetch(apiUrl, { method: "POST", headers, body });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return extractResponse(data, model);
    } catch (error) {
        console.error("API Request Failed:", error);
        return "Error: Please try another AI model.";
    }
}

// Function to extract AI response based on API format
function extractResponse(data, model) {
    if (model === "chatgpt") return data.choices?.[0]?.message?.content || "No response.";
    if (model === "gemini") return data.candidates?.[0]?.content || "No response.";
    if (model === "deepseek") return data.choices?.[0]?.text || "No response.";
    return "Error processing response.";
}

// Function to handle sending messages
async function sendMessage() {
    const userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return;

    const chatbox = document.getElementById("chatbox");
    const model = document.getElementById("aiSelector").value;

    // Display user message
    chatbox.innerHTML += `<p class="user-message"><b>You:</b> ${userInput}</p>`;

    // Display "Bot is typing..." message
    chatbox.innerHTML += `<p class="bot-message" id="loading">Bot is typing...</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Fetch AI response
    const response = await fetchAIResponse(userInput, model);
    
    // Remove loading message and show bot response
    document.getElementById("loading").remove();
    chatbox.innerHTML += `<p class="bot-message"><b>Bot:</b> ${response}</p>`;
    chatbox.scrollTop = chatbox.scrollHeight;

    // Clear input box
    document.getElementById("userInput").value = "";

    // Save chat history
    saveChatHistory();
}

// Function to save chat history in Local Storage
function saveChatHistory() {
    localStorage.setItem("chatHistory", document.getElementById("chatbox").innerHTML);
}

// Function to load chat history on page load
function loadChatHistory() {
    const storedChat = localStorage.getItem("chatHistory");
    if (storedChat) document.getElementById("chatbox").innerHTML = storedChat;
}

// Event Listener for "Send" Button
document.getElementById("sendButton").addEventListener("click", sendMessage);
