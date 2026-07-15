import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/services/categories";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import type { Category } from "../types/category";
import { getErrorMessage } from "../utils/apiError";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = useCallback(() => {
    return getCategories(includeInactive);
  }, [includeInactive]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError("");

      try {
        const data = await loadCategories();
        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [loadCategories]);

  async function refreshCategories() {
    const data = await loadCategories();
    setCategories(data);
  }

  function resetForm() {
    setEditingCategory(null);
    setName("");
    setDescription("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          isActive: editingCategory.isActive,
        });
        setSuccessMessage("Category updated successfully.");
      } else {
        await createCategory({
          name: name.trim(),
          description: description.trim(),
        });
        setSuccessMessage("Category created successfully.");
      }

      resetForm();
      await refreshCategories();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(category: Category) {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description ?? "");
    setError("");
    setSuccessMessage("");
  }

  async function toggleStatus(category: Category) {
    setError("");
    setSuccessMessage("");

    try {
      await updateCategory(category.id, {
        name: category.name,
        description: category.description ?? "",
        isActive: !category.isActive,
      });
      setSuccessMessage(category.isActive ? "Category deactivated." : "Category activated.");
      await refreshCategories();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Delete "${category.name}"?`);
    if (!confirmed) return;

    setError("");
    setSuccessMessage("");

    try {
      await deleteCategory(category.id);
      setSuccessMessage("Category deleted successfully.");
      await refreshCategories();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Configuration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Categories
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Maintain event categories and control which ones can be used for new events.
          </p>
        </div>

        <label className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600"
          />
          Include inactive
        </label>
      </div>

      {(error || successMessage) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            error
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || successMessage}
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_1.5fr_auto] lg:items-end">
          <Input
            required
            label="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workshop"
          />
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional category description"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" loading={saving}>
              {editingCategory ? "Update" : "Create"}
            </Button>
            {editingCategory && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">Category List</h2>
          <p className="text-sm text-slate-500">{categories.length} categories shown</p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-900">No categories found</p>
            <p className="mt-2 text-sm text-slate-500">Create a category to start organizing events.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-950">{category.name}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{category.description || "-"}</td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => toggleStatus(category)}>
                        <Badge tone={category.isActive ? "green" : "gray"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => startEdit(category)} className="px-3 py-2">
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(category)} className="px-3 py-2">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
