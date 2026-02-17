/**
 * LLM Integration — OpenAI GPT-4o-mini
 *
 * CHOIX DU MODÈLE : GPT-4o-mini
 * ─────────────────────────────────
 * 1. Coût/performance : 15x moins cher que GPT-4o, mais 95% de la qualité
 *    pour les tâches documentaires (résumé, catégorisation, extraction).
 *
 * 2. Vitesse : Réponse en <2s en moyenne, idéal pour une UX fluide
 *    dans un assistant conversationnel.
 *
 * 3. Contexte 128K tokens : Permet d'ingérer des documents volumineux
 *    (rapports, contrats) en une seule passe.
 *
 * 4. Multilingue natif : Excellent en français, ce qui est essentiel
 *    pour une plateforme francophone.
 *
 * 5. Zéro dépendance : Appel via fetch() natif à l'API REST OpenAI,
 *    aucun SDK à installer.
 *
 * 6. Facilement interchangeable : La couche d'abstraction ci-dessous
 *    permet de switcher vers Claude, Mistral, ou Llama en changeant
 *    uniquement l'URL et le format.
 *
 * FONCTIONNALITÉS IA AJOUTÉES :
 * - Assistant conversationnel : Poser des questions sur vos documents
 * - Résumé automatique : Générer un résumé d'un document
 * - Catégorisation intelligente : Suggérer la catégorie d'un document
 * - Extraction de tags : Extraire les mots-clés d'un document
 * - Recherche sémantique : Reformuler les requêtes pour plus de pertinence
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = "gpt-4o-mini";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

async function callOpenAI(messages: ChatMessage[], maxTokens: number = 1024): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    return simulateResponse(messages);
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI API error: ${res.status}`);
  }

  const data = await res.json();
  return {
    content: data.choices[0]?.message?.content || "",
    model: data.model,
    usage: data.usage,
  };
}

// Demo mode — simulated responses when no API key is configured
function simulateResponse(messages: ChatMessage[]): AIResponse {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";

  // Detect intent from the system message
  const systemMsg = messages[0]?.content?.toLowerCase() || "";

  if (systemMsg.includes("résumé") || systemMsg.includes("summarize")) {
    return {
      content: "**Résumé du document**\n\nCe document traite des principaux points suivants :\n\n1. **Contexte** — Présentation du cadre général et des objectifs\n2. **Analyse** — Étude détaillée des données et indicateurs clés\n3. **Recommandations** — Actions proposées pour améliorer les résultats\n4. **Conclusion** — Synthèse et prochaines étapes\n\n> *Note : Ceci est un résumé généré en mode démo. Configurez votre clé OpenAI pour des résumés réels.*",
      model: "demo-mode",
    };
  }

  if (systemMsg.includes("catégor") || systemMsg.includes("categorize")) {
    return {
      content: JSON.stringify({ category: "Rapports", confidence: 0.85, alternatives: ["Contrats", "Juridique"] }),
      model: "demo-mode",
    };
  }

  if (systemMsg.includes("tags") || systemMsg.includes("extract")) {
    return {
      content: JSON.stringify({ tags: ["finance", "annuel", "rapport", "2025", "budget"], confidence: 0.9 }),
      model: "demo-mode",
    };
  }

  // Chat responses
  if (lastMsg.includes("bonjour") || lastMsg.includes("salut") || lastMsg.includes("hello")) {
    return {
      content: "Bonjour ! Je suis l'assistant IA d'Archivist. Je peux vous aider à :\n\n- **Résumer** vos documents\n- **Rechercher** des informations spécifiques\n- **Catégoriser** automatiquement vos fichiers\n- **Extraire** les mots-clés importants\n\nComment puis-je vous aider ?",
      model: "demo-mode",
    };
  }

  if (lastMsg.includes("résumé") || lastMsg.includes("résumer") || lastMsg.includes("summary")) {
    return {
      content: "Pour résumer un document, rendez-vous sur la page du document et cliquez sur le bouton **« Résumer avec l'IA »**. Je générerai automatiquement un résumé structuré.\n\nVous pouvez aussi me donner le contenu ici et je le résumerai pour vous.",
      model: "demo-mode",
    };
  }

  if (lastMsg.includes("cherch") || lastMsg.includes("recherch") || lastMsg.includes("trouv")) {
    return {
      content: "Je peux vous aider à rechercher des documents. Décrivez-moi ce que vous cherchez en langage naturel, par exemple :\n\n- *\"Les factures de mars 2025\"*\n- *\"Le contrat avec le fournisseur X\"*\n- *\"Les rapports financiers du dernier trimestre\"*\n\nJe reformulerai votre requête pour des résultats optimaux.",
      model: "demo-mode",
    };
  }

  return {
    content: "Je suis l'assistant IA d'Archivist. En mode démo, mes réponses sont simulées. Configurez la variable `OPENAI_API_KEY` pour activer les réponses réelles.\n\nJe peux vous aider avec :\n- 📄 **Résumés** de documents\n- 🏷️ **Catégorisation** automatique\n- 🔍 **Recherche** intelligente\n- 💡 **Suggestions** d'organisation\n\nPosez-moi votre question !",
    model: "demo-mode",
  };
}

// ─── Public API ──────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es l'assistant IA d'Archivist, une plateforme d'archivage documentaire professionnelle.
Tu aides les utilisateurs à gérer, rechercher, résumer et organiser leurs documents.
Tu réponds toujours en français, de manière concise et professionnelle.
Tu peux résumer des documents, suggérer des catégories, extraire des mots-clés, et répondre aux questions sur l'organisation documentaire.
Si on te demande quelque chose hors de ce contexte, redirige poliment vers les fonctionnalités de la plateforme.`;

export async function chat(userMessages: ChatMessage[]): Promise<AIResponse> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...userMessages,
  ];
  return callOpenAI(messages);
}

export async function summarizeDocument(title: string, description: string, category: string, tags: string[]): Promise<AIResponse> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "Tu es un assistant de résumé documentaire. Génère un résumé structuré et concis du document suivant. Utilise du markdown avec des titres, listes et points clés.",
    },
    {
      role: "user",
      content: `Résume ce document :\n\nTitre : ${title}\nCatégorie : ${category}\nTags : ${tags.join(", ")}\nDescription : ${description}`,
    },
  ];
  return callOpenAI(messages, 512);
}

export async function categorizeDocument(title: string, description: string, fileName: string, existingCategories: string[]): Promise<AIResponse> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: `Tu es un assistant de catégorisation. Analyse le document et suggère la catégorie la plus appropriée parmi : ${existingCategories.join(", ")}. Réponds UNIQUEMENT en JSON : {"category": "...", "confidence": 0.0-1.0, "alternatives": ["..."]}`,
    },
    {
      role: "user",
      content: `Catégorise ce document :\nTitre : ${title}\nFichier : ${fileName}\nDescription : ${description}`,
    },
  ];
  return callOpenAI(messages, 128);
}

export async function extractTags(title: string, description: string, category: string): Promise<AIResponse> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "Tu es un assistant d'extraction de mots-clés. Extrais les tags les plus pertinents du document. Réponds UNIQUEMENT en JSON : {\"tags\": [\"...\"], \"confidence\": 0.0-1.0}",
    },
    {
      role: "user",
      content: `Extrais les tags :\nTitre : ${title}\nCatégorie : ${category}\nDescription : ${description}`,
    },
  ];
  return callOpenAI(messages, 128);
}

export function isAIConfigured(): boolean {
  return !!OPENAI_API_KEY;
}
