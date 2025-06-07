import Image from "next/image";

const OurVision = () => {
  return (
    <section className="mt-24">
      <div className="flex flex-col md:flex-row items-center gap-10 justify-between">
        {/* Image Section */}
        <div className="flex-1 flex justify-start">
          <Image
            src="/assets/vision.png"
            alt="Auction speaker"
            height={550}
            width={470}
            className="rounded-xl "
          />
        </div>

        {/* Text Section */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black text-start">
            Our Vision
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            At Diamond Auctions, our vision is to redefine the auction experience by bringing transparency, excitement, and accessibility to buyers and sellers around the world. We are committed to curating high-quality, unique items and creating a trusted platform where collectors, investors, and enthusiasts can connect. Whether it&apos;s fine jewelry, rare collectibles, or valuable art, our goal is to offer an exceptional selection that inspires confidence and delivers lasting value. <br /> <br />
            We envision a future where Diamond Auctions leads the industry in innovation and customer satisfaction. By combining cutting-edge technology with personalized service, we aim to make every auction seamless, secure, and rewarding. Our vision extends beyond transactions—we strive to build a vibrant, engaged community where every bidder and consignor feels valued, supported, and part of something extraordinary.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurVision;
