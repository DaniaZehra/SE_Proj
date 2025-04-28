'use client'
import DynamicCard from './dealsCard';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function BestDeals() {
  const deals = [
    {
      image: '/placeholder.jpg',
      title: "Deal 1",
      description: 'The best of the best',
    },
    {
      image: '/placeholder.jpg',
      title: "Deal 2",
      description: 'Another great deal',
    },
  ];

  return (
    <div style={{ height: 'auto' }}>
      <Carousel
        infiniteLoop
        centerMode
        centerSlidePercentage={30}
      >
        {deals.map((deal, index) => (
          <div key={index}>
            <DynamicCard
              image={deal.image}
              title={deal.title}
              description={deal.description}
              imageWidth={400}
              imageHeight={200}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}