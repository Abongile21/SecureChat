export default function Chat() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Security Chat</h1>
      <div className="flex h-[600px] border rounded-lg">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {/* Chat messages will go here */}
            <p className="text-gray-500">Start a conversation about cybersecurity</p>
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about security..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
