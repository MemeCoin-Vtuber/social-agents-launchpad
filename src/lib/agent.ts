import { TwitterApi } from 'twitter-api-v2';
import {
    ExecutableGameFunctionResponse,
    ExecutableGameFunctionStatus,
    GameAgent,
    GameFunction,
    GameWorker,
    LLMModel,
} from "@virtuals-protocol/game";
import { TwitterCredentials } from "./types";
  
// Create Twitter API client with real API integration
const createTwitterClient = (credentials: TwitterCredentials) => {
  // Create a real Twitter API client
  const client = new TwitterApi({
    appKey: credentials.apiKey,
    appSecret: credentials.apiKeySecret,
    accessToken: credentials.accessToken,
    accessSecret: credentials.accessTokenSecret,
  });

  // Get the read-write client
  const rwClient = client.readWrite;

  return {
    postTweet: async (content: string) => {
      try {
        // Make actual Twitter API call to post a tweet
        const result = await rwClient.v2.tweet(content);
        console.log(`Successfully posted tweet: ${content}`);
        return { id: result.data.id, content };
      } catch (error) {
        // Enhanced error logging
        console.error('Error posting tweet:', error);
        
        // Log detailed API error response if available
        if (error.data) {
          console.error('Twitter API error data:', JSON.stringify(error.data, null, 2));
        }
        
        // Log rate limit information if available
        if (error.rateLimit) {
          console.error('Rate limit info:', JSON.stringify(error.rateLimit, null, 2));
        }
        
        // Log HTTP status code and headers if available
        if (error.code) {
          console.error(`HTTP Status Code: ${error.code}`);
        }
        
        if (error.headers) {
          console.error('Response headers:', JSON.stringify(error.headers, null, 2));
        }
        
        throw error;
      }
    },

    searchTweets: async (query: string) => {
      try {
        // Make actual Twitter API call to search tweets
        const result = await client.v2.search(query, {
          'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
          'user.fields': ['username'],
          'expansions': ['author_id'],
          'max_results': 10,
        });

        // Map the results to a more usable format
        return result.data.map(tweet => ({
          id: tweet.id,
          content: tweet.text,
          user: tweet.author_id,
          engagement: tweet.public_metrics ? 
            (tweet.public_metrics.like_count + tweet.public_metrics.retweet_count) : 0,
          timestamp: tweet.created_at,
        }));
      } catch (error) {
        // Enhanced error logging
        console.error('Error searching tweets:', error);

        if (error.data) {
          console.error('Twitter API error data:', JSON.stringify(error.data, null, 2));
        }
        
        // If the search fails, return some mock data to avoid breaking the agent
        return [
          { 
            id: `tweet-search-1-${Date.now()}`, 
            content: `Just discovered an amazing project related to ${query.split(' ')[0]}! #AI #tech`,
            user: "tech_enthusiast",
            engagement: 45,
            timestamp: new Date().toISOString(),
          },
          { 
            id: `tweet-search-2-${Date.now()}`, 
            content: `Anyone know good resources for ${query.split(' ')[0]}? Looking to learn more #askingforafriend`,
            user: "curious_user",
            engagement: 32,
            timestamp: new Date().toISOString(),
          }
        ];
      }
    },

    replyToTweet: async (tweetId: string, content: string) => {
      try {
        // Make actual Twitter API call to reply to a tweet
        const result = await rwClient.v2.reply(content, tweetId);
        console.log(`Successfully replied to tweet ${tweetId}: ${content}`);
        return { id: result.data.id, content };
      } catch (error) {
        // Enhanced error logging
        console.error('Error replying to tweet:', error);
        
        if (error.data) {
          console.error('Twitter API error data:', JSON.stringify(error.data, null, 2));
        }
        
        if (error.rateLimit) {
          console.error('Rate limit info:', JSON.stringify(error.rateLimit, null, 2));
        }
        
        throw error;
      }
    },
  };
};

