import type { NextApiRequest, NextApiResponse } from 'next';
import { postTweet } from './create-agent'; // Import the function from create-agent.ts

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { agentId, content, reasoning } = req.body;
    
    if (!agentId || !content) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['agentId', 'content']
      });
    }

    // Validate tweet length
    if (content.length > 280) {
      return res.status(400).json({ 
        message: 'Tweet exceeds maximum length of 280 characters'
      });
    }

    await postTweet(agentId, content, reasoning || 'Manual tweet request');

    return res.status(200).json({ 
      success: true,
      message: 'Tweet posted successfully'
    });
  } catch (error) {
    console.error('Error in post-tweet API:', error);
    return res.status(500).json({ 
      message: 'Failed to post tweet',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}