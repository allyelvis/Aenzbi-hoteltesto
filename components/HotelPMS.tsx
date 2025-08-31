
import React, { useState, useEffect } from 'react';
import { mockRooms } from '../services/mockData';
import { Room, RoomStatus } from '../types';

const getStatusColorClasses = (status: RoomStatus): string => {
    switch (status) {
        case RoomStatus.Available:
            return 'border-green-500 bg-green-500/10 text-green-400';
        case RoomStatus.Occupied:
            return 'border-blue-500 bg-blue-500/10 text-blue-400';
        case RoomStatus.Dirty:
            return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
        case RoomStatus.Maintenance:
            return 'border-red-500 bg-red-500/10 text-red-400';
        default:
            return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
};

const RoomCard: React.FC<{ room: Room; onClick: (room: Room) => void }> = ({ room, onClick }) => {
    const colorClasses = getStatusColorClasses(room.status);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        // FIX: Corrected typo from toLocaleDateDateString to toLocaleDateString
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    };

    return (
        <div 
            onClick={() => onClick(room)}
            className={`bg-base-100 p-4 rounded-lg shadow-lg border-l-4 cursor-pointer transition-all duration-200 hover:bg-base-300 flex flex-col justify-between ${colorClasses}`}
        >
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xl font-bold text-white">{room.number}</p>
                        <p className="text-sm text-gray-400">{room.type}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-opacity-50 bg-current whitespace-nowrap">{room.status}</span>
                </div>
                {room.guest && <p className="mt-4 text-sm text-gray-300">Guest: {room.guest}</p>}
            </div>
            {room.status === RoomStatus.Occupied && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 space-y-1">
                    <p>Check-in: {formatDate(room.checkIn)}</p>
                    <p>Check-out: {formatDate(room.checkOut)}</p>
                </div>
            )}
        </div>
    );
};

