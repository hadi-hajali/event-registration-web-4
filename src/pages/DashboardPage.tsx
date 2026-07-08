export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-80">Total Events</p>
          <h2 className="text-4xl font-bold mt-2">12</h2>
        </div>

        <div className="bg-green-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-80">Participants</p>
          <h2 className="text-4xl font-bold mt-2">87</h2>
        </div>

        <div className="bg-purple-600 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-80">Categories</p>
          <h2 className="text-4xl font-bold mt-2">5</h2>
        </div>

        <div className="bg-orange-500 text-white rounded-xl shadow-lg p-6">
          <p className="text-sm opacity-80">Active Events</p>
          <h2 className="text-4xl font-bold mt-2">4</h2>
        </div>
      </div>

      {/* Fake Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">
          Monthly Registrations
        </h2>

        <div className="flex items-end gap-4 h-64">
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 w-12 h-20 rounded-t"></div>
            <span className="mt-2">Jan</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-blue-500 w-12 h-28 rounded-t"></div>
            <span className="mt-2">Feb</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-blue-500 w-12 h-40 rounded-t"></div>
            <span className="mt-2">Mar</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-blue-500 w-12 h-32 rounded-t"></div>
            <span className="mt-2">Apr</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-blue-500 w-12 h-48 rounded-t"></div>
            <span className="mt-2">May</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-blue-500 w-12 h-56 rounded-t"></div>
            <span className="mt-2">Jun</span>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Events
        </h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Location</th>
              <th className="border p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-3">
                React Workshop
              </td>

              <td className="border p-3">
                Ramallah
              </td>

              <td className="border p-3">
                <span className="bg-green-500 text-white px-3 py-1 rounded">
                  Active
                </span>
              </td>
            </tr>

            <tr>
              <td className="border p-3">
                AI Bootcamp
              </td>

              <td className="border p-3">
                Nablus
              </td>

              <td className="border p-3">
                <span className="bg-yellow-500 text-white px-3 py-1 rounded">
                  Upcoming
                </span>
              </td>
            </tr>

            <tr>
              <td className="border p-3">
                Tech Conference
              </td>

              <td className="border p-3">
                Jerusalem
              </td>

              <td className="border p-3">
                <span className="bg-red-500 text-white px-3 py-1 rounded">
                  Closed
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}