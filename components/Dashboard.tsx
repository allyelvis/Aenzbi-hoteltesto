
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { mockRooms, mockSales, mockBookings } from '../services/mockData';
import { RoomStatus, BookingStatus } from '../types';

const Card: React.FC<{ title: string; value: string; description: string }> = ({ title, value, description }) => (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
);

const salesDataForChart = mockSales.map(sale => ({
    name: new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Revenue: sale.total
}));

const getRoomStatusCounts = () => {
    const counts = {
        [RoomStatus.Available]: 0,
        [RoomStatus.Occupied]: 0,
        [RoomStatus.Dirty]: 0,
        [RoomStatus.Maintenance]: 0,
    };
    mockRooms.forEach(room => {
        counts[room.status]++;
    });
    return [
        { name: 'Available', count: counts[RoomStatus.Available] },
        { name: 'Occupied', count: counts[RoomStatus.Occupied] },
        { name: 'Dirty', count: counts[RoomStatus.Dirty] },
        { name: 'Maintenance', count: counts[RoomStatus.Maintenance] }
    ];
};

export const Dashboard: React.FC = () => {
    const totalRevenue = mockSales.reduce((acc, sale) => acc + sale.total, 0);
    const occupiedRooms = mockBookings.filter(b => b.status === BookingStatus.CheckedIn).length;
    const occupancyRate = (occupiedRooms / mockRooms.length) * 100;
    const roomStatusData = getRoomStatusCounts();
    const availableRooms = roomStatusData.find(d => d.name === 'Available')?.count || 0;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} description="All time restaurant sales" />
                <Card title="Occupancy Rate" value={`${occupancyRate.toFixed(1)}%`} description="Currently occupied rooms" />
                <Card title="Total Orders" value={mockSales.length.toString()} description="Restaurant orders processed" />
                <Card title="Rooms Available" value={availableRooms.toString()} description="Ready for check-in" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-base-100 p-6 rounded-lg shadow-lg h-96">
                    <h3 className="font-semibold text-lg mb-4 text-white">Daily Revenue</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesDataForChart} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#E2E8F0' }} />
                            <Legend />
                            <Line type="monotone" dataKey="Revenue" stroke="#0D9488" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-base-100 p-6 rounded-lg shadow-lg h-96">
                    <h3 className="font-semibold text-lg mb-4 text-white">Room Status Distribution</h3>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={roomStatusData} margin={{ top: 5, right: 20, left: -10, bottom: 25 }}>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', color: '#E2E8F0' }} />
                            <Legend />
                            <Bar dataKey="count" fill="#0D9488" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
