import { NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const VOICE_PRESETS: Record<string, { voiceId: string; name: string; description: string }> = {
  rachel: {
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Calm, professional female voice - perfect for med spa"
  },
  bella: {
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    description: "Warm, friendly female voice"
  },
  elli: {
    voiceId: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    description: "Young, energetic female voice"
  },
  josh: {
    voiceId: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    description: "Deep, authoritative male voice"
  },
  adam: {
    voiceId: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    description: "Professional male voice"
  },
  charlotte: {
    voiceId: "XB0fDUnXU5powFXDhCwa",
    name: "Charlotte",
    description: "Elegant, sophisticated female voice"
  }
};

const SERVICE_SCRIPTS: Record<string, string> = {
  solaria: `Introducing the Solaria CO2 Fractional Laser at Hello Gorgeous Med Spa. 
    Erase years of sun damage, smooth fine lines, and reveal radiant, youthful skin. 
    Now available at our special launch price of eighteen ninety-five. 
    Book your consultation today at Hello Gorgeous Med Spa, Oswego Illinois.`,
  
  botox: `Smooth away wrinkles with Botox at Hello Gorgeous Med Spa.
    Our expert injectors deliver natural-looking results in just fifteen minutes.
    No downtime, just gorgeous results.
    Schedule your appointment today.`,
  
  morpheus8: `Transform your skin with Morpheus8 at Hello Gorgeous Med Spa.
    This revolutionary RF microneedling treatment tightens, contours, and rejuvenates.
    Experience the gold standard in skin remodeling.
    Book now and save.`,
  
  weightloss: `Achieve your weight loss goals with our medical program at Hello Gorgeous Med Spa.
    FDA-approved Semaglutide helps you lose weight and keep it off.
    Physician supervised for your safety.
    Start your transformation today.`,
  
  fillers: `Restore volume and enhance your natural beauty with dermal fillers at Hello Gorgeous Med Spa.
    From lips to cheeks to jawline, our expert injectors create stunning, natural results.
    Book your consultation today.`,
  
  prf: `Regrow your hair naturally with PRF therapy at Hello Gorgeous Med Spa.
    Using your own growth factors, we stimulate follicles for thicker, healthier hair.
    No surgery required.
    Schedule your treatment today.`,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      text, 
      service, 
      voicePreset = "rachel",
      customText 
    } = body;

    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "ElevenLabs API key not configured",
          hint: "Add ELEVENLABS_API_KEY to your .env.local file"
        },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({ apiKey });

    const scriptText = customText || SERVICE_SCRIPTS[service] || text;
    
    if (!scriptText) {
      return NextResponse.json(
        { error: "No text provided for voiceover" },
        { status: 400 }
      );
    }

    const voice = VOICE_PRESETS[voicePreset] || VOICE_PRESETS.rachel;

    console.log("[Voiceover] Generating with voice:", voice.name);
    console.log("[Voiceover] Text:", scriptText.substring(0, 100) + "...");

    const audioResponse = await client.textToSpeech.convert(voice.voiceId, {
      text: scriptText,
      modelId: "eleven_turbo_v2_5",
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.3,
        useSpeakerBoost: true,
      },
    });

    const chunks: Uint8Array[] = [];
    for await (const chunk of audioResponse) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    const audioDir = path.join(process.cwd(), "remotion-videos", "public", "audio");
    await mkdir(audioDir, { recursive: true });

    const timestamp = Date.now();
    const filename = service 
      ? `${service}-voiceover-${timestamp}.mp3`
      : `voiceover-${timestamp}.mp3`;
    
    const outputPath = path.join(audioDir, filename);
    await writeFile(outputPath, audioBuffer);

    console.log("[Voiceover] Saved to:", outputPath);

    return NextResponse.json({
      success: true,
      audioUrl: `/audio/${filename}`,
      filename,
      voice: voice.name,
      textLength: scriptText.length,
    });

  } catch (error: any) {
    console.error("[Voiceover] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate voiceover",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    voices: Object.entries(VOICE_PRESETS).map(([key, value]) => ({
      id: key,
      ...value
    })),
    services: Object.keys(SERVICE_SCRIPTS),
    usage: {
      endpoint: "POST /api/generate-voiceover",
      body: {
        service: "solaria | botox | morpheus8 | weightloss | fillers | prf",
        voicePreset: "rachel | bella | elli | josh | adam | charlotte",
        customText: "Optional custom script (overrides service script)"
      }
    }
  });
}
