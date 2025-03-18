import type { NextApiRequest, NextApiResponse } from 'next';

// This references the activeAgents object from create-agent.ts
// In a real application, you'd use a proper database or state management system
import { activeAgents } from './create-agent';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Agent ID is required' });
  }

  try {
    const agentData = activeAgents[id];
    
    if (!agentData) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    return res.status(200).json({
      agentId: id,
      status: agentData.status,
      name: agentData.config.name,
    });
  } catch (error) {
    console.error('Error getting agent status:', error);
    return res.status(500).json({ 
      message: 'Failed to get agent status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}