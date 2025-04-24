import { FaqSection } from "@/components/faq-section";
import PathTracker from "@/Shared/PathTracker";

const page = () => {
  return (
    <div className="mt-28 container">

      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className="text-center mt-8">
        <h1 className="text-5xl font-semibold">Frequently Asked Questions</h1>

        <p className="mt-3 text-[#645949]">Have questions? We’re here to help! Below are answers to some of the most common inquiries about registering, bidding, and making purchases on our auction platform.</p>
      </div>

      <FaqSection />

    </div>
  );
};

export default page;
