
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'builder' | 'buyer' | 'admin';
  verified?: boolean;
  email?: string;
  phone?: string;
  preferences?: {
    currency: string;
    theme?: 'professional' | 'sharp';
    notifications: {
      email: boolean;
      community: boolean;
    };
  };
  portfolio?: {
    downloads: string[]; // Agent IDs
    uploads: string[];   // Agent IDs
    wishlist: string[];  // Agent IDs
  };
  // Builder Specific Fields
  type?: 'independent_creator' | 'startup' | 'enterprise_partner';
  bio?: string;
  expertise?: string[];
  builderStatus?: 'pending' | 'approved' | 'rejected';
  
  // New User Profile & Social Fields
  persona?: 'Student' | 'Professional' | 'Business' | 'Enterprise' | 'Creator';
  interests?: string[];
  contributionScore?: number;
  activePoints?: number;
  joinedDate?: string;
  twoFactorEnabled?: boolean;
  
  // Dynamic Profile Fields
  university?: string;
  major?: string;
  jobTitle?: string;
  industry?: string;
  companyName?: string;
  teamSize?: string;
  department?: string;
  website?: string;
  location?: string;
  
  stats?: {
    totalAgents: number;
    totalDownloads: number;
    avgRating: number;
    avgTrust: number;
    responseRate?: string; // e.g. "within 12h"
  };
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  organization?: string;
  agentId?: string;
  agentName?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Rejected';
  date: string;
}

export interface Report {
  id: string;
  targetId: string; // Comment ID or Agent ID
  targetType: 'comment' | 'agent' | 'user';
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'misinformation' | 'off-topic' | 'other';
  status: 'pending' | 'resolved' | 'dismissed';
  timestamp: number;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  iconName: 'Hexagon' | 'PenTool' | 'Users' | 'Zap';
  role: 'builder' | 'buyer' | 'admin';
  path: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface Integration {
  id: string;
  name: string;
  icon: string; // Lucide icon name or image url
  connected?: boolean;
}

export interface TrustBreakdown {
  codeQuality: number;
  stability: number;
  community: number;
  updates: number;
  documentation: number;
  security?: number;
  adoption?: number;
}

export interface AgentVersion {
  version: string;
  date: string;
  changes: string;
  downloadUrl: string;
}

export type Persona = 'Students' | 'Professionals' | 'Business Teams' | 'Enterprise' | 'Creators & Builders';

export type AgentBadge = 'verified' | 'featured' | 'sponsored' | 'top_seller' | 'new' | 'enterprise_ready' | 'free' | 'paid';

export type AgentSegment = 'individuals' | 'enterprise' | 'others';
export type AgentState = 'production' | 'draft' | 'submission';

export interface RiskEvent {
  type: 'bug' | 'outage' | 'vulnerability';
  version: string;
  resolvedIn: string; // e.g. "48h"
  date: string;
}

export interface SecuritySignals {
  signed: boolean;
  gated: boolean;
  docs: boolean;
  scanned: boolean;
}

export interface Agent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AgentCategory;
  price: number;
  pricingModel: 'one-time' | 'monthly' | 'custom';
  rating: number;
  reviewCount: number;
  builder: User;
  verified: boolean;
  // New v2.0 Fields
  systemLogos: string[]; // List of platform names for the ribbon
  trustScore: number;
  trustBreakdown: TrustBreakdown;
  versions: AgentVersion[];
  lastUpdate: string;
  segment?: 'trending' | 'viral' | 'new' | 'recommended'; 
  
  // Security & Distribution
  checksum?: string; // SHA-256 hash
  fileSize?: string; // e.g. "4.2 MB"
  purchaseEnabled?: boolean;
  demoUrl?: string; // YouTube/Vimeo embed URL

  imageUrl: string; 
  useCases: string[];
  features: string[];
  reviews: Review[];
  installs: number;
  integrations: Integration[];
  
  // New Fields for v3 UI
  logoUrl?: string;
  isTopSeller?: boolean;
  isNew?: boolean;
  
  // v4 Persona Fields
  personas?: Persona[];
  b2cTags?: string[]; // e.g. "Good for Job Search"

  // v5 Trust & Enterprise Fields
  badges?: AgentBadge[];
  securitySignals?: SecuritySignals;
  maintenanceScore?: number; // 0-100
  riskHistory?: RiskEvent[];
  socialProof?: string[]; // e.g. ["Used by Google", "Used by Stripe"]

  // v6 Standardization Fields
  marketSegment?: AgentSegment;
  state?: AgentState;
  revenue?: number;
  views?: number;
  conversionRate?: number; // e.g. 4.5 for 4.5%
  responseTimeHours?: number;
}

export interface BillingDetails {
  companyName: string;
  billingEmail: string;
  billingAddress: string;
  taxId?: string;
  poRef?: string;
}

export interface Order {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'po_generated';
  method: 'card' | 'invoice';
  downloadUrl?: string;
  invoiceId?: string;
  billingDetails?: BillingDetails;
}

export enum AgentCategory {
  All = 'All',
  Sales = 'Sales',
  Marketing = 'Marketing',
  Development = 'Development',
  Design = 'Design',
  Productivity = 'Productivity',
  Data = 'Data',
  CustomerSupport = 'Customer Support',
  Operations = 'Operations',
  Finance = 'Finance',
  HR = 'HR'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system'; 
  senderId?: string; 
  content: string;
  timestamp: number;
  attachments?: string[];
}

export interface ChatThread {
  id: string;
  builderId: string;
  builderName: string;
  builderAvatar: string;
  userId: string;
  agentId?: string;
  subject: string;
  messages: ChatMessage[];
  unread: boolean;
  lastUpdated: number;
  sla?: string; // e.g. "Replies within 12h"
  context?: {
    agentName: string;
    version: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'chat_reply' | 'version_update' | 'review_reply';
  refId: string; // Thread ID or Agent ID
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
}

export interface ThreadReply {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  isAcceptedAnswer?: boolean;
  likes?: number;
  attachments?: string[];
}

export interface CommunityPost {
  id: string;
  threadId?: string; // Backwards compatibility or future use
  title: string;
  content: string;
  author: User;
  likes: number; // Upvotes
  views: number;
  repliesCount: number;
  replies: ThreadReply[];
  tags: string[];
  category: 'Bug' | 'Feature Request' | 'Integration Help' | 'Pricing' | 'Best Practices' | 'Security' | 'Performance' | 'General';
  status: 'open' | 'answered' | 'closed';
  date: string; // Created At
  relatedAgentId?: string;
  attachmentUrl?: string;
  attachments?: string[];
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
