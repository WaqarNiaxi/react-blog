import React, { useState, useEffect } from "react";
import axios from "axios";
import { Audio } from 'react-loader-spinner';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);  // Add loading state

  const API_URL = "https://nodejs-project-two.vercel.app/items";

  const fetchPosts = async () => {
    try {
      console.log("enter");
      const response = await axios.get(API_URL);
      setPosts(response.data);
      console.log(response);
      console.log("Posts fetched successfully:", response.data);
    } catch (err) {
      console.error("Error fetching posts:", err.message || err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrEditPost = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);  // Set loading to true when API call starts
    try {
      if (isEditing) {
        const response = await axios.put(`${API_URL}/${selectedPost._id}`, {
          title: formData.title,
          content: formData.content,
        });
        console.log("Post updated successfully:", response.data);
      } else {
        const response = await axios.post(API_URL, {
          title: formData.title,
          content: formData.content,
        });
        console.log("Post created successfully:", response.data);
      }
      setFormData({ title: "", content: "" });
      setSelectedPost(null);
      setIsEditing(false);
      fetchPosts(); 
      setErrors({});
    } catch (err) {
      console.error("Error saving post:", err.response?.data?.message || err.message || err);
    } finally {
      setLoading(false);  // Set loading to false once API call finishes
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setFormData({ title: post.title, content: post.content });
    setIsEditing(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await axios.delete(`${API_URL}/${postId}`);
      console.log("Post deleted successfully:", response.data);
      fetchPosts(); 
    } catch (err) {
      console.error("Error deleting post:", err.message || err);
    }
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ title: "", content: "" });
    setSelectedPost(null);
    setErrors({});
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.content}...</p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleViewPost(post)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                View
              </button>
              <button
                onClick={() => handleEditPost(post)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePost(post._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4">{isEditing ? "Edit Post" : "Add New Post"}</h2>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAddOrEditPost}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}  // Disable button while loading
          >
            {loading ? (
              <Audio height="20" width="20" color="white" />  // Show loader while loading
            ) : (
              isEditing ? "Update Post" : "Add Post"
            )}
          </button>
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {selectedPost && !isEditing && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">{selectedPost.title}</h2>
          <p className="text-gray-700 mt-2">{selectedPost.content}</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
