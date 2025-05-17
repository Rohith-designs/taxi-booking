
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBooking } from "../contexts/BookingContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getBookingById, assignDriver } = useBooking();
  const navigate = useNavigate();
  
  const [countdown, setCountdown] = useState(15); // Reduced from 60 to 15 seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const driverAssignedRef = useRef(false);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (!id) {
      navigate("/dashboard");
      return;
    }
    
    const booking = getBookingById(id);
    if (!booking) {
      navigate("/dashboard");
      return;
    }

    // If the booking already has a driver assigned, don't start the timer
    if (booking.status === 'confirmed' && booking.driver) {
      driverAssignedRef.current = true;
      return;
    }
    
    // For demo purposes, auto-assign a driver after the countdown
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Only assign a driver if one hasn't been assigned already
          if (!driverAssignedRef.current) {
            driverAssignedRef.current = true;
            assignDriver(id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [id, user, navigate, getBookingById, assignDriver]);
  
  const booking = id ? getBookingById(id) : null;
  
  if (!booking) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Booking Confirmed</CardTitle>
          <CardDescription>
            Your booking has been confirmed and is being processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Pickup Location</div>
              <div className="font-medium">{booking.pickup}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Drop-off Location</div>
              <div className="font-medium">{booking.dropoff}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Time</div>
                <div className="font-medium">{booking.time}</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-center py-4">
              {booking.status === 'pending' ? (
                <div>
                  <p className="mb-2">Waiting for driver assignment...</p>
                  <p className="text-sm text-muted-foreground">This usually takes a few moments</p>
                  
                  {/* Demo countdown */}
                  {countdown > 0 && (
                    <div className="mt-4">
                      <div className="inline-block px-3 py-1 bg-secondary/30 rounded-full text-sm">
                        Auto-assigning driver in {countdown} seconds
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium text-green-600 mb-2">Driver has been assigned!</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.driver?.name} will arrive in a {booking.driver?.vehicle.color} {booking.driver?.vehicle.make} {booking.driver?.vehicle.model}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    License Plate: {booking.driver?.vehicle.licensePlate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
