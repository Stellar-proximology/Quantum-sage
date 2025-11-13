import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Send, Bot, User, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ChatMessage, Document } from "@shared/schema";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: messages, isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/messages"],
  });

  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const sendMutation = useMutation({
    mutationFn: async (data: { message: string; contextDocuments: string[] }) => {
      return apiRequest("POST", "/api/chat/send", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/messages"] });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({
      message: message.trim(),
      contextDocuments: selectedDocs,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleDocument = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-6">
        <h1 className="font-serif text-3xl font-bold text-foreground">AI Chat</h1>
        <p className="text-muted-foreground mt-1">
          Ask questions about esoteric concepts using your document library
        </p>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-6">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      data-testid={`message-${msg.id}`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </div>
                      <div className={`flex-1 space-y-2 ${msg.role === "user" ? "items-end" : ""}`}>
                        <div
                          className={`rounded-lg p-4 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground ml-12"
                              : "bg-card border mr-12"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                        {msg.contextDocuments && msg.contextDocuments.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {msg.contextDocuments.map((docId) => {
                              const doc = documents?.find((d) => d.id === docId);
                              return doc ? (
                                <Badge key={docId} variant="secondary" className="text-xs">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {doc.filename}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground px-4">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Bot className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="font-semibold text-lg">Start a conversation</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Ask about human design, I Ching, quantum mechanics, or any concepts from your
                      uploaded documents. The AI will use your library to provide contextual answers.
                    </p>
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="p-6 border-t space-y-4">
              <Textarea
                placeholder="Ask a question about esoteric concepts... (Shift+Enter for new line, Enter to send)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-24 resize-none"
                data-testid="input-chat-message"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {selectedDocs.length > 0
                    ? `Using ${selectedDocs.length} document${selectedDocs.length > 1 ? "s" : ""} as context`
                    : "No documents selected"}
                </p>
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sendMutation.isPending}
                  data-testid="button-send-message"
                >
                  {sendMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="w-80">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Document Context</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select documents to include in your questions
            </p>
            {documents && documents.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-3 hover-elevate rounded-md p-2 -m-2">
                      <Checkbox
                        id={`doc-${doc.id}`}
                        checked={selectedDocs.includes(doc.id)}
                        onCheckedChange={() => toggleDocument(doc.id)}
                        data-testid={`checkbox-doc-${doc.id}`}
                      />
                      <Label
                        htmlFor={`doc-${doc.id}`}
                        className="flex-1 cursor-pointer leading-tight text-sm"
                      >
                        {doc.filename}
                        {doc.category && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {doc.category}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
