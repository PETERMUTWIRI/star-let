// app/admin/music/page.tsx - Music Management Admin
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSave, FaArrowLeft, FaMusic, FaImage, FaYoutube, FaEye, FaEyeSlash, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminMusicPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading editor...</div>}>
      <MusicEditor />
    </Suspense>
  );
}

function MusicEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  /* ---------- form state ---------- */
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Single' as 'Single' | 'Album' | 'Live Performance' | 'Cover' | 'Reel/Short' | 'Worship' | 'Music Video',
    youtubeUrl: '',
    youtubeId: '',
    thumbnail: '',
    useCustomThumbnail: false,
    published: true,
    order: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  /* ---------- load on mount ---------- */
  useEffect(() => {
    if (editId) loadMusic(Number(editId));
  }, [editId]);

  /* ---------- extract YouTube ID from URL ---------- */
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/, // Just the ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  /* ---------- handle YouTube URL change ---------- */
  const handleYoutubeUrlChange = (url: string) => {
    const videoId = extractYouTubeId(url);
    setForm(p => ({
      ...p,
      youtubeUrl: url,
      youtubeId: videoId || '',
      thumbnail: videoId && !p.useCustomThumbnail ? getYouTubeThumbnail(videoId) : p.thumbnail,
    }));
    setPreviewError(videoId ? '' : url ? 'Invalid YouTube URL' : '');
  };

  const loadMusic = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/music?id=${id}`);
      const music = await res.json();
      setForm({
        title: music.title || '',
        description: music.description || '',
        category: music.category || 'Single',
        youtubeUrl: music.youtubeUrl || '',
        youtubeId: music.youtubeId || '',
        thumbnail: music.thumbnail || '',
        useCustomThumbnail: music.useCustomThumbnail || false,
        published: music.published ?? true,
        order: music.order ?? 0,
      });
    } catch (e) {
      console.error(e);
      alert('Failed to load music entry');
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

  /* ---------- image upload ---------- */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) {
        setForm(p => ({ ...p, thumbnail: data.url, useCustomThumbnail: true }));
      }
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploadLoading(false);
    }
  };

  /* ---------- save ---------- */
  const saveMusic = async () => {
    if (!form.title || !form.youtubeUrl) return alert('Title & YouTube URL are required');
    if (!form.youtubeId) return alert('Invalid YouTube URL. Please check the URL.');

    setIsLoading(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/music?id=${editId}` : '/api/music';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Save failed');
      }

      alert(editId ? 'Music entry updated!' : 'Music entry saved!');
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
          <h2 className="text-2xl font-black text-gray-900">{editId ? 'Edit' : 'Add'} Music</h2>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${form.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {form.published ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="p-8">
        <div className="space-y-6">
          {/* title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Song/Video Title *</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="e.g., Ni Mwema Yesu" 
              className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500" 
              disabled={isLoading} 
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2"><FaYoutube className="inline mr-1 text-red-600" /> YouTube URL *</label>
            <input 
              name="youtubeUrl" 
              value={form.youtubeUrl} 
              onChange={(e) => handleYoutubeUrlChange(e.target.value)} 
              placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..." 
              className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500" 
              disabled={isLoading} 
            />
            {previewError && <p className="text-sm text-red-500 mt-1">{previewError}</p>}
            <p className="text-xs text-gray-500 mt-1">Supports regular videos, shorts, and youtu.be links</p>
          </div>

          {/* YouTube Preview */}
          {form.youtubeId && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preview</label>
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

          {/* category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select 
              name="category" 
              value={form.category} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" 
              disabled={isLoading}
            >
              <option value="Single">Single</option>
              <option value="Album">Album</option>
              <option value="Live Performance">Live Performance</option>
              <option value="Cover">Cover</option>
              <option value="Reel/Short">Reel/Short</option>
              <option value="Worship">Worship</option>
              <option value="Music Video">Music Video</option>
            </select>
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Brief description of the song/video..." 
              className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900 h-32" 
              disabled={isLoading} 
            />
          </div>

          {/* THUMBNAIL */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-gray-700 mb-2"><FaImage className="inline mr-1" /> Thumbnail</label>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="useCustomThumbnail" 
                  checked={form.useCustomThumbnail} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-blue-600" 
                />
                <span className="text-sm">Use custom thumbnail</span>
              </label>
            </div>

            {form.useCustomThumbnail ? (
              <>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isLoading || uploadLoading} />
                {uploadLoading && <span className="text-blue-600 text-sm ml-2">Uploading...</span>}
              </>
            ) : (
              <p className="text-sm text-gray-600">Using auto-generated YouTube thumbnail</p>
            )}
            
            {form.thumbnail && (
              <div className="mt-3 relative inline-block">
                <img src={form.thumbnail} alt="Thumbnail" className="h-32 rounded shadow object-cover aspect-video" />
                <button 
                  onClick={() => setForm(p => ({ 
                    ...p, 
                    thumbnail: p.youtubeId ? getYouTubeThumbnail(p.youtubeId) : '', 
                    useCustomThumbnail: false 
                  }))} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
            <input 
              type="number" 
              name="order" 
              value={form.order} 
              onChange={handleChange} 
              placeholder="0" 
              className="w-full px-4 py-3 border rounded-lg bg-white text-gray-900" 
              disabled={isLoading} 
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          {/* published checkbox */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                name="published" 
                checked={form.published} 
                onChange={handleChange} 
                className="w-4 h-4 text-blue-600" 
                disabled={isLoading} 
              />
              <span className="font-medium text-gray-700">
                {form.published ? <><FaEye className="inline mr-1" /> Published</> : <><FaEyeSlash className="inline mr-1" /> Draft</>}
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-6">Draft entries are only visible in the admin panel.</p>
          </div>

          {/* save btn */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button 
              onClick={saveMusic} 
              disabled={isLoading} 
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaSave /> {isLoading ? 'Saving...' : (editId ? 'Update' : 'Save')} Music Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
