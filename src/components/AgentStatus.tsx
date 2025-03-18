import { useState } from 'react';
import { AgentStatus as AgentStatusType } from '../lib/types';

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
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Status</h2>
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2 ${status.isRunning ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="text-sm font-medium">{status.isRunning ? 'Running' : 'Idle'}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium mb-2">
          {agentName || 'Twitter Agent'} <span className="text-sm text-gray-500">({agentId})</span>
        </h3>
        
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Initialized</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {status.isInitialized ? 'Yes' : 'No'}
            </dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Running</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {status.isRunning ? 'Yes' : 'No'}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formattedDate}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Activity</dt>
            <dd className="mt-1 text-sm text-gray-900">
              Tweets: {status.tweet_count || 0}, 
              Replies: {status.reply_count || 0}, 
              Searches: {status.search_count || 0}
            </dd>
          </div>
          
          {status.lastTweet && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Last Tweet</dt>
              <dd className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded">
                {status.lastTweet}
              </dd>
            </div>
          )}
          
          {status.lastSearch && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Last Search</dt>
              <dd className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded">
                {status.lastSearch}
              </dd>
            </div>
          )}
          
          {status.lastReply && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Last Reply</dt>
              <dd className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded">
                {status.lastReply}
              </dd>
            </div>
          )}
        </dl>
        
        {status.error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            <p className="text-sm font-medium">Error</p>
            <p className="text-sm">{status.error}</p>
          </div>
        )}
      </div>

      {/* Manual Tweet Posting */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium mb-2">Post a Manual Tweet</h3>
        <p className="text-sm text-gray-500 mb-3">
          Use this to manually post a tweet from your agent.
        </p>
        
        {postSuccess && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            {postSuccess}
          </div>
        )}
        
        {postError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
            {postError}
          </div>
        )}
        
        <div className="space-y-3">
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {280 - tweetContent.length} characters remaining
            </div>
            <button
              onClick={handlePostTweet}
              disabled={isPosting || !tweetContent.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isPosting ? 'Posting...' : 'Post Tweet'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">
          The agent will automatically search for tweets and post updates based on the configured goal and search keywords.
          You can also post manual tweets using the form above.
        </p>
        
        <div className="mt-4 p-4 border border-blue-100 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-700">Twitter API Integration</h4>
          <p className="mt-1 text-sm text-blue-600">
            This agent uses the Twitter API v2 to post real tweets to your Twitter account. Make sure your API credentials
            have the necessary write permissions for posting tweets.
          </p>
        </div>
      </div>
    </div>
  );
}