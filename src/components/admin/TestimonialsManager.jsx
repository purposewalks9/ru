
import React, { useState } from 'react';
import { MessageSquare, Quote, Plus, X, Trash } from 'lucide-react';

const TestimonialsManager = ({ data, setData, loading, showSuccess }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', text: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const newT = { ...formData, id: Date.now().toString() };
    setData([newT, ...data]);
    setIsAdding(false);
    setFormData({ name: '', role: '', text: '' });
    showSuccess('Testimonial added!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Testimonials</h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#478100] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center shadow-sm"
        >
          <Plus size={16} className="mr-2" /> Add New
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-[#478100] shadow-md animate-fade-in">
          <form onSubmit={handleAdd} className="space-y-4">
             <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">New Testimonial</span>
                <button type="button" onClick={() => setIsAdding(false)}><X size={20} className="text-gray-400" /></button>
             </div>
             <input placeholder="Name" className="w-full px-4 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
             <input placeholder="Role / Position" className="w-full px-4 py-2 border rounded-lg" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
             <textarea placeholder="The Review..." className="w-full px-4 py-2 border rounded-lg" rows={3} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required />
             <button type="submit" className="w-full py-2 bg-[#478100] text-white rounded-lg font-bold">Save Testimonial</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
            <Quote className="text-green-100 absolute top-4 right-4" size={40} />
            <p className="text-gray-600 italic mb-4 relative z-10">"{t.text}"</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#478100] font-bold mr-3">
                {t.name.charAt(0)}
              </div>
              <div>
                <h5 className="font-bold text-gray-800 leading-none">{t.name}</h5>
                <span className="text-xs text-gray-500">{t.role}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
               <button className="p-1.5 text-gray-400 hover:text-red-500" onClick={() => { if(confirm('Delete?')) setData(data.filter(x => x.id !== t.id)) }}><Trash size={14} /></button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="md:col-span-2 py-12 text-center text-gray-400 flex flex-col items-center">
             <MessageSquare size={40} className="mb-2 opacity-20" />
             <p>No testimonials yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;
