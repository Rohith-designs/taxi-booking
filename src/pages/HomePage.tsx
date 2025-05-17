
import { useAuth } from "../contexts/AuthContext";
import BookingForm from "../components/BookingForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="taxi-container py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Get a taxi in <span className="text-primary">minutes</span>, not hours
            </h1>
            <p className="text-lg text-muted-foreground">
              Book your ride with ease and enjoy a comfortable journey to your destination. 
              Our drivers are professional and our vehicles are well-maintained.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto btn-accent">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {user ? (
            <BookingForm />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-md text-sm">
                FAST & RELIABLE
              </div>
              <div className="aspect-[4/3] rounded-lg bg-muted flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                  alt="Taxi cab"
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted rounded">
                  <div className="font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">Service</div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-bold">5 min</div>
                  <div className="text-sm text-muted-foreground">Avg. Wait</div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-bold">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="font-bold">100+</div>
                  <div className="text-sm text-muted-foreground">Vehicles</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-10">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-accent rounded-full text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-bold mb-2">Book Your Ride</h3>
              <p className="text-muted-foreground">Enter your pickup and drop-off locations along with your preferred date and time.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-accent rounded-full text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-bold mb-2">Get a Driver</h3>
              <p className="text-muted-foreground">We'll assign a professional driver and notify you when they're on their way.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-accent rounded-full text-accent-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-bold mb-2">Enjoy Your Trip</h3>
              <p className="text-muted-foreground">Relax and enjoy your journey with our comfortable vehicles and professional service.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
