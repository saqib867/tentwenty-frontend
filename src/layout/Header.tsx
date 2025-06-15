import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/button";

export default function Header() {
  const { user, logout } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b fixed top-0 max-w-7xl w-full bg-white dark:bg-background">
      <div className=" flex items-center justify-between h-16">
        {/* Left nav */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold">
            Home
          </Link>

          <Link
            to="/contests"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Contests
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/create-contest"
              className="text-sm hover:text-foreground transition"
            >
              Create Contest
            </Link>
          )}
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="outline" asChild>
                <Link
                  to={
                    user?.role == "admin"
                      ? "/dashboard/leaderboard"
                      : `/dashboard?tab=all-contests`
                  }
                >
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
