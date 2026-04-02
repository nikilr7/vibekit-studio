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
import { LivePreview } from "../components/LivePreview";
import {
  HeroEditor,
  FeaturesEditor,
  GalleryEditor,
  ContactEditor,
} from "../components/SectionEditors";

type DeviceType = "desktop" | "tablet" | "mobile";

export default function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [theme, setTheme] = useState<ThemeName>("minimal");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

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

  const fetchPage = async () => {
    try {
      setLoading(true);
      const data = await pagesAPI.get(pageId!);
      setPage(data as any);
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

  const handleSave = async () => {
    if (!page || !content) return;

    try {
      setSaving(true);
      await pagesAPI.update(page.id, {
        title,
        content,
        theme,
      });
      setSaved(true);
      alert("Success: Page saved");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to save page"}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!page) return;

    try {
      setSaving(true);
      await pagesAPI.publish(page.id);
      setPage({ ...page, status: "published" });
      alert("Success: Page published");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to publish page"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (!page) return;

    try {
      setSaving(true);
      await pagesAPI.unpublish(page.id);
      setPage({ ...page, status: "draft" });
      alert("Success: Page unpublished");
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to unpublish page"}`);
    } finally {
      setSaving(false);
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

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Top Bar */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={4} px={6}>
        <Container maxW="100%" px={0}>
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={1}>
              <Heading size="md">{title}</Heading>
              <HStack gap={2}>
                <Badge colorScheme={page.status === "published" ? "green" : "gray"}>
                  {page.status === "published" ? "Published" : "Draft"}
                </Badge>
                <Text fontSize="sm" color="gray.600">
                  {saved ? "Saved" : "Unsaved changes"}
                </Text>
              </HStack>
            </VStack>
            <HStack gap={2}>
              <Button
                variant="outline"
                onClick={() => navigate("/app")}
              >
                Back to Dashboard
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleSave}
                loading={saving}
              >
                Save
              </Button>
              {page.status === "draft" ? (
                <Button
                  colorScheme="green"
                  onClick={handlePublish}
                  loading={saving}
                >
                  Publish
                </Button>
              ) : (
                <Button
                  colorScheme="orange"
                  onClick={handleUnpublish}
                  loading={saving}
                >
                  Unpublish
                </Button>
              )}
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Editor */}
      <Container maxW="100%" px={0}>
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={0}
          minH="calc(100vh - 120px)"
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
                <Text fontWeight="bold" fontSize="lg">
                  Page Settings
                </Text>
                <Input
                  placeholder="Page Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSaved(false);
                  }}
                />
                <Input
                  placeholder="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled
                  fontSize="sm"
                  color="gray.500"
                />
                <select
                  value={theme}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setTheme(e.target.value as ThemeName);
                    setSaved(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #e2e8f0",
                    fontSize: "14px",
                  }}
                >
                  {Object.entries(THEMES).map(([key, t]) => (
                    <option key={key} value={key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </VStack>

              {/* Section Editors */}
              <HeroEditor content={content} onChange={(c) => {
                setContent(c);
                setSaved(false);
              }} />
              <FeaturesEditor content={content} onChange={(c) => {
                setContent(c);
                setSaved(false);
              }} />
              <GalleryEditor content={content} onChange={(c) => {
                setContent(c);
                setSaved(false);
              }} />
              <ContactEditor content={content} onChange={(c) => {
                setContent(c);
                setSaved(false);
              }} />
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
