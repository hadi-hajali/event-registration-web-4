export interface UpcomingDashboardEvent {
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
  totalActiveCategories: number;
  totalActiveParticipants: number;
  totalUpcomingEvents: number;
  totalActiveRegistrations: number;
  upcomingEvents: UpcomingDashboardEvent[];
}