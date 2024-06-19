import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebase_app from '../lib/firebase/config';
import { EventShort } from '../models/event/event-short';

const useFetchEventShorts = () => {
  const [eventsShort, setEventsShort] = useState<EventShort[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventShorts = async () => {
      try {
        const db = getFirestore(firebase_app);
        const shortEventRef = doc(db, 'data', 'events');
        const shortEvents = await getDoc(shortEventRef);
        const shortEventsData = shortEvents.data();
        if (shortEventsData !== undefined) {
          setEventsShort(Object.values(shortEventsData['events']));
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching event shorts');
        setLoading(false);
      }
    };

    fetchEventShorts();
  }, [shouldRefetch]);

  const refetchEventShorts = () => {
    setShouldRefetch((prevState) => !prevState);
  };

  return { eventsShort, loading, error, refetchEventShorts };
};

export default useFetchEventShorts;