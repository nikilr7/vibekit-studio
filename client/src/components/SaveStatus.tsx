import { HStack, Text, Spinner, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface SaveStatusProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  error: string | null;
}

export function SaveStatus({
  isSaving,
  hasUnsavedChanges,
  lastSavedAt,
  error,
}: SaveStatusProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    if (!lastSavedAt) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastSavedAt.getTime()) / 1000);

      if (diff < 60) {
        setTimeAgo("just now");
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeAgo(`${minutes}m ago`);
      } else {
        const hours = Math.floor(diff / 3600);
        setTimeAgo(`${hours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000);

    return () => clearInterval(interval);
  }, [lastSavedAt]);

  if (error) {
    return (
      <Box
        px={3}
        py={2}
        borderRadius="md"
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
      >
        <HStack gap={2} color="red.700" fontSize="sm">
          <Text fontSize="lg">⚠️</Text>
          <Text fontWeight="500">{error}</Text>
        </HStack>
      </Box>
    );
  }

  if (isSaving) {
    return (
      <Box
        px={3}
        py={2}
        borderRadius="md"
        bg="blue.50"
        border="1px solid"
        borderColor="blue.200"
      >
        <HStack gap={2} color="blue.700" fontSize="sm">
          <Spinner size="xs" color="blue.600" />
          <Text fontWeight="500">Saving...</Text>
        </HStack>
      </Box>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <Box
        px={3}
        py={2}
        borderRadius="md"
        bg="orange.50"
        border="1px solid"
        borderColor="orange.200"
      >
        <HStack gap={2} color="orange.700" fontSize="sm">
          <Text fontSize="lg">●</Text>
          <Text fontWeight="500">Unsaved changes</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      px={3}
      py={2}
      borderRadius="md"
      bg="green.50"
      border="1px solid"
      borderColor="green.200"
    >
      <HStack gap={2} color="green.700" fontSize="sm">
        <Text fontSize="lg">✓</Text>
        <Text fontWeight="500">
          Saved {timeAgo ? `${timeAgo}` : ""}
        </Text>
      </HStack>
    </Box>
  );
}
