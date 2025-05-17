
import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// Define the shape of our booking object
export interface Booking {
  id: string;
  userId: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  driver?: {
    name: string;
    phone: string;
    rating: number;
    vehicle: {
      make: string;
      model: string;
      color: string;
      licensePlate: string;
    };
  };
  createdAt: string;
}

// Define the shape of our booking context
interface BookingContextType {
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, "id" | "userId" | "status" | "createdAt">) => Promise<Booking>;
  getBookingById: (id: string) => Booking | undefined;
  getCurrentBookings: () => Booking[];
  getPastBookings: () => Booking[];
  assignDriver: (bookingId: string) => void;
}

// Create the booking context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Mock driver data for demonstration
const MOCK_DRIVERS = [
  {
    name: "Michael Smith",
    phone: "+1 (555) 123-4567",
    rating: 4.8,
    vehicle: {
      make: "Toyota",
      model: "Camry",
      color: "Silver",
      licensePlate: "ABC 1234"
    }
  },
  {
    name: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    rating: 4.9,
    vehicle: {
      make: "Honda",
      model: "Accord",
      color: "Black",
      licensePlate: "XYZ 7890"
    }
  }
];

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user } = useAuth();

  const createBooking = async (bookingData: Omit<Booking, "id" | "userId" | "status" | "createdAt">): Promise<Booking> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!user) {
      throw new Error("User must be logged in to create a booking");
    }
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      userId: user.id,
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const getBookingById = (id: string) => {
    return bookings.find(b => b.id === id);
  };

  const getCurrentBookings = () => {
    if (!user) return [];
    return bookings.filter(b => 
      b.userId === user.id && 
      (b.status === "pending" || b.status === "confirmed")
    );
  };

  const getPastBookings = () => {
    if (!user) return [];
    return bookings.filter(b => 
      b.userId === user.id && 
      (b.status === "completed" || b.status === "cancelled")
    );
  };

  const assignDriver = (bookingId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        // Pick a random driver from our mock data
        const driver = MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)];
        
        toast.success("A driver has been assigned to your booking!");
        
        return {
          ...booking,
          status: "confirmed" as const,
          driver
        };
      }
      return booking;
    }));
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      createBooking, 
      getBookingById, 
      getCurrentBookings, 
      getPastBookings,
      assignDriver
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
