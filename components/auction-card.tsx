// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Heart } from "lucide-react";
// import Link from "next/link";

// interface AuctionCardProps {
//   image: string;
//   title: string;
//   currentBid?: string;
//   timeLeft?: string;
//   badges?: string | undefined;
//   auctionId?: string;
//   startTime : string;
//   endTime : string
// }

// export function AuctionCard({
//   image,
//   title,
//   currentBid,
//   badges,
//   auctionId
// }: AuctionCardProps) {
//   return (
//     <Link href={`/auctions/${auctionId}`}>
//     <Card className="overflow-hidden border-none bg-[#dfc5a2] p-2">
//       <div className="relative aspect-square overflow-hidden rounded-lg">
//         <Image
//           src={image || "/placeholder.svg"}
//           alt={title}
//           width={300}
//           height={300}
//           className="h-full w-full mx-auto object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
//         />
//         {badges && badges.length > 0 && (
//           <div className="absolute left-2 top-2 flex flex-wrap gap-1">
//             <Badge
//               variant="secondary"
//               className="bg-black/50 text-white flex gap-1 items-center"
//             >
//               <Image
//                 src={"/assets/live.png"}
//                 alt="live"
//                 height={10}
//                 width={10}
//               />
//               {badges}
//             </Badge>
//           </div>
//         )}
//         <div className="absolute right-2 top-2 bg-black/50 px-2 py-1 text-xs text-white h-[24px] w-[24px] rounded-full flex flex-col justify-center items-center">
//           <Heart className="h-[20px] w-[20px]" />
//         </div>

//         {/* timer */}
//         <div className=" absolute bottom-2 flex translate-x-2 items-center gap-4 font-semibold text-white">

//           <div>
//             <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
//               20
//             </div>
//             <h1 className="text-center">DAY</h1>
//           </div>

//           :

//           <div>
//             <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
//               20
//             </div>
//             <h1 className="text-center">HR</h1>
//           </div>

//           :

//          <div>
//             <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
//               20
//             </div>
//             <h1 className="text-center">MIN</h1>
//           </div>

//           :

//           <div>
//             <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
//               20
//             </div>
//             <h1 className="text-center">SEC</h1>
//           </div>
          
//         </div>
//       </div>

//       <CardContent className="my-2">
//         <h1 className="text-[#645949]">Round Brilliant</h1>
//         <h3 className="font-medium text-xl my-1">{title}</h3>
//         {currentBid && (
//           <p className="text-sm text-white font-semibold">
//             Current bid: {currentBid}
//           </p>
//         )}
//       </CardContent>
//       <CardFooter>
//         <Button
//           variant="outline"
//           className="w-full bg-[#645949] text-white font-semibold"
//         >
//           Bid now
//         </Button>
//       </CardFooter>
//     </Card></Link>
//   );
// }


"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuctionCardProps {
  image: string;
  title: string;
  currentBid?: string;
  timeLeft?: string;
  badges?: string | undefined;
  auctionId?: string;
  startTime: string; 
  endTime: string; 
}

function calculateTimeLeft(endTime: string) {
  const difference = new Date(endTime).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function AuctionCard({
  image,
  title,
  currentBid,
  badges,
  auctionId,
  endTime,
}: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <Link href={`/auctions/${auctionId}`}>
      <Card className="overflow-hidden border-none bg-[#dfc5a2] p-2">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={300}
            height={300}
            className="h-full w-full mx-auto object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
          />

          {badges && badges.length > 0 && (
            <div className="absolute left-2 top-2 flex flex-wrap gap-1">
              <Badge
                variant="secondary"
                className="bg-black/50 text-white flex gap-1 items-center"
              >
                <Image
                  src={"/assets/live.png"}
                  alt="live"
                  height={10}
                  width={10}
                />
                {badges}
              </Badge>
            </div>
          )}

          <div className="absolute right-2 top-2 bg-black/50 px-2 py-1 text-xs text-white h-[24px] w-[24px] rounded-full flex flex-col justify-center items-center">
            <Heart className="h-[20px] w-[20px]" />
          </div>

          {/* Timer */}
          <div className="absolute bottom-2 flex translate-x-2 items-center gap-4 font-semibold text-white">
            <div>
              <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <h1 className="text-center mt-1">DAY</h1>
            </div>

            :

            <div>
              <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <h1 className="text-center mt-1">HR</h1>
            </div>

            :

            <div>
              <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <h1 className="text-center mt-1">MIN</h1>
            </div>

            :

            <div>
              <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <h1 className="text-center mt-1">SEC</h1>
            </div>
          </div>
        </div>

        <CardContent className="my-2">
          <h1 className="text-[#645949]">Round Brilliant</h1>
          <h3 className="font-medium text-xl my-1">{title}</h3>
          {currentBid && (
            <p className="text-sm text-white font-semibold">
              Current bid: {currentBid}
            </p>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full bg-[#645949] text-white font-semibold"
          >
            Bid now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
