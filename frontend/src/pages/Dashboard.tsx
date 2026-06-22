export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to SecureChat</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-500 text-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Points</h2>
          <p className="text-3xl font-bold">1,250</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Rank</h2>
          <p className="text-3xl font-bold">#15</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Badges</h2>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Trainings</h2>
          <p className="text-3xl font-bold">5/10</p>
        </div>
      </div>
    </div>
  );
}
