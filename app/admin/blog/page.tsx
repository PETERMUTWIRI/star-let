// app/admin/blog/page.tsx - ENTERPRISE ADMIN EDITOR
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSave, FaArrowLeft, FaEye, FaEyeSlash, FaImage } from 'react-icons/fa';
import Link from 'next/link';

// Wrapper with Suspense for useSearchParams
export default function AdminBlogPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading editor...</div>}>
      <BlogEditor />
    </Suspense>
  );
}

function BlogEditor() {
  // Core fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('News');
  const [cover, setCover] = useState('');
  const [excerpt, setExcerpt] = useState('');
  
  // SEO & Meta fields (NEW)
  const [author, setAuthor] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [ogImage, setOgImage] = useState('');
  
  // Publishing control (NEW)
  const [published, setPublished] = useState(true);
  const [publishedAt, setPublishedAt] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [EditorComponent, setEditorComponent] = useState<any>(null);
  const [ClassicEditor, setClassicEditor] = useState<any>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  // Load CKEditor client-side only
  useEffect(() => {
    let mounted = true;
    
    const loadEditor = async () => {
      const [{ CKEditor }, ClassicEditorBuild] = await Promise.all([
        import('@ckeditor/ckeditor5-react'),
        import('@ckeditor/ckeditor5-build-classic'),
      ]);
      
      if (mounted) {
        setEditorComponent(() => CKEditor);
        setClassicEditor(() => ClassicEditorBuild.default);
      }
    };
    
    loadEditor();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (editId) {
      loadPost(Number(editId));
    }
  }, [editId]);

  const loadPost = async (id: number) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/blog?id=${id}`);
      const post = await res.json();
      
      // Set all fields
      setTitle(post.title);
      setContent(post.content);
      setCategory(post.category);
      setCover(post.cover || '');
      setExcerpt(post.excerpt || '');
      setAuthor(post.author || '');
      setMetaTitle(post.metaTitle || '');
      setMetaDesc(post.metaDesc || '');
      setOgImage(post.ogImage || '');
      setPublished(post.published);
      setPublishedAt(post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '');
    } catch (error) {
      console.error('Failed to load post:', error);
      alert('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate excerpt from content
  useEffect(() => {
    if (content && !excerpt) {
      const plainText = content.replace(/<[^>]*>/g, '');
      setExcerpt(plainText.slice(0, 200) + (plainText.length > 200 ? '...' : ''));
    }
  }, [content]);

  // Auto-generate meta title from title
  useEffect(() => {
    if (title && !metaTitle) {
      setMetaTitle(title.slice(0, 60));
    }
  }, [title]);

  // Auto-generate meta desc from excerpt
  useEffect(() => {
    if (excerpt && !metaDesc) {
      setMetaDesc(excerpt.slice(0, 160));
    }
  }, [excerpt]);

  // Add to your admin editor save function
  const savePost = async (asDraft = false) => {
    if (!title || !content) return alert('Title & content required');
  
    setIsLoading(true);
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/blog?id=${editId}` : '/api/blog';
    
      const payload = {
        title,
        content,
        category,
        cover,
        excerpt,
        author: author || undefined,
        metaTitle: metaTitle || undefined,
        metaDesc: metaDesc || undefined,
        ogImage: ogImage || undefined,
        published: asDraft ? false : published,
        publishedAt: asDraft ? null : (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save post');
      }

      // ❌ FIXED: Auto-revalidate blog after publishing
      if (!asDraft && published) {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paths: ['/blog'] }),
        });
      }

      alert(asDraft ? 'Draft saved!' : editId ? 'Post updated!' : 'Post published!');
      router.push('/admin');
    } catch (error) {
      console.error('Save error:', error);
      alert(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (_event: any, editor: any) => {
    setContent(editor.getData());
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const body = new FormData();
    body.append('file', file);
    
    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const { url } = await res.json();
      setter(url);
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  if (!EditorComponent || !ClassicEditor) {
    return <div className="p-8">Loading rich text editor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <FaArrowLeft size={20} />
          </Link>
          <h2 className="text-2xl font-black text-gray-900">
            {editId ? 'Edit' : 'Create'} Blog Post
          </h2>
        </div>
        
        {/* Publish Toggle */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-medium text-gray-700">
              {published ? <><FaEye className="inline mr-1"/> Published</> : <><FaEyeSlash className="inline mr-1"/> Draft</>}
            </span>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-6 py-3 font-medium ${activeTab === 'content' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-6 py-3 font-medium ${activeTab === 'seo' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          SEO & Meta
        </button>
      </div>

      <div className="p-8">
        {activeTab === 'content' ? (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="e.g., John Doe, Communications Team"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                className="w-full px-4 py-3 border rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
              >
                {['News', 'Impact Story', 'Event Recap', 'Advocacy', 'Opinion'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setCover)}
                  disabled={isLoading}
                  className="flex-1"
                />
                {cover && (
                  <div className="relative">
                    <img src={cover} alt="cover" className="h-20 w-20 object-cover rounded" />
                    <button 
                      onClick={() => setCover('')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt (Auto-generated from content, or customize)
              </label>
              <textarea
                className="w-full px-4 py-3 border rounded-lg h-24"
                placeholder="Brief summary for blog cards..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                maxLength={500}
              />
              <span className="text-xs text-gray-500">{excerpt.length}/500</span>
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
              <div className="border rounded-lg overflow-hidden">
                <EditorComponent
                  editor={ClassicEditor}
                  data={content}
                  onChange={handleEditorChange}
                  config={{
                    placeholder: 'Write your story here...',
                  }}
                />
              </div>
            </div>

            {/* Schedule Publish */}
            {published && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Publish Date/Time (optional - defaults to now)
                </label>
                <input
                  type="datetime-local"
                  className="px-4 py-3 border rounded-lg"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </div>
            )}
          </div>
        ) : (
          /* SEO Tab */
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-blue-900 mb-1">SEO Settings</h3>
              <p className="text-sm text-blue-700">Optimize how this post appears in search engines and social media.</p>
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta Title (60 chars max)
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="SEO title for search results..."
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={60}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{metaTitle.length}/60</span>
                <span className="text-xs text-gray-500">Recommended: 50-60 characters</span>
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Meta Description (160 chars max)
              </label>
              <textarea
                className="w-full px-4 py-3 border rounded-lg h-24"
                placeholder="Brief description for search results..."
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                maxLength={160}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{metaDesc.length}/160</span>
                <span className="text-xs text-gray-500">Recommended: 150-160 characters</span>
              </div>
            </div>

            {/* OG Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Social Media Image (Open Graph)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setOgImage)}
                  disabled={isLoading}
                  className="flex-1"
                />
                {ogImage && (
                  <div className="relative">
                    <img src={ogImage} alt="og" className="h-20 w-20 object-cover rounded" />
                    <button 
                      onClick={() => setOgImage('')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Recommended: 1200×630 pixels</p>
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Google Search Preview</h4>
              <div className="bg-white p-4 rounded border">
                <div className="text-blue-800 text-lg truncate" style={{color: '#1a0dab'}}>
                  {metaTitle || title || 'Post Title'}
                </div>
                <div className="text-green-700 text-sm truncate">
                  nihiri.com › blog › {title.toLowerCase().replace(/\s+/g, '-')}
                </div>
                <div className="text-gray-600 text-sm line-clamp-2 mt-1">
                  {metaDesc || excerpt || 'No description provided...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button 
            onClick={() => savePost(false)} 
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={isLoading}
          >
            <FaSave /> {editId ? 'Update Post' : (published ? 'Publish Now' : 'Save as Draft')}
          </button>
          
          {!editId && published && (
            <button 
              onClick={() => savePost(true)} 
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              disabled={isLoading}
            >
              Save as Draft
            </button>
          )}
        </div>
      </div>
    </div>
  );
}