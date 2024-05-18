"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, doc, updateDoc } from 'firebase/firestore';
import firebase_app from '../../lib/firebase/config';
import './events.css'; 

const Events: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [editedEvent, setEditedEvent] = useState<any>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const db = getFirestore(firebase_app);
                const eventsCollection = collection(db, 'events');
                const querySnapshot = await getDocs(eventsCollection);
                const fetchedEvents = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(fetchedEvents);
                setLoading(false);
            } catch (error) {
                setError('Error fetching events');
                setLoading(false);
            }
        };

        fetchEvents(); 
    }, []);
    

    const handleEdit = (event: any) => {
        setEditMode(true);
        setSelectedEvent(event);
        setEditedEvent({
            ...event,
            category: Array.isArray(event.category) ? event.category : [],
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setEditedEvent((prevState: any) => ({
                ...prevState,
                [name]: value.split(',').map(item => item.trim()),
            }));
        } else {
            setEditedEvent((prevState: any) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const db = getFirestore(firebase_app);
            const eventRef = doc(db, 'events', selectedEvent.id);
            // Update event with new data
            await updateDoc(eventRef, editedEvent); 
            // Fetch updated events
            const updatedEvents = events.map((event) =>
                event.id === selectedEvent.id ? editedEvent : event
            );
            setEvents(updatedEvents);
            setEditMode(false);
            setSelectedEvent(null);
            setEditedEvent(null);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setSelectedEvent(null);
        setEditedEvent(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-6 relative">
                        <h2 className="text-xl font-bold mb-4">{event.name}</h2>
                        <div>
                            <p><span className="font-bold">ID:</span> {event.id}</p>
                            <p><span className="font-bold">Description:</span> {event.description}</p>
                            <p><span className="font-bold">Description Short:</span> {event.description_short}</p>
                            <p><span className="font-bold">Start Date:</span> {new Date(Number(event.start_date)).toLocaleDateString()}</p>
                            <div className="flex items-center">
                                <p className="font-bold mr-2">Image URL:</p>
                                <p className='url_fit'>{event.imageURL}</p>
                            </div>
                            <p><span className="font-bold">Status:</span> {event.status}</p>
                            <p><span className="font-bold">Type:</span> {event.type}</p>
                            <p>
                                <span className="font-bold">Categories:</span> {Array.isArray(event.category) ? event.category.join(', ') : 'No categories available'}
                            </p>                       
                         </div>
                        <button onClick={() => handleEdit(event)} className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">Edit</button>
                    </div>
                ))}
            </div>
            {editMode && selectedEvent && (
                <div className="edit-form-overlay fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="edit-form bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Event</h2>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-4">
                                <span className="font-bold">Name:</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedEvent.name}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                                <span className="font-bold">Description:</span>
                                <input
                                    type="text"
                                    name="description"
                                    value={editedEvent.description}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                                <span className="font-bold">Description Short:</span>
                                <input
                                    type="text"
                                    name="description_short"
                                    value={editedEvent.description_short}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                                <span className="font-bold">Start Date:</span>
                                <input
                                    type="text"
                                    name="start_date"
                                    value={new Date(Number(editedEvent.start_date)).toLocaleDateString()}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                                <span className="font-bold">Image URL:</span>
                                <input
                                    type="text"
                                    name="imageURL"
                                    value={editedEvent.imageURL}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                                <span className="font-bold">Status:</span>
                                <input
                                    type="text"
                                    name="status"
                                    value={editedEvent.status}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                                <span className="font-bold">Type:</span>
                                <input
                                    type="text"
                                    name="type"
                                    value={editedEvent.type}
                                    onChange={handleChange}
                                    className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                />
                            </label>
                            <label className="block mb-4">
                               <span className="font-bold">Categories:</span>
                                    <input
                                        type="text"
                                        name="category"
                                        value={Array.isArray(editedEvent.category) ? editedEvent.category.join(', ') : ''}
                                        onChange={handleChange}
                                        className="form-input mt-1 block w-full border-gray-300 rounded-md focus:border-blue-400 focus:outline-none"
                                    />
                            </label>
                            <div className="flex justify-end">
                                <button type="submit" className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save</button>
                                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
