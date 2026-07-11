import { useEffect, useState } from "react";
import type { Category } from "../types/category";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/services/categories";


type ApiError = {
  status?: number;
  data?: {
    message?: string;
  };
};


const getErrorMessage = (error: unknown) => {

  const apiError = error as ApiError;

  return (
    apiError.data?.message ??
    "Something went wrong"
  );

};



export default function CategoriesPage() {

  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");


  const [name, setName] = useState("");

  const [description, setDescription] = useState("");


  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);



  // ================= GET CATEGORIES =================

  useEffect(() => {

  const fetchCategories = async () => {

    try {

      setLoading(true);

      const data = await getCategories();

      setCategories(data);

    }
    catch(error: unknown){

      setError(
        getErrorMessage(error)
      );

    }
    finally{

      setLoading(false);

    }

  };


  fetchCategories();


}, []);


  // ================= CREATE =================

  const handleCreate = async () => {

    try {

      setError("");

      setSuccessMessage("");


      const newCategory = await createCategory({

        name,

        description,

      });


      setCategories(prev => [

        ...prev,

        newCategory

      ]);


      setName("");

      setDescription("");


      setSuccessMessage(
        "Category created successfully"
      );


    }
    catch(error: unknown){

      setError(
        getErrorMessage(error)
      );

    }

  };




  // ================= EDIT START =================

  const startEdit = (category: Category) => {

    setEditingCategory(category);

    setName(category.name);

    setDescription(
      category.description ?? ""
    );

    setError("");

    setSuccessMessage("");

  };




  // ================= UPDATE =================

  const handleUpdate = async () => {


    if(!editingCategory)
      return;



    try {


      setError("");

      setSuccessMessage("");



      const updated = await updateCategory(

        editingCategory.id,

        {

          name,

          description,

          isActive:
            editingCategory.isActive

        }

      );



      setCategories(prev =>

        prev.map(category =>

          category.id === updated.id

          ? updated

          : category

        )

      );



      setEditingCategory(null);

      setName("");

      setDescription("");



      setSuccessMessage(
        "Category updated successfully"
      );


    }
    catch(error: unknown){

      setError(
        getErrorMessage(error)
      );

    }

  };





  // ================= DELETE =================


  const handleDelete = async (id:number) => {


    try {


      setError("");

      setSuccessMessage("");



      await deleteCategory(id);



      setCategories(prev =>

        prev.filter(
          category =>
            category.id !== id
        )

      );



      setSuccessMessage(
        "Category deleted successfully"
      );


    }
    catch(error: unknown){


      setError(
        getErrorMessage(error)
      );


    }


  };






  // ================= TOGGLE ACTIVE =================


  const toggleStatus = async(category:Category)=>{


    try{


      const updated = await updateCategory(

        category.id,

        {

          name: category.name,

          description:
            category.description ?? "",

          isActive:
            !category.isActive

        }

      );



      setCategories(prev =>

        prev.map(c =>

          c.id === updated.id

          ? updated

          : c

        )

      );


    }
    catch(error:unknown){


      setError(
        getErrorMessage(error)
      );


    }


  };






  if(loading){

    return (

      <div className="p-6 text-center">

        Loading categories...

      </div>

    );

  }







  return (

    <div className="max-w-6xl mx-auto p-6">


      <div className="bg-white shadow-md rounded-lg p-6">



        <h1 className="text-3xl font-bold mb-6">

          Categories

        </h1>





        {/* FORM */}


        <div className="border p-4 mb-6 bg-gray-50">


          <h2 className="text-xl font-semibold mb-4">

            {
              editingCategory

              ? "Edit Category"

              : "Create Category"
            }


          </h2>




          <div className="grid gap-4">


            <input

              className="border p-3 rounded"

              placeholder="Category Name"

              value={name}

              onChange={
                e=>setName(e.target.value)
              }

            />



            <textarea

              className="border p-3 rounded"

              placeholder="Description"

              value={description}

              onChange={
                e=>setDescription(e.target.value)
              }

            />





            <button

              onClick={
                editingCategory

                ? handleUpdate

                : handleCreate

              }

              className="bg-blue-600 text-white py-2 rounded"

            >


              {
                editingCategory

                ? "Update"

                : "Create"

              }


            </button>



          </div>



        </div>






        {
          successMessage &&

          <p className="text-green-600 mb-4">

            {successMessage}

          </p>

        }





        {
          error &&

          <p className="text-red-600 mb-4">

            {error}

          </p>

        }







        {/* TABLE */}



        <table className="w-full border">


          <thead className="bg-gray-100">


            <tr>


              <th className="border p-3">

                Name

              </th>


              <th className="border p-3">

                Description

              </th>


              <th className="border p-3">

                Status

              </th>


              <th className="border p-3">

                Actions

              </th>



            </tr>


          </thead>





          <tbody>


          {
            categories.map(category=>(


              <tr
                key={category.id}
                className="text-center"
              >



                <td className="border p-3">

                  {category.name}

                </td>




                <td className="border p-3">

                  {category.description}

                </td>





                <td className="border p-3">


                  <button

                    onClick={()=>
                      toggleStatus(category)
                    }

                    className={`px-3 py-1 rounded ${
                      category.isActive

                      ? "bg-green-500 text-white"

                      : "bg-red-500 text-white"

                    }`}


                  >

                    {
                      category.isActive

                      ? "Active"

                      : "Inactive"

                    }


                  </button>



                </td>





                <td className="border p-3">


                  <button

                    onClick={()=>
                      startEdit(category)
                    }

                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"

                  >

                    Edit

                  </button>




                  <button

                    onClick={()=>
                      handleDelete(category.id)
                    }

                    className="bg-red-600 text-white px-3 py-1 rounded"

                  >

                    Delete

                  </button>



                </td>



              </tr>


            ))
          }


          </tbody>



        </table>




      </div>


    </div>


  );

}
