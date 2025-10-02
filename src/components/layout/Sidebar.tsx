import { SidebarNav } from "./SidebarNav";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-sidebar sticky top-16">
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
      
      {/* Footer sidebar */}
      <div className="border-t p-4">
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="h-4 w-4" />
          <span>Fait avec ❤️ au Gabon</span>
        </Link>
      </div>
    </aside>
  );
};
