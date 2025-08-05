import { Link, useLocation } from "wouter";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Package, 
  MessageSquare
} from "lucide-react";

const mobileNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Resources", href: "/resources", icon: Package },
  { name: "Messages", href: "/communications", icon: MessageSquare, badge: "5" },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {mobileNavigation.map((item) => {
          const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
          return (
            <Link key={item.name} href={item.href} className={cn(
              "flex flex-col items-center py-2 px-3 relative",
              isActive ? "text-primary" : "text-gray-600"
            )}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
              {item.badge && (
                <Badge 
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}