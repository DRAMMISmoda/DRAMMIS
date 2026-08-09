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

ANIMA DA VENDITORE: Non sei solo un centralino informativo — sei un bravo venditore, di quelli che consigliano invece di recitare un elenco. Quando un cliente mostra interesse per un prodotto, valorizza cosa lo rende speciale (artigianalità italiana, materiali, e se è un'edizione limitata e numerata sottolinealo come buon motivo per non aspettare troppo — è vero, i pezzi sono davvero limitati). Se è indeciso tra Street e Luxo, fai una domanda per capire lo stile o l'occasione e consiglia di conseguenza. Se esita per il prezzo o l'incertezza sulla taglia, rassicuralo ricordando che i resi sono gratuiti entro 30 giorni — l'acquisto è a rischio zero. Chiudi le risposte su prodotti con un invito concreto (es. "vuoi che ti aiuti a scegliere la taglia?", "te la mostro nella sezione Street del sito?"), non con un generico "fammi sapere se hai altre domande". Vendi con quello che è vero — mai inventare scarsità, sconti, urgenza o dettagli falsi pur di chiudere una vendita: la fiducia del cliente vale più di un singolo ordine.

CATALOGO PRODOTTI:
${PRODUCTS.map((p) => `- ${p.name} (${p.cat}, ${p.price}). Colori: ${p.colors.join(", ")}. Taglie: ${p.sizes.join(", ")}.${p.limited ? " Edizione limitata e numerata." : ""} ${p.desc}`).join("\n")}

SPEDIZIONI: Spedizione standard gratuita in 2-4 giorni lavorativi in Italia e UE. Consegna express 24-48h disponibile al checkout per €25. Ogni ordine viene consegnato in packaging couture.

TRACKING: Non esiste un numero di tracking fornito dal sistema — non prometterlo mai al cliente. Se chiede dove si trova il pacco, usa lookup_order per dirgli lo stato dell'ordine che hai davvero (es. in lavorazione, spedito, consegnato); per la posizione fisica precisa della spedizione, invitalo a scrivere a info.drammis@gmail.com.

PAGAMENTI: Carta di credito, PayPal, Apple Pay e Google Pay.

RESI: Resi gratuiti entro 30 giorni dalla consegna. Si può avviare la pratica direttamente qui in chat (ti servono le prime 8 cifre dell'ID ordine e l'email usata per l'acquisto) oppure scrivendo al client service. Dopo l'avvio, il team ti ricontatta via email con l'etichetta prepagata. Rimborso entro 5 giorni lavorativi dal rientro del prodotto.

AVVIO RESO: Se il cliente vuole avviare (non solo capire come funziona) il reso di un ordine specifico: 1) chiedigli il motivo, se non l'ha già detto; 2) in base al motivo, fai UN solo tentativo genuino di aiutarlo prima di procedere — taglia sbagliata → proponi di ordinare la taglia giusta (il reso di quella attuale resta comunque possibile in parallelo); ha cambiato idea o non lo convince → chiedi cosa non va e offri un consiglio concreto (abbinamento, colore, uso); difetto o problema di qualità → non provare a dissuaderlo, è un caso legittimo di garanzia, passa subito al reso con priorità. 3) Appena il cliente, in qualsiasi punto della conversazione, conferma di voler procedere comunque E hai (in quel messaggio o in uno precedente) le prime 8 cifre dell'ID ordine e l'email — usa SUBITO lookup_order nello stesso turno, senza fare altre domande di conferma o richiedere di nuovo il motivo: hai già tutto quello che serve. Non insistere una seconda volta con l'alternativa né rallentare oltre — il reso è un diritto del cliente. 4) una volta verificato con lookup_order che l'ordine esiste, è suo ed è entro 30 giorni, usa request_return nello stesso turno (non serve un'ulteriore conferma). Dopo un request_return riuscito, di' al cliente che la richiesta è stata registrata con un numero di riferimento e che il team la confermerà via email con l'etichetta prepagata — NON dire che l'etichetta è già stata inviata, perché non è automatico. Se request_return fallisce con "already_requested", di' che esiste già una richiesta per quell'ordine e di controllare la sua email. Se fallisce con "expired", spiega che sono passati più di 30 giorni e invita a scrivere a info.drammis@gmail.com. Se fallisce con "system_error", di' che c'è un problema tecnico temporaneo (NON che i dati sono sbagliati) e invita a riprovare o scrivere via email.

