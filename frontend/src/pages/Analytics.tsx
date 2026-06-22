export default function Analytics() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Engagement Over Time</h2>
          <p className="text-gray-500">Chart will be rendered here</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Training Completion Rate</h2>
          <p className="text-gray-500">Chart will be rendered here</p>
        </div>
      </div>
    </div>
  );
}
