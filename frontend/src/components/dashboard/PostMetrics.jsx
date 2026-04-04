import React from 'react';
import { Calendar, ThumbsUp, MessageSquare, Share2, FileText } from 'lucide-react';

const PostsMetrics = () => {
  const posts = [
    {
      id: 'post-62',
      date: 'Apr 04, 2026 09:43',
      content: 'Customer appreciation post! Thank you all for your continued support. ❤️',
      reactions: 90,
      comments: 78,
      shares: 17,
    },
    {
      id: 'post-61',
      date: 'Apr 03, 2026 09:43',
      content: 'Behind the scenes of our latest project. The team has been working incredibly hard!',
      reactions: 168,
      comments: 51,
      shares: 44,
    },
    {
      id: 'post-58',
      date: 'Apr 02, 2026 09:43',
      content: "Sneak peek of what we're working on next. Stay tuned!",
      reactions: 442,
      comments: 45,
      shares: 42,
    },
    {
      id: 'post-59',
      date: 'Apr 02, 2026 09:43',
      content: 'Inspirational quote of the day to kickstart your week!',
      reactions: 548,
      comments: 46,
      shares: 29,
    },
    {
      id: 'post-60',
      date: 'Apr 02, 2026 09:43',
      content: 'Excited to announce our new product launch! 🚀 Check it out and let us know what you think!',
      reactions: 320,
      comments: 89,
      shares: 56,
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <FileText size={28} className="text-cyan-300" />
          <h2 className="text-2xl font-bold">Posts & Metrics</h2>
        </div>
        <p className="text-indigo-100 max-w-2xl">
          View and analyze individual Facebook posts, including engagement metrics such as reactions, comments, and shares.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Posts Overview
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            62 posts retrieved (FR-03, FR-04)
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition"
            >

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>

                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border border-gray-200">
                  {post.id}
                </span>
              </div>

              <p className="text-gray-800 text-sm mb-4 leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center gap-6 text-gray-500 text-xs font-medium">

                <div className="flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer">
                  <ThumbsUp size={16} />
                  {post.reactions}
                </div>

                <div className="flex items-center gap-1.5 hover:text-green-600 transition cursor-pointer">
                  <MessageSquare size={16} />
                  {post.comments}
                </div>

                <div className="flex items-center gap-1.5 hover:text-amber-600 transition cursor-pointer">
                  <Share2 size={16} />
                  {post.shares}
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default PostsMetrics;