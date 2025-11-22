import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {MapPin, Clock,Smartphone, TrendingUp } from "lucide-react";

const HomeIntro = () => {
  const features = [
    {
      icon: MapPin,
      title: "Real-Time Availability",
      description: "See available parking spots",
    },
    {
      icon: Smartphone,
      title: "Easy Booking",
      description: "Book your parking spot in seconds from your device",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Access your reserved parking spot anytime, anywhere",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Track your parking history and spending patterns",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Find & Book Parking{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Never waste time
            searching for parking again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/parking">View Parking Spots</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SmartPark?
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the future of parking management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="pt-6">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-primary text-primary-foreground shadow-elevated">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Park Smarter?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Create the account instantly by clicking below
            </p>
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/auth">Create Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomeIntro;