"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Check, MessageSquare } from "lucide-react";
import { Review } from "@/types/marketplace";
import { mockDb } from "@/lib/data/mockDb";

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
  rating: number;
  reviewCount: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  initialReviews,
  rating,
  reviewCount,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !comment || !userName) return;

    const added = mockDb.addReview({
      product_id: productId,
      rating: newRating,
      title,
      comment,
      user_name: userName,
      user_location: userLocation || "Kampala, Uganda",
      is_verified_purchase: true,
    });

    setReviews([added, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setIsFormOpen(false);
      setSubmitted(false);
      setTitle("");
      setComment("");
    }, 2000);
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Customer Reviews & Ratings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Verified feedback from customers across Uganda
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <MessageSquare size={14} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:text-left sm:border-r sm:border-gray-200 sm:pr-8">
          <div className="text-4xl font-black text-gray-900 leading-none">
            {rating}
          </div>
          <div className="flex items-center gap-1 my-1.5 justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500">Based on {reviewCount} ratings</p>
        </div>

        <div className="flex-1 w-full space-y-1.5 text-xs">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = s === 5 ? Math.round(reviewCount * 0.8) : s === 4 ? Math.round(reviewCount * 0.15) : 1;
            const pct = Math.round((count / Math.max(1, reviewCount)) * 100);
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="w-12 text-gray-600 font-medium">{s} Stars</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-gray-400 font-mono">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form Modal / Box */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 mb-8">
          <h4 className="font-bold text-sm text-gray-900 mb-3">Share your authentic experience</h4>
          {submitted ? (
            <div className="p-4 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-2">
              <Check size={16} /> Thank you! Your review has been published.
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Your Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        size={22}
                        className={star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christine Namugga"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">District / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Bugolobi, Kampala"
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent Ugandan quality, will buy again"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Detailed Review</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell others what you think about the product quality, packaging, and delivery..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 font-bold"
                >
                  Post Review
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {rev.user_name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">{rev.user_name}</h5>
                    <p className="text-[10px] text-gray-400">{rev.user_location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={12}
                      className={s <= rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 my-1">
                <span className="font-bold text-xs text-gray-900">{rev.title}</span>
                {rev.is_verified_purchase && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                    <ShieldCheck size={11} /> Verified Buyer
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 py-4">No reviews yet. Be the first to leave a review!</p>
        )}
      </div>
    </div>
  );
};
