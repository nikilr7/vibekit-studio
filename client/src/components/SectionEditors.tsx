import { Box, Button, Input, VStack, HStack, Text, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import type { PageContent } from "../types/page";

interface SectionEditorsProps {
  content: PageContent;
  onChange: (content: PageContent) => void;
}

export function HeroEditor({ content, onChange }: SectionEditorsProps) {
  const updateHero = (field: string, value: string) => {
    onChange({
      ...content,
      hero: { ...content.hero, [field]: value },
    });
  };

  return (
    <VStack gap={4} align="stretch">
      <Text fontWeight="bold" fontSize="lg">
        Hero Section
      </Text>
      <Input
        placeholder="Title"
        value={content.hero.title}
        onChange={(e) => updateHero("title", e.target.value)}
      />
      <Input
        placeholder="Subtitle"
        value={content.hero.subtitle}
        onChange={(e) => updateHero("subtitle", e.target.value)}
      />
      <Input
        placeholder="Button Text"
        value={content.hero.buttonText}
        onChange={(e) => updateHero("buttonText", e.target.value)}
      />
      <Input
        placeholder="Button URL"
        value={content.hero.buttonUrl}
        onChange={(e) => updateHero("buttonUrl", e.target.value)}
      />
    </VStack>
  );
}

export function FeaturesEditor({ content, onChange }: SectionEditorsProps) {
  const updateFeature = (idx: number, field: string, value: string) => {
    const items = [...content.features.items];
    items[idx] = { ...items[idx], [field]: value };
    onChange({
      ...content,
      features: { items },
    });
  };

  const addFeature = () => {
    onChange({
      ...content,
      features: {
        items: [...content.features.items, { title: "New Feature", description: "" }],
      },
    });
  };

  const removeFeature = (idx: number) => {
    onChange({
      ...content,
      features: {
        items: content.features.items.filter((_, i) => i !== idx),
      },
    });
  };

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="bold" fontSize="lg">
          Features
        </Text>
        <Button size="sm" colorScheme="purple" onClick={addFeature}>
          + Add Feature
        </Button>
      </HStack>
      {content.features.items.map((feature, idx) => (
        <Box key={idx} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="bold">
              Feature {idx + 1}
            </Text>
            <IconButton
              size="sm"
              colorScheme="red"
              variant="ghost"
              aria-label="Delete"
              onClick={() => removeFeature(idx)}
            >
              ✕
            </IconButton>
          </HStack>
          <VStack gap={2} align="stretch">
            <Input
              placeholder="Title"
              value={feature.title}
              onChange={(e) => updateFeature(idx, "title", e.target.value)}
              size="sm"
            />
            <Input
              placeholder="Description"
              value={feature.description}
              onChange={(e) => updateFeature(idx, "description", e.target.value)}
              size="sm"
            />
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}

export function GalleryEditor({ content, onChange }: SectionEditorsProps) {
  const [urlErrors, setUrlErrors] = useState<{ [key: number]: string }>({});

  const validateUrl = (url: string): string | null => {
    if (!url.trim()) return null;
    
    try {
      new URL(url);
      if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return "URL should point to an image file";
      }
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  };

  const updateImage = (idx: number, value: string) => {
    const images = [...content.gallery.images];
    images[idx] = value;
    
    // Validate URL
    const error = validateUrl(value);
    setUrlErrors(prev => ({
      ...prev,
      [idx]: error || ""
    }));
    
    onChange({
      ...content,
      gallery: { images },
    });
  };

  const addImage = () => {
    onChange({
      ...content,
      gallery: {
        images: [...content.gallery.images, ""],
      },
    });
  };

  const removeImage = (idx: number) => {
    onChange({
      ...content,
      gallery: {
        images: content.gallery.images.filter((_, i) => i !== idx),
      },
    });
  };

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="bold" fontSize="lg">
          Gallery
        </Text>
        <Button size="sm" colorScheme="purple" onClick={addImage}>
          + Add Image
        </Button>
      </HStack>
      {content.gallery.images.map((image, idx) => (
        <Box key={idx} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="bold">
              Image {idx + 1}
            </Text>
            <IconButton
              size="sm"
              colorScheme="red"
              variant="ghost"
              aria-label="Delete"
              onClick={() => removeImage(idx)}
            >
              ✕
            </IconButton>
          </HStack>
          <VStack gap={2} align="stretch">
            <Input
              placeholder="Image URL (e.g., https://example.com/image.jpg)"
              value={image}
              onChange={(e) => updateImage(idx, e.target.value)}
              size="sm"
              borderColor={urlErrors[idx] ? "red.300" : "gray.200"}
            />
            {urlErrors[idx] && (
              <Text color="red.500" fontSize="xs">
                {urlErrors[idx]}
              </Text>
            )}
            {image && !urlErrors[idx] && (
              <Box
                w="100px"
                h="100px"
                borderRadius="md"
                overflow="hidden"
                bg="gray.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <img
                  src={image}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = "❌ Invalid image";
                  }}
                />
                <Text fontSize="xs" color="gray.500" display="none"></Text>
              </Box>
            )}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}

export function ContactEditor({ content, onChange }: SectionEditorsProps) {
  const toggleField = (field: "name" | "email" | "message") => {
    onChange({
      ...content,
      contact: {
        ...content.contact,
        fields: {
          ...content.contact.fields,
          [field]: !content.contact.fields[field],
        },
      },
    });
  };

  const toggleEnabled = () => {
    onChange({
      ...content,
      contact: {
        ...content.contact,
        enabled: !content.contact.enabled,
      },
    });
  };

  return (
    <VStack gap={4} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="bold" fontSize="lg">
          Contact Section
        </Text>
        <Button
          size="sm"
          colorScheme={content.contact.enabled ? "green" : "gray"}
          onClick={toggleEnabled}
        >
          {content.contact.enabled ? "Enabled" : "Disabled"}
        </Button>
      </HStack>
      {content.contact.enabled && (
        <VStack gap={2} align="stretch">
          <HStack>
            <input
              type="checkbox"
              checked={content.contact.fields.name}
              onChange={() => toggleField("name")}
              style={{ width: "auto", cursor: "pointer" }}
            />
            <Text>Name Field</Text>
          </HStack>
          <HStack>
            <input
              type="checkbox"
              checked={content.contact.fields.email}
              onChange={() => toggleField("email")}
              style={{ width: "auto", cursor: "pointer" }}
            />
            <Text>Email Field</Text>
          </HStack>
          <HStack>
            <input
              type="checkbox"
              checked={content.contact.fields.message}
              onChange={() => toggleField("message")}
              style={{ width: "auto", cursor: "pointer" }}
            />
            <Text>Message Field</Text>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}