const RoomDetailModal: React.FC<{ 
    room: Room | null; 
    onClose: () => void; 
    onUpdateStatus: (id: number, status: RoomStatus) => void;
    onBookRoom: (id: number, guestName: string, checkIn: string, checkOut: string) => void;
}> = ({ room, onClose, onUpdateStatus, onBookRoom }) => {
    if (!room) return null;

    const [guestName, setGuestName] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (room && room.status === RoomStatus.Available) {
            const today = new Date().toISOString().split('T')[0];
            setCheckIn(today);
            setGuestName('');
            setCheckOut('');
            setError('');
        }
    }, [room]);
    
    const handleConfirmBooking = () => {
        if (!guestName.trim()) {
            setError('Guest name is required.');
            return;
        }
        if (!checkIn || !checkOut) {
            setError('Check-in and check-out dates are required.');
            return;
        }
        if (new Date(checkOut) <= new Date(checkIn)) {
            setError('Check-out date must be after the check-in date.');
            return;
        }
        onBookRoom(room.id, guestName, checkIn, checkOut);
    };

    const renderContent = () => {
        switch (room.status) {
            case RoomStatus.Available:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-white text-lg">New Booking</h3>
                        <div>
                            <label className="text-sm text-gray-400">Guest Name</label>
                            <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} className="w-full bg-base-300 text-white p-2 rounded-lg mt-1 border border-secondary" />
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="text-sm text-gray-400">Check-in</label>
                                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full bg-base-300 text-white p-2 rounded-lg mt-1 border border-secondary" />
                            </div>
                             <div className="w-1/2">
                                <label className="text-sm text-gray-400">Check-out</label>
                                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full bg-base-300 text-white p-2 rounded-lg mt-1 border border-secondary" />
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                         <button onClick={handleConfirmBooking} className="w-full bg-success hover:bg-green-700 text-white font-bold py-2 rounded-lg mt-2 transition-colors">
                            Confirm Booking
                        </button>
                    </div>
                );
            case RoomStatus.Occupied:
                return (
                    <div className="space-y-2">
                        <p><span className="font-semibold text-gray-400">Guest:</span> {room.guest}</p>
                        <p><span className="font-semibold text-gray-400">Check-in:</span> {new Date(room.checkIn!).toLocaleDateString(undefined, {timeZone: 'UTC'})}</p>
                        <p><span className="font-semibold text-gray-400">Check-out:</span> {new Date(room.checkOut!).toLocaleDateString(undefined, {timeZone: 'UTC'})}</p>
                        <div className="pt-4">
                             <button onClick={() => onUpdateStatus(room.id, RoomStatus.Dirty)} className="w-full bg-warning hover:bg-amber-700 text-white font-bold py-2 rounded-lg mt-2 transition-colors">
                                Check Out & Mark for Cleaning
                            </button>
                        </div>
                    </div>
                );
            case RoomStatus.Dirty:
                 return (
                    <div className="text-center">
                        <p className="mb-4">This room needs to be cleaned.</p>
                        <button onClick={() => onUpdateStatus(room.id, RoomStatus.Available)} className="w-full bg-info hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                           Mark as Clean and Available
                        </button>
                    </div>
                );
            case RoomStatus.Maintenance:
                 return (
                    <div className="text-center">
                        <p className="mb-4">This room is currently under maintenance.</p>
                        <button onClick={() => onUpdateStatus(room.id, RoomStatus.Available)} className="w-full bg-info hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                           Return to Service
                        </button>
                    </div>
                 );
            default:
                return <p>No actions available for this status.</p>;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Room {room.number}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                 <div className="mb-4">
                    <p><span className="font-semibold text-gray-400">Type:</span> {room.type}</p>
                    <p><span className="font-semibold text-gray-400">Current Status:</span> {room.status}</p>
                </div>
                <div className="border-t border-base-300 pt-4">
                   {renderContent()}
                </div>
                 <div className="border-t border-base-300 mt-4 pt-4">
                    <h3 className="font-semibold text-white mb-2 text-sm">Manual Override</h3>
                     <div className="flex flex-wrap gap-2">
                            {Object.values(RoomStatus).map(status => (
                                <button
                                    key={status}
                                    onClick={() => onUpdateStatus(room.id, status)}
                                    disabled={status === RoomStatus.Occupied} // Prevent manual setting to occupied
                                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${room.status === status ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary-focus disabled:bg-neutral disabled:cursor-not-allowed'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                 </div>
            </div>
        </div>
    );
};

export const HotelPMS: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>(mockRooms);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
    };

    const handleCloseModal = () => {
        setSelectedRoom(null);
    };

    const handleUpdateStatus = (id: number, status: RoomStatus) => {
        let updatedRoom: Room | null = null;
        setRooms(prevRooms => prevRooms.map(r => {
            if (r.id === id) {
                const isCheckingOut = r.status === RoomStatus.Occupied && status !== RoomStatus.Occupied;
                updatedRoom = { 
                    ...r, 
                    status, 
                    guest: isCheckingOut ? undefined : r.guest,
                    checkIn: isCheckingOut ? undefined : r.checkIn,
                    checkOut: isCheckingOut ? undefined : r.checkOut,
                };
                 // Prevent manually setting a room to occupied without booking details
                if (status === RoomStatus.Occupied && !isCheckingOut) {
                    return r; // Do not change status
                }
                return updatedRoom;
            }
            return r;
        }));
        if(updatedRoom) {
            setSelectedRoom(updatedRoom);
        }
    };

    const handleBookRoom = (id: number, guestName: string, checkIn: string, checkOut: string) => {
        let bookedRoom: Room | null = null;
        setRooms(prevRooms =>
          prevRooms.map(r => {
            if (r.id === id) {
              bookedRoom = { ...r, status: RoomStatus.Occupied, guest: guestName, checkIn, checkOut };
              return bookedRoom;
            }
            return r;
          })
        );
        setSelectedRoom(bookedRoom); // Keep modal open with updated info
        // handleCloseModal(); // Or close it immediately
    };


    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {rooms.map(room => (
                    <RoomCard key={room.id} room={room} onClick={handleRoomClick} />
                ))}
            </div>
            <RoomDetailModal 
                room={selectedRoom} 
                onClose={handleCloseModal} 
                onUpdateStatus={handleUpdateStatus} 
                onBookRoom={handleBookRoom}
            />
        </>
    );
};
