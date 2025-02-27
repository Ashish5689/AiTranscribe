import React from "react";
import DashboardLayout from "./Dashboard/DashboardLayout";

const Home: React.FC = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <main className="h-full w-full overflow-hidden">
        <DashboardLayout />
      </main>
    </div>
  );
};

export default Home;
