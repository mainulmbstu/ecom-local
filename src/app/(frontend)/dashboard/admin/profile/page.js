import Profile from "@/app/(frontend)/dashboard/admin/profile/Profile";

export const metadata = {
  title: "Profile",
  description: "Admin Dashboard page",
};

const AdminDashboard = () => {
  return (
    <div className="">
      <Profile />
    </div>
  );
};

export default AdminDashboard;
