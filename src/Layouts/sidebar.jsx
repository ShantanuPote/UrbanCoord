import { Link, useLocation } from "wouter";
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
  Settings
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
  { name: "Projects", href: "/projects", icon: FolderOpen, badge: "12" },
  { name: "Resources", href: "/resources", icon: Package, badge: null },
  { name: "Timeline", href: "/timeline", icon: Calendar, badge: null },
  { name: "Departments", href: "/departments", icon: Building2, badge: null },
  { name: "Communications", href: "/communications", icon: MessageSquare, badge: "5" },
];

const adminNavigation = [
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200 hidden md:block">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              isActive 
                ? "bg-primary text-white" 
                : "text-gray-700 hover:bg-gray-100"
            )}>
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
              {item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "default"}
                  className={cn(
                    "ml-auto",
                    isActive ? "bg-white text-primary" : "bg-primary text-white"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
            Administration
          </p>
          
          {adminNavigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href} className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}