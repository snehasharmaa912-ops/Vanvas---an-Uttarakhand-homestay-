import { useState, useEffect } from 'react'
import { Toast } from '../components/ui'
const API_URL = 'https://vanvas-an-uttarakhand-homestay.onrender.com/api/stays'
const EMPTY_FORM = {
  title: '', location: '', price: '', host: '',
  rating: '', reviews: '', eco: false, image: '', tags: ''
}
export default function Admin() {
  const [stays, setStays] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })
  const [showForm, setShowForm] = useState(false)
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type })
  }

  useEffect(() => {
    fetchStays()
  }, [])

  const fetchStays = () => {
    setLoading(true)
    fetch(API_URL)
      .then(res => res.json())
      .then(data => { setStays(data); setLoading(false) })
      .catch(() => { showToast('Failed to load stays', 'error'); setLoading(false) })
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    const url = editingId ? `${API_URL}/${editingId}` : API_URL
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Request failed')
      showToast(editingId ? 'Stay updated successfully' : 'Stay created successfully')
      setForm(EMPTY_FORM)
      setEditingId(null)
      setShowForm(false)
      fetchStays()
    } catch {
      showToast('Operation failed', 'error')
    }
  }

  const handleEdit = stay => {
    setForm({
      title: stay.title || '',
      location: stay.location || '',
      price: stay.price || '',
      host: stay.host || '',
      rating: stay.rating || '',
      reviews: stay.reviews || '',
      eco: stay.eco || false,
      image: stay.image || '',
      tags: (stay.tags || []).join(', '),
    })
    setEditingId(stay._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this stay?')) return
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (res.status !== 204) throw new Error('Delete failed')
      showToast('Stay deleted successfully')
      fetchStays()
    } catch {
      showToast('Delete failed', 'error')
    }
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="py-10 bg-[#fdf8f2] dark:bg-[#0a1f14] min-h-screen">
      <div className="section-pad max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="display-font text-3xl font-bold text-[#1c1c1c] dark:text-white">Admin Panel</h1>
            <p className="text-sm text-[#777] dark:text-white/60 mt-1">{stays.length} stays in database</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-sm py-2 px-5"
            >
              + Add new stay
            </button>
          )}
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <div className="bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl p-6 mb-10">
            <h2 className="display-font text-xl font-bold text-[#1c1c1c] dark:text-white mb-6">
              {editingId ? 'Edit Stay' : 'Add New Stay'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'title', label: 'Title', placeholder: 'Himalayan Pine Cottage' },
                { name: 'location', label: 'Location', placeholder: 'Chopta, Rudraprayag' },
                { name: 'price', label: 'Price per night (₹)', placeholder: '1400', type: 'number' },
                { name: 'host', label: 'Host name', placeholder: 'Ramesh Ji' },
                { name: 'rating', label: 'Rating', placeholder: '4.9', type: 'number' },
                { name: 'reviews', label: 'Reviews count', placeholder: '38', type: 'number' },
                { name: 'image', label: 'Image URL', placeholder: 'https://picsum.photos/seed/name/400/300' },
                { name: 'tags', label: 'Tags (comma separated)', placeholder: 'Forest view, Trekking' },
              ].map(({ name, label, placeholder, type = 'text' }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-[#555] dark:text-white/70 mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-[#0d2b1a] text-[#1c1c1c] dark:text-white outline-none focus:border-[#2d7a4f]"
                  />
                </div>
              ))}

              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  name="eco"
                  id="eco"
                  checked={form.eco}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#2d7a4f]"
                />
                <label htmlFor="eco" className="text-sm text-[#555] dark:text-white/70 font-medium">Eco-certified</label>
              </div>

              <div className="sm:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="btn-primary text-sm py-2 px-6">
                  {editingId ? 'Update stay' : 'Create stay'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline text-sm py-2 px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stays Table */}
        {loading ? (
          <p className="text-[#777] text-sm">Loading stays...</p>
        ) : (
          <div className="space-y-3">
            {stays.map(stay => (
              <div key={stay._id} className="flex items-center justify-between gap-4 bg-white dark:bg-[#1a4a31] border border-[#e8dfc8] dark:border-[#2d7a4f]/30 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {stay.image && (
                    <img src={stay.image} alt={stay.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1c1c1c] dark:text-white text-sm truncate">{stay.title}</p>
                    <p className="text-xs text-[#888] dark:text-white/50 truncate">{stay.location}</p>
                    <p className="text-xs text-[#2d7a4f] font-medium">₹{stay.price?.toLocaleString()}/night</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(stay)}
                    className="text-xs font-semibold text-[#2d7a4f] border border-[#2d7a4f] px-3 py-1.5 rounded-full hover:bg-[#2d7a4f] hover:text-white transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(stay._id)}
                    className="text-xs font-semibold text-red-500 border border-red-400 px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
    </div>
  )
      }
