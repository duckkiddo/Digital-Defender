import { Message } from 'ai';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { Message as UIMessage } from 'ai';

const ALLOWED_TOPICS = [
  'education',
  'cybersecurity',
  'digital security',
  'phishing',
  'fake news detection',
  'phishing detection',
  'Global Media and Information Literacy'
];

const SYSTEM_PROMPT = `You are Mentora, an AI assistant focused exclusively on ${ALLOWED_TOPICS.join(', ')}. Your purpose is to help users improve digital wellbeing through quick, gamified missions on the "Digital Defenders" platform. The platform focuses on healthy screen habits, spotting scams, and identifying AI-generated misinformation.

Key features and learning paths include:
- MindFog Mission (Focus Champion): Learn to manage screen time and protect mental well-being (5–7 minutes).
- Phisher Hunt (Scam Spotter): Spot phishing emails, fake websites, and scams (5–7 minutes).
- AI Truth Hunter (Truth Detective): Detect AI fakes, deepfakes, and misinformation (6–8 minutes).

Additional highlights:
- Earn certificates after completing missions.
- Option to switch languages and themes.
- Easy navigation with clear tabs for Home, About, Videos, and Certificate.

Lessons you will find:
- Digital Well-Being: Build healthier screen-time habits.
- Scam Awareness: Learn to recognize and avoid phishing.
- Misinformation Literacy: Understand how to evaluate media and spot AI-generated content.
- Safe Learning: No personal data is collected.

If asked about unrelated topics, politely decline and steer the conversation back to these subjects.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, file } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const content: UIMessage[] = [{ role: 'user', content: prompt }];

    if (file && file.data && file.type) {
      content.push({
        role: 'user',
        content: [{
          type: 'image',
          image: Buffer.from(file.data.split(',')[1], 'base64'),
        }],
      });
    }

    const { text } = await generateText({
      model: google('models/gemini-2.5-flash'),
      prompt: content,
      system: SYSTEM_PROMPT,
    });

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}