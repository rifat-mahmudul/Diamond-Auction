"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import "./blogDetails.css";
import { Blog } from "../../_components/type";
import { useParams } from "next/navigation";
import BlogComments from "./blogComments";

interface BlogDetailsProps {
  id?: string; // Optional, since we get it from the URL
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ id }) => {
  // console.log("Blog ID:", id); // Log the blog ID for debugging
  const [blog, setBlog] = useState<Blog | null>(null);
  const params = useParams();
  const blogId = id || (params?.id as string);
  console.log("Blog ID from params:", blogId); // Log the blog ID for debugging

  useEffect(() => {
    if (blogId) {
      fetch(`http://localhost:5100/api/v1/admin/blogs/${blogId}`)
        .then((res) => res.json())
        .then((data) => {
          setBlog(data.data);
        })
        .catch((err) => console.error("Failed to fetch blog:", err));
    }
  }, [blogId]);

  // if (!blog) return <p>Loading...</p>;

  console.log("Fetched blog data:", blog); // Log the fetched blog data for debugging


  return (
    <div>
      <div className="space-y-5 mt-10 mb-10">
        <div className="">
          <h1 className="text-[32px] font-semibold text-black">{blog?.title}</h1>
        </div>
        <div>
          {new Date(blog?.updatedAt ?? '').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>

        <div className="">
          <Image
            src={blog?.image || '/default-image.jpg'}
            alt=""
            width={770}
            height={440}
            className="w-full h-[600px] overflow-hidden rounded-2xl"
          />
        </div>
        <div>
          <p className="text-2xl font-normal text-[#BFBFBF] mt-5">{blog?.content}</p>
        </div>
        <div>
          {blogId && <BlogComments blogId={blogId} />}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;