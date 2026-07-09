import { apiClient } from "../client";


export interface UpcomingEvent {
  id: number;
  name: string;
  categoryName: string;
  startAt: string;
  location: string;
  capacity: number;
  activeRegistrationCount: number;
  availableSeats: number;
}


export interface DashboardSummary {

  activeCategories: number;

  activeParticipants: number;

  activeRegistrations: number;

  upcomingEventsCount: number;

  upcomingEvents: UpcomingEvent[];

}



export const getDashboardSummary = () => {

  return apiClient.get<DashboardSummary>(
    "/dashboard/summary"
  );

};