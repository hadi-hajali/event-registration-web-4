export type Event = {
  id: number;
  name: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  categoryId: number;
  categoryName: string;
  capacity: number;
  activeRegistrationCount: number;
  availableSeats: number;
  isActive: boolean;
};
export type EventListItem = {
  id: number;
  name: string;
  categoryName: string;
  location: string;
  startAt: string;
  endAt: string;
  capacity: number;
  availableSeats: number;
  isActive: boolean;
};
