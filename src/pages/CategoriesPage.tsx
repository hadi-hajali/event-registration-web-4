import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const toggleCategoryStatus = async (category: any) => {
    try {
      const response = await fetch(
        `http://localhost:5031/api/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: category.id,
            name: category.name,
            description: category.description,
            isActive: !category.isActive,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id
            ? { ...c, isActive: !c.isActive }
            : c
        )
      );
    } catch {
      alert("Failed to update category");
    }
  };

  const createCategory = async () => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "http://localhost:5031/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const newCategory = await response.json();

      setCategories((prev) => [...prev, newCategory]);

      setName("");
      setDescription("");

      setSuccessMessage("Category created successfully");
    } catch {
      setError("Failed to create category");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5031/api/categories"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch {
        setError("Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Categories
        </h1>

        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            Create Category
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 rounded"
            />

            <button
              onClick={createCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Create Category
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
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Description</th>
                <th className="border p-3 text-center">Active</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="border p-3">{cat.name}</td>
                  <td className="border p-3">{cat.description}</td>

                  <td className="border p-3 text-center">
                    <button
                      onClick={() => toggleCategoryStatus(cat)}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                        cat.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="border p-3">
                    <div className="flex justify-center gap-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        Edit
                      </button>

                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}