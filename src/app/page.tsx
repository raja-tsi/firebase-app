'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

interface Visit {
  id: string;
  message: string;
  timestamp: Timestamp | null;
  userAgent: string;
}

export default function Home() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  // Listen to visits collection in real-time
  useEffect(() => {
    const q = query(
      collection(db, 'visits'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const visitData: Visit[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Visit[];
      setVisits(visitData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Add a new visit/greeting
  const addGreeting = async () => {
    if (!name.trim()) return;
    
    try {
      await addDoc(collection(db, 'visits'), {
        message: `Hello from ${name}!`,
        timestamp: serverTimestamp(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) : 'Unknown',
      });
      setName('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Hello World! 🌍
          </h1>
          <p className="text-xl text-white/80">
            Firebase App Hosting + Next.js + Firestore
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Say Hello! 👋
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGreeting()}
              placeholder="Enter your name..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={addGreeting}
              className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Visits List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Recent Greetings 📝
          </h2>
          
          {loading ? (
            <p className="text-white/70">Loading...</p>
          ) : visits.length === 0 ? (
            <p className="text-white/70">No greetings yet. Be the first!</p>
          ) : (
            <ul className="space-y-3">
              {visits.map((visit) => (
                <li
                  key={visit.id}
                  className="bg-white/10 rounded-xl p-4 border border-white/20"
                >
                  <p className="text-white font-medium">{visit.message}</p>
                  <p className="text-white/50 text-sm mt-1">
                    {visit.timestamp?.toDate?.()?.toLocaleString() || 'Just now'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 mt-8 text-sm">
          Powered by Firebase App Hosting • Data stored in Firestore
        </p>
      </div>
    </main>
  );
}