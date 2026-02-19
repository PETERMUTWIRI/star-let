// app/admin/events/page.tsx - ENTERPRISE EVENT EDITOR (mirrors blog)
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSave, FaArrowLeft, FaCalendar, FaClock, FaMapMarkerAlt, FaImage, FaGlobe, FaPlus, FaTrash } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading editor...</div>}>
      <EventEditor />
    </Suspense>
  );
}

function EventEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  /* ---------- form state (mirrors blog) ---------- */
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Upcoming' as 'Upcoming' | 'Past',
    location: '',
    startDate: '',
    endDate: '',
    cover: '',
    author: '',
    metaTitle: '',
    metaDesc: '',
    ogImage: '',
    venue: '',
    address: '',
    registrationLink: '',
    registrationType: 'native' as 'native' | 'external' | 'email' | 'none',
    maxAttendees: '',
    isFree: true,
    ticketPrice: '',
    ticketPriceCents: '',
    gallery: [] as string[], // NEW
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'seo'>('details');

  /* ---------- load on mount ---------- */
  useEffect(() => {
    if (editId) loadEvent(Number(editId));
  }, [editId]);

  const loadEvent = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/events?id=${id}`);
      const ev = await res.json();
      // cast maxAttendees and ticketPriceCents to string for input fields
      setForm({ 
        ...ev, 
        gallery: ev.gallery || [], 
        maxAttendees: ev.maxAttendees?.toString() ?? '',
        ticketPriceCents: ev.ticketPriceCents?.toString() ?? '',
        registrationType: ev.registrationType || 'native',
      });
    } catch (e) {
      console.error(e);
      alert('Failed to load event');
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- change handler ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(p => ({ ...p, [name]: checked }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  /* ---------- auto-generate helpers (same as blog) ---------- */
  useEffect(() => {
    if (form.description && !form.metaDesc) {
      const plain = form.description.replace(/<[^>]*>/g, '');
      setForm(p => ({ ...p, metaDesc: plain.slice(0, 160) }));
    }
  }, [form.description]);

  useEffect(() => {
    if (form.title && !form.metaTitle) {
      setForm(p => ({ ...p, metaTitle: form.title.slice(0, 60) }));
    }
  }, [form.title]);

  /* ---------- multi-image upload (same as blog) ---------- */
  const uploadImages = async (files: FileList) => {
    if (files.length + form.gallery.length > 10) return alert('Max 10 images');
    setUploadLoading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    setForm(p => ({ ...p, gallery: [...p.gallery, ...urls] }));
    setUploadLoading(false);
  };

  const removeGallery = (index: number) =>
    setForm(p => ({ ...p, gallery: p.gallery.filter((_, i) => i !== index) }));

  /* ---------- cast & save (same clean-up as blog) ---------- */
  const saveEvent = async () => {
    if (!form.title || !form.location) return alert('Title & location required');

    setIsLoading(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/events?id=${editId}` : '/api/events';

      /* ---- cast maxAttendees & ticketPriceCents before send ---- */
      const payload = {
        ...form,
        maxAttendees: form.maxAttendees ? Number(form.maxAttendees) : null,
        ticketPrice: form.isFree ? undefined : form.ticketPrice,
        ticketPriceCents: form.isFree ? undefined : (form.ticketPriceCents ? Number(form.ticketPriceCents) : undefined),
        // Only include registrationLink when relevant
        registrationLink: (form.registrationType === 'external' || form.registrationType === 'email') 
          ? form.registrationLink 
          : undefined,
      };

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Save failed');
      alert(editId ? 'Event updated!' : 'Event saved!');
      router.push('/admin');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- single image helper (same as blog) ---------- */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'ogImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) setForm(p => ({ ...p, [field]: data.url }));
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  /* ---------- render (mirrors blog structure) ---------- */
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* header */}
      <div className="bg-gray-50 border-b px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900"><FaArrowLeft size={20} /></Link>
          <h2 className="text-2xl font-black text-gray-900">{editId ? 'Edit' : 'Create'} Event</h2>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${form.category === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{form.category}</span>
      </div>

      {/* tabs */}
      <div className="flex border-b">
        <button onClick={() => setActiveTab('details')} className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}><FaCalendar /> Event Details</button>
        <button onClick={() => setActiveTab('seo')} className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'seo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}><FaGlobe /> SEO & Meta</button>
      </div>

      <div className="p-8">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g., Community Health Fair" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>

            {/* author / organiser */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organiser</label>
              <input name="author" value={form.author} onChange={handleChange} placeholder="New International Hope Team" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading} />
            </div>

            {/* category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading}>
                <option value="Upcoming">Upcoming</option>
                <option value="Past">Past Event</option>
              </select>
            </div>

            {/* dates (simple text) */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2"><FaClock className="inline mr-1" /> Start Date</label>
                <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="2026-06-20T09:00" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading} />
                <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DDTHH:MM</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2"><FaClock className="inline mr-1" /> End Date (optional)</label>
                <input name="endDate" value={form.endDate} onChange={handleChange} placeholder="2026-06-20T16:00" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading} />
              </div>
            </div>

            {/* location / venue / address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2"><FaMapMarkerAlt className="inline mr-1" /> Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Downtown Community Center" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading} />
            </div>
            <input name="venue" value={form.venue} onChange={handleChange} placeholder="Grand Ballroom" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading} />
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, City, State 12345" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 h-24" disabled={isLoading} />

            {/* tickets */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Ticket Info</h4>
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="w-4 h-4 text-blue-600" disabled={isLoading} />
                <span>Free Event</span>
              </label>
              {!form.isFree && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Price ($)</label>
                    <input 
                      type="number" 
                      name="ticketPriceCents" 
                      value={form.ticketPriceCents} 
                      onChange={(e) => {
                        const cents = e.target.value;
                        setForm(p => ({ 
                          ...p, 
                          ticketPriceCents: cents,
                          ticketPrice: cents ? `$${(Number(cents) / 100).toFixed(2)}` : ''
                        }));
                      }} 
                      placeholder="2500 (=$25.00)" 
                      className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" 
                      disabled={isLoading} 
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter amount in cents (e.g., 2500 = $25.00)</p>
                    {form.ticketPrice && <p className="text-sm text-green-600 mt-1">Price: {form.ticketPrice}</p>}
                  </div>
                </>
              )}
              <input type="number" name="maxAttendees" value={form.maxAttendees} onChange={handleChange} placeholder="Max attendees (optional)" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading} />
            </div>

            {/* registration type */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Registration Method</h4>
              
              <div className="space-y-3 mb-4">
                <label className="flex items-start gap-3 p-3 rounded-lg bg-white border cursor-pointer hover:border-blue-400 transition-colors">
                  <input 
                    type="radio" 
                    name="registrationType" 
                    value="native" 
                    checked={form.registrationType === 'native'}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Built-in Registration</span>
                    <p className="text-sm text-gray-500">Use our native checkout (Stripe for paid, instant confirmation for free)</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-white border cursor-pointer hover:border-purple-400 transition-colors">
                  <input 
                    type="radio" 
                    name="registrationType" 
                    value="external" 
                    checked={form.registrationType === 'external'}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-purple-600"
                  />
                  <div>
                    <span className="font-medium text-gray-900">External Link</span>
                    <p className="text-sm text-gray-500">Link to Eventbrite, Ticketmaster, or other ticketing platform</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-white border cursor-pointer hover:border-green-400 transition-colors">
                  <input 
                    type="radio" 
                    name="registrationType" 
                    value="email" 
                    checked={form.registrationType === 'email'}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-green-600"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Email RSVP</span>
                    <p className="text-sm text-gray-500">Attendees send an RSVP email to you</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg bg-white border cursor-pointer hover:border-gray-400 transition-colors">
                  <input 
                    type="radio" 
                    name="registrationType" 
                    value="none" 
                    checked={form.registrationType === 'none'}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-gray-600"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Coming Soon</span>
                    <p className="text-sm text-gray-500">Registration not open yet</p>
                  </div>
                </label>
              </div>

              {/* Show registration link input only for external or email */}
              {(form.registrationType === 'external' || form.registrationType === 'email') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {form.registrationType === 'external' ? 'External URL' : 'Email Address'}
                  </label>
                  <input 
                    name="registrationLink" 
                    value={form.registrationLink} 
                    onChange={handleChange} 
                    placeholder={form.registrationType === 'external' ? 'https://eventbrite.com/...' : 'newinternationalhope@gmail.com'} 
                    className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" 
                    disabled={isLoading} 
                  />
                </div>
              )}
            </div>

            {/* COVER IMAGE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2"><FaImage className="inline mr-1" /> Cover Image</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    disabled={isLoading || uploadLoading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="cover-upload-events"
                  />
                  <label
                    htmlFor="cover-upload-events"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-blue-700 font-medium">
                      {uploadLoading ? 'Uploading...' : 'Choose Cover Image'}
                    </span>
                  </label>
                </div>
                {form.cover && (
                  <div className="relative">
                    <img src={form.cover} alt="Cover" className="h-24 rounded shadow border" />
                    <button onClick={() => setForm(p => ({ ...p, cover: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600">×</button>
                  </div>
                )}
              </div>
            </div>
            {/* GALLERY (NEW) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2"><FaImage className="inline mr-1" /> Gallery (max 10)</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && uploadImages(e.target.files)}
                  disabled={isLoading || uploadLoading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="gallery-upload-events"
                />
                <label
                  htmlFor="gallery-upload-events"
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:bg-green-100 hover:border-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    {uploadLoading ? 'Uploading...' : 'Choose Gallery Images'}
                  </span>
                </label>
              </div>
              {uploadLoading && <span className="text-blue-600 text-sm ml-2">Uploading...</span>}
            </div>
            {/* GALLERY (NEW) */}
            <div className="flex flex-wrap gap-2 mt-2">
              {form.gallery.map((url, i) => (
                <div key={i} className="relative">
                  {/* ✅ plain img → bypasses Next optimization */}
                  <img src={url} alt="" className="h-20 rounded object-cover" />
                  <button onClick={() => removeGallery(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600">×</button>
                </div>
              ))}
            </div>

            {/* description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Event description..." className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 h-40" disabled={isLoading} />
            </div>

            {/* save btn */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button onClick={saveEvent} disabled={isLoading} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
                <FaSave /> {isLoading ? 'Saving...' : (editId ? 'Update Event' : 'Save Event')}
              </button>
            </div>
          </div>
        )}

        {/* ---------- SEO TAB ---------- */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-1">SEO Settings</h3>
            <p className="text-sm text-blue-700">Optimise how this event appears in search engines and social media.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title (60 chars max)</label>
            <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="SEO title for search results..." className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" maxLength={60} />
            <div className="flex justify-between mt-1"><span className="text-xs text-gray-500">{form.metaTitle.length}/60</span><span className="text-xs text-gray-500">Recommended: 50-60 characters</span></div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description (160 chars max)</label>
            <textarea name="metaDesc" value={form.metaDesc} onChange={handleChange} placeholder="Brief description for search results..." className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 h-24" maxLength={160} />
            <div className="flex justify-between mt-1"><span className="text-xs text-gray-500">{form.metaDesc.length}/160</span><span className="text-xs text-gray-500">Recommended: 150-160 characters</span></div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Social Media Image (Open Graph)</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'ogImage')}
                  disabled={isLoading || uploadLoading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="og-upload-events"
                />
                <label
                  htmlFor="og-upload-events"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:bg-purple-100 hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm text-purple-700 font-medium">
                    {uploadLoading ? 'Uploading...' : 'Choose Social Image'}
                  </span>
                </label>
              </div>
              {form.ogImage && (
                <div className="relative">
                  <img src={form.ogImage} alt="OG" className="h-24 rounded shadow border" />
                  <button onClick={() => setForm(p => ({ ...p, ogImage: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600">×</button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Recommended: 1200×630 pixels</p>
          </div>

          {/* Google preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Google Search Preview</h4>
            <div className="bg-white p-4 rounded border">
              <div className="text-blue-800 text-lg truncate" style={{ color: '#1a0dab' }}>{form.metaTitle || form.title || 'Event Title'}</div>
              <div className="text-green-700 text-sm truncate">nihiri.com › events › {(form.title || 'event').toLowerCase().replace(/\s+/g, '-')}</div>
              <div className="text-gray-600 text-sm line-clamp-2 mt-1">{form.metaDesc || form.description?.replace(/<[^>]*>/g, '').slice(0, 160) || 'No description provided...'}</div>
            </div>
          </div>
        </div>

        {/* ---------- SAVE BUTTON ---------- */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button onClick={saveEvent} disabled={isLoading} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
            <FaSave /> {isLoading ? 'Saving...' : (editId ? 'Update Event' : 'Save Event')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- helper: single image upload (same as blog) ---------- */
async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'ogImage') {
  const file = e.target.files?.[0];
  if (!file) return;
  const body = new FormData();
  body.append('file', file);
  try {
    const res = await fetch('/api/upload', { method: 'POST', body });
    const data = await res.json();
    if (data.url) window.dispatchEvent(new CustomEvent('uploadDone', { detail: { field, url: data.url } }));
  } catch (error) {
    alert('Failed to upload image');
  }
}