import { NavLink, useLocation } from "react-router-dom";
import { Home, Briefcase, Users, CreditCard, BarChart } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Job Management", icon: Briefcase, path: "/jobs" },
    { name: "User Management", icon: Users, path: "/users" },
    { name: "Payments", icon: CreditCard, path: "/payments" },
    { name: "Payouts", icon: CreditCard, path: "/payouts" },
    { name: "Reports", icon: BarChart, path: "/reports" },
  ];
  
  return (
    <aside className="w-64 bg-gray-900 flex flex-col p-6">
      <h1 className="text-xl font-bold mb-8">Dispatch Panel</h1>
      <nav className="flex-1 text-xl" style={{ overflowY: "auto" }}>
        <ul className="space-y-4"> {/* Increased space-y value */}
          {menuItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={`grid grid-cols-3 grid-rows-5 items-stretch gap-2 p-4 rounded-md transition duration-700 ${
                location.pathname === path ? "bg-secondary opacity-15 transition duration-800 text-white" : "text-muted-foreground hover:bg-gray-800"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm">{name}</span>
            </NavLink>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
