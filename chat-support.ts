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
  { name: "Street Black Belt LUMA Buckle", cat: "Street", price: "€150", desc: "Cintura in pelle crust artigianale con fibbia LUMA in zamak. Costruzione robusta, anima urbana. Made in Italy." },
  { name: "Street White Belt LUMA Buckle", cat: "Street", price: "€150", desc: "Cintura in pelle crust artigianale con fibbia LUMA in zamak. Costruzione robusta, anima urbana. Made in Italy." },
  { name: "Canvas Studs", cat: "Street", price: "€165", desc: "Cintura in canvas rinforzato con borchie applicate a mano e fibbia scultorea. Edizione limitata." },
  { name: "Metro Reversibile", cat: "Street", price: "€195", desc: "Cintura reversibile in pelle e nylon tecnico. Due anime, un solo gesto per cambiarle." },
  { name: "Luxo Black Belt MM Monogram", cat: "Luxo", price: "€250", desc: "Cintura in pelle canvas artigianale con monogramma MM e fibbia in zamak. Edizione limitata. Made in Italy." },
  { name: "Luxo White Belt MM Monogram", cat: "Luxo", price: "€250", desc: "Cintura in pelle canvas artigianale con monogramma MM e fibbia in zamak. Edizione limitata. Made in Italy." },
  { name: "Sovrana", cat: "Luxo", price: "€720", desc: "Cintura in vitello pieno fiore con fibbia scultorea firmata. Una silhouette che non passa inosservata." },
  { name: "Héritage", cat: "Luxo", price: "€580", desc: "Cintura senza tempo in pelle vacchetta conciata al vegetale. L'essenziale della maison, per sempre." },
];

const SYSTEM_PROMPT = `Sei l'assistente virtuale di DRAMMIS, una maison italiana di cinture che unisce alta sartoria (linea Luxo) e streetwear (linea Street). Rispondi sempre in italiano, con un tono elegante, cordiale e diretto. Risposte brevi e concrete, non robotiche.

CATALOGO PRODOTTI:
${PRODUCTS.map((p) => `- ${p.name} (${p.cat}, ${p.price}): ${p.desc}`).join("\n")}

SPEDIZIONI: Spedizione standard gratuita in 2-4 giorni lavorativi in Italia e UE. Consegna express 24-48h disponibile al checkout per €25. Ogni ordine viene tracciato e consegnato in packaging couture.

RESI: Resi gratuiti entro 30 giorni dalla consegna. Si avvia la pratica dall'account o contattando il client service; arriva un'etichetta prepagata. Rimborso entro 5 giorni lavorativi dal rientro del prodotto.

TAGLIE: Ogni scheda prodotto riporta la vestibilità. In caso di dubbio, consiglia di scrivere al client service.

MODIFICA ORDINE: Si può modificare entro 1 ora dalla conferma scrivendo a info.drammis@gmail.com.

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
