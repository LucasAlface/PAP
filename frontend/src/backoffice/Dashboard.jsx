import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="dashboard-screen">
      <div className="dashboard-heading">
        <div className="dashboard-icon">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h2>Dashboard</h2>
        </div>
      </div>
    </section>
  );
}
