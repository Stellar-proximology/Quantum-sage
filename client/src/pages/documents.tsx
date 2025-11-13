import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Document } from "@shared/schema";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "human_design", label: "Human Design" },
  { value: "iching", label: "I Ching / Yijing" },
  { value: "gene_keys", label: "Gene Keys" },
  { value: "quantum_mechanics", label: "Quantum Mechanics" },
  { value: "astrology", label: "Astrology" },
  { value: "cymatics", label: "Cymatics & Sound" },
  { value: "other", label: "Other" },
];

const uploadSchema = z.object({
  file: z.custom<FileList>((val) => val instanceof FileList && val.length > 0, {
    message: "Please select a PDF file",
  }),
  category: z.string().min(1, "Please select a category"),
});

type UploadForm = z.infer<typeof uploadSchema>;

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();

  const form = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      category: "other",
    },
  });

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/documents/upload", formData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document uploaded",
        description: "Your document has been processed and added to the library",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/documents/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been removed from your library",
      });
    },
  });

  const onSubmitUpload = (data: UploadForm) => {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("category", data.category);
    uploadMutation.mutate(formData);
  };

  const filteredDocuments = documents?.filter((doc) => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-4xl font-bold text-foreground">Document Library</h1>
        <p className="text-muted-foreground">
          Upload and manage your esoteric knowledge PDFs for AI-powered analysis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Upload Document</CardTitle>
          <CardDescription>
            Add PDF books on human design, I Ching, quantum mechanics, or related topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitUpload)} className="space-y-6">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>PDF File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf"
                        data-testid="input-file-upload"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={uploadMutation.isPending}
                className="w-full"
                data-testid="button-upload-document"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-documents"
            />
          </div>
          <div className="w-64">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger data-testid="select-filter-category">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocuments && filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover-elevate" data-testid={`card-document-${doc.id}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-semibold leading-tight">
                          {doc.filename}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 items-center">
                          {doc.category && (
                            <Badge variant="secondary" data-testid={`badge-category-${doc.id}`}>
                              {categories.find((c) => c.value === doc.category)?.label || doc.category}
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {formatFileSize(doc.filesize)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                          {doc.chunkCount > 0 && (
                            <span className="text-sm text-muted-foreground">
                              {doc.chunkCount} chunks processed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${doc.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">No documents found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterCategory !== "all"
                    ? "Try adjusting your search or filter"
                    : "Upload your first PDF to get started"}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
