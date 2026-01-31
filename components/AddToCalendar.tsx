'use client';

// ============================================================
// ADD TO CALENDAR COMPONENT
// Let clients save appointments to their calendar
// ============================================================

import { useState } from 'react';
import { generateCalendarLinks } from '@/lib/hgos/reminders';

interface AddToCalendarProps {
  title: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  description?: string;
}

export function AddToCalendar({
  title,
  startTime,
  endTime,
  location = 'Hello Gorgeous Med Spa, Oswego, IL',
  description = '',
}: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const links = generateCalendarLinks({
    title,
    startTime,
    endTime,
    location,
    description,
  });

  const calendars = [
    { name: 'Google Calendar', icon: '📅', url: links.google },
    { name: 'Apple Calendar', icon: '🍎', url: links.ical },
    { name: 'Outlook', icon: '📧', url: links.outlook },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span>📅</span>
        <span>Add to Calendar</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-100 z-50 min-w-[200px]">
            {calendars.map((cal) => (
              <a
                key={cal.name}
                href={cal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl">{cal.icon}</span>
                <span className="text-gray-700">{cal.name}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AddToCalendar;
