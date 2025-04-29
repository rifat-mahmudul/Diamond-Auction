import { FaqSection } from "@/components/faq-section";
import PathTracker from "@/Shared/PathTracker";

const page = () => {
  return (
    <div className="mt-28">

      <div className="container">
        <div className=" border-b border-black pb-5">
          <PathTracker />
        </div>
      </div>

      <div className=" container text-center mt-8">
        <h1 className="text-xl md:text-2xl lg:text-5xl font-semibold">Frequently Asked Questions</h1>

        <div className="max-w-3xl text-center mx-auto mt-5">
          <p className="mt-3  text-[#645949]">Have questions? We’re here to help! Below are answers to some of the most common inquiries about registering, bidding, and making purchases on our auction platform.</p>
        </div>
      </div>

      <div className="mt-[-50px]">
        <FaqSection />
      </div>

    </div>
  );
};

export default page;
