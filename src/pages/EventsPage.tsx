import { useCallback, useEffect, useState } from "react";
import type { Event } from "../types/event";

import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/services/events";


type ApiError = {
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




export default function EventsPage() {


  const [events, setEvents] = useState<Event[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");



  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [location, setLocation] = useState("");

  const [categoryId, setCategoryId] = useState(1);

  const [capacity, setCapacity] = useState(0);



  const [editingEvent, setEditingEvent] =
    useState<Event | null>(null);





  // ================= GET EVENTS =================


  
  const fetchEvents = useCallback(async () => {

    try {

      const response = await getEvents({
        page: 1,
        pageSize: 20,
      });

      setEvents(response.items);

    } catch(error: unknown) {

      setError(
        getErrorMessage(error)
      );

    }

  }, []);




  // التحميل الأول يتم هنا بشكل منفصل تماماً لتجنب أي تعارض مع الـ Linter
  useEffect(() => {
    
    async function initialFetch() {
      try {
        const response = await getEvents({
          page: 1,
          pageSize: 20,
        });
        setEvents(response.items);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    initialFetch();

  }, []);







  // ================= CLEAR FORM =================


  const clearForm = () => {


    setName("");

    setDescription("");

    setLocation("");

    setCategoryId(1);

    setCapacity(0);

    setEditingEvent(null);


  };









  // ================= CREATE =================


  const handleCreate = async () => {


    try {


      setError("");

      setSuccessMessage("");



      await createEvent({

        categoryId,

        name,

        description,

        location,

        startAt:
          "2026-08-01T10:00:00",

        endAt:
          "2026-08-01T12:00:00",

        registrationDeadline:
          "2026-07-30T10:00:00",

        capacity,

        isActive:true,

      });




      await fetchEvents();



      clearForm();



      setSuccessMessage(
        "Event created successfully"
      );



    } catch(error: unknown) {


      setError(
        getErrorMessage(error)
      );


    }


  };









  // ================= EDIT =================


  const startEdit = (event: Event) => {


    setEditingEvent(event);


    setName(event.name);


    setDescription(
      event.description ?? ""
    );


    setLocation(
      event.location
    );


    setCategoryId(
      event.categoryId
    );


    setCapacity(
      event.capacity
    );


    setError("");

    setSuccessMessage("");


  };









  // ================= UPDATE =================


  const handleUpdate = async () => {


    if(!editingEvent)
      return;



    try {


      setError("");

      setSuccessMessage("");



      await updateEvent(

        editingEvent.id,

        {

          categoryId,

          name,

          description,

          location,

          startAt:
            "2026-08-01T10:00:00",

          endAt:
            "2026-08-01T12:00:00",

          registrationDeadline:
            "2026-07-30T10:00:00",

          capacity,

          isActive:true,

        }

      );




      await fetchEvents();



      clearForm();



      setSuccessMessage(
        "Event updated successfully"
      );



    } catch(error: unknown) {


      setError(
        getErrorMessage(error)
      );


    }


  };









  // ================= DELETE =================


  const handleDelete = async(id:number) => {


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this event?"
      );


    if(!confirmDelete)
      return;




    try {


      setError("");

      setSuccessMessage("");



      await deleteEvent(id);



      await fetchEvents();




      setSuccessMessage(
        "Event deleted successfully"
      );



    } catch(error: unknown) {


      setError(
        getErrorMessage(error)
      );


    }


  };









  if(loading){

    return (

      <div className="p-6 text-center">

        Loading events...

      </div>

    );

  }









  return (

    <div className="max-w-6xl mx-auto p-6">


      <div className="bg-white shadow-md rounded-lg p-6">


        <h1 className="text-3xl font-bold mb-6">
          Events
        </h1>





        <div className="border p-4 mb-6 bg-gray-50 rounded">


          <h2 className="text-xl font-semibold mb-4">

            {
              editingEvent
              ? "Edit Event"
              : "Create Event"
            }

          </h2>





          <div className="grid gap-4">


            <input
              className="border p-3 rounded"
              placeholder="Event Name"
              value={name}
              onChange={
                e => setName(e.target.value)
              }
            />



            <textarea
              className="border p-3 rounded"
              placeholder="Description"
              value={description}
              onChange={
                e => setDescription(e.target.value)
              }
            />



            <input
              className="border p-3 rounded"
              placeholder="Location"
              value={location}
              onChange={
                e => setLocation(e.target.value)
              }
            />



            <input
              className="border p-3 rounded"
              type="number"
              value={categoryId}
              onChange={
                e =>
                setCategoryId(
                  Number(e.target.value)
                )
              }
            />



            <input
              className="border p-3 rounded"
              type="number"
              value={capacity}
              onChange={
                e =>
                setCapacity(
                  Number(e.target.value)
                )
              }
            />



            <button
              onClick={
                editingEvent
                ? handleUpdate
                : handleCreate
              }
              className="bg-blue-600 text-white py-2 rounded"
            >

              {
                editingEvent
                ? "Update Event"
                : "Create Event"
              }

            </button>



            {
              editingEvent &&

              <button
                onClick={clearForm}
                className="bg-gray-500 text-white py-2 rounded"
              >

                Cancel

              </button>
            }



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






        <table className="w-full border">


          <thead className="bg-gray-100">


            <tr>

              <th className="border p-3">
                Name
              </th>

              <th className="border p-3">
                Category
              </th>

              <th className="border p-3">
                Location
              </th>

              <th className="border p-3">
                Seats
              </th>

              <th className="border p-3">
                Actions
              </th>

            </tr>


          </thead>




          <tbody>


          {
            events.map(event => (

              <tr
                key={event.id}
                className="text-center"
              >

                <td className="border p-3">
                  {event.name}
                </td>


                <td className="border p-3">
                  {event.categoryName}
                </td>


                <td className="border p-3">
                  {event.location}
                </td>


                <td className="border p-3">
                  {event.availableSeats}
                  /
                  {event.capacity}
                </td>



                <td className="border p-3">


                  <button
                    onClick={() =>
                      startEdit(event)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>



                  <button
                    onClick={() =>
                      handleDelete(event.id)
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