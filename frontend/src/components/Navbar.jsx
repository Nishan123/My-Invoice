import { Bell, User } from "lucide-react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav className="h-16 bg-gray-900 border-b border-gray-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-100">My-Invoice Console</h1>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-800">
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-200">{user.name || "User"}</p>
            <p className="text-gray-400">{user.email || "user@example.com"}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
