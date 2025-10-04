import { Activity, ShieldCheck, UserPlus, Users } from "lucide-react";
import Kpi from "@/components/common/Kpi";

const Kpis = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Kpi
        title="Total Users"
        icon={<Users className="h-4 w-4" />}
        value="12,000"
        change="+5% than last month"
        tooltipContent="Total number of users in the system"
      />
      <Kpi
        title="New Users"
        icon={<UserPlus className="h-4 w-4" />}
        value="+350"
        change="+10% vs last month"
        tooltipContent="New users registered in the last month"
      />
      <Kpi
        title="Pending Verifications"
        icon={<ShieldCheck className="h-4 w-4" />}
        value="42"
        change="2% of users"
        tooltipContent="Users who have not verified their email address"
      />
      <Kpi
        title="Active Users"
        icon={<Activity className="h-4 w-4" />}
        value="7800"
        change="65% of all users"
        tooltipContent="Active users in the system"
      />
    </div>
  );
};

export default Kpis;
