const GROUPS = [
  "GRUPO 1",
  "GRUPO 2",
  "GRUPO 3",
  "GRUPO 4",
  "GRUPO 5",
  "GRUPO 6",
  "GRUPO 7",
  "GRUPO 8",
  "GRUPO 9",
  "GRUPO 10"
];

const lockIcon = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <rect x="6" y="11" width="12" height="9" rx="2" stroke="#ffffff" stroke-width="1.8"/>
  <path d="M8.5 11V8.4a3.5 3.5 0 0 1 7 0V11" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="12" cy="15.4" r="1.15" fill="#ffffff"/>
</svg>`;

const groupsEl = document.getElementById("groups");
groupsEl.innerHTML = GROUPS.map((name) => `
  <div class="group">
    <span class="group-ico">${lockIcon}</span>
    <span class="group-copy">
      <strong>${name}</strong>
      <span class="group-link"></span>
    </span>
  </div>
`).join("");

const BIBLIO_KNOWLEDGE = {
  nome: "BiblioPRO",
  descricao: "A BiblioPRO é um serviço de organização de conteúdos que reúne materiais de diferentes áreas em uma única plataforma.",
  grupos: "Os conteúdos ficam organizados em dez grupos, em um só lugar.",
  busca: "Em vez de procurar conteúdos em vários lugares, o acesso acontece dentro da própria plataforma."
};

const API_CONFIG = {
  endpoint: "",
  ready: false
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function answerFromKnowledge(question) {
  const q = normalize(question);
  if (!q) return "Não possui essa informação.";

  if (
    q.includes("como funciona") ||
    (q.includes("bibliopro") && (q.includes("o que") || q.includes("que e") || q.includes("oque")))
  ) {
    return BIBLIO_KNOWLEDGE.descricao;
  }

  if (q.includes("grupo") || q.includes("o que encontro") || q.includes("organizado")) {
    return BIBLIO_KNOWLEDGE.grupos;
  }

  if (q.includes("varios lugares") || q.includes("procurar") || q.includes("plataforma")) {
    return BIBLIO_KNOWLEDGE.busca;
  }

  return "Não possui essa informação.";
}

const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

function addBubble(text, type) {
  const el = document.createElement("div");
  el.className = `bubble bubble-${type}`;
  el.textContent = text;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function ask(question) {
  const q = question.trim();
  if (!q) return;

  addBubble(q, "user");
  chatInput.value = "";

  if (API_CONFIG.ready && API_CONFIG.endpoint) {
    try {
      const res = await fetch(API_CONFIG.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      const data = await res.json();
      addBubble(data.answer || "Não possui essa informação.", "ai");
      return;
    } catch {
      addBubble("Não possui essa informação.", "ai");
      return;
    }
  }

  addBubble(answerFromKnowledge(q), "ai");
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  ask(chatInput.value);
});

document.getElementById("chatChips").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-q]");
  if (!btn) return;
  ask(btn.dataset.q);
});

const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", (e) => {
  const url = checkoutBtn.getAttribute("data-checkout");
  if (!url) {
    e.preventDefault();
  }
});
