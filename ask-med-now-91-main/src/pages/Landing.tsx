import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users, Calendar, FileText, Sparkles, Shield, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

const Landing = () => {

  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Chat",
      description: "Describe your symptoms and get instant recommendations on which specialist to visit.",
    },
    {
      icon: Users,
      title: "Find Specialists",
      description: "Connect with qualified doctors based on your symptoms and insurance coverage.",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule appointments and pay in advance for a seamless healthcare experience.",
    },
    {
      icon: FileText,
      title: "Smart Results",
      description: "Get AI-powered explanations of your test results in simple, understandable terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section with Background Glow */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        {/* Animated background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-glow opacity-60 animate-pulse-glow pointer-events-none" />
        
        <div className="mx-auto max-w-4xl text-center relative">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-up shadow-glow">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium bg-gradient-hero bg-clip-text text-transparent">
              AI-Powered Healthcare Platform
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl lg:text-7xl animate-fade-up [animation-delay:100ms]">
            Find the Right Doctor,
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent inline-block animate-fade-up [animation-delay:200ms]">
              Faster & Smarter
            </span>
          </h1>
          
          <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-up [animation-delay:300ms]">
            Our AI-powered platform helps you identify which specialist you need based on your symptoms,
            then connects you with qualified doctors covered by your insurance.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mb-12 animate-fade-up [animation-delay:400ms]">
            <Link to="/register">
              <Button variant="hero" size="xl" className="shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105">
                <Zap className="h-5 w-5 mr-2" />
                Sign Up Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl" className="hover:scale-105 transition-all duration-300">
                Login
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-up [animation-delay:500ms]">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>10k+ Users</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative border-t border-border bg-muted/30 py-20 overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-accent rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-hero rounded-full blur-3xl opacity-20 animate-float [animation-delay:2s]" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Simple Process</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              How It Works
            </h2>
          </div>
          
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="group relative bg-gradient-card p-6 shadow-card transition-all duration-300 hover:shadow-glow hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 rounded-lg transition-opacity duration-300" />
                  
                  <div className="relative">
                    {/* Icon with animation */}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                      <feature.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-accent text-white text-sm font-bold shadow-md">
                      {index + 1}
                    </div>
                    
                    <h3 className="mb-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-glow opacity-40" />
        
        <div className="mx-auto max-w-4xl text-center relative">
          {/* CTA Card */}
          <div className="relative rounded-3xl bg-gradient-hero p-1 shadow-glow-lg animate-fade-up">
            <div className="rounded-3xl bg-background/95 backdrop-blur-sm p-12 md:p-16">
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Join Our Community</span>
              </div>
              
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl lg:text-6xl">
                Ready to Take Control of{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Your Health?
                </span>
              </h2>
              
              <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Join thousands of users who trust Med-AI to find the right care, faster and smarter.
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link to="/register">
                  <Button variant="hero" size="xl" className="shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105">
                    <Zap className="h-5 w-5 mr-2" />
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="xl" className="hover:scale-105 transition-all duration-300">
                    Login
                  </Button>
                </Link>
              </div>
              
              {/* Social proof */}
              <div className="mt-10 flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">10k+</div>
                  <div className="text-muted-foreground">Active Users</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">50k+</div>
                  <div className="text-muted-foreground">Appointments</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">98%</div>
                  <div className="text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
