import { useEffect, useState } from "react";

interface Participant {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  isActive: boolean;
}

function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
const [editingParticipant, setEditingParticipant] =
  useState<Participant | null>(null);
  const createParticipant = async () => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "http://localhost:5031/api/participants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participant: {
              fullName,
              email,
              phone,
              dateOfBirth,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setSuccessMessage(
        "Participant created successfully"
      );

      setFullName("");
      setEmail("");
      setPhone("");
      setDateOfBirth("");

      const refreshResponse = await fetch(
        "http://localhost:5031/api/participants"
      );

      const refreshedData =
        await refreshResponse.json();

      setParticipants(refreshedData);
    } catch {
      setError("Failed to create participant");
    }
  };
const startEdit = (participant: Participant) => {
  setEditingParticipant(participant);

  setFullName(participant.fullName);
  setEmail(participant.email);
  setPhone(participant.phone);

  if (participant.dateOfBirth) {
    setDateOfBirth(
      participant.dateOfBirth.split("T")[0]
    );
  }

  setError("");
  setSuccessMessage("");
};
const updateParticipant = async () => {
  if (!editingParticipant) return;

  setError("");
  setSuccessMessage("");

  try {
    const response = await fetch(
      `http://localhost:5031/api/participants/${editingParticipant.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingParticipant.id,
          participant: {
            fullName,
            email,
            phone,
            dateOfBirth,
            isActive: editingParticipant.isActive,
          },
        }),
      }
    );
const deleteParticipant = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this participant?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5031/api/participants/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    setParticipants((prev) =>
      prev.filter((p) => p.id !== id)
    );

    setSuccessMessage(
      "Participant deleted successfully"
    );
  } catch {
    setError("Failed to delete participant");
  }
};
    if (!response.ok) {
      throw new Error();
    }

    const refreshResponse = await fetch(
      "http://localhost:5031/api/participants"
    );

    const refreshedData = await refreshResponse.json();

    setParticipants(refreshedData);

    setEditingParticipant(null);

    setFullName("");
    setEmail("");
    setPhone("");
    setDateOfBirth("");

    setSuccessMessage(
      "Participant updated successfully"
    );
  } catch {
    setError("Failed to update participant");
  }
};
const deleteParticipant = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this participant?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5031/api/participants/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    setParticipants((prev) =>
      prev.filter((p) => p.id !== id)
    );

    setSuccessMessage(
      "Participant deleted successfully"
    );
  } catch {
    setError("Failed to delete participant");
  }
};
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(
          "http://localhost:5031/api/participants"
        );

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        setParticipants(data);
      } catch {
        setError("Failed to load participants");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading participants...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Participants
        </h1>

        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
  {editingParticipant
    ? "Edit Participant"
    : "Create Participant"}
</h2>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="border p-3 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="border p-3 rounded"
            />

            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="border p-3 rounded"
            />

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) =>
                setDateOfBirth(e.target.value)
              }
              className="border p-3 rounded"
            />

           <button
  onClick={
    editingParticipant
      ? updateParticipant
      : createParticipant
  }
  className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
>
  {editingParticipant
    ? "Update Participant"
    : "Create Participant"}
</button>

            {successMessage && (
              <div className="text-green-600 font-medium">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="text-red-600 font-medium">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">
                  ID
                </th>
                <th className="border p-3 text-left">
                  Full Name
                </th>
                <th className="border p-3 text-left">
                  Email
                </th>
                <th className="border p-3 text-left">
                  Phone
                </th>
               <th className="border p-3 text-center">
  Status
</th>

<th className="border p-3 text-center">
  Actions
</th>
              </tr>
            </thead>

            <tbody>
              {participants.map((participant) => (
                <tr
                  key={participant.id}
                  className="hover:bg-gray-50"
                >
                  <td className="border p-3">
                    {participant.id}
                  </td>

                  <td className="border p-3">
                    {participant.fullName}
                  </td>

                  <td className="border p-3">
                    {participant.email}
                  </td>

                  <td className="border p-3">
                    {participant.phone}
                  </td>

                  <td className="border p-3 text-center">
                    <span
                    
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        participant.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {participant.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>
           <td className="border p-3 text-center">
  <div className="flex justify-center gap-2">
    <button
      onClick={() => startEdit(participant)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
    >
      Edit
    </button>

    <button
      onClick={() => deleteParticipant(participant.id)}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    >
      Delete
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          {participants.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No participants found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantsPage;