import { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  Badge,
} from "@chakra-ui/react";
import type { Page } from "../api/pages";
import { Messages } from "./Messages";
import { formatViewCount } from "../utils/formatters";

interface PageDetailsProps {
  page: Page;
  onViewPublic: () => void;
}

export function PageDetails({ page, onViewPublic }: PageDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");

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
    <VStack gap={6} align="stretch" w="full">
      {/* Header */}
      <VStack align="start" gap={2} w="full">
        <HStack justify="space-between" w="full">
          <VStack align="start" gap={1}>
            <Text fontSize="2xl" fontWeight="bold">
              {page.title}
            </Text>
            <HStack gap={2}>
              <Badge
                colorScheme={page.status === "published" ? "green" : "gray"}
              >
                {page.status === "published" ? "Published" : "Draft"}
              </Badge>
              <Text fontSize="sm" color="gray.600">
                {formatDate(page.created_at)}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </VStack>

      <Box w="full" h="1px" bg="rgba(255,255,255,0.1)" />

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)} w="full">
        <Tabs.List w="full" style={{ borderBottomColor: "rgba(255,255,255,0.1)" }}>
          <Tabs.Trigger value="overview" style={{ color: "rgba(255,255,255,0.7)" }}>Overview</Tabs.Trigger>
          <Tabs.Trigger value="messages" style={{ color: "rgba(255,255,255,0.7)" }}>Messages</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview" w="full">
          <VStack gap={4} align="start" w="full" pt={4}>
            <Box>
              <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.5)" }} mb={1}>
                Page URL
              </Text>
              <HStack
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor="rgba(255,255,255,0.1)"
                bg="rgba(255,255,255,0.02)"
              >
                <Text fontSize="sm" fontFamily="mono" flex={1} style={{ color: "#a5b4fc" }}>
                  {window.location.origin}/p/{page.slug}
                </Text>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/p/${page.slug}`
                    );
                  }}
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Copy
                </Button>
              </HStack>
            </Box>

            <Box>
              <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.5)" }} mb={1}>
                Theme
              </Text>
              <Text fontSize="sm" fontWeight="500" textTransform="capitalize" style={{ color: "rgba(255,255,255,0.9)" }}>
                {page.theme}
              </Text>
            </Box>

            {page.status === "published" && (
              <Box>
                <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.5)" }} mb={1}>
                  Views
                </Text>
                <Text fontSize="lg" fontWeight="bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                  {formatViewCount(page.view_count || 0)}
                </Text>
              </Box>
            )}

            <Box>
              <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.5)" }} mb={1}>
                Created
              </Text>
              <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.7)" }}>{formatDate(page.created_at)}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.5)" }} mb={1}>
                Last Updated
              </Text>
              <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.7)" }}>{formatDate(page.updated_at)}</Text>
            </Box>

            {page.status === "published" && (
              <Button colorScheme="blue" onClick={onViewPublic} w="full">
                View Public Page
              </Button>
            )}
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="messages" w="full">
          <Box pt={4} w="full">
            {page.status === "published" ? (
              <Messages pageId={page.id} />
            ) : (
              <Box textAlign="center" py={12}>
                <Text style={{ color: "rgba(255,255,255,0.5)" }} mb={2}>
                  Messages are only available for published pages
                </Text>
                <Text fontSize="sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Publish your page to start receiving messages
                </Text>
              </Box>
            )}
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
}
