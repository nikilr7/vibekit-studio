import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Spinner, Container, VStack, Text, Button } from "@chakra-ui/react";
import type { Page, PageContent } from "../types/page";
import { THEMES, applyTheme } from "../theme/themes";
import type { ThemeName } from "../theme/themes";
import { LivePreview } from "../components/LivePreview";

export default function PublicPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }
    fetchPublicPage();
  }, [slug]);

  useEffect(() => {
    if (page) {
      applyTheme(THEMES[page.theme as ThemeName] || THEMES.minimal);
      // Set page title
      document.title = page.title;
    }
  }, [page]);

  const fetchPublicPage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/.netlify/functions/pages-public?slug=${slug}`);
      
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
          <Button colorScheme="purple" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="100vh">
      {/* Full-width preview without editor controls */}
      <LivePreview
        content={page.content as PageContent}
        theme={THEMES[page.theme as ThemeName] || THEMES.minimal}
        device="desktop"
      />
      
      {/* Powered by footer */}
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