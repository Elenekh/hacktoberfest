import { Card } from "@/components/ui/card";
import { MessageSquare, Users, FileText, Calendar, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "ისაუბრე AI-სთან",
      description: "აღწერეთ თქვენი სიმპტომები და მიიღეთ პერსონალიზებული ექიმის რეკომენდაცია",
      icon: MessageSquare,
      path: "/chat",
      gradient: "from-primary to-primary/80",
    },
    {
      title: "ექიმები",
      description: "აღმოაჩინეთ და დაჯავშნეთ შეხვედრა საუკეთესო ექიმებთან",
      icon: Users,
      path: "/doctors",
      gradient: "from-primary to-primary/80",
    },
    {
      title: "ანალიზის შედეგების ნახვა",
      description: "შეამოწმეთ და გაიგეთ თქვენი სამედიცინო ანალიზების შედეგები",
      icon: FileText,
      path: "/results",
      gradient: "from-primary to-primary/80",
    },
    {
      title: "ჩემი ჯავშნები",
      description: "გაიგეთ და მართეთ თქვენი მომავალი შეხვედრები",
      icon: Calendar,
      path: "/appointments",
      gradient: "from-primary to-primary/80",
    },
    {
      title: "ექიმის უკუკავშირი",
      description: "ნახეთ ექიმის უკუკავშირი და რეკომენდაციები თქვენი ჯანმრთელობის შესახებ",
      icon: MessageCircle,
      path: "/feedback",
      gradient: "from-primary to-primary/80",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="mb-12 text-center animate-fade-up">
          <h3 className="mb-3 text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            შენი პერსონალიზებული სამედიცინო ასისტენტი
          </h3>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto">
          {/* First row - 3 cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {cards.slice(0, 3).map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className="group cursor-pointer bg-gradient-card p-8 shadow-card hover:shadow-glow border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 relative overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="mb-6 flex items-start justify-between">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="p-2 rounded-full bg-background/50 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
            {cards.slice(3).map((card, index) => {
              const Icon = card.icon;
              return (
                <Card
                  key={card.title}
                  onClick={() => navigate(card.path)}
                  className="group cursor-pointer bg-gradient-card p-8 shadow-card hover:shadow-glow border border-border/50 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 relative overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="mb-6 flex items-start justify-between">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110`}>
                        <Icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="p-2 rounded-full bg-background/50 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 translate-x-2">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
      </div>
    </div>
  );
};

export default Dashboard;
