import { AgentStatus as AgentStatusType } from '../lib/types';

interface AgentStatusProps {
  agentId: string | null;
  status: AgentStatusType | null;
  agentName?: string;
}

export default function AgentStatus({ agentId, status, agentName }: AgentStatusProps) {
  if (!agentId || !status) {
    return null;
  }

  // Format created date
  const formattedDate = status.createdAt 
    ? new Date(status.createdAt).toLocaleString() 
    : 'Unknown';

  return (
    <div className="agent-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-center">{agentName || 'Twitter Agent'} Status</h2>
        <div className="flex items-center">
          <span className={`h-3 w-3 rounded-full mr-2 ${status.isRunning ? 'bg-lightBlue' : 'bg-gray-400'}`}></span>
          <span className={`status-badge ${status.isRunning ? 'active' : 'idle'}`}>
            {status.isRunning ? 'Running' : 'Idle'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Agent details */}
        <div className="border-t-2 border-black pt-4">
          <h3 className="text-lg font-medium mb-4">Agent Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm font-bold text-gray-700 block">Agent ID</span>
              <span className="text-sm font-mono" title={agentId}>{agentId.slice(0, 10)}...</span>
            </div>
            
            <div>
              <span className="text-sm font-bold text-gray-700 block">Created</span>
              <span className="text-sm">{formattedDate.split(',')[0]}</span>
            </div>
            
            <div>
              <span className="text-sm font-bold text-gray-700 block">Initialized</span>
              {status.isInitialized ? 
                <span className="text-green-600 font-bold text-sm">Yes</span> : 
                <span className="text-red-600 font-bold text-sm">No</span>
              }
            </div>
            
            <div>
              <span className="text-sm font-bold text-gray-700 block">Running</span>
              {status.isRunning ? 
                <span className="text-green-600 font-bold text-sm">Yes</span> : 
                <span className="text-red-600 font-bold text-sm">No</span>
              }
            </div>
          </div>
          
          <div className="mb-4">
            <span className="text-sm font-bold text-gray-700 block mb-2">Activity Stats</span>
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
          </div>
          
          {status.error && (
            <div className="p-2 mb-4 bg-heroRed/10 border-2 border-heroRed rounded">
              <p className="text-xs font-bold text-heroRed">Error</p>
              <p className="text-sm text-black">{status.error}</p>
            </div>
          )}
          
          <div className="p-3 border-2 border-black bg-blue-light rounded shadow-[-2px_2px_0_0_#1f2024] text-xs">
            <h4 className="font-bold text-black mb-1">Twitter Integration</h4>
            <p>
              This agent uses Twitter API v2 to automatically post tweets and interact based on its configuration.
            </p>
          </div>
        </div>
        
        {/* Right columns - Activity feed */}
        <div className="border-t-2 border-black pt-4 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-black rounded-lg overflow-hidden">
              <div className="bg-purple-light/20 px-3 py-2 border-b-2 border-black">
                <h4 className="text-sm font-bold">Last Tweet</h4>
              </div>
              <div className="h-40 overflow-y-auto p-3">
                {status.lastTweet ? (
                  <p className="text-sm">{status.lastTweet}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No tweets yet</p>
                )}
              </div>
            </div>
            
            <div className="border-2 border-black rounded-lg overflow-hidden">
              <div className="bg-yellow/20 px-3 py-2 border-b-2 border-black">
                <h4 className="text-sm font-bold">Last Search</h4>
              </div>
              <div className="h-40 overflow-y-auto p-3">
                {status.lastSearch ? (
                  <p className="text-sm">{status.lastSearch}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No searches yet</p>
                )}
              </div>
            </div>
            
            <div className="border-2 border-black rounded-lg overflow-hidden">
              <div className="bg-secondary/20 px-3 py-2 border-b-2 border-black">
                <h4 className="text-sm font-bold">Last Reply</h4>
              </div>
              <div className="h-40 overflow-y-auto p-3">
                {status.lastReply ? (
                  <p className="text-sm">{status.lastReply}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No replies yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}