import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebase_app from '../lib/firebase/config';
import { Skill } from '@/models/event/skill.d';

const useFetchSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventShorts = async () => {
      try {
        const db = getFirestore(firebase_app);
        const skillsRef = doc(db, 'data', 'skills');
        const skills = await getDoc(skillsRef);
        const skillsData = skills.data();
        if (skillsData !== undefined) {
          setSkills(Object.values(skillsData['skills']));
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching skills');
        setLoading(false);
      }
    };

    fetchEventShorts();
  }, [shouldRefetch]);

  const refetchSkills = () => {
    setShouldRefetch((prevState) => !prevState);
  };

  return { skills, loading, error, refetchSkills };
};

export default useFetchSkills;