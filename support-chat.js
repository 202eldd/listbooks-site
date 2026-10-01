(() => {
  const messagesElement = document.querySelector("#assistant-messages");
  if (!messagesElement) return;

  function addMessage(text, role) {
    const message = document.createElement("div");
    message.className = `assistant-message assistant-message-${role}`;
    message.textContent = text;
    messagesElement.append(message);
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }

  document.querySelectorAll("[data-faq-question][data-faq-answer]").forEach(button => {
    button.addEventListener("click", () => {
      addMessage(button.dataset.faqQuestion || "", "user");
      addMessage(button.dataset.faqAnswer || "", "bot");
    });
  });
})();
