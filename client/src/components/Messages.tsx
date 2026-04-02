import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
  Badge,
  Button,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
} from "@chakra-ui/react";
import type { ContactSubmission } from "../api/pages";
import { pagesAPI } from "../api/pages";

interface MessagesProps {
  pageId: string;
}

export function Messages({ pageId }: MessagesProps) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    loadSubmissions();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadSubmissions, 10000);
    return () => clearInterval(interval);
  }, [pageId]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pagesAPI.getSubmissions(pageId);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        borderRadius="md"
        p={4}
      >
        <Text color="red.700">{error}</Text>
        <Button
          size="sm"
          mt={2}
          colorScheme="red"
          variant="outline"
          onClick={loadSubmissions}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (submissions.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Text fontSize="lg" color="gray.500" mb={4}>
          No messages yet
        </Text>
        <Text fontSize="sm" color="gray.400">
          Messages from your contact form will appear here
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={0} align="stretch">
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Messages ({submissions.length})
        </Text>
        <Button size="sm" colorScheme="blue" variant="outline" onClick={loadSubmissions}>
          Refresh
        </Button>
      </HStack>

      <VStack gap={3} align="stretch">
        {submissions.map((submission) => (
          <Box
            key={submission.id}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            cursor="pointer"
            _hover={{ bg: "gray.50", borderColor: "gray.300" }}
            onClick={() => setSelectedMessage(submission)}
          >
            <HStack justify="space-between" mb={2}>
              <VStack align="start" gap={0}>
                <Text fontWeight="bold" color="gray.900">
                  {submission.name}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {submission.email}
                </Text>
              </VStack>
              <Badge colorScheme="blue" variant="subtle">
                {formatDate(submission.created_at)}
              </Badge>
            </HStack>
            <Text
              fontSize="sm"
              color="gray.700"
              lineClamp={2}
              mt={2}
            >
              {submission.message}
            </Text>
          </Box>
        ))}
      </VStack>

      <MessageModal
        submission={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </VStack>
  );
}

function MessageModal(
  {
    submission,
    onClose,
  }: {
    submission: ContactSubmission | null;
    onClose: () => void;
  }
) {
  if (!submission) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DialogRoot open={!!submission} onOpenChange={(details) => !details.open && onClose()}>
      <DialogContent>
        <DialogHeader>Message Details</DialogHeader>
        <DialogCloseTrigger />
        <DialogBody pb={6}>
          <VStack gap={4} align="start">
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>
                From
              </Text>
              <Text fontWeight="bold">{submission.name}</Text>
              <Text fontSize="sm" color="blue.600">
                {submission.email}
              </Text>
            </Box>

            <Box w="full" h="1px" bg="gray.200" />

            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>
                Date
              </Text>
              <Text fontSize="sm">{formatDate(submission.created_at)}</Text>
            </Box>

            <Box w="full" h="1px" bg="gray.200" />

            <Box w="full">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Message
              </Text>
              <Box
                bg="gray.50"
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                whiteSpace="pre-wrap"
                wordBreak="break-word"
              >
                <Text fontSize="sm" color="gray.900">
                  {submission.message}
                </Text>
              </Box>
            </Box>

            <HStack gap={2} w="full" pt={2}>
              <Button
                flex={1}
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  window.location.href = `mailto:${submission.email}`;
                }}
              >
                Reply via Email
              </Button>
              <Button
                flex={1}
                colorScheme="gray"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(submission.email);
                }}
              >
                Copy Email
              </Button>
            </HStack>
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
