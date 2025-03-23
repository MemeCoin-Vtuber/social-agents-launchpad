import { useState } from 'react';
import { AgentStatus as AgentStatusType } from '../lib/types';
import Button from './Button';

interface AgentStatusProps {
  agentId: string | null;
  status: AgentStatusType | null;
  agentName?: string;
}

export default function AgentStatus({ agentId, status, agentName }: AgentStatusProps) {
  const [tweetContent, setTweetContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  if (!agentId || !status) {
    return null;
  }

  const handlePostTweet = async () => {
    if (!tweetContent.trim()) {
      setPostError('Tweet content cannot be empty');
      return;
    }

    if (tweetContent.length > 280) {
      setPostError('Tweet exceeds maximum length of 280 characters');
      return;
    }

    setIsPosting(true);
    setPostError(null);
    setPostSuccess(null);

    try {
      const response = await fetch('/api/post-tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          content: tweetContent,
          reasoning: 'Manually posted from agent dashboard'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post tweet');
      }

      setPostSuccess('Tweet posted successfully!');
      setTweetContent('');
    } catch (error) {
      setPostError(error instanceof Error ? error.message : 'Failed to post tweet');
    } finally {
      setIsPosting(false);
    }
  };

  // Format created date
  const formattedDate = status.createdAt 
    ? new Date(status.createdAt).toLocaleString() 
    : 'Unknown';

  return (
    <div className="agent-card space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-center">Agent Status</h2>
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2 ${status.isRunning ? 'bg-lightBlue' : 'bg-gray-400'}`}></span>
          <span className={`status-badge ${status.isRunning ? 'active' : 'idle'}`}>
            {status.isRunning ? 'Running' : 'Idle'}
          </span>
        </div>
      </div>
      
      <div className="border-t-4 border-black pt-4">
        <h3 className="text-xl font-right-grotesk mb-2">
          {agentName || 'Twitter Agent'} <span className="text-sm font-mono font-normal text-gray-600">({agentId})</span>
        </h3>
        
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-700">Initialized</dt>
            <dd className="mt-1 text-sm">
              {status.isInitialized ? 
                <span className="text-green-600 font-bold">Yes</span> : 
                <span className="text-red-600 font-bold">No</span>
              }
            </dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-700">Running</dt>
            <dd className="mt-1 text-sm">
              {status.isRunning ? 
                <span className="text-green-600 font-bold">Yes</span> : 
                <span className="text-red-600 font-bold">No</span>
              }
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-700">Created At</dt>
            <dd className="mt-1 text-sm">
              {formattedDate}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-bold text-gray-700">Activity</dt>
            <dd className="mt-1 text-sm">
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-purple-light text-white rounded border-2 border-black text-xs">
                  Tweets: {status.tweet_count || 0}
                </span>
                <span className="px-2 py-1 bg-secondary text-white rounded border-2 border-black text-xs">
                  Replies: {status.reply_count || 0}
                </span>
                <span className="px-2 py-1 bg-primary text-white rounded border-2 border-black text-xs">
                  Searches: {status.search_count || 0}
                </span>
              </div>
            </dd>
          </div>
          
          {status.lastTweet && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold text-gray-700">Last Tweet</dt>
              <dd className="mt-1 text-sm p-3 bg-blue-light rounded border-2 border-black shadow-[-2px_2px_0_0_#1f2024]">
                {status.lastTweet}
              </dd>
            </div>
          )}
          
          {status.lastSearch && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold text-gray-700">Last Search</dt>
              <dd className="mt-1 text-sm p-3 bg-yellow/30 rounded border-2 border-black shadow-[-2px_2px_0_0_#1f2024]">
                {status.lastSearch}
              </dd>
            </div>
          )}
          
          {status.lastReply && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold text-gray-700">Last Reply</dt>
              <dd className="mt-1 text-sm p-3 bg-purple-light/20 rounded border-2 border-black shadow-[-2px_2px_0_0_#1f2024]">
                {status.lastReply}
              </dd>
            </div>
          )}
        </dl>
        
        {status.error && (
          <div className="mt-4 p-3 bg-heroRed/10 border-2 border-heroRed rounded">
            <p className="text-sm font-bold text-heroRed">Error</p>
            <p className="text-sm text-black">{status.error}</p>
          </div>
        )}
      </div>

      {/* Manual Tweet Posting */}
      <div className="border-t-4 border-black pt-4">
        <h3 className="text-xl font-right-grotesk mb-3">Post a Manual Tweet</h3>
        <p className="text-sm font-bold mb-3">
          Use this to manually post a tweet from your agent.
        </p>
        
        {postSuccess && (
          <div className="mb-4 p-3 bg-lightBlue border-2 border-black rounded">
            {postSuccess}
          </div>
        )}
        
        {postError && (
          <div className="mb-4 p-3 bg-heroRed/10 border-2 border-heroRed rounded">
            {postError}
          </div>
        )}
        
        <div className="space-y-3">
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="What's happening?"
            className="form-input"
            rows={3}
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            <div className="text-sm font-bold">
              {280 - tweetContent.length} characters remaining
            </div>
            <Button
              onClick={handlePostTweet}
              disabled={isPosting || !tweetContent.trim()}
              variant="secondary"
            >
              {isPosting ? 'Posting...' : 'Post Tweet'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-t-4 border-black pt-4">
        <p className="text-sm font-bold">
          The agent will automatically search for tweets and post updates based on the configured goal and search keywords.
          You can also post manual tweets using the form above.
        </p>
        
        <div className="mt-4 p-4 border-4 border-black bg-blue-light rounded shadow-[-3px_3px_0_0_#1f2024]">
          <h4 className="text-sm font-bold text-black">Twitter API Integration</h4>
          <p className="mt-1 text-sm">
            This agent uses the Twitter API v2 to post real tweets to your Twitter account. Make sure your API credentials
            have the necessary write permissions for posting tweets.
          </p>
        </div>
      </div>
    </div>
  );
}