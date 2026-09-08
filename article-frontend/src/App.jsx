import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2, Plus, Eye, List } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [activePage, setActivePage] = useState('all-posts'); 
  const [activeTab, setActiveTab] = useState('publish'); 
  
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  const [page, setPage] = useState(0);
  const limit = 5;

  useEffect(() => {
    fetchPosts();
  }, [activeTab, activePage, page]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/article/100/0`);
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setEditId(null);
  };

  const handleSave = async (status) => {
    if (title.length < 20) {
      alert('Title minimal 20 karakter!');
      return;
    }
    if (content.length < 200) {
      alert('Content minimal 200 karakter!');
      return;
    }
    if (category.length < 3) {
      alert('Category minimal 3 karakter!');
      return;
    }

    const payload = { title, content, category, status };

    try {
      if (editId) {
        await axios.post(`${API_BASE_URL}/article/${editId}`, payload);
        alert('Artikel berhasil diperbarui!');
      } else {
        await axios.post(`${API_BASE_URL}/article/`, payload);
        alert('Artikel berhasil ditambahkan!');
      }
      resetForm();
      setActivePage('all-posts');
    } catch (err) {
      alert('Gagal menyimpan data. Pastikan kriteria validasi terpenuhi.');
    }
  };

  const handleEditClick = (post) => {
    setEditId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setActivePage('edit-post');
  };

  const handleMoveToTrash = async (post) => {
    if (!window.confirm('Pindahkan artikel ke tab Trashed?')) return;
    try {
      const payload = {
        title: post.title,
        content: post.content,
        category: post.category,
        status: 'thrash'
      };
      await axios.post(`${API_BASE_URL}/article/${post.id}`, payload);
      fetchPosts();
    } catch (err) {
      alert('Gagal memindahkan artikel ke trash.');
    }
  };

  const filteredPosts = posts.filter((p) => p.status === activeTab);
  const publishedPosts = posts.filter((p) => p.status === 'publish');
  const paginatedPosts = publishedPosts.slice(page * limit, (page + 1) * limit);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h1 className="text-xl font-bold mb-8 text-blue-400">Article Admin</h1>
        <nav className="space-y-2">
          <button
            onClick={() => { setActivePage('all-posts'); resetForm(); }}
            className={`w-full flex items-center gap-2 p-3 rounded text-left ${activePage === 'all-posts' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <List size={18} /> All Posts
          </button>
          <button
            onClick={() => { setActivePage('add-new'); resetForm(); }}
            className={`w-full flex items-center gap-2 p-3 rounded text-left ${activePage === 'add-new' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Plus size={18} /> Add New
          </button>
          <button
            onClick={() => { setActivePage('preview'); resetForm(); }}
            className={`w-full flex items-center gap-2 p-3 rounded text-left ${activePage === 'preview' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
          >
            <Eye size={18} /> Preview Blog
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {activePage === 'all-posts' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Posts</h2>
            <div className="flex border-b mb-6">
              {['publish', 'draft', 'thrash'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-6 font-medium capitalize border-b-2 ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'publish' ? 'Published' : tab === 'draft' ? 'Drafts' : 'Trashed'}
                </button>
              ))}
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-gray-700">Title</th>
                    <th className="p-4 font-semibold text-gray-700">Category</th>
                    <th className="p-4 font-semibold text-gray-700 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{post.title}</td>
                        <td className="p-4">{post.category}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEditClick(post)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            {activeTab !== 'thrash' && (
                              <button
                                onClick={() => handleMoveToTrash(post)}
                                className="text-red-600 hover:text-red-800"
                                title="Move to Trash"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">
                        Tidak ada artikel di tab ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activePage === 'add-new' || activePage === 'edit-post') && (
          <div className="max-w-2xl bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">
              {activePage === 'edit-post' ? 'Edit Article' : 'Add New Article'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul (min. 20 karakter)"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Masukkan kategori (min. 3 karakter)"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows="8"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Masukkan konten (min. 200 karakter)"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleSave('publish')}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleSave('draft')}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {activePage === 'preview' && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Blog Preview (Published Only)</h2>
            <div className="space-y-6">
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post) => (
                  <article key={post.id} className="bg-white p-6 rounded-lg shadow">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold mt-2 text-gray-800">{post.title}</h3>
                    <p className="text-gray-600 mt-2 whitespace-pre-line">{post.content}</p>
                  </article>
                ))
              ) : (
                <p className="text-gray-500">Belum ada artikel yang di-publish.</p>
              )}
            </div>
            {publishedPosts.length > limit && (
              <div className="flex justify-between items-center mt-6">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {page + 1}</span>
                <button
                  disabled={(page + 1) * limit >= publishedPosts.length}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}