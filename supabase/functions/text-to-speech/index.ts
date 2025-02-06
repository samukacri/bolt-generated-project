import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process audio data in chunks to prevent stack overflow
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const chunks: string[] = [];
  const chunk_size = 8192; // Process 8KB at a time
  const uint8Array = new Uint8Array(buffer);
  
  for (let i = 0; i < uint8Array.length; i += chunk_size) {
    const chunk = uint8Array.slice(i, i + chunk_size);
    chunks.push(String.fromCharCode.apply(null, chunk));
  }
  
  return btoa(chunks.join(''));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Calling ElevenLabs API with text:', text);

    // Forward the request to ElevenLabs
    const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL", {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": Deno.env.get('VITE_ELEVEN_LABS_API_KEY') || "",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API error:', errorData);
      throw new Error("Failed to generate speech: " + errorData);
    }

    // Get the audio data and convert to base64 in chunks
    const audioData = await response.arrayBuffer();
    const base64Audio = arrayBufferToBase64(audioData);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }), 
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
