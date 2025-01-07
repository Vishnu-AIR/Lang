import { NextResponse } from 'next/server'
import fetch from 'node-fetch'

export async function POST(req: Request) {
  try {
    const { apiKey, prompt } = await req.json()

    const applicationToken = process.env.ASTRA_DB_APPLICATION_TOKEN

    if (!applicationToken) {
      throw new Error('ASTRA_DB_APPLICATION_TOKEN is not set in the environment variables')
    }

    const response = await fetch(
      "https://api.langflow.astra.datastax.com/lf/dd58bedf-b939-4051-9031-6397993aafa2/api/v1/run/1949e0ad-1997-4004-99b6-7ee272dd71ba?stream=false",
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
            "Prompt-8cQj5": {
              "template": "from given post types , and given average engagement metrics , give the brief about comparision b/w the post types in the form of dictionary with key as post type and its value as object containing all engge,ent metrics , for example , reels have this much higher likes than this this .. and allgive brief conclusion too"
            },
            "Agent-d5MEY": {
              "add_current_date_tool": true,
              "agent_description": "A helpful assistant with access to the following tools:",
              "agent_llm": "OpenAI",
              "api_key": apiKey,
              "handle_parsing_errors": true,
              "input_value": "",
              "json_mode": false,
              "max_iterations": 15,
              "max_tokens": null,
              "model_kwargs": {},
              "model_name": "gpt-4o-mini",
              "n_messages": 100,
              "openai_api_base": "",
              "order": "Ascending",
              "output_schema": {},
              "seed": 1,
              "sender": "Machine and User",
              "sender_name": "",
              "session_id": "",
              "system_prompt": "You are a helpful assistant that can use tools to answer questions and perform tasks.",
              "temperature": 0.1,
              "template": "{sender_name}: {text}",
              "verbose": true
            },
            "AstraDBToolComponent-ETMlW": {
              "api_endpoint": "https://1bb35f69-6620-47c0-807e-8907218fdd3d-us-east-2.apps.astra.datastax.com",
              "collection_name": "engagement_data",
              "namespace": "default_keyspace",
              "number_of_results": 5,
              "projection_attributes": "*",
              "static_filters": {},
              "token": "ASTRA_DB_APPLICATION_TOKEN",
              "tool_description": "carrying data",
              "tool_name": "DB",
              "tool_params": {}
            },
            "ChatOutput-kftPe": {
              "background_color": "",
              "chat_icon": "",
              "data_template": "{text}",
              "input_value": "",
              "sender": "Machine",
              "sender_name": "AI",
              "session_id": "",
              "should_store_message": true,
              "text_color": ""
            },
            "ChatInput-UNZry": {
              "files": "",
              "background_color": "",
              "chat_icon": "",
              "sender": "User",
              "sender_name": "User",
              "session_id": "",
              "should_store_message": true,
              "text_color": ""
            },
            "AstraDBToolComponent-r5JZh": {
              "api_endpoint": "https://1bb35f69-6620-47c0-807e-8907218fdd3d-us-east-2.apps.astra.datastax.com",
              "collection_name": "average_metrics",
              "namespace": "default_keyspace",
              "number_of_results": 5,
              "projection_attributes": "*",
              "static_filters": {},
              "token": "ASTRA_DB_APPLICATION_TOKEN",
              "tool_description": "carrying data",
              "tool_name": "DB",
              "tool_params": {}
            },
            "TextInput-iQ6Ln": {
              "input_value": apiKey
            }
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

