import { useState } from 'react';

export default function TwitterInstructions() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          How to Get Twitter API Credentials
        </h2>
        <button
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Hide Instructions' : 'Show Instructions'}
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-500">
            To use this application, you'll need Twitter API credentials with OAuth 1.0a for user authentication.
            Follow these steps to obtain the required credentials:
          </p>
          
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
            <li>
              <strong>Create a Twitter Developer Account:</strong> Visit the{' '}
              <a href="https://developer.twitter.com/en/portal/dashboard" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                Twitter Developer Portal
              </a>{' '}
              and sign in with your Twitter account.
            </li>
            
            <li>
              <strong>Create a Project:</strong> Once approved, create a new project in your dashboard.
            </li>
            
            <li>
              <strong>Create an App:</strong> Within your project, create a new app to get your API keys.
            </li>
            
            <li>
              <strong>Set App Permissions:</strong> In your app settings, change the app permissions to "Read and Write".
            </li>
            
            <li>
              <strong>Set Up Authentication:</strong> Navigate to the "Authentication settings" section and set up OAuth 1.0a.
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Enable OAuth 1.0a</li>
                <li>Add a callback URL (can be http://localhost:3006)</li>
                <li>Set the website URL to your website if available</li>
                <li>Turn on "Request email from users"</li>
              </ul>
            </li>
            
            <li>
              <strong>Generate Tokens:</strong> Go to "Keys and Tokens" and generate both:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>API Key and Secret (Consumer Keys)</li>
                <li>Access Token and Secret</li>
              </ul>
            </li>
          </ol>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Keep your API keys and tokens secure. Do not share them or commit them to public code repositories.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            Once you have all the required credentials, you can enter them in the form to create your Twitter agent.
          </p>
        </div>
      )}
    </div>
  );
}