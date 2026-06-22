export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">SecureChat</h1>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
}
