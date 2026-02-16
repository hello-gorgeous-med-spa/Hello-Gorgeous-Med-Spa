'use client';

// ============================================================
// PATIENT QUEUE - Waiting Room Management
// Real-time view of checked-in patients and room status
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useProviderId } from '@/lib/provider/useProviderId';

interface QueuePatient {
  id: string;
  client_name: string;
  client_phone?: string;
  service_name: string;
  service_price?: number;
  duration?: number;
  starts_at: string;
  checked_in_at?: string;
  status: string;
  room?: string;
  consent_complete?: boolean;
}

const ROOMS = [
  { id: 'room-1', name: 'Treatment Room 1', icon: '💉' },
  { id: 'room-2', name: 'Treatment Room 2', icon: '💆' },
  { id: 'room-3', name: 'Consultation', icon: '🗣️' },
];

export default function PatientQueuePage() {
  const providerId = useProviderId();
  const [queue, setQueue] = useState<QueuePatient[]>([]);
  const [confirmedUpcoming, setConfirmedUpcoming] = useState<QueuePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(null);
  const [assigningRoom, setAssigningRoom] = useState(false);

  const fetchQueue = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = new URLSearchParams({ date: today });
      if (providerId) params.set('provider_id', providerId);
      const res = await fetch(`/api/appointments?${params}`);
      const data = await res.json();
      
      if (data.appointments) {
        const now = new Date();
        
        // Checked in patients
        const checkedIn = data.appointments
          .filter((a: any) => a.status === 'checked_in' || a.status === 'in_progress')
          .map((a: any) => ({
            ...a,
            checked_in_at: a.check_in_at || a.starts_at,
          }))
          .sort((a: any, b: any) => 
            new Date(a.checked_in_at).getTime() - new Date(b.checked_in_at).getTime()
          );
        
        setQueue(checkedIn);

        // Upcoming confirmed (not yet checked in)
        const upcoming = data.appointments
          .filter((a: any) => 
            a.status === 'confirmed' && 
            new Date(a.starts_at).getTime() > now.getTime() - 30 * 60000 // Within last 30 min or future
          )
          .sort((a: any, b: any) => 
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
          )
          .slice(0, 5);
        
        setConfirmedUpcoming(upcoming);
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchQueue();
    // Refresh every 15 seconds for real-time updates
    const interval = setInterval(fetchQueue, 15000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWaitTime = (checkedInAt: string) => {
    const now = new Date().getTime();
    const checkIn = new Date(checkedInAt).getTime();
    const minutes = Math.max(0, Math.round((now - checkIn) / 60000));
    return minutes;
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'checked_in',
          check_in_at: new Date().toISOString(),
        }),
      });
      fetchQueue();
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleStartVisit = async (appointmentId: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      fetchQueue();
    } catch (error) {
      console.error('Error starting visit:', error);
    }
  };

  const handleNoShow = async (appointmentId: string) => {
    if (!confirm('Mark this patient as no-show?')) return;
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'no_show' }),
      });
      fetchQueue();
    } catch (error) {
      console.error('Error marking no-show:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Patient Queue</h1>
          <p className="text-black">Manage waiting room and patient flow</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Updates
          </span>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-black p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-black">Waiting</p>
              <p className="text-2xl font-bold text-black">
                {queue.filter(p => p.status === 'checked_in').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <p className="text-sm text-black">In Treatment</p>
              <p className="text-2xl font-bold text-black">
                {queue.filter(p => p.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🕐</span>
            </div>
            <div>
              <p className="text-sm text-black">Arriving Soon</p>
              <p className="text-2xl font-bold text-black">{confirmedUpcoming.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Queue */}
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <div className="px-5 py-4 border-b border-black bg-green-50">
            <h2 className="font-semibold text-black flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              Checked In / In Treatment
            </h2>
          </div>
          
          {queue.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-4xl block mb-2">🪑</span>
              <p className="text-black">Waiting room is empty</p>
            </div>
          ) : (
            <div className="divide-y divide-black">
              {queue.map((patient, idx) => {
                const waitTime = getWaitTime(patient.checked_in_at || patient.starts_at);
                const isWaitingLong = waitTime > 10;
                
                return (
                  <div 
                    key={patient.id} 
                    className={`p-4 ${patient.status === 'in_progress' ? 'bg-purple-50' : isWaitingLong ? 'bg-amber-50' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          patient.status === 'in_progress' ? 'bg-pink-500' : 'bg-green-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-black">{patient.client_name}</p>
                          <p className="text-sm text-black">{patient.service_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          patient.status === 'in_progress' ? 'text-pink-600' :
                          isWaitingLong ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {patient.status === 'in_progress' ? 'In Treatment' : `Waiting ${waitTime}m`}
                        </p>
                        <p className="text-xs text-black">
                          Appt: {formatTime(patient.starts_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {patient.status === 'checked_in' && (
                        <>
                          <Link
                            href={`/provider/charting?appointment=${patient.id}`}
                            onClick={() => handleStartVisit(patient.id)}
                            className="flex-1 px-3 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-500 text-center"
                          >
                            Start Visit
                          </Link>
                          <Link
                            href={`/provider/patients?id=${patient.id}`}
                            className="px-3 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white"
                          >
                            View
                          </Link>
                        </>
                      )}
                      {patient.status === 'in_progress' && (
                        <>
                          <Link
                            href={`/provider/charting?appointment=${patient.id}`}
                            className="flex-1 px-3 py-2 bg-pink-500 text-white text-sm font-medium rounded-lg hover:bg-pink-500 text-center"
                          >
                            Continue Chart
                          </Link>
                          <Link
                            href={`/pos?appointment=${patient.id}`}
                            className="px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                          >
                            Checkout
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Arriving Soon */}
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <div className="px-5 py-4 border-b border-black bg-blue-50">
            <h2 className="font-semibold text-black flex items-center gap-2">
              <span className="text-lg">🕐</span>
              Arriving Soon
            </h2>
          </div>
          
          {confirmedUpcoming.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-4xl block mb-2">📅</span>
              <p className="text-black">No upcoming appointments</p>
            </div>
          ) : (
            <div className="divide-y divide-black">
              {confirmedUpcoming.map((patient) => {
                const appointmentTime = new Date(patient.starts_at);
                const now = new Date();
                const minutesUntil = Math.round((appointmentTime.getTime() - now.getTime()) / 60000);
                const isLate = minutesUntil < -5;
                const isArriving = minutesUntil <= 10 && minutesUntil > -5;
                
                return (
                  <div key={patient.id} className={`p-4 ${isLate ? 'bg-red-50' : isArriving ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-black">{patient.client_name}</p>
                        <p className="text-sm text-black">{patient.service_name}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          isLate ? 'text-red-600' : 
                          isArriving ? 'text-blue-600' : 'text-black'
                        }`}>
                          {formatTime(patient.starts_at)}
                        </p>
                        <p className={`text-xs ${
                          isLate ? 'text-red-500' : 
                          isArriving ? 'text-blue-500' : 'text-black'
                        }`}>
                          {isLate ? `${Math.abs(minutesUntil)}m late` :
                           minutesUntil <= 0 ? 'Now' :
                           `In ${minutesUntil}m`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCheckIn(patient.id)}
                        className="flex-1 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                      >
                        Check In
                      </button>
                      {isLate && (
                        <button
                          onClick={() => handleNoShow(patient.id)}
                          className="px-3 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200"
                        >
                          No Show
                        </button>
                      )}
                      <Link
                        href={`/provider/patients?id=${patient.id}`}
                        className="px-3 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-white"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Room Status */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="px-5 py-4 border-b border-black">
          <h2 className="font-semibold text-black">Room Status</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4 p-5">
          {ROOMS.map((room) => {
            const occupant = queue.find(p => p.status === 'in_progress' && p.room === room.id);
            
            return (
              <div 
                key={room.id}
                className={`p-4 rounded-xl border-2 ${
                  occupant 
                    ? 'border-purple-300 bg-purple-50' 
                    : 'border-green-300 bg-green-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{room.icon}</span>
                  <div>
                    <p className="font-semibold text-black">{room.name}</p>
                    <p className={`text-sm ${occupant ? 'text-pink-600' : 'text-green-600'}`}>
                      {occupant ? 'Occupied' : 'Available'}
                    </p>
                  </div>
                </div>
                
                {occupant ? (
                  <div className="p-3 bg-white rounded-lg">
                    <p className="font-medium text-black">{occupant.client_name}</p>
                    <p className="text-sm text-black">{occupant.service_name}</p>
                  </div>
                ) : (
                  <p className="text-sm text-green-700">Ready for next patient</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
