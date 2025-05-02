<<<<<<< Updated upstream

import HeaderCarousel from "@/components/carousel";
import TabBar from "@/components/tabbar";
import BestDeals from "@/components/best_deals_carousel";
=======
import AdminDashboard from '@/components/admin_dashboard';
// import Image from 'next/image';
>>>>>>> Stashed changes

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div>
      <div className="z-[10]">
        <HeaderCarousel/>
      </div>
      <div className="absolute w-full flex justify-center top-36 z-[20]">
        <div className="bg-slate-100 rounded-lg"> 
          <TabBar />
        </div>
      </div>
      </div>
      <section className="p-9 bg-slate-100">
      <span className="text-xl font-bold ml-2">The best deals are waiting for you</span>
        <BestDeals/>
      </section>
    </div>
  );
}
