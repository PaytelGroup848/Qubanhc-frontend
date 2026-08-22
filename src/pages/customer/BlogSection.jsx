import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import blogService from "../services/blog";
import { formatDate } from "../utils/date";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getFeaturedBlogs(3);
        if (response.success) {
          setBlogs(response.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="aspect-[16/10] animate-pulse bg-gray-200" />
              <div className="p-6 space-y-4">
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            QubanHc
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[#25170d] sm:text-4xl">
            Stories & Comfort.
          </h2>
        </div>
        <Link
          to="/blog"
          className="flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-700"
        >
          View all articles
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            to={`/blog/${blog.slug}`}
            className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={blog.featuredImage}
                alt={blog.imageAlt || blog.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                {blog.category}
              </p>
              <h3 className="mt-2 text-xl font-bold text-[#25170d]">
                {blog.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-500 line-clamp-2">
                {blog.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(blog.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {blog.readTime} min read
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
