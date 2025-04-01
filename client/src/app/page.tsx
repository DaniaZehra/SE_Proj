import HeaderCarousel from "@/components/carousel";
import CardComponent from "@/components/DynamicExplore";
import Form from 'next/form'
export default function Home() {
  return (
    <div className="header">
      <HeaderCarousel></HeaderCarousel>
      <CardComponent title="Search for Destination" description="Start your next travel destination"
      footer={<button className="">Send</button>}>
        <Form action="/search">
          <input name="query" />
          <button type="submit">Submit</button>
        </Form>
      </CardComponent>
    </div>
  );
}
