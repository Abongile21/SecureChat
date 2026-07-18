import { useAuth } from '../context/AuthContext';
import { isAzureConfigured } from '../config/msalConfig';

export default function Login() {
  const { login, isLoading } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-4">SecureChat</h1>
        <p className="text-gray-600 text-center mb-6">
          {isAzureConfigured
            ? 'Sign in with your Microsoft account to continue.'
            : 'Azure is not configured yet, so this demo uses a local sign-in flow.'}
        </p>
        <button
          onClick={() => login()}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : isAzureConfigured ? 'Sign in with Microsoft' : 'Continue in demo mode'}
        </button>
      </div>
    </div>
  );
}
