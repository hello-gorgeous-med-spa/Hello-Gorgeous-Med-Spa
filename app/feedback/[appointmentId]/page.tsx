'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getReviewAction, getGoogleReviewUrl, DEFAULT_REVIEW_BOOST_CONFIG } from '@/lib/hgos/review-boost';

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;

  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    
    setLoading(true);
    
    try {
      // Submit feedback to API
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          rating,
          comment,
          submittedAt: new Date().toISOString(),
        }),
      });

      const action = getReviewAction(rating);
      
      if (action.action === 'redirect_google') {
        setShowGooglePrompt(true);
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleReview = () => {
    window.open(getGoogleReviewUrl(), '_blank');
  };

  // Thank you screen after submission
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          {showGooglePrompt ? (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⭐</span>
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Thank You!</h1>
              <p className="text-black mb-6">
                We're so happy you had a great experience! Would you mind sharing 
                your feedback on Google? It helps others find us.
              </p>
              <button
                onClick={handleGoogleReview}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Leave a Google Review
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-black hover:text-black text-sm"
              >
                No thanks, maybe later
              </button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💝</span>
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">Thank You!</h1>
              <p className="text-black mb-6">
                We appreciate you taking the time to share your feedback. 
                Your input helps us improve our services.
              </p>
              {rating && rating <= 2 && (
                <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-sm text-amber-800">
                    We're sorry your experience wasn't perfect. Our team will 
                    reach out to you shortly to make things right.
                  </p>
                </div>
              )}
              <button
                onClick={() => router.push('/')}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Return to Hello Gorgeous
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Feedback form
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">💎</span>
          <h1 className="text-2xl font-bold text-black mb-2">
            How was your visit?
          </h1>
          <p className="text-black">
            Your feedback helps us provide the best experience
          </p>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4 text-center">
            Rate your experience
          </h2>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                className="p-2 transition-transform hover:scale-110"
              >
                <span
                  className={`text-4xl transition-colors ${
                    star <= (hoveredRating || rating || 0)
                      ? 'text-yellow-400'
                      : 'text-black'
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          {/* Rating Label */}
          {rating && (
            <p className="text-center text-black mb-6">
              {rating === 5 && '🌟 Excellent! We\'re thrilled!'}
              {rating === 4 && '😊 Great! Thanks for the feedback!'}
              {rating === 3 && '👍 Good, but we can do better'}
              {rating === 2 && '😕 We\'re sorry to hear that'}
              {rating === 1 && '😢 We apologize for your experience'}
            </p>
          )}

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Tell us more (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you love? What could we improve?"
              rows={4}
              className="w-full px-4 py-3 border border-black rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E] resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!rating || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-black">
          Hello Gorgeous Med Spa • (630) 636-6193
        </p>
      </div>
    </div>
  );
}
