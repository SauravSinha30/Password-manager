import React, { useState, useEffect } from 'react';
import { FaCopy, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';

const Manager = () => {
  const [form, setForm] = useState({ website: '', username: '', password: '' });
  const [passwordArray, setPasswordArray] = useState([]);
  // NEW: Track which item is currently being edited
  const [editingId, setEditingId] = useState(null);

  // 1. Fetch passwords when the component mounts
  useEffect(() => {
    fetchVault();
  }, []);

  const fetchVault = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; 

      const res = await axios.get('http://localhost:3000/api/vault', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordArray(res.data);
    } catch (error) {
      console.error('Error fetching vault:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. Save (POST) or Update (PUT) a password
  const handleSave = async () => {
    if (form.website && form.username && form.password) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        if (editingId) {
          // UPDATE: If we are editing, send a PUT request
          await axios.put(`http://localhost:3000/api/vault/${editingId}`, form, config);
          setEditingId(null); // Reset the editing state
        } else {
          // CREATE: If we are not editing, send a POST request
          await axios.post('http://localhost:3000/api/vault', form, config);
        }

        // Clear the form and re-fetch the updated vault
        setForm({ website: '', username: '', password: '' });
        fetchVault();
      } catch (error) {
        console.error('Error saving credential:', error);
      }
    }
  };

  // 3. Delete Functionality (DELETE)
  const deletePassword = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this credential?");
    
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/vault/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Refresh the list after deleting
        fetchVault();
      } catch (error) {
        console.error('Error deleting credential:', error);
      }
    }
  };

  // 4. Edit Functionality (Prepares the form)
  const editPassword = (id) => {
    // Find the specific item using MongoDB's _id
    const itemToEdit = passwordArray.find(item => item._id === id);
    
    // Populate the form with its values
    setForm({ website: itemToEdit.website, username: itemToEdit.username, password: itemToEdit.password });
    
    // Set the editing state so handleSave knows to execute a PUT request instead of POST
    setEditingId(id);
  };

  // 5. Copy Functionality
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!"); 
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-16 px-4 pb-16 flex flex-col gap-10">
      
      {/* --- ADD / EDIT PASSWORD FORM --- */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">
            {editingId ? 'Edit Credential' : 'New Credential'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {editingId ? 'Update your saved password details below.' : 'Securely store a new password in your vault.'}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Website URL</label>
            <input className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600" type="url" name="website" value={form.website} onChange={handleChange} placeholder="e.g., https://github.com" />
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-zinc-300 ml-1">Username or Email</label>
              <input className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600" type="text" name="username" value={form.username} onChange={handleChange} placeholder="dev_user" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
              <input className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••••••" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 gap-4">
          {/* Optional: Add a cancel button if they change their mind during an edit */}
          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setForm({ website: '', username: '', password: '' }); }} 
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-8 rounded-xl transition-all"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={handleSave} 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(5,150,105,0.2)] hover:shadow-[0_0_25px_rgba(5,150,105,0.4)] active:scale-95 flex items-center gap-2"
          >
            {editingId ? 'Update Credential' : 'Save to Vault'}
          </button>
        </div>
      </div>

      {/* --- YOUR VAULT DISPLAY SECTION --- */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Your Vault</h2>
        
        {!Array.isArray(passwordArray) || passwordArray.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">
             Your vault is empty. Add a credential above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-zinc-300 border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="py-3 px-4 font-semibold">Website</th>
                  <th className="py-3 px-4 font-semibold">Username</th>
                  <th className="py-3 px-4 font-semibold">Password</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passwordArray.map((item) => (
                  // Swapped item.id for item._id to match MongoDB
                  <tr key={item._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group">
                    <td className="py-4 px-4">{item.website}</td>
                    <td className="py-4 px-4">{item.username}</td>
                    <td className="py-4 px-4 font-mono">{'•'.repeat(item.password.length)}</td>
                    <td className="py-4 px-4">
                      {/* Action Buttons */}
                      <div className="flex items-center justify-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyText(item.password)} 
                          className="hover:text-emerald-400 transition-colors"
                          title="Copy Password"
                        >
                          <FaCopy size={18} />
                        </button>
                        <button 
                          // Passing _id instead of id
                          onClick={() => editPassword(item._id)} 
                          className="hover:text-blue-400 transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          // Passing _id instead of id
                          onClick={() => deletePassword(item._id)} 
                          className="hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default Manager;