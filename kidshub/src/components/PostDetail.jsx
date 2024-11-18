import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import { FaEdit, FaTrash, FaThumbsUp } from 'react-icons/fa';


function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [secretKey,setSecretKey] = useState('');
  

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id);

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleUpvote = async () => {
    if (post) {
      const { data, error } = await supabase
        .from('posts')
        .update({ upvotes: post.upvotes + 1 })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error upvoting post:', error);
      } else {
        setPost(data[0]);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, content: comment }])
      .select();

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setComments([...comments, data[0]]);
      setComment('');
    }
  };

  const handleEdit = () => {
    navigate(`/create`, { state: { postToEdit: post } });
  };

  const handleDelete = async () => {
    const userSecretKey = prompt('Do you really want to delete the post? Please enter your secret key:');
    if (userSecretKey === post.secret_key) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
      } else {
        navigate('/');
      }
    } else {
      alert('Incorrect secret key. Post not deleted.');
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container-home">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.image_url && <img src={post.image_url} style={{ maxWidth: '300px', height: 'auto' }}
 />}
      <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
    
      <div className="post-actions">
    <div className="upvote-section">
      <FaThumbsUp onClick={handleUpvote} className="upvote-icon" title="Upvote Post" />
      <span>{post.upvotes} upvotes</span>
    </div>
    <div className="edit-delete-buttons">
      <FaEdit onClick={handleEdit} className="edit-icon" title="Edit Post" />
      <FaTrash onClick={handleDelete} className="delete-icon" title="Delete Post" />
    </div>
  </div>

      <h2 className="comments-section">Comments</h2>
      {comments.map((comment) => (
        <p key={comment.id} className="comment-item">{comment.content}</p>
      ))}
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default PostDetail;
