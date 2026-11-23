import { z } from "zod";

// Gemini API ima besplatan nivo. Ključ se pravi na aistudio.google.com i ide u .env kao GEMINI_API_KEY.
// Model može da se promeni preko GEMINI_MODEL, ako Google neki model ukine ili promeni limite.
const DEFAULT_MODEL = "gemini-3.6-flash";

const instructions = `You translate portfolio texts written by a software engineering student from Serbian (Latin script) to English.
Keep the meaning, tone and technical terms. Keep names of projects, technologies and companies unchanged.
Do not add or remove information. Return only a JSON array of strings, one translation per input, in the same order.`;

const responseSchema = z.object({
  candidates: z
    .array(z.object({ content: z.object({ parts: z.array(z.object({ text: z.string() })) }) }))
    .min(1),
});

export class TranslateError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function translateToEnglish(texts: string[]): Promise<string[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new TranslateError("Prevod nije podešen: dodaj GEMINI_API_KEY u server/.env", 503);
  }
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instructions }] },
      contents: [{ role: "user", parts: [{ text: JSON.stringify(texts) }] }],
      // Tražimo od modela tačno ovaj oblik odgovora: niz stringova.
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: { type: "ARRAY", items: { type: "STRING" } },
      },
    }),
  });

  if (res.status === 429) throw new TranslateError("Gemini: dostignut besplatni limit, probaj ponovo za minut", 502);
  if (res.status === 400 || res.status === 403) {
    const body = await res.text();
    console.error("Gemini", res.status, body);
    throw new TranslateError(
      body.includes("API_KEY") ? "Gemini ne prihvata ključ, proveri GEMINI_API_KEY" : `Gemini je odbio zahtev (${res.status})`,
      502,
    );
  }
  if (res.status === 404) throw new TranslateError(`Gemini model "${model}" ne postoji, promeni GEMINI_MODEL`, 502);
  if (!res.ok) {
    console.error("Gemini", res.status, await res.text());
    throw new TranslateError(`Gemini je vratio grešku ${res.status}`, 502);
  }

  const data = responseSchema.parse(await res.json());
  const translations = z.array(z.string()).safeParse(JSON.parse(data.candidates[0]!.content.parts[0]?.text ?? "null"));
  if (!translations.success || translations.data.length !== texts.length) {
    throw new TranslateError("Gemini je vratio neočekivan odgovor, probaj ponovo", 502);
  }
  return translations.data;
}
