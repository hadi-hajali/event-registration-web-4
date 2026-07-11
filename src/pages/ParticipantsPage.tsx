import { useEffect, useState } from "react";

interface Participant {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  isActive: boolean;
}

// 💡 Using a clear named export to match App.tsx requirements!
export function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);

  // Search, Filters & Pagination State (F03 Requirements)
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Building query string params for pagination & sorting
      let url = `http://localhost:5031/api/participants?page=${page}&pageSize=${pageSize}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (isActiveFilter !== "all") url += `&isActive=${isActiveFilter === "active"}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error();
      
      const data = await response.json();
      setParticipants(data.items || []);
    } catch {
      setError("Failed to load participants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [page, isActiveFilter]); // Auto-reload when pages or active state toggles

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Simple validation safeguard
    if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
      setError("Date of birth cannot be in the future.");
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth: dateOfBirth || null
    };

    try {
      const url = editingParticipant 
        ? `http://localhost:5031/api/participants/${editingParticipant.id}`
        : "http://localhost:5031/api/participants";
        
      const response = await fetch(url, {
        method: editingParticipant ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant: payload }),
      });

      if (response.status === 409) {
        setError("Conflict: Email is already registered.");
        return;
      }
      if (!response.ok) throw new Error();

      setSuccessMessage(editingParticipant ? "Participant updated successfully" : "Participant created successfully");
      resetForm();
      fetchParticipants();
    } catch {
      setError("Failed to process request. Check parameters.");
    }
  };

  const handleToggleActive = async (participant: Participant) => {
    try {
      // Direct API Update variant for activation/deactivation switch logic
      const response = await fetch(`http://localhost:5031/api/participants/${participant.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: participant.id,
          participant: {
            fullName: participant.fullName,
            email: participant.email,
            phone: participant.phone,
            dateOfBirth: participant.dateOfBirth,
            isActive: !participant.isActive
          }
        }),
      });
      if (!response.ok) throw new Error();
      fetchParticipants();
    } catch {
      setError("Failed to alter activation state.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this participant?")) return;
    try {
      const response = await fetch(`http://localhost:5031/api/participants/${id}`, { method: "DELETE" });
      if (response.status === 409) {
        setError("Cannot delete participant with an active registration history.");
        return;
      }
      if (!response.ok) throw new Error();
      setSuccessMessage("Participant safely removed.");
      fetchParticipants();
    } catch {
      setError("An error occurred during deletion.");
    }
  };

  const startEdit = (p: Participant) => {
    setEditingParticipant(p);
    setFullName(p.fullName);
    setEmail(p.email);
    setPhone(p.phone);
    setDateOfBirth(p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "");
  };

  const resetForm = () => {
    setEditingParticipant(null);
    setFullName("");
    setEmail("");
    setPhone("");
    setDateOfBirth("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Participant Management</h1>
        
        {/* Alerts */}
        {successMessage && <div className="p-3 mb-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}
        {error && <div className="p-3 mb-3 bg-red-100 text-red-700 rounded">{error}</div>}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 border rounded">
          <h2 className="col-span-full font-bold">{editingParticipant ? "Modify Participant Details" : "Register New Participant"}</h2>
          <input required type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className="p-2 border rounded"/>
          <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="p-2 border rounded"/>
          <input required type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="p-2 border rounded"/>
          <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="p-2 border rounded"/>
          <div className="col-span-full flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingParticipant ? "Update" : "Save Entry"}</button>
            {editingParticipant && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Query Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center flex-1 min-w-[250px]">
          <input type="text" placeholder="Search name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} className="p-2 border rounded w-full"/>
          <button onClick={fetchParticipants} className="bg-gray-800 text-white px-4 py-2 rounded">Search</button>
        </div>
        <select value={isActiveFilter} onChange={e => setIsActiveFilter(e.target.value)} className="p-2 border rounded">
          <option value="all">All States</option>
          <option value="active">Active Status</option>
          <option value="inactive">Inactive Status</option>
        </select>
      </div>

      {/* Data Viewer Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? <div className="p-6 text-center">Querying Database records...</div> : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Full Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border text-center">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">{p.fullName}</td>
                  <td className="p-3 border">{p.email}</td>
                  <td className="p-3 border">{p.phone}</td>
                  <td className="p-3 border text-center">
                    <button onClick={() => handleToggleActive(p)} className={`px-3 py-1 rounded-full text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <button onClick={() => startEdit(p)} className="bg-amber-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination Controls */}
        <div className="p-4 bg-gray-50 flex justify-between items-center border-t">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border rounded disabled:opacity-50 text-sm">Previous</button>
          <span className="text-sm font-medium">Page {page}</span>
          <button disabled={participants.length < pageSize} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white border rounded disabled:opacity-50 text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}
export default ParticipantsPage;