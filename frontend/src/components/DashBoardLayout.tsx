import { Navbar } from "./NavBar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#080e1e]">
    <Navbar />
    <main className="pt-16 max-w-7xl mx-auto px-6 py-10">{children}</main>
  </div>
);