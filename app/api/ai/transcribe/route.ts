import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface TranscriptionResult {
  text: string;
  words: WordTimestamp[];
  duration: number;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "Audio file required" }, { status: 400 });
    }

    // Transcribe with Whisper - word-level timestamps
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    // Extract word-level timestamps
    const words: WordTimestamp[] = (transcription as unknown as { words?: Array<{ word: string; start: number; end: number }> }).words?.map((w) => ({
      word: w.word,
      start: w.start,
      end: w.end,
    })) || [];

    // Calculate duration from last word
    const duration = words.length > 0 ? words[words.length - 1].end : 0;

    const result: TranscriptionResult = {
      text: transcription.text,
      words,
      duration,
    };

    return NextResponse.json({ success: true, transcription: result });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}
