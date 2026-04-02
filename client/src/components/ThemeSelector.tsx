import { Box, VStack, HStack, Text, Button, Grid } from "@chakra-ui/react";
import type { ThemeName } from "../theme/themes";
import { getAvailableThemes } from "../theme/utils";

interface ThemeSelectorProps {
  value: ThemeName;
  onChange: (theme: ThemeName) => void;
  compact?: boolean;
}

export function ThemeSelector({ value, onChange, compact }: ThemeSelectorProps) {
  const themes = getAvailableThemes();

  if (compact) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ThemeName)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid #e2e8f0",
          fontSize: "14px",
          fontFamily: "inherit",
          cursor: "pointer",
        }}
      >
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <VStack gap={4} align="stretch">
      <Text fontWeight="bold" fontSize="lg">
        Select Theme
      </Text>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap={4}
      >
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={value === theme.id}
            onSelect={() => onChange(theme.id as ThemeName)}
          />
        ))}
      </Grid>
    </VStack>
  );
}

interface ThemeCardProps {
  theme: ReturnType<typeof getAvailableThemes>[0];
  isSelected: boolean;
  onSelect: () => void;
}

function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <Button
      onClick={onSelect}
      variant={isSelected ? "solid" : "outline"}
      colorScheme={isSelected ? "purple" : "gray"}
      height="auto"
      p={4}
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      gap={3}
      whiteSpace="normal"
      textAlign="left"
      border={isSelected ? "2px solid" : "1px solid"}
      borderColor={isSelected ? "purple.500" : "gray.200"}
      transition="all 0.2s"
      _hover={{
        borderColor: "purple.400",
        shadow: "md",
      }}
    >
      {/* Preview Box */}
      <Box
        height="60px"
        borderRadius="4px"
        bg={theme.preview.bg}
        border="1px solid"
        borderColor={theme.preview.bg === "#ffffff" ? "gray.200" : "transparent"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <Text
          fontSize="sm"
          fontWeight="bold"
          color={theme.preview.text}
          style={{ fontFamily: theme.preview.font }}
        >
          Aa
        </Text>
      </Box>

      {/* Theme Info */}
      <VStack gap={1} align="start">
        <Text fontWeight="bold" fontSize="sm">
          {theme.name}
        </Text>
        <Text fontSize="xs" color="gray.600" title={theme.description}>
          {theme.description.length > 20
            ? `${theme.description.substring(0, 20)}...`
            : theme.description}
        </Text>
      </VStack>

      {/* Color Dots */}
      <HStack gap={1} justify="flex-start">
        <Box
          width="12px"
          height="12px"
          borderRadius="50%"
          bg={theme.preview.bg}
          border="1px solid"
          borderColor="gray.300"
        />
        <Box
          width="12px"
          height="12px"
          borderRadius="50%"
          bg={theme.preview.text}
          border="1px solid"
          borderColor="gray.300"
        />
        <Box
          width="12px"
          height="12px"
          borderRadius="50%"
          bg={theme.preview.accent}
          border="1px solid"
          borderColor="gray.300"
        />
      </HStack>
    </Button>
  );
}
