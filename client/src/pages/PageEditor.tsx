import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Grid,
  Text,
  Input,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import type { Page, PageContent } from "../types/page";
import { pagesAPI } from "../api/pages";
import { THEMES, applyTheme } from "../theme/themes";
import type { ThemeName } from "../theme/themes";
import { ThemeSelector } from "../components/ThemeSelector";
import { LivePreview } from "../components/LivePreview";
import { SaveStatus } from "../components/SaveStatus";
import { useSaveManager } from "../hooks/useSaveManager";
import {
  HeroEditor,
  FeaturesEditor,
  GalleryEditor,
  ContactEditor,
} from "../components/SectionEditors";

// Custom hook for unsaved changes warning
function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const confirmNavigation = () => {
    if (hasUnsavedChanges) {
      return window.confirm("You have unsaved changes. Are you sure you want to leave?");
    }
    return true;
  };

  return confirmNavigation;
}

type DeviceType = "desktop" | "tablet" | "mobile";

export default function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [theme, setTheme] = useState<ThemeName>("minimal");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Track what needs to be saved
  const [pendingChanges, setPendingChanges] = useState({
    title: false,
    content: false,
    theme: false,
  });

  const confirmNavigation = useUnsavedChangesWarning(
    Object.values(pendingChanges).some((v) => v)
  );

  // Save manager hook
  const saveManager = useSaveManager({
    onSave: async () => {
      if (!page || !content) return;

      const updates: any = {};
      if (pendingChanges.title) updates.title = title;
      if (pendingChanges.content) updates.content = content;
      if (pendingChanges.theme) updates.theme = theme;

      if (Object.keys(updates).length === 0) return;

      const result = await pagesAPI.update(page.id, updates);
      setPage(result);
      setPendingChanges({ title: false, content: false, theme: false });
    },
    debounceDelay: 1200,
    maxRetries: 3,
    onError: (error) => {
      console.error("Save failed:", error);
    },
    onSuccess: () => {
      // Optional: Show success toast
    },
  });

  useEffect(() => {
    if (!pageId) {
      navigate("/app");
      return;
    }
    fetchPage();
  }, [pageId]);

  useEffect(() => {
    if (content) {
      applyTheme(THEMES[theme]);
    }
  }, [theme]);

  // Trigger auto-save when changes are made
  useEffect(() => {
    if (autoSaveEnabled && Object.values(pendingChanges).some((v) => v)) {
      saveManager.triggerAutoSave();
    }
  }, [pendingChanges, autoSaveEnabled, saveManager]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const data = await pagesAPI.get(pageId!);
      setPage(data);
      setContent(data.content as PageContent);
      setTitle(data.title);
      setSlug(data.slug);
      setTheme((data.theme as ThemeName) || "minimal");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to load page"}`);
      navigate("/app");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setPendingChanges((prev) => ({ ...prev, title: true }));
    saveManager.markUnsaved();
  };

  const handleContentChange = (newContent: PageContent) => {
    setContent(newContent);
    setPendingChanges((prev) => ({ ...prev, content: true }));
    saveManager.markUnsaved();
  };

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    setPendingChanges((prev) => ({ ...prev, theme: true }));
    saveManager.markUnsaved();
  };

  const handlePublish = async () => {
    if (!page) return;

    // Save unsaved changes first
    if (Object.values(pendingChanges).some((v) => v)) {
      const shouldSaveFirst = window.confirm(
        "You have unsaved changes. Would you like to save them before publishing?"
      );
      if (shouldSaveFirst) {
        await saveManager.save();
        if (Object.values(pendingChanges).some((v) => v)) {
          return; // Save failed
        }
      }
    }

    try {
      const updated = await pagesAPI.publish(page.id);
      setPage(updated);
      alert("Success: Page published 🚀");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to publish page"}`);
    }
  };

  const handleUnpublish = async () => {
    if (!page) return;

    try {
      const updated = await pagesAPI.unpublish(page.id);
      setPage(updated);
      alert("Success: Page unpublished");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to unpublish page"}`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="lg" color="purple.500" />
      </Box>
    );
  }

  if (!page || !content) {
    return (
      <Container maxW="md" py={20}>
        <VStack gap={4} textAlign="center">
          <Heading>Page not found</Heading>
          <Button colorScheme="purple" onClick={() => navigate("/app")}>
            Back to Dashboard
          </Button>
        </VStack>
      </Container>
    );
  }

  const isPublishDisabled = Object.values(pendingChanges).some((v) => v) || saveManager.isSaving;

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top Bar */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4} px={6} boxShadow="sm">
        <Container maxW="100%" px={0}>
          <VStack gap={4} align="stretch">
            {/* Row 1: Title and Status */}
            <HStack justify="space-between" align="start">
              <VStack align="start" gap={2} flex={1}>
                <Heading size="md" color="gray.900">
                  {title || "Untitled Page"}
                </Heading>
                <HStack gap={2} flexWrap="wrap">
                  <Badge 
                    colorScheme={page.status === "published" ? "green" : "gray"}
                    fontSize="xs"
                    px={2}
                    py={1}
                  >
                    {page.status === "published" ? "Published" : "Draft"}
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    /{slug}
                  </Text>
                </HStack>
              </VStack>

              {/* Save Status - Right aligned */}
              <Box minW="fit-content">
                <SaveStatus
                  isSaving={saveManager.isSaving}
                  hasUnsavedChanges={saveManager.hasUnsavedChanges}
                  lastSavedAt={saveManager.lastSavedAt}
                  error={saveManager.error}
                />
              </Box>
            </HStack>

            {/* Row 2: Controls */}
            <HStack justify="space-between" align="center">
              <HStack gap={2}>
                <Button
                  variant={autoSaveEnabled ? "solid" : "outline"}
                  size="sm"
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  colorScheme={autoSaveEnabled ? "blue" : "gray"}
                  fontSize="xs"
                >
                  Auto-save: {autoSaveEnabled ? "ON" : "OFF"}
                </Button>
              </HStack>

              <HStack gap={2}>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  size="sm"
                  onClick={() => {
                    if (confirmNavigation()) {
                      navigate("/app");
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => saveManager.save()}
                  loading={saveManager.isSaving}
                  disabled={!saveManager.hasUnsavedChanges || saveManager.isSaving}
                >
                  Save
                </Button>
                {page.status === "draft" ? (
                  <Button
                    colorScheme="cyan"
                    size="sm"
                    onClick={handlePublish}
                    disabled={isPublishDisabled}
                    loading={saveManager.isSaving}
                  >
                    Publish
                  </Button>
                ) : (
                  <Button
                    colorScheme="orange"
                    size="sm"
                    onClick={handleUnpublish}
                    loading={saveManager.isSaving}
                  >
                    Unpublish
                  </Button>
                )}
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Main Editor */}
      <Container maxW="100%" px={0}>
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={0}
          minH="calc(100vh - 180px)"
        >
          {/* Left: Editor */}
          <Box
            bg="white"
            borderRight={{ base: "none", lg: "1px solid" }}
            borderColor="gray.200"
            overflowY="auto"
            p={6}
          >
            <VStack gap={8} align="stretch">
              {/* Page Settings */}
              <VStack gap={4} align="stretch">
                <Text fontWeight="bold" fontSize="lg" color="gray.900">
                  Page Settings
                </Text>
                <Input
                  placeholder="Page Title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  size="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  _focus={{
                    bg: "white",
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px blue.500",
                  }}
                />
                <Input
                  placeholder="Slug"
                  value={slug}
                  disabled
                  fontSize="sm"
                  color="gray.500"
                  bg="gray.100"
                  borderColor="gray.300"
                />
              </VStack>

              {/* Theme Selector */}
              <ThemeSelector
                value={theme}
                onChange={handleThemeChange}
              />

              {/* Section Editors */}
              <HeroEditor
                content={content}
                onChange={handleContentChange}
              />
              <FeaturesEditor
                content={content}
                onChange={handleContentChange}
              />
              <GalleryEditor
                content={content}
                onChange={handleContentChange}
              />
              <ContactEditor
                content={content}
                onChange={handleContentChange}
              />
            </VStack>
          </Box>

          {/* Right: Preview */}
          <Box
            bg="gray.100"
            p={6}
            overflowY="auto"
            display={{ base: "none", lg: "block" }}
          >
            <VStack gap={4} align="stretch">
              {/* Device Toggle */}
              <HStack gap={2} justify="center">
                {(["desktop", "tablet", "mobile"] as DeviceType[]).map((d) => (
                  <Button
                    key={d}
                    size="sm"
                    colorScheme={device === d ? "purple" : "gray"}
                    variant={device === d ? "solid" : "outline"}
                    onClick={() => setDevice(d)}
                    textTransform="capitalize"
                  >
                    {d}
                  </Button>
                ))}
              </HStack>

              {/* Preview */}
              <Box overflowX="auto" display="flex" justifyContent="center">
                <LivePreview
                  content={content}
                  theme={THEMES[theme]}
                  device={device}
                />
              </Box>
            </VStack>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
