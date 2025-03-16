"use client";

import { useState } from "react";
import { Trash2, Edit, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Comment type definition
export type Comment = {
  id: number;
  user: {
    name: string;
    avatar: string | null;
    initials: string;
  };
  content: string;
  isOwnComment?: boolean;
};

type CommentsProps = {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onUpdateComment: (id: number, content: string) => void;
  onDeleteComment: (id: number) => void;
};

export default function CommentsSection({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: CommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText("");
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const saveEdit = (id: number) => {
    if (!editedContent.trim()) return;
    onUpdateComment(id, editedContent);
    setEditingCommentId(null);
  };

  return (
    <div >
      <h2 className="text-2xl font-bold text-gray-900">Comments</h2>

      {/* Add comment form */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-900">Leave a Comment</h3>
        <div className="mt-4">
          <Textarea
            placeholder="Share your thoughts about this cabinet..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleAddComment}
              className="bg-[#3b82f6] hover:bg-[#3b82f6]/90"
            >
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {comments.length} Comments
        </h3>

        <div className="mt-4 space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-white p-6 shadow">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 border">
                  {comment.user.avatar ? (
                    <AvatarImage
                      src={comment.user.avatar}
                      alt={comment.user.name}
                    />
                  ) : (
                    <AvatarFallback className="bg-[#3b82f6]/10 text-[#3b82f6]">
                      {comment.user.initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {comment.user.name}
                    </h4>

                    {/* Edit/Delete buttons - only show for own comments */}
                    {comment.isOwnComment && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-[#3b82f6]"
                          onClick={() => startEditing(comment)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Comment
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this comment?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDeleteComment(comment.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>

                  {/* Comment content - edit mode or display mode */}
                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(comment.id)}
                          className="bg-[#3b82f6] hover:bg-[#3b82f6]/90"
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-700">{comment.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
