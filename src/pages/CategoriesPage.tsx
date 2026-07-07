import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../api/services/categories';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = async (showInactive: boolean) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await getCategories(showInactive);
      setCategories(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load categories.';
      setErrorMessage(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      setErrorMessage('');

      try {
        const data = await getCategories(includeInactive);
        if (!active) {
          return;
        }

        setCategories(data);
      } catch (error) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Unable to load categories.';
        setErrorMessage(message);
        setCategories([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      active = false;
    };
  }, [includeInactive]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return categories;
    }

    return categories.filter((category) => {
      const haystack = `${category.name} ${category.description}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [categories, searchTerm]);

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormName('');
    setFormDescription('');
    setFormIsActive(true);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormDescription(category.description);
    setFormIsActive(category.isActive);
    setIsFormOpen(true);
  };

  const handleIncludeInactiveChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setErrorMessage('');
    setIncludeInactive(event.target.checked);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formName.trim()) {
      setErrorMessage('Category name is required.');
      return;
    }

    const payload: CreateCategoryRequest | UpdateCategoryRequest = {
      name: formName.trim(),
      description: formDescription.trim(),
      isActive: formIsActive,
    };

    setSubmitting(true);
    setErrorMessage('');

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
      } else {
        await createCategory(payload);
      }

      await loadCategories(includeInactive);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save category.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    setErrorMessage('');

    try {
      await deleteCategory(category.id);
      await loadCategories(includeInactive);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to delete category.';
      setErrorMessage(message);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.7)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Management</p>
        <h2 className="mt-3 text-3xl font-semibold">Categories</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Manage category definitions for the event registration system. The page is connected to the backend API and is ready for live records.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Category workspace</h3>
            <p className="mt-1 text-sm text-slate-600">
              Search categories, manage active states, and create or edit records from the backend.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-60">
              <Input
                label="Search"
                placeholder="Search categories"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeInactive}
                onChange={handleIncludeInactiveChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Include inactive
            </label>
            <Button variant="primary" onClick={openCreateForm}>
              Create Category
            </Button>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {isFormOpen ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  {editingCategory ? 'Edit category' : 'Create category'}
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  {editingCategory ? 'Update the selected category details.' : 'Add a new category record to the API.'}
                </p>
              </div>
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>

            <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <Input
                  label="Name"
                  placeholder="Category name"
                  value={formName}
                  onChange={(event) => setFormName(event.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Description"
                  placeholder="Short description"
                  value={formDescription}
                  onChange={(event) => setFormDescription(event.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(event) => setFormIsActive(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Active
              </label>
              <div className="flex justify-end gap-2 md:col-span-2">
                <Button variant="secondary" type="button" onClick={resetForm}>
                  Discard
                </Button>
                <Button variant="primary" type="submit" loading={submitting}>
                  {editingCategory ? 'Save changes' : 'Create category'}
                </Button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-6 py-10 text-center text-sm text-slate-600">
              Loading categories...
            </div>
          ) : (
            <Table
              columns={[
                {
                  header: 'Name',
                  accessor: (item) => <span className="font-medium text-slate-900">{item.name}</span>,
                },
                {
                  header: 'Description',
                  accessor: (item) => <span>{item.description}</span>,
                },
                {
                  header: 'Status',
                  accessor: (item) => (
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  ),
                },
                {
                  header: 'Actions',
                  accessor: (item) => (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => openEditForm(item)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => void handleDelete(item)}>
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              data={filteredCategories}
              emptyMessage={searchTerm ? 'No categories match your search.' : 'No categories to display yet'}
              emptyDescription={searchTerm ? 'Try a different keyword.' : 'Categories will appear here after API integration.'}
              keyExtractor={(item) => item.id}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default CategoriesPage;
