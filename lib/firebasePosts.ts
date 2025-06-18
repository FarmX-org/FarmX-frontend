import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

export const addPost = async (post: {
  userId: string;
  userName: string;
  content: string;
  farmId?: number;
}) => {
  await addDoc(collection(db, 'posts'), {
    ...post,
    timestamp: new Date()
  });
};

export const fetchPosts = async () => {
  const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
