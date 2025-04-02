import AdminDashboard from '@/components/admin_dashboard';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="header">
      {/* <Image src="/header_slideshow.png" // Ensure it's inside the 'public' folder alt="Nature image" width={800} height={400} priority /> */}
      <AdminDashboard/>
    </div>
  );
}
