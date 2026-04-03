import { Box, VStack, Button, Text, Image, Input, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import type { PageContent } from "../types/page";
import type { Theme } from "../theme/themes";
import { getThemePreviewStyles } from "../theme/utils";

interface LivePreviewProps {
  content: PageContent;
  theme: Theme;
  device: "desktop" | "tablet" | "mobile";
  onContactSubmit?: (data: {
    name?: string;
    email?: string;
    message?: string;
  }) => Promise<boolean>;
}

export function LivePreview({
  content,
  theme,
  device,
  onContactSubmit,
}: LivePreviewProps) {
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

  const previewStyles = getThemePreviewStyles(theme);

  return (
    <Box
      width={getWidth()}
      mx="auto"
      style={previewStyles}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      className="fade-in"
    >
      <VStack gap={0} align="stretch">
        {/* Hero Section */}
        <Box
          className="hero-section fade-in-down"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.secondary,
            padding: `calc(${theme.ui.spacing} * 2)`,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <Text
            as="h1"
            fontSize={{ base: "1.5rem", sm: "2rem", md: "2.5rem", lg: theme.typography.headingSize }}
            fontWeight={theme.typography.fontWeight}
            mb={{ base: 2, md: 4 }}
            style={{
              fontFamily: theme.typography.fontFamily,
              color: theme.colors.secondary,
              lineHeight: "1.2",
              wordBreak: "break-word",
            }}
          >
            {content.hero.title}
          </Text>
          <Text
            fontSize={{ base: "0.875rem", sm: "1rem", md: "md", lg: "lg" }}
            mb={{ base: 4, md: 8 }}
            style={{
              color: theme.colors.accent,
              fontFamily: theme.typography.fontFamily,
              lineHeight: "1.4",
              wordBreak: "break-word",
            }}
          >
            {content.hero.subtitle}
          </Text>
          <Button
            className="btn btn-solid transition-smooth"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.primary,
              fontFamily: theme.typography.fontFamily,
              borderRadius: theme.ui.borderRadius,
              padding: `calc(${theme.ui.spacing} * 0.75) calc(${theme.ui.spacing} * 1.5)`,
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              transition: "all 250ms ease-in-out",
              minHeight: "44px",
            }}
          >
            {content.hero.buttonText}
          </Button>
        </Box>

        {/* Features Section */}
        {content.features.items.length > 0 && (
          <Box
            className="section"
            style={{
              padding: `calc(${theme.ui.spacing} * 4)`,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              mb={12}
              textAlign="center"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fontFamily,
              }}
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
              gap={{ base: 4, md: 6, lg: 8 }}
            >
              {content.features.items.map((feature, idx) => (
                <Box
                  key={idx}
                  className="card fade-in-up transition-smooth"
                  style={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.ui.borderRadius,
                    padding: theme.ui.spacing,
                    transition: "all 250ms ease-in-out",
                  }}
                >
                  <Text
                    as="h3"
                    fontSize={{ base: "md", md: "lg", lg: "lg" }}
                    fontWeight="bold"
                    mb={2}
                    style={{
                      color: theme.colors.primary,
                      fontFamily: theme.typography.fontFamily,
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    fontSize={{ base: "sm", md: "base", lg: "base" }}
                    style={{
                      color: theme.colors.textLight,
                      fontFamily: theme.typography.fontFamily,
                      fontSize: theme.typography.bodySize,
                    }}
                  >
                    {feature.description}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Gallery Section */}
        {content.gallery.images.length > 0 && (
          <Box
            className="section section-alt"
            style={{
              padding: `calc(${theme.ui.spacing} * 4)`,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              mb={12}
              textAlign="center"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fontFamily,
              }}
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
              gap={{ base: 4, md: 6, lg: 8 }}
            >
              {content.gallery.images.map((image, idx) => (
                <GalleryImage
                  key={idx}
                  src={image}
                  alt={`Gallery ${idx + 1}`}
                  borderRadius={theme.ui.borderRadius}
                  borderColor={theme.colors.border}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Contact Section */}
        {content.contact.enabled && (
          <Box
            className="section"
            style={{
              padding: `calc(${theme.ui.spacing} * 4)`,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text
              as="h2"
              fontSize="2xl"
              fontWeight="bold"
              mb={8}
              textAlign="center"
              style={{
                color: theme.colors.primary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              Get In Touch
            </Text>
            <ContactForm
              content={content}
              theme={theme}
              onSubmit={onContactSubmit}
            />
          </Box>
        )}
      </VStack>
    </Box>
  );
}

function GalleryImage({
  src,
  alt,
  borderRadius,
  borderColor,
}: {
  src: string;
  alt: string;
  borderRadius: string;
  borderColor: string;
}) {
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
      style={{ borderRadius }}
      bg="gray.200"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      border={`1px solid ${borderColor}`}
      className="transition-smooth"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
      }}
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

function ContactForm({
  content,
  theme,
  onSubmit,
}: {
  content: PageContent;
  theme: Theme;
  onSubmit?: (data: {
    name?: string;
    email?: string;
    message?: string;
  }) => Promise<boolean>;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasAnyField =
    content.contact.fields.name ||
    content.contact.fields.email ||
    content.contact.fields.message;

  if (!hasAnyField) {
    return (
      <Box textAlign="center" py={8}>
        <Text
          style={{
            color: theme.colors.textLight,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          Contact form is enabled but no fields are selected.
        </Text>
      </Box>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate required fields
    if (content.contact.fields.name && !formData.name?.trim()) {
      setSubmitError("Name is required");
      return;
    }
    if (content.contact.fields.email && !formData.email?.trim()) {
      setSubmitError("Email is required");
      return;
    }
    if (content.contact.fields.message && !formData.message?.trim()) {
      setSubmitError("Message is required");
      return;
    }

    // Validate field lengths
    if (formData.name && formData.name.trim().length < 2) {
      setSubmitError("Name must be at least 2 characters");
      return;
    }
    if (formData.message && formData.message.trim().length < 5) {
      setSubmitError("Message must be at least 5 characters");
      return;
    }

    if (!onSubmit) {
      setSubmitError("Contact form is not configured");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      setSubmitError("Failed to submit form. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack
      gap={{ base: 3, md: 4 }}
      maxW="500px"
      mx="auto"
      as="form"
      onSubmit={handleSubmit}
      w="full"
      px={{ base: 4, md: 0 }}
    >
      {content.contact.fields.name && (
        <Input
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="form-input input-responsive transition-smooth"
          style={{
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            borderRadius: theme.ui.borderRadius,
            backgroundColor: theme.colors.background,
            padding: "8px 12px",
            border: `1px solid ${theme.colors.border}`,
            minHeight: "44px",
          }}
          disabled={isSubmitting}
        />
      )}
      {content.contact.fields.email && (
        <Input
          name="email"
          placeholder="Your Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input input-responsive transition-smooth"
          style={{
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            borderRadius: theme.ui.borderRadius,
            backgroundColor: theme.colors.background,
            padding: "8px 12px",
            border: `1px solid ${theme.colors.border}`,
            minHeight: "44px",
          }}
          disabled={isSubmitting}
        />
      )}
      {content.contact.fields.message && (
        <Input
          name="message"
          placeholder="Your Message"
          as="textarea"
          minH="120px"
          value={formData.message}
          onChange={handleChange}
          className="form-textarea input-responsive transition-smooth"
          style={{
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            borderRadius: theme.ui.borderRadius,
            backgroundColor: theme.colors.background,
            padding: "8px 12px",
            border: `1px solid ${theme.colors.border}`,
            minHeight: "120px",
          }}
          disabled={isSubmitting}
        />
      )}
      {submitError && (
        <Text color="red.500" fontSize="sm">
          {submitError}
        </Text>
      )}
      <Button
        width="full"
        className="btn btn-solid btn-responsive transition-smooth"
        style={{
          backgroundColor: theme.colors.accent,
          color: theme.colors.primary,
          fontFamily: theme.typography.fontFamily,
          borderRadius: theme.ui.borderRadius,
          padding: "10px 20px",
          fontWeight: "bold",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          border: "none",
          transition: "all 250ms ease-in-out",
          opacity: isSubmitting ? 0.7 : 1,
          minHeight: "44px",
        }}
        type="submit"
        disabled={isSubmitting}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" mr={2} />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </VStack>
  );
}
