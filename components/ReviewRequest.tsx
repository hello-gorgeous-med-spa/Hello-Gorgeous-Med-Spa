'use client';

// ============================================================
// REVIEW REQUEST COMPONENT
// Prompt clients to leave a review after their appointment
// ============================================================

import { useState } from 'react';

interface ReviewRequestProps {
  clientName: string;
  serviceName: string;
  providerName: string;
  appointmentDate: string;
  googleReviewUrl?: string;
}

export function ReviewRequest({
  clientName,
  serviceName,
  providerName,
  appointmentDate,
  googleReviewUrl = 'https://g.page/r/CYQOWmT_HcwQEBM/review',
}: ReviewRequestProps) {
  const [dismissed, setDismissed] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  if (dismissed) {
    return null;
  }

  const handleRatingClick = (stars: number) => {
    setRating(stars);
    if (stars >= 4) {
      // Redirect to Google review
      window.open(googleReviewUrl, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 p-6">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 text-black hover:text-black"
      >
        ×
      </button>

      <div className="text-center">
        <span className="text-4xl mb-4 block">💕</span>
        <h3 className="text-lg font-semibold text-black mb-2">
          How was your {serviceName}?
        </h3>
        <p className="text-black mb-4">
          Hi {clientName.split(' ')[0]}! We hope you loved your treatment with {providerName}.
        </p>

        {!rating ? (
          <>
            <p className="text-sm text-black mb-3">Tap a star to rate your experience</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => handleRatingClick(stars)}
                  className="text-3xl hover:scale-110 transition-transform"
                >
                  ⭐
                </button>
              ))}
            </div>
          </>
        ) : rating >= 4 ? (
          <div className="bg-white rounded-lg p-4">
            <p className="text-green-600 font-medium mb-2">Thank you! 🎉</p>
            <p className="text-black text-sm mb-4">
              We're so glad you had a great experience! Your feedback on Google helps others 
              discover Hello Gorgeous.
            </p>
            <a
              href={googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
            >
              Leave a Google Review
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4">
            <p className="text-black font-medium mb-2">We're sorry to hear that</p>
            <p className="text-black text-sm mb-4">
              We want to make it right. Please let us know what we can do better.
            </p>
            <textarea
              placeholder="Tell us what happened..."
              className="w-full px-4 py-2 border border-black rounded-lg mb-3"
              rows={3}
            />
            <button
              onClick={() => {
                alert('Thank you for your feedback. Our team will reach out to you shortly.');
                setDismissed(true);
              }}
              className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-black"
            >
              Send Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewRequest;
