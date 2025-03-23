import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import AgentForm from '../components/AgentForm';
import AgentStatus from '../components/AgentStatus';
import TwitterInstructions from '../components/TwitterInstructions';
import { AgentConfig, AgentStatus as AgentStatusType } from '../lib/types';
import Button from '../components/Button';

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatusType | null>(null);
  const [agentName, setAgentName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to store the interval ID for proper cleanup
  const statusPollingRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling on component unmount
  useEffect(() => {
    return () => {
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current);
      }
    };
  }, []);

  const createAgent = async (config: AgentConfig) => {
    setIsCreating(true);
    setError(null);
    
    try {
      // Clear any existing polling interval
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current);
        statusPollingRef.current = null;
      }
      
      const response = await fetch('/api/create-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create agent');
      }
      
      setAgentId(data.agentId);
      setAgentStatus(data.status);
      setAgentName(config.name);
      
      // Start polling with the new agent ID
      startStatusPolling(data.agentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const startStatusPolling = (id: string) => {
    console.log(`Started polling for agent ${id} status updates`);
    
    // Clear any existing polling interval
    if (statusPollingRef.current) {
      clearInterval(statusPollingRef.current);
    }
    
    // Set up new polling interval
    statusPollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/agent-status?id=${id}`);
        
        if (response.status === 404) {
          console.warn(`Agent ${id} not found. Stopping polling.`);
          clearInterval(statusPollingRef.current!);
          statusPollingRef.current = null;
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          setAgentStatus(data.status);
          
          // If agent is no longer running, stop polling
          if (!data.status.isRunning) {
            console.log(`Agent ${id} is no longer running. Stopping polling.`);
            clearInterval(statusPollingRef.current!);
            statusPollingRef.current = null;
          }
        }
      } catch (error) {
        console.error('Error polling for status:', error);
      }
    }, 10000); // Poll every 10 seconds
  };

  return (
    <div className="min-h-screen bg-blue-light">
      <Head>
        <title>Vtuber Social Studio</title>
        <meta name="description" content="Let AI Handle Your Token's Social Media Presence" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-right-grotesk font-extrabold text-black hero-heading">
              Vtuber Social Studio
            </h1>
            <p className="mt-2 max-w-2xl mx-auto text-lg md:text-xl text-black">
              Let AI Handle Your Token's Social Media Presence
            </p>
          </div>
          
          {error && (
            <div className="mt-4 max-w-3xl mx-auto p-3 bg-heroRed/10 border-4 border-heroRed rounded-lg shadow-[-3px_3px_0_0_#1f2024]">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-heroRed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <h3 className="text-base font-bold text-heroRed">Error</h3>
                  <div className="mt-1 text-sm">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Hidden Instructions as per your request */}
          {/* <div className="mt-6 max-w-3xl mx-auto">
            <TwitterInstructions />
          </div> */}
          
          <div className="mt-6 max-w-6xl mx-auto grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="transform transition duration-300 hover:-translate-y-1">
              <AgentForm onSubmit={createAgent} isLoading={isCreating} />
            </div>
            <div className="transform transition duration-300 hover:-translate-y-1">
              <AgentStatus 
                agentId={agentId} 
                status={agentStatus} 
                agentName={agentName} 
              />
              
              {!agentId && !agentStatus && (
                <div className="agent-card">
                  <h2 className="text-xl font-bold mb-3">No Agent Running</h2>
                  <p className="text-gray-700 text-sm mb-3">
                    Fill out the form to create and start your Twitter agent.
                  </p>
                  <div className="border-t-2 border-black pt-3">
                    <h3 className="text-lg font-medium mb-2">What This Agent Can Do:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      <li>Post tweets based on its goal and personality</li>
                      <li>Search for tweets using specified keywords</li>
                      <li>Reply to tweets it finds interesting or relevant</li>
                      <li>Run autonomously based on GAME framework</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-secondary mt-12 md:mt-20 border-t-8 border-black">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-lg text-white font-bold">
            Powered by GAME SDK by Virtuals Protocol
          </p>
        </div>
      </footer>
    </div>
  );
}