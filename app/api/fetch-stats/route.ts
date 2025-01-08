import { NextResponse } from 'next/server'
import fetch from 'node-fetch'

export async function POST(req: Request) {
  try {
    const { apiKey, prompt } = await req.json()

    const applicationToken = "AstraCS:PsyBxdvhMqWsmOIOcvJvPLId:4b96e5cf7ee28b4f122723b6abedb95f248a8505aebdb8ebdf4daa6b85416ef0"

    if (!applicationToken) {
      throw new Error('ASTRA_DB_APPLICATION_TOKEN is not set in the environment variables')
    }
    const response = await fetch(
      "https://api.langflow.astra.datastax.com/lf/3341abcb-b1d4-4463-86f0-6874b888e678/api/v1/run/ffadf85d-4ddb-4fff-a214-ab0260d5d46d?stream=false",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${applicationToken}`
        },
        body: JSON.stringify({
          "input_value": prompt,
    "output_type": "chat",
    "input_type": "chat",
    "tweaks": {
        "TextInput-xbSJD": {
            "input_value": apiKey
        },
    }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      throw new Error('Invalid JSON response from the server');
    }

    if (!data) {
      console.error('Unexpected response format:', data);
      throw new Error('Unexpected response format');
    }

    return NextResponse.json({ output: JSON.stringify(data) });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    return NextResponse.json({"hah": "Hello bhai ke" });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}


