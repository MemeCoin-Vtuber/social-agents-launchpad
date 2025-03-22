import type { NextApiRequest, NextApiResponse } from 'next';
import { createTwitterAgent } from '../../lib/agent';
import { AgentConfig } from '../../lib/types';
import { ExecutableGameFunctionStatus } from '@virtuals-protocol/game';

// Store active agent instances (Note: In production, you'd want a more persistent solution)
export let activeAgents: Record<string, any> = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const config = req.body as AgentConfig;
    const gameApiKey = process.env.GAME_API_KEY;

    if (!gameApiKey) {
      return res.status(500).json({ message: 'GAME API key not configured' });
    }

    // Validate Twitter credentials
    if (!config.twitterCredentials.apiKey || 
        !config.twitterCredentials.apiKeySecret || 
        !config.twitterCredentials.accessToken || 
        !config.twitterCredentials.accessTokenSecret) {
      return res.status(400).json({ message: 'Invalid Twitter credentials' });
    }

    // Create a unique ID for this agent instance
    const agentId = `agent-${Date.now()}`;

    // Create the agent
    const agent = createTwitterAgent(
      gameApiKey,
      config.name,
      config.goal,
      config.description,
      config.twitterCredentials,
      config.searchKeywords
    );

    // Initialize the agent
    await agent.init();
    
    // Store initial status
    const initialStatus = {
      isInitialized: true,
      isRunning: false,
      createdAt: new Date().toISOString(),
      tweet_count: 0,
      reply_count: 0,
      search_count: 0
    };

    // Store the agent instance
    activeAgents[agentId] = {
      agent,
      config,
      status: initialStatus
    };

    // Post an initial tweet to get things started
    try {
      // Simplified initial tweet without mentions or too many hashtags
      const initialTweet = `Hello! I'm ${config.name}, ready to share insights${config.searchKeywords.length > 0 
        ? ` about ${config.searchKeywords.slice(0, 2).join(' and ')}` 
        : ''}. Looking forward to connecting!`;
      
      const worker = agent.workers.find(w => w.id === "twitter_worker");
      if (worker) {
        const postTweetFn = worker.functions.find(f => f.name === "post_tweet");
        if (postTweetFn && postTweetFn.executable) {
          console.log("Posting initial tweet to kickstart the agent's activity...");
          const result = await postTweetFn.executable({ 
            tweet: initialTweet, 
            tweet_reasoning: "Simple introduction tweet to establish presence" 
          }, console.log);
          
          // Update status with the initial tweet
          activeAgents[agentId].status.lastTweet = initialTweet;
          activeAgents[agentId].status.tweet_count = 1;
          
          // Log the result of the tweet attempt
          console.log("Initial tweet posting result:", result);
        }
      }
    } catch (tweetError) {
      console.error("Failed to post initial tweet:", tweetError);
      // Continue even if initial tweet fails, don't block agent creation
    }

    // Start the agent in the background
    startAgent(agentId);

    return res.status(200).json({ 
      agentId,
      message: 'Agent created and initialized successfully',
      status: activeAgents[agentId].status
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return res.status(500).json({ 
      message: 'Failed to create agent',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Function to start the agent
async function startAgent(agentId: string) {
  try {
    const { agent, status } = activeAgents[agentId];
    
    // Update status
    activeAgents[agentId].status.isRunning = true;
    
    // Run the agent with a 60-second interval
    await agent.run(60, { verbose: true });
    
    // If agent.run completes, update status
    activeAgents[agentId].status.isRunning = false;
  } catch (error) {
    console.error(`Error running agent ${agentId}:`, error);
    
    // Update status with error
    if (activeAgents[agentId]) {
      activeAgents[agentId].status.isRunning = false;
      activeAgents[agentId].status.error = error instanceof Error 
        ? error.message 
        : 'Unknown error during agent execution';
    }
  }
}

// Helper function to post a tweet from an agent
export async function postTweet(agentId: string, content: string, reasoning: string = "Manual tweet request") {
  try {
    const agentData = activeAgents[agentId];
    if (!agentData) {
      throw new Error('Agent not found');
    }

    const worker = agentData.agent.workers.find((w: any) => w.id === "twitter_worker");
    if (!worker) {
      throw new Error('Twitter worker not found');
    }

    const postTweetFn = worker.functions.find((f: any) => f.name === "post_tweet");
    if (!postTweetFn || !postTweetFn.executable) {
      throw new Error('Post tweet function not found');
    }
    
    const result = await postTweetFn.executable({ 
      tweet: content, 
      tweet_reasoning: reasoning 
    }, console.log);

    // Check if the result indicates success
    if (result.status === ExecutableGameFunctionStatus.Done) {
      // Update agent status
      agentData.status.lastTweet = content;
      agentData.status.tweet_count = (agentData.status.tweet_count || 0) + 1;
      return true;
    } else {
      throw new Error(result.feedback || 'Failed to post tweet');
    }
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
}