import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import blogService from "../../services/blog";

const BlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);

        // Log the slug from URL params
        console.log("Blog slug from URL params:", slug);

        if (!slug) {
          console.error("No slug provided in URL");
          setError("Blog slug is missing");
          setLoading(false);
          return;
        }

        console.log("Fetching blog with slug:", slug);
        const response = await blogService.getBlogBySlug(slug);
        console.log("Blog response:", response);

        if (response.success && response.data) {
          setBlog(response.data);
          setError(null);
        } else {
          setError(response.message || "Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-8 h-12 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="mt-8 h-[400px] animate-pulse rounded bg-gray-200" />
          <div className="mt-8 space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600">Blog not found</h1>
          <p className="mt-2 text-gray-500">
            {error || "The blog you are looking for does not exist."}
          </p>
          {slug && <p className="mt-2 text-sm text-gray-400">Slug: {slug}</p>}
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Back button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        {/* Header */}
        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              {blog.category}
            </span>
            {blog.isFeatured && (
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            {blog.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            {blog.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {typeof blog.author === "object" ? blog.author.name : "Unknown"}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {console.log("this is time", blog.publishedAt)}
              {formatDateTime(blog.publishedAt)}
            </div>
            {/* <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {blog.readTime} min read
            </div> */}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              {blog.tags.map((tag) => (
                <span key={tag} className="text-sm text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        <div className="mt-8 overflow-hidden rounded-lg">
          <img
            src={blog.featuredImage}
            alt={blog.imageAlt || blog.title}
            className="w-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", blog.featuredImage);
              e.target.src = "/images/placeholder.jpg";
            }}
          />
        </div>

        {/* Content */}
        <div className="mt-8 prose prose-lg max-w-none">
          {blog.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Published on {formatDateTime(blog.publishedAt)}
              </p>
              {blog.views > 0 && (
                <p className="text-sm text-gray-500">{blog.views} views</p>
              )}
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-green-800 px-6 py-2 text-sm font-semibold text-white hover:bg-green-900"
            >
              Back to Blogs <ArrowRight />
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPage;
