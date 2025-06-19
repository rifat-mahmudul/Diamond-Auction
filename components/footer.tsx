import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterCategories from "./footerCategories";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  return (
    <footer
      className={`bg-[#635746] text-white pb-8 ${
        pathname === "/" ? "pt-10" : "-mt-36 pt-52"
      }`}
    >
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Diamond Auctions Logo"
              className="mb-4"
              width={46}
              height={39}
            />
          </Link>
          <p className="text-gray-300 mb-4">
            Join us on social media for exclusive updates, auction previews, and
            special offers!
          </p>
          <div className="flex space-x-4">
            <div className="bg-[#83765b] rounded-full p-2 w-8 h-8 flex items-center justify-center">
              <Link href="">
                <Facebook className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#83765b] rounded-full p-2 w-8 h-8 flex items-center justify-center">
              <Link href="">
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#83765b] rounded-full p-2 w-8 h-8 flex items-center justify-center">
              <Link href="">
                <Twitter className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-[#83765b] rounded-full p-2 w-8 h-8 flex items-center justify-center">
              <Linkedin className="w-4 h-[16px]" />
              <Link href="">
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/auctions">Upcoming Auctions</Link>
            </li>
            <li>
              <Link href="/faq">How to Register</Link>
            </li>
            <li>
              <Link href="/seller-dashboard">Submit Your Item</Link>
            </li>
            <li>
              <Link href="/faq">Bidding Tips & FAQs</Link>
            </li>
            <li>
              <Link href="/contact">Contact Support</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Categories</h3>
          <FooterCategories />
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Contact us</h3>
          <div className="flex items-start gap-2 text-gray-300 mb-2">
            <Mail size={16} className="mt-1" />
            <span>info@diamondauctionsllc.com</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300 mb-2">
            <MapPin size={16} className="mt-1" />
            <span>548 Market Street PMB 830066</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <MapPin size={16} className="mt-1" />
            <span>San Francisco, CA 94104</span>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-600" />

      <div className="flex flex-col md:flex-row justify-between text-xs text-gray-400 max-w-7xl mx-auto px-6 md:px-16">
        <p>© 2025 Agency All rights reserved.</p>
        <div className="space-x-4 pt-2 md:pt-0 lg:pt-0">
          <Link href="/privacypolicy">Privacy Policy</Link>
          <Link href="/Terms&Conditions">Conditions</Link>
          <span>Support</span>
        </div>
      </div>
    </footer>
  );
}
