import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AgentConfig } from '../lib/types';

interface AgentFormProps {
  onSubmit: (data: AgentConfig) => void;
  isLoading: boolean;
}

export default function AgentForm({ onSubmit, isLoading }: AgentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgentConfig>();
  
  const [searchKeywordsInput, setSearchKeywordsInput] = useState('');
  const [searchKeywords, setSearchKeywords] = useState<string[]>([]);

  const addSearchKeyword = () => {
    if (searchKeywordsInput.trim() && !searchKeywords.includes(searchKeywordsInput.trim())) {
      setSearchKeywords([...searchKeywords, searchKeywordsInput.trim()]);
      setSearchKeywordsInput('');
    }
  };

  const removeSearchKeyword = (keyword: string) => {
    setSearchKeywords(searchKeywords.filter(k => k !== keyword));
  };

  const onFormSubmit = (data: Omit<AgentConfig, 'searchKeywords'>) => {
    onSubmit({
      ...data,
      searchKeywords
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Twitter Agent</h2>
      
      {/* Agent Information */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Agent Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Name
          </label>
          <input
            type="text"
            {...register('name', { required: 'Agent name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Goal
          </label>
          <input
            type="text"
            {...register('goal', { required: 'Agent goal is required' })}
            placeholder="e.g., Engage with tech community and share AI news"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.goal && (
            <p className="mt-1 text-sm text-red-600">{errors.goal.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Description
          </label>
          <textarea
            {...register('description', { required: 'Agent description is required' })}
            rows={3}
            placeholder="Describe your agent's personality and what it does"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>
      
      {/* Twitter Credentials */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Twitter API Credentials</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="text"
            {...register('twitterCredentials.apiKey', { required: 'API Key is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.twitterCredentials?.apiKey && (
            <p className="mt-1 text-sm text-red-600">{errors.twitterCredentials.apiKey.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            API Key Secret
          </label>
          <input
            type="password"
            {...register('twitterCredentials.apiKeySecret', { required: 'API Key Secret is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.twitterCredentials?.apiKeySecret && (
            <p className="mt-1 text-sm text-red-600">{errors.twitterCredentials.apiKeySecret.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Access Token
          </label>
          <input
            type="text"
            {...register('twitterCredentials.accessToken', { required: 'Access Token is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.twitterCredentials?.accessToken && (
            <p className="mt-1 text-sm text-red-600">{errors.twitterCredentials.accessToken.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Access Token Secret
          </label>
          <input
            type="password"
            {...register('twitterCredentials.accessTokenSecret', { required: 'Access Token Secret is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.twitterCredentials?.accessTokenSecret && (
            <p className="mt-1 text-sm text-red-600">{errors.twitterCredentials.accessTokenSecret.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bearer Token
          </label>
          <input
            type="password"
            {...register('twitterCredentials.bearerToken', { required: 'Bearer Token is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.twitterCredentials?.bearerToken && (
            <p className="mt-1 text-sm text-red-600">{errors.twitterCredentials.bearerToken.message}</p>
          )}
        </div>
      </div>
      
      {/* Search Keywords */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Search Keywords</h3>
        <p className="text-sm text-gray-600">
          Add keywords the agent should search for on Twitter
        </p>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchKeywordsInput}
            onChange={(e) => setSearchKeywordsInput(e.target.value)}
            placeholder="Add a keyword..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addSearchKeyword}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {searchKeywords.map((keyword) => (
            <span
              key={keyword}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeSearchKeyword(keyword)}
                className="ml-2 text-blue-500 hover:text-blue-800"
              >
                &times;
              </button>
            </span>
          ))}
          {searchKeywords.length === 0 && (
            <p className="text-sm text-gray-500 italic">No keywords added yet</p>
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Agent...
            </>
          ) : (
            'Create Agent'
          )}
        </button>
      </div>
    </form>
  );
}