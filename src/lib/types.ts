// Twitter authentication credentials
export interface TwitterCredentials {
    apiKey: string;
    apiKeySecret: string;
    accessToken: string;
    accessTokenSecret: string;
    bearerToken?: string;  // Optional for some operations
  }
  
  // Agent configuration
  export interface AgentConfig {
    name: string;
    goal: string;
    description: string;
    twitterCredentials: TwitterCredentials;
    searchKeywords: string[];
  }
  
  // Agent status information
  export interface AgentStatus {
    isInitialized: boolean;
    isRunning: boolean;
    lastTweet?: string;
    lastSearch?: string;
    lastReply?: string;
    createdAt?: string;
    error?: string;
    tweet_count?: number;
    reply_count?: number;
    search_count?: number;
  }
  
  // Twitter API response types
  export interface TwitterUser {
    id: string;
    name: string;
    username: string;
  }
  
  export interface TwitterTweet {
    id: string;
    text: string;
    created_at?: string;
    author_id?: string;
    public_metrics?: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
    };
  }
  
  export interface SearchResponse {
    data: TwitterTweet[];
    includes?: {
      users: TwitterUser[];
    };
    meta: {
      result_count: number;
      newest_id?: string;
      oldest_id?: string;
      next_token?: string;
    };
  }
  
  // For twitter-api-v2 enums
  export enum ExecutableGameFunctionStatus {
    Done = 'done',
    Failed = 'failed'
  }