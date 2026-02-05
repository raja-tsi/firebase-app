'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp,
  query,
  orderBy,
  limit 
} from 'firebase/firestore';

interface Greeting {
  id: string;
  message: string;
  name: string;
  createdAt: Date | null;
}

export default function Home() {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch greetings from Firestore
  const fetchGreetings = async () => {
    try {
      const q = query(
        collection(db, 'greetings'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const greetingsList: Greeting[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message,
        name: doc.data().name,
        createdAt: doc.data().createdAt?.toDate() || null,
      }));
      setGreetings(greetingsList);
    } catch (error) {
      console.error('Error fetching greetings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreetings();
  }, []);

  // Add new greeting to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'greetings'), {
        name: name.trim(),
        message: `Hello, ${name.trim()}! Welcome to Firebase App Hosting! 🎉`,
        createdAt: serverTimestamp(),
      });
      setName('');
      await fetchGreetings(); // Refresh the list
    } catch (error) {
      console.error('Error adding greeting:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hello World! 🌍
          </h1>
          <p className="text-purple-100">
            Firebase App Hosting + Next.js + Firestore
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add Your Greeting
          </h2>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Saving...' : 'Say Hello!'}
            </button>
          </form>
        </div>

        {/* Greetings List */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Greetings
          </h2>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading...</p>
          ) : greetings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No greetings yet. Be the first!
            </p>
          ) : (
            <ul className="space-y-3">
              {greetings.map((greeting) => (
                <li
                  key={greeting.id}
                  className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                >
                  <p className="text-gray-800 font-medium">{greeting.message}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {greeting.createdAt
                      ? greeting.createdAt.toLocaleString()
                      : 'Just now'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-purple-100 mt-6 text-sm">
          Powered by Firebase App Hosting 🔥
        </p>
      </div>
    </main>
  );
}