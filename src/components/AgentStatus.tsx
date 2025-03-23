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
    <div className="agent-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-center">Agent Status</h2>
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2 ${status.isRunning ? 'bg-lightBlue' : 'bg-gray-400'}`}></span>
          <span className={`status-badge ${status.isRunning ? 'active' : 'idle'}`}>
            {status.isRunning ? 'Running' : 'Idle'}
          </span>
        </div>
      </div>
      
      <div className="border-t-2 border-black pt-3 mb-4">
        <h3 className="text-lg font-right-grotesk mb-2">
          {agentName || 'Twitter Agent'} <span className="text-xs font-mono font-normal text-gray-600">({agentId})</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <div className="col-span-1">
            <span className="text-xs font-bold text-gray-700 block">Initialized</span>
            {status.isInitialized ? 
              <span className="text-green-600 font-bold text-sm">Yes</span> : 
              <span className="text-red-600 font-bold text-sm">No</span>
            }
          </div>
          
          <div className="col-span-1">
            <span className="text-xs font-bold text-gray-700 block">Running</span>
            {status.isRunning ? 
              <span className="text-green-600 font-bold text-sm">Yes</span> : 
              <span className="text-red-600 font-bold text-sm">No</span>
            }
          </div>

          <div className="col-span-1">
            <span className="text-xs font-bold text-gray-700 block">Created</span>
            <span className="text-sm">{formattedDate.split(',')[0]}</span>
          </div>

          <div className="col-span-1">
            <span className="text-xs font-bold text-gray-700 block">Activity</span>
            <div className="flex space-x-1">
              <span className="px-1.5 py-0.5 bg-purple-light text-white rounded border-2 border-black text-xs">
                T: {status.tweet_count || 0}
              </span>
              <span className="px-1.5 py-0.5 bg-secondary text-white rounded border-2 border-black text-xs">
                R: {status.reply_count || 0}
              </span>
              <span className="px-1.5 py-0.5 bg-primary text-white rounded border-2 border-black text-xs">
                S: {status.search_count || 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto mb-3">
          {status.lastTweet && (
            <div>
              <span className="text-xs font-bold text-gray-700 block">Last Tweet</span>
              <div className="mt-1 text-sm p-2 bg-blue-light rounded border-2 border-black shadow-[-2px_2px_0_0_#1f2024]">
                {status.lastTweet}
              </div>
            </div>
          )}
          
          {status.lastSearch && (
            <div>
              <span className="text-xs font-bold text-gray-700 block">Last Search</span>
              <div className="mt-1 text-sm p-2 bg-yellow/30 rounded border-2 border-black shadow-[-2px_2px_0_0_#1f2024]">
                {status.lastSearch}
              </div>
            </div>
          )}
          
          {status.lastReply && (
            <div>
              <span className="text-xs font-bold text-gray-700 block">Last Reply</span>
              <div className="mt-1 text-sm p-2 bg-purple-light/20 rounded border-2 border-black shadow-[-2px_2px_0_0_#1f2024]">
                {status.lastReply}
              </div>
            </div>
          )}
        </div>
        
        {status.error && (
          <div className="p-2 bg-heroRed/10 border-2 border-heroRed rounded mb-3">
            <p className="text-xs font-bold text-heroRed">Error</p>
            <p className="text-sm text-black">{status.error}</p>
          </div>
        )}
      </div>

      {/* Manual Tweet Posting */}
      <div className="border-t-2 border-black pt-3 mb-4">
        <h3 className="text-lg font-right-grotesk mb-2">Post a Manual Tweet</h3>
        
        {postSuccess && (
          <div className="mb-3 p-2 bg-lightBlue border-2 border-black rounded text-sm">
            {postSuccess}
          </div>
        )}
        
        {postError && (
          <div className="mb-3 p-2 bg-heroRed/10 border-2 border-heroRed rounded text-sm">
            {postError}
          </div>
        )}
        
        <div>
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="What's happening?"
            className="form-input py-2 mb-2"
            rows={2}
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold">
              {280 - tweetContent.length} characters
            </div>
            <Button
              onClick={handlePostTweet}
              disabled={isPosting || !tweetContent.trim()}
              variant="secondary"
              className="py-2 px-4 text-sm"
            >
              {isPosting ? 'Posting...' : 'Post Tweet'}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-t-2 border-black pt-2">
        <div className="p-3 border-2 border-black bg-blue-light rounded shadow-[-2px_2px_0_0_#1f2024] text-xs">
          <h4 className="font-bold text-black">Twitter API Integration</h4>
          <p>
            This agent uses the Twitter API v2 to post real tweets to your Twitter account. Make sure your API credentials have the necessary write permissions.
          </p>
        </div>
      </div>
    </div>
  );
}