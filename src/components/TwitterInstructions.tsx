import { useState } from 'react';
import Button from './Button';

export default function TwitterInstructions() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="agent-card mb-6">
      <div className="flex justify-between items-center">
        <h2 className="font-right-grotesk text-xl">
          How to Get Twitter API Credentials
        </h2>
        <button
          type="button"
          className="px-4 py-2 border-4 border-black rounded-lg bg-secondary
                   shadow-[-2px_2px_0_0_#1f2024] transition-all duration-200
                   font-right-grotesk text-white text-sm tracking-wider
                   hover:shadow-[-4px_4px_0_0_#1f2024] hover:translate-x-0.5 hover:-translate-y-0.5"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Hide Instructions' : 'Show Instructions'}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-4 space-y-4 animate-slideDown">
          <p className="text-md font-bold">
            To use this application, you'll need Twitter API credentials with OAuth 1.0a for user authentication.
            Follow these steps to obtain the required credentials:
          </p>
          
          <ol className="list-decimal pl-5 space-y-3 text-md">
            <li>
              <strong className="text-primary">Create a Twitter Developer Account:</strong> Visit the{' '}
              <a href="https://developer.twitter.com/en/portal/dashboard" className="text-secondary underline hover:text-primary" target="_blank" rel="noopener noreferrer">
                Twitter Developer Portal
              </a>{' '}
              and sign in with your Twitter account.
            </li>
            
            <li>
              <strong className="text-primary">Create a Project:</strong> Once approved, create a new project in your dashboard.
            </li>
            
            <li>
              <strong className="text-primary">Create an App:</strong> Within your project, create a new app to get your API keys.
            </li>
            
            <li>
              <strong className="text-primary">Set App Permissions:</strong> In your app settings, change the app permissions to "Read and Write".
            </li>
            
            <li>
              <strong className="text-primary">Set Up Authentication:</strong> Navigate to the "Authentication settings" section and set up OAuth 1.0a.
              <ul className="list-disc pl-5 mt-2 space-y-1 text-md">
                <li>Enable OAuth 1.0a</li>
                <li>Add a callback URL (can be http://localhost:3006)</li>
                <li>Set the website URL to your website if available</li>
                <li>Turn on "Request email from users"</li>
              </ul>
            </li>
            
            <li>
              <strong className="text-primary">Generate Tokens:</strong> Go to "Keys and Tokens" and generate both:
              <ul className="list-disc pl-5 mt-2 space-y-1 text-md">
                <li>API Key and Secret (Consumer Keys)</li>
                <li>Access Token and Secret</li>
              </ul>
            </li>
          </ol>
          
          <div className="bg-yellow/30 border-4 border-black p-4 mt-6 rounded shadow-[-3px_3px_0_0_#1f2024]">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-md font-bold">
                  <strong>Important:</strong> Keep your API keys and tokens secure. Do not share them or commit them to public code repositories.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-md">
            Once you have all the required credentials, you can enter them in the form to create your Twitter agent.
          </p>
        </div>
      )}
    </div>
  );
}