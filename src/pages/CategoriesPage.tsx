import { useEffect, useState } from "react";
import type { Category } from "../types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5031/api/categories"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data: Category[] = await response.json();
        setCategories(data);
      } catch {
        setError("Error loading categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ================= TOGGLE STATUS =================
  const toggleCategoryStatus = async (category: Category) => {
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

      if (!response.ok) throw new Error();

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

  // ================= CREATE =================
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

      if (!response.ok) throw new Error();

      const newCategory: Category = await response.json();

      setCategories((prev) => [...prev, newCategory]);

      setName("");
      setDescription("");

      setSuccessMessage("Category created successfully");
    } catch {
      setError("Failed to create category");
    }
  };

  // ================= EDIT =================
  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setError("");
    setSuccessMessage("");
  };

  const updateCategory = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(
        `http://localhost:5031/api/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingCategory.id,
            name,
            description,
            isActive: editingCategory.isActive,
          }),
        }
      );

      if (!response.ok) throw new Error();

      const updated: Category = await response.json();

      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );

      setEditingCategory(null);
      setName("");
      setDescription("");

      setSuccessMessage("Category updated successfully");
    } catch {
      setError("Failed to update category");
    }
  };

  // ================= UI =================
  if (loading) {
    return <div className="p-6 text-center">Loading categories...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>

        {/* FORM */}
        <div className="border p-4 mb-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? "Edit Category" : "Create Category"}
          </h2>

          <div className="grid gap-4">
            <input
              className="border p-3 rounded"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <textarea
              className="border p-3 rounded"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              onClick={
                editingCategory ? updateCategory : createCategory
              }
              className="bg-blue-600 text-white py-2 rounded"
            >
              {editingCategory ? "Update" : "Create"}
            </button>

            {successMessage && (
              <p className="text-green-600">{successMessage}</p>
            )}

            {error && <p className="text-red-600">{error}</p>}
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Status</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="text-center">
                <td className="border p-3">{cat.name}</td>
                <td className="border p-3">{cat.description}</td>

                <td className="border p-3">
                  <button
                    onClick={() => toggleCategoryStatus(cat)}
                    className={`px-3 py-1 rounded ${
                      cat.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="border p-3">
                  <button
                    onClick={() => startEdit(cat)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}