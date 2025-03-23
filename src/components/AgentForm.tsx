import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AgentConfig } from '../lib/types';
import Button from './Button';

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
    <form onSubmit={handleSubmit(onFormSubmit)} className="agent-card">
      <h2 className="text-center mb-6">Create Twitter Agent</h2>
      
      {/* Agent Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold border-b-2 border-black pb-2 mb-3">Agent Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-sm">
              Agent Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Agent name is required' })}
              className="form-input py-2"
              placeholder="Enter agent name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-heroRed font-bold">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="form-label text-sm">
              Agent Goal
            </label>
            <input
              type="text"
              {...register('goal', { required: 'Agent goal is required' })}
              placeholder="e.g., Engage with tech community"
              className="form-input py-2"
            />
            {errors.goal && (
              <p className="mt-1 text-xs text-heroRed font-bold">{errors.goal.message}</p>
            )}
          </div>
        </div>
        
        <div className="mt-3">
          <label className="form-label text-sm">
            Agent Description
          </label>
          <textarea
            {...register('description', { required: 'Agent description is required' })}
            rows={2}
            placeholder="Describe your agent's personality and what it does"
            className="form-input"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-heroRed font-bold">{errors.description.message}</p>
          )}
        </div>
      </div>
      
      {/* Twitter Credentials */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold border-b-2 border-black pb-2 mb-3">Twitter API Credentials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-sm">
              API Key
            </label>
            <input
              type="text"
              {...register('twitterCredentials.apiKey', { required: 'API Key is required' })}
              className="form-input py-2"
            />
            {errors.twitterCredentials?.apiKey && (
              <p className="mt-1 text-xs text-heroRed font-bold">{errors.twitterCredentials.apiKey.message}</p>
            )}
          </div>
          
          <div>
            <label className="form-label text-sm">
              API Key Secret
            </label>
            <input
              type="password"
              {...register('twitterCredentials.apiKeySecret', { required: 'API Key Secret is required' })}
              className="form-input py-2"
            />
            {errors.twitterCredentials?.apiKeySecret && (
              <p className="mt-1 text-xs text-heroRed font-bold">{errors.twitterCredentials.apiKeySecret.message}</p>
            )}
          </div>
          
          <div>
            <label className="form-label text-sm">
              Access Token
            </label>
            <input
              type="text"
              {...register('twitterCredentials.accessToken', { required: 'Access Token is required' })}
              className="form-input py-2"
            />
            {errors.twitterCredentials?.accessToken && (
              <p className="mt-1 text-xs text-heroRed font-bold">{errors.twitterCredentials.accessToken.message}</p>
            )}
          </div>
          
          <div>
            <label className="form-label text-sm">
              Access Token Secret
            </label>
            <input
              type="password"
              {...register('twitterCredentials.accessTokenSecret', { required: 'Access Token Secret is required' })}
              className="form-input py-2"
            />
            {errors.twitterCredentials?.accessTokenSecret && (
              <p className="mt-1 text-xs text-heroRed font-bold">{errors.twitterCredentials.accessTokenSecret.message}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="form-label text-sm">
              Bearer Token
            </label>
            <input
              type="password"
              {...register('twitterCredentials.bearerToken', { required: 'Bearer Token is required' })}
              className="form-input py-2"
            />
            {errors.twitterCredentials?.bearerToken && (
              <p className="mt-1 text-xs text-heroRed font-bold">{errors.twitterCredentials.bearerToken.message}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Keywords */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold border-b-2 border-black pb-2 mb-3">Search Keywords</h3>
        
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={searchKeywordsInput}
            onChange={(e) => setSearchKeywordsInput(e.target.value)}
            placeholder="Add a keyword..."
            className="form-input py-2"
          />
          <button
            type="button"
            onClick={addSearchKeyword}
            className="px-3 py-2 border-4 border-black rounded-lg bg-secondary
                     shadow-[-2px_2px_0_0_#1f2024] transition-all duration-200
                     font-right-grotesk text-white text-sm tracking-wider
                     hover:shadow-[-4px_4px_0_0_#1f2024] hover:translate-x-0.5 hover:-translate-y-0.5"
          >
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2 max-h-20 overflow-y-auto">
          {searchKeywords.map((keyword) => (
            <span
              key={keyword}
              className="keyword-tag"
            >
              {keyword}
              <button
                type="button"
                onClick={() => removeSearchKeyword(keyword)}
                className="ml-2 text-white hover:text-yellow"
              >
                &times;
              </button>
            </span>
          ))}
          {searchKeywords.length === 0 && (
            <p className="text-sm text-gray-700 italic">No keywords added yet</p>
          )}
        </div>
      </div>
      
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-3"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Agent...
            </>
          ) : (
            'Create Agent'
          )}
        </Button>
      </div>
    </form>
  );
}