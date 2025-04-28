import HeaderCarousel from "@/components/carousel";
import TabBar from "@/components/tabbar";
import DynamicCard from "@/components/dealsCard";
//import BestDeals from "@/components/best_deals_carousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <section>
        <div className="z-[9]">
          <HeaderCarousel/>
        </div>
        <div className="w-full flex justify-center top-20 absolute z-[8]">
          <TabBar/>
        </div>
      </section>
      <section>
        <DynamicCard
          image="placeholder.jpg"
          title="this is an image"
          description='The best of the best'
          imageWidth={400}
          imageHeight={200}
          imageAlt='placeholder image'
          />
      </section>
    </div>
  );
}
