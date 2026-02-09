
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CommunityPost, ThreadReply, Report } from '../types';
import { MOCK_POSTS } from '../data';
import { useAuth } from './AuthContext';

interface CommunityContextType {
  posts: CommunityPost[];
  createPost: (post: Partial<CommunityPost>) => string | undefined;
  getPostById: (id: string) => CommunityPost | undefined;
  editPost: (postId: string, content: string) => void;
  editReply: (postId: string, replyId: string, content: string) => void;
  addReply: (postId: string, content: string, attachments?: string[]) => void;
  markAnswer: (postId: string, replyId: string) => void;
  toggleLike: (postId: string) => void;
  toggleReplyLike: (postId: string, replyId: string) => void;
  incrementView: (postId: string) => void;
  reportContent: (targetId: string, type: 'comment' | 'agent' | 'user', reason: string) => void;
  reports: Report[];
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  // Initialize posts with safe defaults for new fields
  const [posts, setPosts] = useState<CommunityPost[]>(MOCK_POSTS.map(p => ({
    ...p,
    views: p.views || 0,
    attachments: p.attachments || [],
    replies: p.replies.map(r => ({ ...r, likes: r.likes || 0, attachments: r.attachments || [] }))
  })));
  const [reports, setReports] = useState<Report[]>([]);

  const createPost = (postData: Partial<CommunityPost>) => {
    if (!user) return undefined;
    
    const newId = `post_${Date.now()}`;
    const newPost: CommunityPost = {
      id: newId,
      threadId: `th_${Date.now()}`,
      title: postData.title || 'Untitled',
      content: postData.content || '',
      author: user,
      likes: 0,
      views: 0,
      repliesCount: 0,
      replies: [],
      tags: postData.tags || [],
      category: postData.category || 'General',
      status: 'open',
      date: 'Just now',
      relatedAgentId: postData.relatedAgentId,
      attachments: postData.attachments || []
    };

    setPosts(prev => [newPost, ...prev]);
    return newId;
  };

  const getPostById = (id: string) => {
    return posts.find(p => p.id === id || p.threadId === id);
  };

  const editPost = (postId: string, content: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content } : p));
  };

  const editReply = (postId: string, replyId: string, content: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: p.replies.map(r => r.id === replyId ? { ...r, content } : r)
        };
      }
      return p;
    }));
  };

  const incrementView = (postId: string) => {
    const key = `nexus_viewed_${postId}`;
    // Session storage check to ensure 1 view per session
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, 'true');
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, views: (p.views || 0) + 1 } : p));
  };

  const addReply = (postId: string, content: string, attachments: string[] = []) => {
    if (!user) return;

    const newReply: ThreadReply = {
      id: `rep_${Date.now()}`,
      author: user,
      content,
      timestamp: 'Just now',
      likes: 0,
      attachments
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId || p.threadId === postId) {
        return {
          ...p,
          replies: [...p.replies, newReply],
          repliesCount: p.repliesCount + 1
        };
      }
      return p;
    }));
  };

  const markAnswer = (postId: string, replyId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId || p.threadId === postId) {
        return {
          ...p,
          status: 'answered',
          replies: p.replies.map(r => r.id === replyId ? { ...r, isAcceptedAnswer: true } : r)
        };
      }
      return p;
    }));
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId || p.threadId === postId) {
        // Simple toggle simulation: if likes > old likes, assume we liked it. 
        // Real app would track user likes. For mock, just increment.
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const toggleReplyLike = (postId: string, replyId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId || p.threadId === postId) {
        return {
          ...p,
          replies: p.replies.map(r => r.id === replyId ? { ...r, likes: (r.likes || 0) + 1 } : r)
        };
      }
      return p;
    }));
  };

  const reportContent = (targetId: string, type: 'comment' | 'agent' | 'user', reason: string) => {
      if (!user) return;
      const newReport: Report = {
          id: `rep_${Date.now()}`,
          targetId,
          targetType: type,
          reportedBy: user.id,
          reason: reason as any,
          status: 'pending',
          timestamp: Date.now()
      };
      setReports(prev => [...prev, newReport]);
      console.log("Admin Ticket Created:", newReport);
  };

  return (
    <CommunityContext.Provider value={{
      posts,
      createPost,
      getPostById,
      editPost,
      editReply,
      addReply,
      markAnswer,
      toggleLike,
      toggleReplyLike,
      incrementView,
      reportContent,
      reports
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
