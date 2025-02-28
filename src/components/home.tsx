import React from "react";
import DashboardLayout from "./Dashboard/DashboardLayout";

const Home: React.FC = () => {
  return (
    <div className="h-screen w-full bg-[#f8f9fa] dark:bg-slate-900">
      <main className="h-full w-full overflow-hidden">
        <DashboardLayout />
      </main>
    </div>
  );
};

export default Home;
