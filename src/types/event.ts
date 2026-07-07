export interface Event {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationDeadline: string;
  capacity: number;
  activeRegistrationCount: number;
  availableSeats: number;
  eventStatus: "Upcoming" | "Ongoing" | "Completed";
  isActive: boolean;
}