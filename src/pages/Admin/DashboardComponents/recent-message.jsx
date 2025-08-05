import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/Card";
import { Badge } from "../../../ui/Badge";
import { Skeleton } from "../../../ui/Skeleton";
import { MessageSquare, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RecentMessages() {
  // Note: In a real app, you'd query for the current user's messages
  // For demo purposes, we'll query all messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/messages'],
  });

  // Sort messages by most recent and take the latest 5
  const recentMessages = messages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Recent Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentMessages.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No recent messages</p>
          </div>
        ) : (
          recentMessages.map((message) => (
            <div key={message.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {message.subject && (
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{message.subject}</h4>
                  )}
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {message.content}
                  </p>
                </div>
                {!message.isRead && (
                  <Badge variant="default" className="text-xs bg-blue-600">
                    New
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  From: {message.senderId}
                </div>
                <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}