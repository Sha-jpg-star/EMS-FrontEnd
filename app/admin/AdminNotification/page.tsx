import React, { useEffect, useState } from 'react';
import { API_BASE } from '../utils/api';

const AdminNotification: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    const res = await fetch(`${API_BASE}/notifications/admin`);
    const data = await res.json();
    setNotes(data);
  };

  const mark = async (id:string) => {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
    fetchNotes();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Admin Notifications</h1>
      {notes.length === 0 && <div className="text-sm text-gray-500">No notifications</div>}
      <div className="space-y-2">
        {notes.map(n => (
          <div key={n._id} className={`border p-3 rounded ${n.read? 'opacity-60':''}`}>
            <div className="flex justify-between">
              <div>{n.message}</div>
              <div className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            {!n.read && <button className="mt-2 text-sm text-blue-600" onClick={() => mark(n._id)}>Mark read</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotification;