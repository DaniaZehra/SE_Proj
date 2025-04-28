import DynamicCard from './dealsCard';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function BestDeals(){
    return (
        <div style={{height:'auto'}}>
            <Carousel
                aria-label='Slide-Show for the best deals to offer'
                axis={'horizontal'}
                autoPlay={true}
                infiniteLoop={true}
                showThumbs={true}
                interval={10000}
                centerMode={true}
                centerSlidePercentage={25}
            >
        <div>
            <DynamicCard
                image="placeholder.jpg"
                title="this is an image"
                description='The best of the best'
                imageWidth={400}
                imageHeight={200}
                imageAlt='placeholder image'
            />
        </div>
<div>
    <DynamicCard
        image="placeholder.jpg"
        title="this is an image"
        description='The best of the best'
        imageWidth={400}
        imageHeight={200}
        imageAlt='placeholder image'
    />
</div>      
</Carousel>

</div>
    )

}