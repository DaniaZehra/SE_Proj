import TabBar from "@/components/tabbar";
import BestDeals from "@/components/best_deals_carousel";
import HeaderCarousel from "@/components/ui/carousel";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="z-[10]">
        <HeaderCarousel/>
      </div>
      <div className="w-full flex justify-center my-8 z-[20]">
        <div className="bg-slate-100 rounded-lg shadow-lg p-6">
          <Suspense fallback={<div>Loading search...</div>}>
            <TabBar />
          </Suspense>
        </div>
      </div>
      <section className="p-9 bg-slate-100">
      <span className="text-xl font-bold ml-2">The best deals are waiting for you</span>
        <BestDeals/>
      </section>
    </div>
  );
}
