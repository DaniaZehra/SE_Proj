
import HeaderCarousel from "@/components/carousel";
import TabBar from "@/components/tabbar";
import BestDeals from "@/components/best_deals_carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div>
      <div className="z-[10]">
        <HeaderCarousel/>
      </div>
      <div className="absolute w-full flex justify-center top-36 z-[20]">
        <div className="bg-slate-50 rounded-lg"> 
          <TabBar />
        </div>
      </div>
      </div>
      <section>
        <BestDeals/>
      </section>
    </div>
  );
}
