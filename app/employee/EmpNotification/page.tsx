import React, { useEffect, useState } from 'react';
import { API_BASE } from '../utils/api';

const EmpNotification: React.FC = () => {
  const [empNo, setEmpNo] = useState('');
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('emp');
    if (stored) {
      const obj = JSON.parse(stored);
      setEmpNo(obj.empNo);
      fetchNotes(obj.empNo);
    }
  }, []);

  const fetchNotes = async (recipient: string) => {
    const res = await fetch(`${API_BASE}/notifications/${recipient}`);
    const data = await res.json();
    setNotes(data);
  };

  const mark = async (id: string) => {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PATCH' });
    if (empNo) fetchNotes(empNo);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">My Notifications</h1>
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

export default EmpNotification;