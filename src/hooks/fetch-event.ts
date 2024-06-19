import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebase_app from '../lib/firebase/config';
import { Event } from '../models/event/event';

const useFetchEvent = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const db = getFirestore(firebase_app);
        const eventDoc = doc(db, 'events', eventId);
        const querySnapshot = await getDoc(eventDoc);
        const fetchedEvent = querySnapshot.data() as Event;
        setEvent(fetchedEvent);
        setLoading(false);
      } catch (error) {
        setError('Error fetching event');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
};

export default useFetchEvent;