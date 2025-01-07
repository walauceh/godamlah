import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  console.log("API route hit");
  try {
    const { prompt } = await req.json();
    console.log("Received Prompt:", prompt);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    console.log("Generated Response:", result.response.text);
    return NextResponse.json({ text: result.response.text });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

