import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function formatTimeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [search, setSearch] = useState('');
  const [filterFlag, setFilterFlag] = useState('');


  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase.from('posts').select('id, title, created_at, upvotes, flag');

      if (sortBy) {
        query = query.order(sortBy, { ascending: sortBy === 'created_at' });
      }

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }
      if (filterFlag) {
        query = query.eq('flag', filterFlag);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [sortBy, search,filterFlag]);

  return (
    <div className="container-home">
      <h1>Posts</h1>
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="created_at">Sort by Created Time</option>
        <option value="upvotes">Sort by Upvotes</option>
      </select>

      <select value={filterFlag} onChange={(e) => setFilterFlag(e.target.value)} className="filter-dropdown">
        <option value="">All Posts</option>
        <option value="Question">Question</option>
        <option value="Opinion">Opinion</option>
      </select>
      
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <Link to={`/post/${post.id}`} className="post-link">
            <h2>{post.title}</h2>
          </Link>
          <p>Posted {formatTimeAgo(post.created_at)}</p>
          <p>Upvotes: {post.upvotes}</p>
          
        </div>
      ))}
    </div>
  );
}

export default HomeFeed;
