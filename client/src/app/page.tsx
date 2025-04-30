
// import HeaderCarousel from "@/components/carousel";
// import TabBar from "@/components/tabbar";
// import BestDeals from "@/components/best_deals_carousel";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col relative">
//       <section>
//         <div className="z-[9]">
//           <HeaderCarousel/>
//         </div>
//         <div className="w-full flex justify-center top-36 absolute z-[8]">
//           <TabBar/>
//         </div>
//       </section>
//       <section>
//         <BestDeals/>
//       </section>
//     </div>
//   );
// }
import CustomerDashboard from "./customer-dashboard/page";

export default function Home(){
  return (
    <CustomerDashboard/>
  )
}