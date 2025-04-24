"use client";


import { Calendar, Eye, UserRound } from "lucide-react";
import Image from "next/image";
import React from "react";
import "./blogDetails.css";

interface BlogDetailsProps {
  id?: string; // Optional, since we get it from the URL
}

const BlogDetails: React.FC<BlogDetailsProps> = () => {
  return (
    <div>
      <article className="">
        <div className="overflow-hidden">
          <Image
            src=""
            alt=""
            width={770}
            height={440}
            className="w-full h-[320px] lg:w-[770px] md:h-[440px] lg:h-[440px] rounded-t-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-150 duration-300"
          />
        </div>
        <div className="p-4">
          <h2 className="text-[28px] leading-[33.6px] font-semibold text-gradient dark:text-gradient-pink mb-4">
            {/* {blogData?.title ?? "Blog Title"} */}
          </h2>
          <div className="flex gap-5 flex-wrap text-[#444444] font-[16px] leading-[19.2px] mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-[20px] h-[20px]" />
              <span className="font-[16px] leading-[19.2px]">
                {/* {moment(blogData?.createdAt).format("DD MMM, YYYY")} */}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <UserRound className="w-[20px] h-[20px]" />
              <span className="font-[16px] leading-[19.2px]">
                {/* {blogData?.author ?? "By Admin"} */}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-[20px] h-[20px]" />
              <span className="font-[16px] leading-[19.2px]">
                {/* {blogData?.views ?? 0} Views */}
              </span>
            </div>
          </div>
          <div className="text-[#444444] font-[16px] leading-[19.2px]">
            {/* <div className="list-item list-none" dangerouslySetInnerHTML={{ __html: blogData?.description ?? "Blog Description" }} /> */}
          {/* <div dangerouslySetInnerHTML={{ __html: blogData?.description ?? "Blog Description" }} /> */}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;