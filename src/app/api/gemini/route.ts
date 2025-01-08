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

    // Attempt to invoke the text function
    const textResponse = result.response.text(); 

    console.log("Generated Response:", textResponse);
    return NextResponse.json({ text: textResponse });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}