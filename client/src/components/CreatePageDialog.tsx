import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Input,
  Stack,
  Text,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { pagesAPI } from "../api/pages";

interface CreatePageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pageId: string) => void;
}

export function CreatePageDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreatePageDialogProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slug, setSlug] = useState("");

  const MAX_TITLE_LENGTH = 100;

  // Generate slug from title
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50); // Limit slug length
    setSlug(generatedSlug || "untitled-page");
  }, [title]);

  const handleCreate = async () => {
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      setError("Page title is required");
      return;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setError(`Title must be ${MAX_TITLE_LENGTH} characters or less`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newPage = await pagesAPI.create();
      
      // If title is provided, update the page
      if (trimmedTitle !== "Untitled Page") {
        await pagesAPI.update(newPage.id, { title: trimmedTitle });
      }

      onSuccess(newPage.id);
      setTitle("");
      setSlug("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setSlug("");
    setError("");
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Content>
        <Dialog.Header>Create New Page</Dialog.Header>
        <Dialog.Body>
          <VStack gap={4}>
            <Text style={{ color: "rgba(232,232,240,0.45)" }} fontSize="sm">
              Give your page a title. You can change it anytime in the editor.
            </Text>

            <Stack gap={2} width="full">
              <VStack gap={1} align="stretch">
                <Input
                  placeholder="e.g., My Portfolio, Product Launch..."
                  value={title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    if (newTitle.length <= MAX_TITLE_LENGTH) {
                      setTitle(newTitle);
                      setError("");
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleCreate();
                    }
                  }}
                  disabled={loading}
                  autoFocus
                />
                <HStack justify="space-between">
                  <Text fontSize="xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Slug: /{slug}
                  </Text>
                  <Text 
                    fontSize="xs" 
                    style={{ color: title.length > MAX_TITLE_LENGTH * 0.8 ? "#f97316" : "rgba(255,255,255,0.4)" }}
                  >
                    {title.length}/{MAX_TITLE_LENGTH}
                  </Text>
                </HStack>
              </VStack>
              {error && (
                <Text color="red.600" fontSize="sm">
                  {error}
                </Text>
              )}
            </Stack>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer>
          <HStack gap={2}>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
                backgroundColor: "rgba(255,255,255,0.04)"
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleCreate}
              disabled={loading || !title.trim()}
              loading={loading}
            >
              {loading ? (
                <HStack gap={2}>
                  <Spinner size="sm" />
                  <Text>Creating...</Text>
                </HStack>
              ) : (
                "Create Page"
              )}
            </Button>
          </HStack>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
