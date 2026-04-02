import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Spinner, Container, VStack, Text, Button } from "@chakra-ui/react";
import type { Page, PageContent } from "../types/page";
import { applyTheme } from "../theme/themes";
import { getTheme } from "../theme/utils";
import { LivePreview } from "../components/LivePreview";
import { useToast } from "../hooks/useToast";

export default function PublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewTracked, setViewTracked] = useState(false);

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }
    fetchPublicPage();
  }, [slug]);

  useEffect(() => {
    if (page && !viewTracked) {
      trackPageView();
      setViewTracked(true);
    }
  }, [page, viewTracked]);

  useEffect(() => {
    if (page) {
      const theme = getTheme(page.theme);
      applyTheme(theme);
      document.title = page.title;
    }
  }, [page]);

  const fetchPublicPage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/public/pages/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Page not found or not published");
        } else {
          setError("Failed to load page");
        }
        return;
      }

      const data = await response.json();
      setPage(data);
    } catch (err: any) {
      setError("Failed to load page");
      console.error("Error fetching public page:", err);
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async () => {
    try {
      await fetch(`/api/public/pages/${slug}/view`, {
        method: "POST",
      });
    } catch (err) {
      // Silently fail - view tracking is not critical to page display
      console.debug("View tracking failed (non-critical):", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="lg" color="purple.500" />
      </Box>
    );
  }

  if (error || !page) {
    return (
      <Container maxW="md" py={20}>
        <VStack gap={4} textAlign="center">
          <Text fontSize="6xl">404</Text>
          <Text fontSize="xl" fontWeight="bold">
            {error || "Page not found"}
          </Text>
          <Text color="gray.600">
            The page you're looking for doesn't exist or hasn't been published yet.
          </Text>
          <Button colorScheme="blue" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </VStack>
      </Container>
    );
  }

  const theme = getTheme(page.theme);

  return (
    <Box minH="100vh">
      <LivePreview
        content={page.content as PageContent}
        theme={theme}
        device="desktop"
        onContactSubmit={async (data) => {
          try {
            const response = await fetch(`/api/public/pages/${slug}/contact`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              const errorData = await response.json();
              showError("Error", errorData.message || "Failed to submit form");
              return false;
            }

            success("Message sent!", "Thank you for reaching out. We'll get back to you soon.");
            return true;
          } catch (err: any) {
            showError("Error", "Failed to submit form. Please try again.");
            console.error("Contact form error:", err);
            return false;
          }
        }}
      />

      <Box
        bg="gray.50"
        py={4}
        textAlign="center"
        borderTop="1px solid"
        borderColor="gray.200"
      >
        <Text fontSize="sm" color="gray.600">
          Powered by{" "}
          <Text as="span" fontWeight="bold" color="purple.600">
            VibeKit Studio
          </Text>
        </Text>
      </Box>
    </Box>
  );
}
