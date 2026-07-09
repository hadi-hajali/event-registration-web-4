import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  type DashboardSummary
} from "../api/services/dashboard";


export default function DashboardPage() {


  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");



  useEffect(() => {


    const loadDashboard = async () => {

      try {

        const data =
          await getDashboardSummary();


        setSummary(data);


      } catch(error) {

        console.error(error);

        setError(
          "Failed to load dashboard"
        );


      } finally {

        setLoading(false);

      }

    };


    loadDashboard();


  }, []);




  if(loading){

    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );

  }



  if(error){

    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );

  }




  return (

    <div className="min-h-screen bg-gray-100 p-6">


      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>




      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">


        <Card
          title="Active Categories"
          value={
            summary?.activeCategories ?? 0
          }
        />


        <Card
          title="Active Participants"
          value={
            summary?.activeParticipants ?? 0
          }
        />


        <Card
          title="Active Registrations"
          value={
            summary?.activeRegistrations ?? 0
          }
        />


        <Card
          title="Upcoming Events"
          value={
            summary?.upcomingEventsCount ?? 0
          }
        />


      </div>





      <div className="bg-white rounded-xl shadow p-6">


        <h2 className="text-xl font-bold mb-5">
          Upcoming Events
        </h2>



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

            </tr>

          </thead>




          <tbody>


          {
            summary?.upcomingEvents.map(event => (

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


              </tr>


            ))
          }


          </tbody>


        </table>


      </div>



    </div>

  );

}



function Card(
  {
    title,
    value
  }:{
    title:string;
    value:number;
  }
){

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {value}
      </h2>

    </div>

  );

}