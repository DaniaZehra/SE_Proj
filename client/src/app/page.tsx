import AdminDashboard from "@/components/admin_dashboard";
import DriverDashboard from "@/components/driver_dashboard";
import PropertyOwnerDashboard from "@/components/property_dashboard";

export default function Home() {
  return (
    <>
      <AdminDashboard />
      <DriverDashboard />
      <PropertyOwnerDashboard />
    </>
  );
}
