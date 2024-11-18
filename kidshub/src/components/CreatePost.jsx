


import React, { useState } from 'react';
import { supabase } from '../supabaseClient.js';
import { useLocation } from 'react-router-dom';

function CreatePost() {
  const location = useLocation();
  const postToEdit = location.state?.postToEdit;

  const [title, setTitle] = useState(postToEdit?.title ?? '');
  const [content, setContent] = useState(postToEdit?.content ?? '');
  const [imageURL, setImageURL] = useState(postToEdit?.image_url ?? '');
  const [secretKey, setSecretKey] = useState(postToEdit?.secret_key ?? '');
  const [flag, setFlag] = useState(postToEdit?.flag ?? '');
  const [imageFile, setImageFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(''); // Add state for upload status

  const handleImageUpload = async () => {
    if (imageFile) {
      setUploadStatus('Uploading...'); // Set status to uploading
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = `uploads/${fileName}`;
      const { data, error } = await supabase.storage.from('images').upload(filePath, imageFile);

      if (error) {
        console.error('Error uploading image:', error.message, error.details);
        setUploadStatus('Upload failed!'); // Set status to failed
      } else {
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;
        console.log('Generated Public URL:', publicUrl); // Log the URL to verify
        setImageURL(publicUrl);
        setUploadStatus('Upload successful!'); // Set status to successful
      }
    } else {
      setUploadStatus('No file selected!'); // Handle no file selected case
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting post:", { title, content, imageURL, secretKey, flag });

    try {
      if (postToEdit) {
        // Update existing post
        const { data, error } = await supabase
          .from('posts')
          .update({ title, content, image_url: imageURL, secret_key: secretKey, flag })
          .eq('id', postToEdit.id);

        if (error) {
          console.error('Error updating post:', error);
        } else {
          console.log('Post updated:', data);
        }
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert([{ title, content, image_url: imageURL, secret_key: secretKey, flag, upvotes: 0 }]);

        if (error) {
          console.error('Error creating post:', error);
        } else {
          console.log('Post created:', data);
        }
      }

      // Clear form fields after successful operation
      setTitle('');
      setContent('');
      setImageURL('');
      setSecretKey('');
      setFlag('');
      setImageFile(null);
      document.querySelector('input[type="file"]').value = '';

    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content(optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
        />
        <input
          type="text"
          placeholder="Image URL(optional)"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="button" onClick={handleImageUpload} style={{backgroundColor: 'lightblue', padding: '0.5rem 1rem', fontSize: '0.9rem',float: 'right' }}>Upload Image</button>

        <p>{uploadStatus}</p> 

        <input
          type="password"
          placeholder="The key used to edit or delete the post"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          required
        />
        <select value={flag} onChange={(e) => setFlag(e.target.value)}>
          <option value="">Select Flag</option>
          <option value="Question">Question</option>
          <option value="Opinion">Opinion</option>
        </select>
        <button type="submit">{postToEdit ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
}

export default CreatePost;
