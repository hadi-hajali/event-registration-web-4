export interface Event {
  id: number;
  name: string;
  description?: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationDeadline?: string;
  categoryId: number;
  categoryName: string;
  capacity: number;
  activeRegistrationCount: number;
  availableSeats: number;
  eventStatus?: "Upcoming" | "Ongoing" | "Completed";
  isActive: boolean;
}

export interface EventListItem {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  location: string;
  startAt: string;
  endAt: string;
  capacity: number;
  activeRegistrationCount: number;
  availableSeats: number;
  eventStatus: "Upcoming" | "Ongoing" | "Completed";
  isActive: boolean;
}

export interface EventFormValues {
  categoryId: number;
  name: string;
  description?: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationDeadline: string;
  capacity: number;
  isActive: boolean;
}
