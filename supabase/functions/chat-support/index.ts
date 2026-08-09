import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.1";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const PRODUCTS = [
  { name: "Street Black Belt MM Monogram", cat: "Street", price: "€150", colors: ["Nero"], sizes: ["90", "95", "100", "105", "110"], limited: false, desc: "Cintura in pelle crust artigianale con monogramma MM e fibbia in zamak. Costruzione robusta, anima urbana. Made in Italy." },
  { name: "Street White Belt MM Monogram", cat: "Street", price: "€150", colors: ["Bianco"], sizes: ["90", "95", "100", "105", "110"], limited: false, desc: "Cintura in pelle crust artigianale con monogramma MM e fibbia in zamak. Costruzione robusta, anima urbana. Made in Italy." },
  { name: "Luxo Black Belt MM Monogram", cat: "Luxo", price: "€250", colors: ["Nero"], sizes: ["90", "95", "100", "105", "110"], limited: true, desc: "Cintura in pelle canvas artigianale con monogramma MM e fibbia in zamak. Edizione limitata e numerata. Made in Italy." },
  { name: "Luxo White Belt MM Monogram", cat: "Luxo", price: "€250", colors: ["Bianco"], sizes: ["90", "95", "100", "105", "110"], limited: true, desc: "Cintura in pelle canvas artigianale con monogramma MM e fibbia in zamak. Edizione limitata e numerata. Made in Italy." },
];

const SYSTEM_PROMPT = `Sei l'assistente virtuale di DRAMMIS, una maison italiana di cinture che unisce alta sartoria (linea Luxo) e streetwear (linea Street). Rispondi sempre in italiano, con un tono elegante, cordiale e diretto. Risposte brevi e concrete, non robotiche.

CATALOGO PRODOTTI:
${PRODUCTS.map((p) => `- ${p.name} (${p.cat}, ${p.price}). Colori: ${p.colors.join(", ")}. Taglie: ${p.sizes.join(", ")}.${p.limited ? " Edizione limitata e numerata." : ""} ${p.desc}`).join("\n")}

SPEDIZIONI: Spedizione standard gratuita in 2-4 giorni lavorativi in Italia e UE. Consegna express 24-48h disponibile al checkout per €25. Ogni ordine viene tracciato e consegnato in packaging couture.

PAGAMENTI: Carta di credito, PayPal, Apple Pay e Google Pay.

RESI: Resi gratuiti entro 30 giorni dalla consegna. Si avvia la pratica dall'account o contattando il client service; arriva un'etichetta prepagata. Rimborso entro 5 giorni lavorativi dal rientro del prodotto.

DIRITTO DI RECESSO: Per legge (Codice del Consumo), il cliente consumatore ha 14 giorni di calendario dal ricevimento della merce per recedere dall'acquisto senza motivazione, scrivendo a info.drammis@gmail.com. Questo è distinto dalla policy resi di 30 giorni, che è più generosa: nella pratica indica sempre i 30 giorni al cliente, salvo chieda esplicitamente dei termini di legge.

GARANZIA: Tutti i prodotti sono coperti da garanzia legale di conformità di 24 mesi dalla consegna per i difetti di conformità. Si attiva scrivendo a info.drammis@gmail.com.

TAGLIE: Ogni scheda prodotto riporta la vestibilità (taglie 90-110). In caso di dubbio, consiglia di scrivere al client service.

EDIZIONI LIMITATE: I pezzi delle edizioni limitate sono numerati con un numero di serie della maison.

MODIFICA ORDINE: Si può modificare entro 1 ora dalla conferma scrivendo a info.drammis@gmail.com.

CONTATTI: Client service via email a info.drammis@gmail.com, attivo dal lunedì al sabato, 9:00-19:00.

CAMPAGNA NOCTURNE: È la campagna FW/26 (cintura in edizione limitata e numerata), ma la pagina dedicata non è ancora attiva sul sito — non è ancora acquistabile. Se un cliente chiede di Nocturne, di' semplicemente che la campagna non è ancora attiva e di tornare presto a controllare; non inventare dettagli su prezzo, materiali o data di uscita che non conosci.

FATTURAZIONE/P.IVA: L'attività è in fase di costituzione societaria; se un cliente chiede dati di fatturazione o Partita IVA, non inventarli — invita a scrivere a info.drammis@gmail.com per essere seguito direttamente.

Se un cliente chiede lo stato di un ordine, usa SEMPRE lo strumento lookup_order (chiedendogli le prime cifre del numero ordine ed email usata per l'acquisto, se non li ha già forniti) — non inventare mai stati o dettagli di un ordine.

Se non conosci la risposta o la richiesta è fuori da questi argomenti, invita gentilmente a scrivere a info.drammis@gmail.com senza inventare informazioni.`;

const tools: Anthropic.Tool[] = [
  {
    name: "lookup_order",
    description: "Cerca lo stato reale di un ordine nel database, usando le prime 8 cifre dell'ID ordine e l'email usata per l'acquisto (per verificarne l'identità). Usa questo strumento ogni volta che un cliente chiede informazioni su un ordine specifico.",
    input_schema: {
      type: "object",
      properties: {
        order_id_prefix: { type: "string", description: "Le prime 8 cifre dell'ID ordine" },
        email: { type: "string", description: "Email usata per effettuare l'ordine" },
      },
      required: ["order_id_prefix", "email"],
    },
  },
];

async function lookupOrder(orderIdPrefix: string, email: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, status, total, email, order_items(name, qty, size, color)")
    .ilike("email", email.trim())
    .like("id", `${orderIdPrefix}%`)
    .limit(1)
    .maybeSingle();
  if (error || !data) return { found: false };
  return {
    found: true,
    order_id: String(data.id).slice(0, 8),
    date: data.created_at,
    status: data.status,
    total: data.total,
    items: data.order_items,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { messages, customerEmail } = await req.json();
    let conversation: Anthropic.MessageParam[] = messages;
    let finalText = "";

    for (let i = 0; i < 5; i++) {
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: customerEmail
          ? `${SYSTEM_PROMPT}\n\nQuesto cliente ha effettuato l'accesso con l'email ${customerEmail} — se chiede il suo ordine, puoi proporre di usare questa email.`
          : SYSTEM_PROMPT,
        tools,
        messages: conversation,
      });

      if (response.stop_reason === "tool_use") {
        const toolUse = response.content.find((b) => b.type === "tool_use") as Anthropic.ToolUseBlock | undefined;
        conversation = [...conversation, { role: "assistant", content: response.content }];
        if (toolUse && toolUse.name === "lookup_order") {
          const input = toolUse.input as { order_id_prefix: string; email: string };
          const result = await lookupOrder(input.order_id_prefix, input.email);
          conversation = [
            ...conversation,
            {
              role: "user",
              content: [{ type: "tool_result", tool_use_id: toolUse.id, content: JSON.stringify(result) }],
            },
          ];
          continue;
        }
        break;
      }

      const textBlock = response.content.find((b) => b.type === "text") as Anthropic.TextBlock | undefined;
      finalText = textBlock ? textBlock.text : "";
      break;
    }

    if (!finalText) finalText = "Scusa, non sono riuscito a elaborare una risposta. Scrivi a info.drammis@gmail.com per assistenza diretta.";

    return new Response(JSON.stringify({ reply: finalText }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});
