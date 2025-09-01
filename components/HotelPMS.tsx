
import React, { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockRooms, mockGuests, mockBookings } from '../services/mockData';
import { Room, RoomStatus, Guest, Booking, HousekeepingStatus, BookingStatus, PaymentStatus } from '../types';

type PmsTab = 'grid' | 'housekeeping' | 'guests' | 'reports';

// --- HELPER FUNCTIONS ---
const getStatusColorClasses = (status: RoomStatus): string => {
    switch (status) {
        case RoomStatus.Available: return 'border-green-500 bg-green-500/10 text-green-400';
        case RoomStatus.Occupied: return 'border-blue-500 bg-blue-500/10 text-blue-400';
        case RoomStatus.Dirty: return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
        case RoomStatus.Maintenance: return 'border-red-500 bg-red-500/10 text-red-400';
        default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
};

const getHousekeepingStatusChip = (status: HousekeepingStatus) => {
    const base = "px-2 py-1 text-xs font-semibold rounded-full capitalize";
    switch(status) {
        case HousekeepingStatus.Clean: return `${base} bg-success/20 text-success`;
        case HousekeepingStatus.Dirty: return `${base} bg-warning/20 text-warning`;
        case HousekeepingStatus.InProgress: return `${base} bg-info/20 text-info`;
        case HousekeepingStatus.Inspect: return `${base} bg-accent/20 text-accent`;
        default: return `${base} bg-neutral/20 text-neutral-content`;
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

// --- SUB-COMPONENTS ---

const RoomCard: React.FC<{ room: Room; booking: Booking | undefined; onClick: () => void }> = ({ room, booking, onClick }) => {
    const colorClasses = getStatusColorClasses(room.status);
    const guest = booking ? mockGuests.find(g => g.id === booking.guestId) : undefined;

    return (
        <div onClick={onClick} className={`bg-base-100 p-4 rounded-lg shadow-lg border-l-4 cursor-pointer transition-all duration-200 hover:bg-base-300 flex flex-col justify-between ${colorClasses}`}>
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xl font-bold text-white">{room.number}</p>
                        <p className="text-sm text-gray-400">{room.type}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-opacity-50 bg-current whitespace-nowrap">{room.status}</span>
                </div>
                {guest && <p className="mt-4 text-sm text-gray-300">Guest: {guest.firstName} {guest.lastName}</p>}
            </div>
            {booking && booking.status === BookingStatus.CheckedIn && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 space-y-1">
                    <p>Check-out: {formatDate(booking.checkOut)}</p>
                </div>
            )}
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-4 py-2 font-semibold transition-colors ${active ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}>{children}</button>
);


// --- MAIN VIEW COMPONENTS FOR TABS ---

const RoomGridView: React.FC<{ rooms: Room[], bookings: Booking[], onRoomClick: (room: Room) => void }> = ({ rooms, bookings, onRoomClick }) => {
    const today = new Date().toISOString().split('T')[0];
    
    const findBookingForRoom = (roomId: number) => {
        return bookings.find(b => b.roomId === roomId && b.status === BookingStatus.CheckedIn && today >= b.checkIn && today < b.checkOut);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {rooms.map(room => (
                <RoomCard key={room.id} room={room} booking={findBookingForRoom(room.id)} onClick={() => onRoomClick(room)} />
            ))}
        </div>
    );
};

const HousekeepingView: React.FC<{ rooms: Room[], onUpdateStatus: (roomId: number, status: HousekeepingStatus) => void }> = ({ rooms, onUpdateStatus }) => {
    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-left">
                <thead className="text-xs text-gray-400 uppercase bg-base-200">
                    <tr>
                        <th className="px-4 py-3">Room</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(room => (
                        <tr key={room.id} className="border-b border-base-300">
                            <td className="px-4 py-3 font-medium text-white">{room.number}</td>
                            <td className="px-4 py-3 text-gray-300">{room.type}</td>
                            <td className="px-4 py-3"><span className={getHousekeepingStatusChip(room.housekeepingStatus)}>{room.housekeepingStatus}</span></td>
                            <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                    {Object.values(HousekeepingStatus).map(status => (
                                        <button key={status} onClick={() => onUpdateStatus(room.id, status)} disabled={room.housekeepingStatus === status} className="px-3 py-1 text-xs font-semibold rounded-md bg-secondary hover:bg-secondary-focus disabled:bg-neutral disabled:cursor-not-allowed">
                                            Set {status}
                                        </button>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const GuestsView: React.FC<{ guests: Guest[], bookings: Booking[], rooms: Room[] }> = ({ guests, bookings, rooms }) => {
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

    const getGuestBookings = (guestId: number) => {
        return bookings.filter(b => b.guestId === guestId).sort((a,b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
    };

    if (selectedGuest) {
        return (
            <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                <button onClick={() => setSelectedGuest(null)} className="text-sm text-primary mb-4">&larr; Back to Guest List</button>
                <h3 className="text-2xl font-bold text-white">{selectedGuest.firstName} {selectedGuest.lastName}</h3>
                <p className="text-gray-400">{selectedGuest.email} | {selectedGuest.phone}</p>
                <p className="text-gray-400">{selectedGuest.address}</p>
                <h4 className="text-lg font-semibold text-white mt-6 border-b border-base-300 pb-2">Booking History</h4>
                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                    {getGuestBookings(selectedGuest.id).map(booking => {
                        const room = rooms.find(r => r.id === booking.roomId);
                        return (
                            <div key={booking.id} className="bg-base-200 p-3 rounded-lg">
                                <p className="font-semibold text-white">Room {room?.number} ({room?.type})</p>
                                <p className="text-sm text-gray-300">Dates: {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}</p>
                                <p className="text-sm text-gray-400">Status: {booking.status} | Payment: {booking.paymentStatus}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg overflow-x-auto">
             <table className="w-full text-left">
                <thead className="text-xs text-gray-400 uppercase bg-base-200">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Phone</th>
                        <th className="px-4 py-3">Total Bookings</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map(guest => (
                        <tr key={guest.id} onClick={() => setSelectedGuest(guest)} className="border-b border-base-300 hover:bg-base-200 cursor-pointer">
                            <td className="px-4 py-3 font-medium text-white">{guest.firstName} {guest.lastName}</td>
                            <td className="px-4 py-3 text-gray-300">{guest.email}</td>
                            <td className="px-4 py-3 text-gray-300">{guest.phone}</td>
                            <td className="px-4 py-3 text-gray-300">{getGuestBookings(guest.id).length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ReportsView: React.FC<{ bookings: Booking[], rooms: Room[] }> = ({ bookings, rooms }) => {
    const occupancyData = useMemo(() => {
        const data = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const occupiedCount = bookings.filter(b => dateStr >= b.checkIn && dateStr < b.checkOut && (b.status === BookingStatus.CheckedIn || b.status === BookingStatus.Confirmed)).length;
            data.push({
                name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Occupied: occupiedCount,
                '% Occupancy': parseFloat(((occupiedCount / rooms.length) * 100).toFixed(1)),
            });
        }
        return data;
    }, [bookings, rooms]);

    const revenueData = useMemo(() => {
        const revenueMap: { [key: string]: number } = {};
        rooms.forEach(room => revenueMap[room.type] = 0);
        bookings.filter(b => b.paymentStatus === PaymentStatus.Paid).forEach(booking => {
            const room = rooms.find(r => r.id === booking.roomId);
            if (room) {
                revenueMap[room.type] += booking.totalAmount;
            }
        });
        return Object.entries(revenueMap).map(([name, Revenue]) => ({ name, Revenue }));
    }, [bookings, rooms]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-base-100 p-6 rounded-lg shadow-lg h-96">
                <h3 className="font-semibold text-lg mb-4 text-white">7-Day Occupancy Forecast</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={occupancyData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                        <Legend />
                        <Line type="monotone" dataKey="Occupied" stroke="#0D9488" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-base-100 p-6 rounded-lg shadow-lg h-96">
                <h3 className="font-semibold text-lg mb-4 text-white">Revenue by Room Type</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                        <Legend />
                        <Bar dataKey="Revenue" fill="#0D9488" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- MAIN PMS COMPONENT ---

export const HotelPMS: React.FC = () => {
    const [activeTab, setActiveTab] = useState<PmsTab>('grid');
    const [rooms, setRooms] = useState<Room[]>(mockRooms);
    const [guests, setGuests] = useState<Guest[]>(mockGuests);
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const handleUpdateHousekeeping = (roomId: number, status: HousekeepingStatus) => {
        setRooms(prev => prev.map(room => {
            if (room.id !== roomId) return room;
            
            const newRoom: Room = { ...room, housekeepingStatus: status };
            // Business logic: if cleaned, mark as Available (if not occupied or maintenance)
            if (status === HousekeepingStatus.Clean && room.status === RoomStatus.Dirty) {
                newRoom.status = RoomStatus.Available;
            }
            // If marked dirty, update main status
            if (status === HousekeepingStatus.Dirty && room.status === RoomStatus.Available) {
                 newRoom.status = RoomStatus.Dirty;
            }
            return newRoom;
        }));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'grid': return <RoomGridView rooms={rooms} bookings={bookings} onRoomClick={setSelectedRoom} />;
            case 'housekeeping': return <HousekeepingView rooms={rooms} onUpdateStatus={handleUpdateHousekeeping} />;
            case 'guests': return <GuestsView guests={guests} bookings={bookings} rooms={rooms} />;
            case 'reports': return <ReportsView bookings={bookings} rooms={rooms} />;
            default: return null;
        }
    };
    
    // A simplified modal for now. A real app would have a more complex one.
    const SimpleRoomModal = () => {
        if (!selectedRoom) return null;
        return (
             <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-base-200 rounded-lg shadow-xl p-8 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">Room {selectedRoom.number}</h2>
                        <button onClick={() => setSelectedRoom(null)} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                    </div>
                    <p>Details and actions for this room would go here.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex border-b border-base-300">
                <TabButton active={activeTab === 'grid'} onClick={() => setActiveTab('grid')}>Room Grid</TabButton>
                <TabButton active={activeTab === 'housekeeping'} onClick={() => setActiveTab('housekeeping')}>Housekeeping</TabButton>
                <TabButton active={activeTab === 'guests'} onClick={() => setActiveTab('guests')}>Guests</TabButton>
                <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>Reports</TabButton>
            </div>
            <div>
                {renderContent()}
            </div>
            {/* A full booking modal would replace this simple one */}
            <SimpleRoomModal /> 
        </div>
    );
};