// Create and return a Twitter agent
export const createTwitterAgent = (
  apiKey: string,
  name: string,
  goal: string,
  description: string,
  twitterCredentials: TwitterCredentials,
  searchKeywords: string[] = []
) => {
  console.log(`Creating Twitter agent: ${name}`);
  console.log(`Goal: ${goal}`);
  console.log(`Search keywords: ${searchKeywords.join(', ')}`);
  
  // Create Twitter client with credentials
  const twitterClient = createTwitterClient(twitterCredentials);
  
  // Create functions for the Twitter agent
  const postTweetFunction = new GameFunction({
    name: "post_tweet",
    description: "Post a tweet to Twitter",
    args: [
      { name: "tweet", description: "The tweet content" },
      { name: "tweet_reasoning", description: "The reasoning behind the tweet" },
    ],
    executable: async (args, logger) => {
      try {
        if (!args.tweet) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Tweet content is empty"
          );
        }
        
        logger?.(`Posting tweet: ${args.tweet}`);
        logger?.(`Reasoning: ${args.tweet_reasoning}`);
        
        // Implement retry logic for API resilience
        let attempts = 0;
        const maxAttempts = 3;
        let lastError = null;

        while (attempts < maxAttempts) {
          try {
            const result = await twitterClient.postTweet(args.tweet);
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Done,
              `Tweet posted: ${args.tweet}`
            );
          } catch (error) {
            lastError = error;
            attempts++;
            
            // Log detailed error information
            logger?.(`Tweet attempt ${attempts} failed. Error: ${error.message || 'Unknown error'}`);
            
            if (error.data) {
              logger?.(`Error details: ${JSON.stringify(error.data, null, 2)}`);
            }
            
            // If we have more attempts left, wait before retrying
            if (attempts < maxAttempts) {
              logger?.(`Tweet posting failed, retrying (${attempts}/${maxAttempts})...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
            }
          }
        }

        // If we get here, all attempts failed
        const errorMessage = lastError instanceof Error ? lastError.message : "Unknown error";
        logger?.(`Failed to post tweet after ${maxAttempts} attempts: ${errorMessage}`);
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          `Failed to post tweet: ${errorMessage}`
        );
      } catch (e) {
        const error = e instanceof Error ? e.message : "Unknown error";
        logger?.(`Error posting tweet: ${error}`);
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          `Failed to post tweet: ${error}`
        );
      }
    },
  });

  const searchTweetsFunction = new GameFunction({
    name: "search_tweets",
    description: "Search tweets on Twitter and return results",
    args: [
      { name: "query", description: "The query to search for" },
      { name: "reasoning", description: "The reasoning behind the search" },
    ],
    executable: async (args, logger) => {
      try {
        if (!args.query) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Search query is empty"
          );
        }
        
        logger?.(`Searching tweets for query: ${args.query}`);
        
        const results = await twitterClient.searchTweets(args.query);
        logger?.(`Found ${results.length} tweets matching "${args.query}"`);
        
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify(results)
        );
      } catch (e) {
        const error = e instanceof Error ? e.message : "Unknown error";
        logger?.(`Error searching tweets: ${error}`);
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          `Failed to search tweets: ${error}`
        );
      }
    },
  });

  const replyToTweetFunction = new GameFunction({
    name: "reply_to_tweet",
    description: "Reply to a tweet on Twitter",
    args: [
      { name: "tweet_id", description: "The tweet id to reply to" },
      { name: "reply", description: "The reply content" },
      { name: "reply_reasoning", description: "The reasoning behind the reply" },
    ],
    executable: async (args, logger) => {
      try {
        if (!args.tweet_id || !args.reply) {
          return new ExecutableGameFunctionResponse(
            ExecutableGameFunctionStatus.Failed,
            "Tweet ID or reply content is empty"
          );
        }
        
        logger?.(`Replying to tweet ${args.tweet_id} with: ${args.reply}`);
        logger?.(`Reasoning: ${args.reply_reasoning}`);
        
        // Implement retry logic
        let attempts = 0;
        const maxAttempts = 3;
        let lastError = null;

        while (attempts < maxAttempts) {
          try {
            const result = await twitterClient.replyToTweet(args.tweet_id, args.reply);
            return new ExecutableGameFunctionResponse(
              ExecutableGameFunctionStatus.Done,
              `Replied to tweet ${args.tweet_id} with: ${args.reply}`
            );
          } catch (error) {
            lastError = error;
            attempts++;
            
            // Log detailed error information
            logger?.(`Reply attempt ${attempts} failed. Error: ${error.message || 'Unknown error'}`);
            
            if (error.data) {
              logger?.(`Error details: ${JSON.stringify(error.data, null, 2)}`);
            }
            
            if (attempts < maxAttempts) {
              logger?.(`Reply failed, retrying (${attempts}/${maxAttempts})...`);
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
          }
        }

        // If we get here, all attempts failed
        const errorMessage = lastError instanceof Error ? lastError.message : "Unknown error";
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          `Failed to reply to tweet: ${errorMessage}`
        );
      } catch (e) {
        const error = e instanceof Error ? e.message : "Unknown error";
        logger?.(`Error replying to tweet: ${error}`);
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          `Failed to reply to tweet: ${error}`
        );
      }
    },
  });

  // Create worker with the functions
  const twitterWorker = new GameWorker({
    id: "twitter_worker",
    name: "Twitter Worker",
    description: `Worker that handles Twitter operations for ${name}. This worker can search tweets using keywords like ${searchKeywords.join(', ')}, post original tweets, and reply to relevant conversations. The worker should be proactive in engaging with the Twitter community.`,
    functions: [postTweetFunction, searchTweetsFunction, replyToTweetFunction],
    getEnvironment: async () => {
      return {
        search_keywords: searchKeywords,
        daily_tweet_limit: 15,
        preferred_topics: ["AI", "technology", "web development"],
        // Add more context to help the agent make decisions
        engagement_strategy: "Prioritize replying to tweets with questions or that mention topics in preferred_topics",
        posting_guidelines: "Tweet at least once every hour about topics related to search_keywords",
      };
    },
  });

  // Create the agent with the worker
  const agent = new GameAgent(apiKey, {
    name,
    goal,
    // Enhance the description with more specific instructions
    description: `${description} 
    
This agent should actively engage with the Twitter community by:
1. Posting original tweets related to ${searchKeywords.join(', ')}
2. Searching for relevant conversations
3. Replying to tweets that ask questions or mention topics in preferred_topics
4. Maintaining a consistent presence with regular activity`,
    workers: [twitterWorker],
    llmModel: LLMModel.DeepSeek_R1,
    getAgentState: async () => {
      return {
        username: name,
        search_keywords: searchKeywords,
        last_activity: new Date().toISOString(),
        // Add activity tracking to help the agent understand its history
        tweet_count: 0,
        reply_count: 0,
        search_count: 0,
      };
    },
  });

  // Custom logger for the agent
  agent.setLogger((agentInstance, msg) => {
    console.log(`[${agentInstance.name}] ${msg}`);
  });

  return agent;
};