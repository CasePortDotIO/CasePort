import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  mentions: string[];
  replies: Comment[];
}

interface CollaborationPanelProps {
  resourceId: string;
  resourceType: string;
}

export default function CollaborationPanel({ resourceId, resourceType }: CollaborationPanelProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Michael Chen',
      content: 'This case looks promising. High liability exposure.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      mentions: [],
      replies: [
        {
          id: '1-1',
          author: 'Sarah Johnson',
          content: '@Michael agreed, estimated value around $150K',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          mentions: ['Michael Chen'],
          replies: [],
        },
      ],
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [showMentions, setShowMentions] = useState(false);

  const teamMembers = ['Michael Chen', 'Sarah Johnson', 'David Lee', 'Emily Rodriguez'];

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const mentions = teamMembers.filter((member) =>
      newComment.includes(`@${member}`)
    );

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: new Date(),
      mentions,
      replies: [],
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added');
  };

  const handleMention = (member: string) => {
    setNewComment((prev) => prev + `@${member} `);
    setShowMentions(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Comments & Collaboration</h3>
        <span className="text-xs text-muted-foreground">({comments.length})</span>
      </div>

      {/* Comments */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.map((comment, idx) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{comment.author}</div>
                  <p className="text-sm text-foreground mt-1">{comment.content}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {comment.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-3 ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <div className="font-semibold text-xs">{reply.author}</div>
                      <p className="text-foreground">{reply.content}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {reply.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* New Comment Input */}
      <Card className="p-3 border-dashed border-primary/30">
        <div className="space-y-2">
          <div className="relative">
            <Input
              placeholder="Add a comment... (use @name to mention)"
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                setShowMentions(e.target.value.includes('@'));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              className="pr-10"
            />
            <AtSign className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Mention Suggestions */}
          {showMentions && (
            <motion.div
              className="space-y-1 p-2 bg-secondary/50 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {teamMembers.map((member) => (
                <button
                  key={member}
                  onClick={() => handleMention(member)}
                  className="block w-full text-left text-sm px-2 py-1 rounded hover:bg-primary/20"
                >
                  @{member}
                </button>
              ))}
            </motion.div>
          )}

          <Button
            size="sm"
            className="w-full"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Send className="mr-2 h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </Card>

      {/* Presence Indicators */}
      <Card className="p-3 bg-secondary/50">
        <div className="text-xs font-semibold text-muted-foreground mb-2">Viewing Now</div>
        <div className="flex gap-2">
          {['Michael Chen', 'Sarah Johnson'].map((member) => (
            <div key={member} className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs">{member}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
