import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  Calendar,
  Building2,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen, badge: null },
  { name: "Resources", href: "/admin/resources", icon: Package, badge: null },
  { name: "Timeline", href: "/admin/timeline", icon: Calendar, badge: null },
  { name: "Departments", href: "/admin/departments", icon: Building2, badge: null },
  { name: "Communications", href: "/admin/communications", icon: MessageSquare, badge: null },
];

const adminNavigation = [
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200 hidden md:block">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out",
                isActive 
                  ? "bg-primary text-gray-900 shadow-sm hover:bg-primary/90" 
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
            {item.badge && (
              <Badge
                variant="secondary"
                className="ml-auto"
              >
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
            Administration
          </p>
          {adminNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out",
                  isActive 
                    ? "bg-primary text-gray-900 shadow-sm hover:bg-primary/90" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}
