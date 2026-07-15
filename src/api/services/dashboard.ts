import { apiClient } from "../client";

export interface UpcomingEvent {
  id: number;
  title: string;
  categoryName: string;
  startDate: string;
  location: string;
  capacity: number;
  registeredCount: number;
}

export interface DashboardSummary {
  totalActiveCategories: number;
  totalActiveEvents: number;
  totalActiveParticipants: number;
  totalActiveRegistrations: number;
  upcomingEvents: UpcomingEvent[];
}

export const getDashboardSummary = () => {
  return apiClient.get<DashboardSummary>("/api/dashboard/summary");
};