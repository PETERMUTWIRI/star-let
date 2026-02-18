// app/admin/videos/page.tsx - VIDEO MANAGEMENT EDITOR
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSave, FaArrowLeft, FaVideo, FaImage, FaGlobe, FaYoutube, FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminVideosPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading editor...</div>}>
      <VideoEditor />
    </Suspense>
  );
}

function VideoEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  /* ---------- form state ---------- */
  const [form, setForm] = useState({
    title: '',
    description: '',
    youtubeId: '',
    category: 'Music Video' as 'Music Video' | 'Live Performance' | 'Behind the Scenes' | 'Interview' | 'Lyric Video',
    thumbnail: '',
    published: true,
    order: 0,
    metaTitle: '',
    metaDesc: '',
    ogImage: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'seo'>('details');

  /* ---------- load on mount ---------- */
  useEffect(() => {
    if (editId) loadVideo(Number(editId));
  }, [editId]);

  const loadVideo = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/videos?id=${id}`);
      const video = await res.json();
      setForm({
        title: video.title || '',
        description: video.description || '',
        youtubeId: video.youtubeId || '',
        category: video.category || 'Music Video',
        thumbnail: video.thumbnail || '',
        published: video.published ?? true,
        order: video.order ?? 0,
        metaTitle: video.metaTitle || '',
        metaDesc: video.metaDesc || '',
        ogImage: video.ogImage || '',
      });
    } catch (e) {
      console.error(e);
      alert('Failed to load video');
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
    } else if (type === 'number') {
      setForm(p => ({ ...p, [name]: Number(value) }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  /* ---------- auto-generate thumbnail from YouTube ID ---------- */
  useEffect(() => {
    if (form.youtubeId && !form.thumbnail) {
      // YouTube thumbnail URL: https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg
      setForm(p => ({ ...p, thumbnail: `https://img.youtube.com/vi/${form.youtubeId}/maxresdefault.jpg` }));
    }
  }, [form.youtubeId]);

  /* ---------- auto-generate helpers ---------- */
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

  /* ---------- image upload ---------- */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'ogImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadLoading(true);
    const body = new FormData();
    body.append('file', file);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) setForm(p => ({ ...p, [field]: data.url }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  /* ---------- save ---------- */
  const saveVideo = async () => {
    if (!form.title || !form.youtubeId) return alert('Title & YouTube Video ID are required');

    // Validate YouTube ID format (11 characters, alphanumeric and -_)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(form.youtubeId)) {
      return alert('Invalid YouTube Video ID. It should be 11 characters long.');
    }

    setIsLoading(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/videos?id=${editId}` : '/api/videos';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Save failed');
      alert(editId ? 'Video updated!' : 'Video saved!');
      router.push('/admin');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* header */}
      <div className="bg-gray-50 border-b px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900"><FaArrowLeft size={20} /></Link>
          <h2 className="text-2xl font-black text-gray-900">{editId ? 'Edit' : 'Create'} Video</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${form.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {form.published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* tabs */}
      <div className="flex border-b">
        <button onClick={() => setActiveTab('details')} className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'details' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}><FaVideo /> Video Details</button>
        <button onClick={() => setActiveTab('seo')} className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === 'seo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}><FaGlobe /> SEO & Meta</button>
      </div>

      <div className="p-8">
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Video Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g., Summer Vibes Official Music Video" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500" disabled={isLoading} />
            </div>

            {/* YouTube ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2"><FaYoutube className="inline mr-1 text-red-600" /> YouTube Video ID *</label>
              <input name="youtubeId" value={form.youtubeId} onChange={handleChange} placeholder="e.g., dQw4w9WgXcQ" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500" disabled={isLoading} maxLength={11} />
              <p className="text-xs text-gray-500 mt-1">The 11-character ID from the YouTube URL (e.g., youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)</p>
              
              {/* YouTube Preview */}
              {form.youtubeId && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Preview</p>
                  <div className="aspect-video max-w-md bg-gray-900 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${form.youtubeId}`}
                      title="YouTube video preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading}>
                <option value="Music Video">Music Video</option>
                <option value="Live Performance">Live Performance</option>
                <option value="Behind the Scenes">Behind the Scenes</option>
                <option value="Interview">Interview</option>
                <option value="Lyric Video">Lyric Video</option>
              </select>
            </div>

            {/* order */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
              <input type="number" name="order" value={form.order} onChange={handleChange} placeholder="0" className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" disabled={isLoading} />
              <p className="text-xs text-gray-500 mt-1">Lower numbers appear first. Videos are sorted by order, then by date added.</p>
            </div>

            {/* published checkbox */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 text-blue-600" disabled={isLoading} />
                <span className="font-medium text-gray-700">
                  {form.published ? <><FaEye className="inline mr-1" /> Published</> : <><FaEyeSlash className="inline mr-1" /> Draft</>}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2 ml-6">Draft videos are only visible in the admin panel.</p>
            </div>

            {/* THUMBNAIL */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2"><FaImage className="inline mr-1" /> Thumbnail</label>
              
              {form.thumbnail && (
                <div className="mb-4 relative inline-block">
                  <img src={form.thumbnail} alt="Thumbnail" className="h-40 rounded-lg shadow-lg object-cover aspect-video" />
                  <button 
                    onClick={() => {
                      if (form.youtubeId) {
                        // Reset to YouTube auto-generated thumbnail
                        setForm(p => ({ ...p, thumbnail: `https://img.youtube.com/vi/${form.youtubeId}/maxresdefault.jpg` }));
                      } else {
                        setForm(p => ({ ...p, thumbnail: '' }));
                      }
                    }} 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-md"
                    title="Remove custom thumbnail"
                  >×</button>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <FaImage className="text-gray-400" />
                      <span className="text-sm text-gray-600">Upload Custom Thumbnail</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'thumbnail')} 
                      disabled={isLoading || uploadLoading}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {uploadLoading && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <span className="animate-spin">⟳</span>
                    Uploading...
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  {form.thumbnail?.includes('img.youtube.com') 
                    ? 'Currently using auto-generated YouTube thumbnail. Upload a custom image to override it.' 
                    : 'Using custom uploaded thumbnail.'}
                </p>
              </div>
            </div>

            {/* description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Video description..." className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 h-40" disabled={isLoading} />
            </div>

            {/* save btn */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button onClick={saveVideo} disabled={isLoading} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
                <FaSave /> {isLoading ? 'Saving...' : (editId ? 'Update Video' : 'Save Video')}
              </button>
            </div>
          </div>
        )}

        {/* ---------- SEO TAB ---------- */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-1">SEO Settings</h3>
              <p className="text-sm text-blue-700">Optimise how this video appears in search engines and social media.</p>
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
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'ogImage')} disabled={isLoading || uploadLoading} />
              {uploadLoading && <span className="text-blue-600 text-sm ml-2">Uploading...</span>}
              {form.ogImage && (
                <div className="mt-2 relative inline-block">
                  <img src={form.ogImage} alt="OG" className="h-24 rounded shadow" />
                  <button onClick={() => setForm(p => ({ ...p, ogImage: '' }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600">×</button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Recommended: 1200×630 pixels</p>
            </div>

            {/* Google preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Google Search Preview</h4>
              <div className="bg-white p-4 rounded border">
                <div className="text-blue-800 text-lg truncate" style={{ color: '#1a0dab' }}>{form.metaTitle || form.title || 'Video Title'}</div>
                <div className="text-green-700 text-sm truncate">staramillion.com › videos › {(form.title || 'video').toLowerCase().replace(/\s+/g, '-')}</div>
                <div className="text-gray-600 text-sm line-clamp-2 mt-1">{form.metaDesc || form.description?.slice(0, 160) || 'No description provided...'}</div>
              </div>
            </div>

            {/* save btn */}
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button onClick={saveVideo} disabled={isLoading} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
                <FaSave /> {isLoading ? 'Saving...' : (editId ? 'Update Video' : 'Save Video')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
