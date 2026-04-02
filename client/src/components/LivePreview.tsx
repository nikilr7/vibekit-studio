import { Box, VStack, Button, Text, Image, Input } from "@chakra-ui/react";
import { useState } from "react";
import type { PageContent } from "../types/page";
import type { Theme } from "../theme/themes";

interface LivePreviewProps {
  content: PageContent;
  theme: Theme;
  device: "desktop" | "tablet" | "mobile";
}

export function LivePreview({ content, theme, device }: LivePreviewProps) {
  const getWidth = () => {
    switch (device) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      case "desktop":
        return "100%";
    }
  };

  const previewStyles = {
    "--color-primary": theme.colors.primary,
    "--color-secondary": theme.colors.secondary,
    "--color-accent": theme.colors.accent,
    "--color-background": theme.colors.background,
    "--color-text": theme.colors.text,
    "--color-text-light": theme.colors.textLight,
    "--color-border": theme.colors.border,
    "--font-family": theme.typography.fontFamily,
    "--heading-size": theme.typography.headingSize,
    "--body-size": theme.typography.bodySize,
  } as React.CSSProperties;

  return (
    <Box
      width={getWidth()}
      mx="auto"
      bg={theme.colors.background}
      color={theme.colors.text}
      fontFamily={theme.typography.fontFamily}
      style={previewStyles}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
    >
      <VStack gap={0} align="stretch">
        {/* Hero Section */}
        <Box
          bg={theme.colors.primary}
          color={theme.colors.secondary}
          py={16}
          px={8}
          textAlign="center"
        >
          <Text
            as="h1"
            fontSize={theme.typography.headingSize}
            fontWeight="bold"
            mb={4}
          >
            {content.hero.title}
          </Text>
          <Text fontSize="lg" mb={8} color={theme.colors.accent}>
            {content.hero.subtitle}
          </Text>
          <Button
            bg={theme.colors.accent}
            color={theme.colors.primary}
            _hover={{ opacity: 0.8 }}
            size="lg"
          >
            {content.hero.buttonText}
          </Button>
        </Box>

        {/* Features Section */}
        <Box py={16} px={8}>
          <Text
            as="h2"
            fontSize="2xl"
            fontWeight="bold"
            mb={12}
            textAlign="center"
            color={theme.colors.primary}
          >
            Features
          </Text>
          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={8}
          >
            {content.features.items.map((feature, idx) => (
              <Box
                key={idx}
                p={6}
                border="1px solid"
                borderColor={theme.colors.border}
                borderRadius="lg"
              >
                <Text
                  as="h3"
                  fontSize="lg"
                  fontWeight="bold"
                  mb={2}
                  color={theme.colors.primary}
                >
                  {feature.title}
                </Text>
                <Text color={theme.colors.textLight}>{feature.description}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Gallery Section */}
        {content.gallery.images.length > 0 && (
          <Box py={16} px={8} bg={theme.colors.secondary}>
            <Text
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              mb={12}
              textAlign="center"
              color={theme.colors.primary}
            >
              Gallery
            </Text>
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={6}
            >
              {content.gallery.images.map((image, idx) => (
                <GalleryImage
                  key={idx}
                  src={image}
                  alt={`Gallery ${idx + 1}`}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Contact Section */}
        {content.contact.enabled && (
          <Box py={16} px={8}>
            <Text
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              mb={8}
              textAlign="center"
              color={theme.colors.primary}
            >
              Get In Touch
            </Text>
            <ContactForm content={content} theme={theme} />
          </Box>
        )}
      </VStack>
    </Box>
  );
}

// Gallery Image component with error handling
function GalleryImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <Box
      aspectRatio="1"
      overflow="hidden"
      borderRadius="lg"
      bg="gray.200"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      {imageError ? (
        <VStack gap={2} color="gray.500" textAlign="center" p={4}>
          <Text fontSize="2xl">📷</Text>
          <Text fontSize="sm">Image failed to load</Text>
        </VStack>
      ) : (
        <>
          {imageLoading && (
            <Box
              position="absolute"
              inset={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="gray.100"
            >
              <Text color="gray.500">Loading...</Text>
            </Box>
          )}
          <Image
            src={src}
            alt={alt}
            width="100%"
            height="100%"
            objectFit="cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ opacity: imageLoading ? 0 : 1 }}
          />
        </>
      )}
    </Box>
  );
}

// Contact Form component with conditional rendering
function ContactForm({ content, theme }: { content: PageContent; theme: Theme }) {
  const hasAnyField = content.contact.fields.name || content.contact.fields.email || content.contact.fields.message;

  if (!hasAnyField) {
    return (
      <Box textAlign="center" py={8}>
        <Text color={theme.colors.textLight}>
          Contact form is enabled but no fields are selected.
        </Text>
      </Box>
    );
  }

  return (
    <VStack
      gap={4}
      maxW="500px"
      mx="auto"
      as="form"
      onSubmit={(e) => e.preventDefault()}
    >
      {content.contact.fields.name && (
        <Input
          placeholder="Your Name"
          borderColor={theme.colors.border}
          _focus={{ borderColor: theme.colors.accent }}
        />
      )}
      {content.contact.fields.email && (
        <Input
          placeholder="Your Email"
          type="email"
          borderColor={theme.colors.border}
          _focus={{ borderColor: theme.colors.accent }}
        />
      )}
      {content.contact.fields.message && (
        <Input
          placeholder="Your Message"
          as="textarea"
          minH="120px"
          borderColor={theme.colors.border}
          _focus={{ borderColor: theme.colors.accent }}
        />
      )}
      <Button
        width="full"
        bg={theme.colors.accent}
        color={theme.colors.primary}
        _hover={{ opacity: 0.8 }}
      >
        Send Message
      </Button>
    </VStack>
  );
}