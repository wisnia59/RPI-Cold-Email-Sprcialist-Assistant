import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { cleanEmailText } from '@/lib/utils';
import { GenerationResponse } from '@/lib/types';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy',
});

export async function POST(req: Request) {
  try {
    const { inputData } = await req.json();

    if (!inputData) {
      return NextResponse.json({ error: 'Input data is required' }, { status: 400 });
    }

    let result: GenerationResponse;

    if (process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: inputData }
        ],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('Empty response from AI');
      result = JSON.parse(content) as GenerationResponse;
    } else {
      // Mocked for development without API key
      result = await mockLLMCall(inputData);
    }

    // Apply safety cleaning
    result.email.body = cleanEmailText(result.email.body);
    result.email.followUp = cleanEmailText(result.email.followUp);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate email' }, { status: 500 });
  }
}

async function mockLLMCall(input: string): Promise<GenerationResponse> {
  // Simulating extraction and generation
  return {
    signals: {
      fullName: "Jane Doe",
      firstName: "Jane",
      brokerage: "Star Realty",
      recentLocations: ["Royal Oak", "Troy"],
      priceRange: "$300k - $500k",
      transactionVolume: "15 sales in last 12 months",
      bioDetails: "Loves local community and fast-paced markets.",
      email: "jane.doe@starrealty.com",
      phone: "248-555-0123",
      socialUrls: ["linkedin.com/in/janedoe"]
    },
    email: {
      subject: "your royal oak listings",
      body: "I saw your recent work in Royal Oak and noticed how active you've been there lately. My name is Rich and I provide property media for agents in the Michigan Thumb area. First shoot is on me for 10 photos with nothing to pay. If you want to add a video walkthrough or 3D tour, I'll knock 10% less on those additions. You don't pay until the home sells. Want to try it on your next listing?",
      followUp: "Checking in to see if you have any upcoming listings in Royal Oak where I could help. The first 10 photos are on me. I'll also knock 10% less on any upgrades like drone or video. Just let me know if you're interested."
    }
  };
}