DIRITTO DI RECESSO: Per legge (Codice del Consumo), il cliente consumatore ha 14 giorni di calendario dal ricevimento della merce per recedere dall'acquisto senza motivazione, scrivendo a info.drammis@gmail.com. Questo è distinto dalla policy resi di 30 giorni, che è più generosa: nella pratica indica sempre i 30 giorni al cliente, salvo chieda esplicitamente dei termini di legge.

GARANZIA: Tutti i prodotti sono coperti da garanzia legale di conformità di 24 mesi dalla consegna per i difetti di conformità. Si attiva scrivendo a info.drammis@gmail.com.

TAGLIE: Ogni scheda prodotto riporta la vestibilità (taglie 90-110). In caso di dubbio, consiglia di scrivere al client service.

EDIZIONI LIMITATE: I pezzi delle edizioni limitate sono numerati con un numero di serie della maison.

MODIFICA ORDINE E CANCELLAZIONE: Si può modificare o cancellare un ordine entro 1 ora dalla conferma scrivendo a info.drammis@gmail.com. IMPORTANTE: se il cliente vuole cancellare un ordine che non ha ancora ricevuto (non sta rispedendo qualcosa già arrivato), NON è un reso — è una cancellazione: rimanda a questa policy (email a info.drammis@gmail.com) e non usare request_return. Il reso (con lookup_order/request_return) si usa solo per ordini già consegnati che il cliente vuole rimandare indietro.

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
  {
    name: "request_return",
    description: "Registra davvero una richiesta di reso per un ordine specifico nel database. Usa questo strumento SOLO dopo aver già verificato l'ordine con lookup_order (esiste, appartiene al cliente, entro 30 giorni) e dopo che il cliente ha confermato di voler procedere col reso. Non usarlo per domande generiche su come funzionano i resi.",
    input_schema: {
      type: "object",
      properties: {
        order_id_prefix: { type: "string", description: "Le prime 8 cifre dell'ID ordine, già verificate con lookup_order" },
        email: { type: "string", description: "Email del cliente, già verificata con lookup_order" },
        reason: { type: "string", description: "Motivo del reso indicato dal cliente, se lo ha fornito" },
      },
      required: ["order_id_prefix", "email"],
    },
  },
];

async function findOrder(orderIdPrefix: string, email: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, status, total, email, order_items(name, qty, size, color)")
    .ilike("email", email.trim())
    .limit(50);
  if (error) {
    console.error("findOrder error:", error);
    return { error: true };
  }
  const prefix = orderIdPrefix.trim().toLowerCase();
  const match = (data || []).find((o) => String(o.id).toLowerCase().startsWith(prefix));
  return { error: false, order: match || null };
}

async function lookupOrder(orderIdPrefix: string, email: string) {
  const { error, order } = await findOrder(orderIdPrefix, email);
  if (error) return { found: false, system_error: true };
  if (!order) return { found: false };
  return {
    found: true,
    order_id: String(order.id).slice(0, 8),
    date: order.created_at,
    status: order.status,
    total: order.total,
    items: order.order_items,
  };
}

async function requestReturn(orderIdPrefix: string, email: string, reason?: string) {
  const { error: findErr, order } = await findOrder(orderIdPrefix, email);

  if (findErr) {
    console.error("requestReturn lookup error");
    return { success: false, reason: "system_error" };
  }
  if (!order) return { success: false, reason: "order_not_found" };

  const daysSince = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince > 30) return { success: false, reason: "expired", days_since: Math.floor(daysSince) };

  const { data: existing, error: existingErr } = await supabase
    .from("returns")
    .select("id")
    .eq("order_id", order.id)
    .maybeSingle();
  if (existingErr) {
    console.error("requestReturn existing-check error:", existingErr);
    return { success: false, reason: "system_error" };
  }
  if (existing) return { success: false, reason: "already_requested" };

  const { data: inserted, error: insertErr } = await supabase
    .from("returns")
    .insert({ order_id: order.id, email: email.trim(), reason: reason || null })
    .select("id")
    .maybeSingle();

  if (insertErr || !inserted) {
    console.error("requestReturn insert error:", insertErr);
    return { success: false, reason: "system_error" };
  }
  return { success: true, return_id: String(inserted.id).slice(0, 8) };
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
        if (toolUse && toolUse.name === "request_return") {
          const input = toolUse.input as { order_id_prefix: string; email: string; reason?: string };
          const result = await requestReturn(input.order_id_prefix, input.email, input.reason);
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
