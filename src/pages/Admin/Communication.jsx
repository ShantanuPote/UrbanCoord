import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // ✅ your firebase config
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/Select";
import { Skeleton } from "../../ui/Skeleton";
import {
  MessageSquare, Plus, Search, Send, Reply, Archive, User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Communications() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    content: "",
    senderId: "admin", // 🔁 Replace with actual sender ID
  });

  // 🔄 Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  // 🔄 Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const snap = await getDocs(collection(db, "departments"));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  });

  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.shortName || dept?.name || "Unknown Department";
  };

  const sendMessage = useMutation({
    mutationFn: async (data) => {
      await addDoc(collection(db, "messages"), {
        ...data,
        isRead: false,
        createdAt: Timestamp.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
      setIsComposeOpen(false);
      setComposeData({ to: "", subject: "", content: "", senderId: "admin" });
    },
  });

  const filteredMessages = messages.filter((m) =>
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMessages = filteredMessages.sort((a, b) =>
    b.createdAt?.seconds - a.createdAt?.seconds
  );

  const handleComposeChange = (field, value) => {
    setComposeData(prev => ({ ...prev, [field]: value }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage.mutate({
      senderId: composeData.senderId,
      receiverId: composeData.to,
      subject: composeData.subject,
      content: composeData.content,
    });
  };

  if (messagesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Communications</h2>
          <p className="text-gray-600">Inter-departmental messages and coordination</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Compose
        </Button>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">New Message</h2>
            <form className="space-y-4" onSubmit={handleSend}>
              <div>
                <label className="text-sm font-medium block mb-1">To Department</label>
                <Select value={composeData.to} onValueChange={(val) => handleComposeChange("to", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Subject</label>
                <Input
                  value={composeData.subject}
                  onChange={(e) => handleComposeChange("subject", e.target.value)}
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Message</label>
                <Textarea
                  value={composeData.content}
                  onChange={(e) => handleComposeChange("content", e.target.value)}
                  placeholder="Your message..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={sendMessage.isPending}>
                  <Send className="mr-2 h-4 w-4" /> {sendMessage.isPending ? "Sending..." : "Send"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span><MessageSquare className="inline mr-2" />Messages</span>
                <Badge variant="secondary">
                  {filteredMessages.filter(m => !m.isRead).length} unread
                </Badge>
              </CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto p-0">
              {sortedMessages.map((m) => (
                <div
                  key={m.id}
                  className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${selectedMessage?.id === m.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedMessage(m)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-medium text-sm">{m.subject || "No Subject"}</p>
                      <p className="text-xs text-gray-500">From: {getDepartmentName(m.senderId)}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(m.createdAt?.toDate(), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{m.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-2">
          <Card>
            {selectedMessage ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">{selectedMessage.subject || "No Subject"}</CardTitle>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <div>
                      <User className="inline h-4 w-4 mr-1" />
                      From: {getDepartmentName(selectedMessage.senderId)}
                    </div>
                    <span>
                      {formatDistanceToNow(selectedMessage.createdAt?.toDate(), { addSuffix: true })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="whitespace-pre-wrap text-gray-800">{selectedMessage.content}</p>
                </CardContent>
              </>
            ) : (
              <CardContent className="text-center py-24 text-gray-500">
                <MessageSquare className="mx-auto mb-4 h-12 w-12" />
                Select a message to view details
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
