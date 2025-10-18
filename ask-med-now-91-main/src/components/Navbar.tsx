import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to={isAuthenticated ? (user?.role === 'doctor' ? '/doctor/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-card">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Med-AI</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'doctor' ? (
                <>
                  <Link to="/doctor/dashboard">
                    <Button variant="ghost">მთავარი</Button>
                  </Link>
                  <Link to="/doctor/calendar">
                    <Button variant="ghost">კალენდარი</Button>
                  </Link>
                  <Link to="/doctor/patients">
                    <Button variant="ghost">პაციენტები</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost">მთავარი</Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="ghost">AI ჩატი</Button>
                  </Link>
                  <Link to="/doctors">
                    <Button variant="ghost">ექიმები</Button>
                  </Link>
                  <Link to="/feedback">
                    <Button variant="ghost">უკუკავშირი</Button>
                  </Link>
                </>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                გამოსვლა
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">შესვლა</Button>
              </Link>
              <Link to="/register">
                <Button variant="default">დაწყება</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
