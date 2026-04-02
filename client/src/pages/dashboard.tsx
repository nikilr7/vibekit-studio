import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Grid,
  Text,
  Badge,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@chakra-ui/react";
import { CreatePageDialog } from "../components/CreatePageDialog";
import type { Page } from "../api/pages";
import { pagesAPI } from "../api/pages";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await pagesAPI.list();
      setPages(data || []);
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to load pages"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (pageId: string) => {
    alert("Success: Page created successfully");
    navigate(`/app/pages/${pageId}`);
  };

  const handlePublish = async (id: string) => {
    try {
      const updated = await pagesAPI.publish(id);
      setPages(pages.map((p) => (p.id === id ? updated : p)));
      alert("Success: Page published");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to publish page"}`);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const updated = await pagesAPI.unpublish(id);
      setPages(pages.map((p) => (p.id === id ? updated : p)));
      alert("Success: Page unpublished");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to unpublish page"}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await pagesAPI.duplicate(id);
      alert("Success: Page duplicated successfully");
      await fetchPages();
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to duplicate page"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await pagesAPI.delete(id);
      setPages(pages.filter((p) => p.id !== id));
      alert("Success: Page deleted");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to delete page"}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="7xl" py={8}>
        <VStack align="stretch" gap={8}>
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Heading size="xl">My Pages</Heading>
              <Text color="gray.600" fontSize="sm">
                Create and manage your mini websites
              </Text>
            </VStack>
            <Button colorScheme="red" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>

          {/* Create Button */}
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => setDialogOpen(true)}
            width={{ base: "full", sm: "auto" }}
            fontSize={{ base: "md", sm: "lg" }}
            h={{ base: "44px", sm: "50px" }}
          >
            + Create New Page
          </Button>

          {/* Pages Grid */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={12}>
              <Spinner size="lg" color="purple.500" />
            </Box>
          ) : pages.length === 0 ? (
            <Box
              textAlign="center"
              py={16}
              px={4}
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
            >
              <Heading size="md" mb={2}>
                No pages yet
              </Heading>
              <Text color="gray.600" mb={6}>
                Create your first page to get started 🚀
              </Text>
              <Button
                colorScheme="purple"
                onClick={() => setDialogOpen(true)}
              >
                Create First Page
              </Button>
            </Box>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {pages.map((page) => (
                <Box
                  key={page.id}
                  bg="white"
                  shadow="sm"
                  borderRadius="lg"
                  p={6}
                  border="1px solid"
                  borderColor="gray.200"
                  transition="all 0.2s"
                  _hover={{ shadow: "md", borderColor: "purple.300" }}
                >
                  <VStack align="stretch" gap={4}>
                    {/* Title and Status */}
                    <VStack align="stretch" gap={2}>
                      <Heading
                        size="sm"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={page.title}
                      >
                        {page.title}
                      </Heading>
                      <HStack gap={2} flexWrap="wrap">
                        <Badge
                          colorScheme={
                            page.status === "published" ? "green" : "gray"
                          }
                          fontSize="xs"
                        >
                          {page.status === "published"
                            ? "Published"
                            : "Draft"}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(page.created_at)}
                        </Text>
                      </HStack>
                    </VStack>

                    {/* Slug */}
                    <Box
                      bg="gray.50"
                      p={2}
                      borderRadius="md"
                      fontSize="xs"
                      color="gray.600"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      title={page.slug}
                    >
                      /{page.slug}
                    </Box>

                    {/* Actions */}
                    <HStack gap={2} justify="space-between" pt={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/app/pages/${page.id}`)}
                        flex={1}
                        h="44px"
                      >
                        Edit
                      </Button>

                      <MenuRoot>
                        <MenuTrigger asChild>
                          <IconButton
                            variant="outline"
                            size="sm"
                            aria-label="Options"
                            h="44px"
                          >
                            ⋮
                          </IconButton>
                        </MenuTrigger>
                        <MenuContent>
                          {page.status === "draft" ? (
                            <MenuItem
                              value="publish"
                              onClick={() => handlePublish(page.id)}
                            >
                              Publish
                            </MenuItem>
                          ) : (
                            <MenuItem
                              value="unpublish"
                              onClick={() => handleUnpublish(page.id)}
                            >
                              Unpublish
                            </MenuItem>
                          )}
                          <MenuItem
                            value="duplicate"
                            onClick={() => handleDuplicate(page.id)}
                          >
                            Duplicate
                          </MenuItem>
                          <MenuItem
                            value="delete"
                            onClick={() => handleDelete(page.id)}
                            color="red.600"
                          >
                            Delete
                          </MenuItem>
                        </MenuContent>
                      </MenuRoot>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </Grid>
          )}
        </VStack>
      </Container>

      {/* Create Page Dialog */}
      <CreatePageDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
}
