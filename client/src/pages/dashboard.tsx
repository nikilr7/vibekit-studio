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
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@chakra-ui/react";
import { CreatePageDialog } from "../components/CreatePageDialog";
import { PageDetails } from "../components/PageDetails";
import type { Page } from "../api/pages";
import { pagesAPI } from "../api/pages";
import { formatViewCount } from "../utils/formatters";
import "../theme/responsive.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

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
      <Container maxW="7xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={{ base: 4, md: 6, lg: 8 }}>
          {/* Header */}
          <HStack justify="space-between" align="center" flexWrap={{ base: "wrap", md: "nowrap" }} gap={{ base: 2, md: 4 }}>
            <VStack align="start" gap={1} flex={1} minW="0">
              <Heading size={{ base: "lg", md: "xl" }}>
                My Pages
              </Heading>
              <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }}>
                Create and manage your mini websites
              </Text>
            </VStack>
            <Button colorScheme="red" size={{ base: "sm", md: "md" }} onClick={handleLogout} whiteSpace="nowrap">
              Logout
            </Button>
          </HStack>

          {/* Create Button */}
          <Button
            colorScheme="purple"
            size={{ base: "md", md: "lg" }}
            onClick={() => setDialogOpen(true)}
            width={{ base: "full", md: "auto" }}
            fontSize={{ base: "sm", md: "md" }}
            h={{ base: "40px", md: "50px" }}
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
              gap={{ base: 4, md: 5, lg: 6 }}
              alignItems="start"
              w="full"
            >
              {pages.map((page) => (
                <Box
                  key={page.id}
                  bg="white"
                  shadow={{ base: "sm", md: "md" }}
                  borderRadius={{ base: "md", md: "lg" }}
                  p={{ base: 4, md: 5, lg: 6 }}
                  border="1px solid"
                  borderColor="gray.200"
                  transition="all 0.2s"
                  _hover={{ shadow: "lg", borderColor: "purple.300" }}
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  h="full"
                >
                  <VStack align="stretch" gap={{ base: 3, md: 4 }} flex={1}>
                    {/* Title and Status */}
                    <VStack align="stretch" gap={1}>
                      <Heading
                        size={{ base: "sm", md: "md" }}
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
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {page.status === "published"
                            ? "Published"
                            : "Draft"}
                        </Badge>
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">
                          {formatDate(page.created_at)}
                        </Text>
                      </HStack>
                    </VStack>

                    {/* Slug and View Count */}
                    <VStack align="stretch" gap={2}>
                      <Box
                        bg="gray.50"
                        p={{ base: 2, md: 2.5 }}
                        borderRadius="md"
                        fontSize={{ base: "xs", md: "sm" }}
                        color="gray.600"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        title={page.slug}
                      >
                        /{page.slug}
                      </Box>

                      {/* View Count - Only show for published pages */}
                      {page.status === "published" && (
                        <Box
                          bg="blue.50"
                          p={{ base: 2, md: 2.5 }}
                          borderRadius="md"
                          fontSize={{ base: "xs", md: "sm" }}
                          color="blue.700"
                          fontWeight="500"
                          textAlign="center"
                        >
                          👁 {formatViewCount(page.view_count || 0)} views
                        </Box>
                      )}
                    </VStack>

                    {/* Actions - Fixed height to prevent layout shift */}
                    <HStack
                      gap={{ base: 1.5, md: 2 }}
                      justify="space-between"
                      pt={{ base: 2, md: 3 }}
                      mt="auto"
                      flexWrap={{ base: "wrap", md: "nowrap" }}
                      w="full"
                    >
                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        onClick={() => setSelectedPage(page)}
                        flex={{ base: "1 1 calc(50% - 4px)", md: "1" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        View Details
                      </Button>

                      <Button
                        size={{ base: "sm", md: "md" }}
                        variant="outline"
                        onClick={() => navigate(`/app/pages/${page.id}`)}
                        flex={{ base: "1 1 calc(50% - 4px)", md: "1" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        Edit
                      </Button>

                      {page.status === "published" && (
                        <Button
                          size={{ base: "sm", md: "md" }}
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => {
                            const url = `${window.location.origin}/p/${page.slug}`;
                            navigator.clipboard.writeText(url);
                            alert("Page URL copied to clipboard!");
                          }}
                          flex={{ base: "1 1 100%", md: "1" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Share
                        </Button>
                      )}

                      <Box position="relative">
                        <MenuRoot>
                          <MenuTrigger asChild>
                            <IconButton
                              variant="outline"
                              size={{ base: "sm", md: "md" }}
                              aria-label="Options"
                            >
                              ⋮
                            </IconButton>
                          </MenuTrigger>
                          <MenuContent
                            position="absolute"
                            top="100%"
                            right={0}
                            zIndex={10}
                            minW="200px"
                          >
                            {page.status === "published" && (
                              <MenuItem
                                value="view"
                                onClick={() => window.open(`/p/${page.slug}`, '_blank')}
                              >
                                View Public Page
                              </MenuItem>
                            )}
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
                      </Box>
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

      {/* Page Details Modal */}
      <DialogRoot open={!!selectedPage} onOpenChange={(details: any) => !details.open && setSelectedPage(null)}>
        <DialogContent maxW="4xl" w="95vw" maxH="90vh" position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={9999}>
          <DialogHeader pb={2}>
            <HStack justify="space-between" w="full">
              <Text fontSize="lg" fontWeight="bold">
                Page Details
              </Text>
              <DialogCloseTrigger />
            </HStack>
          </DialogHeader>
          <DialogBody pb={6} maxH="calc(90vh - 100px)" overflowY="auto">
            {selectedPage && (
              <PageDetails
                page={selectedPage}
                onViewPublic={() => {
                  window.open(`/p/${selectedPage.slug}`, '_blank');
                }}
              />
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
