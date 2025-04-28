'use client';

import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


export default function HeaderCarousel() {
  return (
    <div style = {{height:'auto'}}>
        <Carousel
            aria-label='Slide-Show featuring a Man Skiing and a Waterfall'
            axis={'horizontal'}
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            interval={10000}
            centerMode={true}
            centerSlidePercentage={50}
        >
        <div>
            <Image 
            src={'/header_slideshow.png'} 
            alt="Man skiing"
            width={1200} 
            height={600}
            priority 
            />
        </div>

        <div>
        <Image 
            src={'/nature-1207955.jpg'} 
            alt="Waterfall"
            width={1200}
            height={600}
            />
        </div>
        <div>
        <Image
            src={'/pexels-baphi-1255061.jpg'}
            alt = "Friends having fun"
            width={1200}
            height={600}
        />
        </div>
        {/* <div>
        <Image
            src={'/pexels-cahilrom-2088282.jpg'}
            alt= "Woman on a surf-board on a sea"
            width={1200}
            height={600}
        />
        </div> */}
        <div>
        <Image
            src={'/pexels-tobiasbjorkli-2104152.jpg'}
            alt= "IceBerg fun"
            width={1200}
            height={600}
        />
        </div>
        </Carousel>
    </div>
  );
}