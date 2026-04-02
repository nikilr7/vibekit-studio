import { useState } from "react";
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

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Page title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newPage = await pagesAPI.create();
      
      // If title is provided, update the page
      if (title.trim() !== "Untitled Page") {
        await pagesAPI.update(newPage.id, { title: title.trim() });
      }

      onSuccess(newPage.id);
      setTitle("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
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
            <Text color="gray.600" fontSize="sm">
              Give your page a title. You can change it anytime in the editor.
            </Text>

            <Stack gap={2} width="full">
              <Input
                placeholder="e.g., My Portfolio, Product Launch..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleCreate();
                  }
                }}
                disabled={loading}
                autoFocus
              />
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
