# Responsive Design Quick Reference

## Breakpoints
```css
Mobile:   320px - 480px
Tablet:   768px - 1024px
Desktop:  1280px+
```

## Responsive Spacing Scale
```css
--sp-xs:   4px
--sp-sm:   8px
--sp-md:   16px
--sp-lg:   24px
--sp-xl:   32px
--sp-2xl:  48px
--sp-3xl:  64px
```

## Touch Target Minimum
```css
--touch-min: 44px
```

## Transitions
```css
--trans-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--trans-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--trans-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Common Responsive Patterns

### 1. Responsive Container
```tsx
<Container maxW="7xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
  {/* Content */}
</Container>
```

### 2. Responsive Grid (3-column on desktop)
```tsx
<Grid
  templateColumns={{
    base: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  }}
  gap={{ base: 4, md: 6, lg: 8 }}
>
  {/* Items */}
</Grid>
```

### 3. Responsive Flex (Stack on mobile)
```tsx
<HStack
  gap={{ base: 2, md: 4 }}
  flexWrap={{ base: "wrap", md: "nowrap" }}
>
  {/* Items */}
</HStack>
```

### 4. Responsive Typography
```tsx
<Heading
  size={{ base: "sm", md: "md", lg: "lg" }}
  fontSize={{ base: "20px", md: "24px", lg: "28px" }}
>
  Title
</Heading>
```

### 5. Responsive Button
```tsx
<Button
  size={{ base: "sm", md: "md" }}
  fontSize={{ base: "xs", md: "sm" }}
  minH="44px"
  width={{ base: "full", md: "auto" }}
>
  Click Me
</Button>
```

### 6. Responsive Input
```tsx
<Input
  size={{ base: "md", md: "lg" }}
  minH="44px"
  fontSize="16px"
  placeholder="Enter text"
/>
```

### 7. Responsive Padding
```tsx
<Box p={{ base: 4, md: 6, lg: 8 }}>
  {/* Content */}
</Box>
```

### 8. Responsive Margin
```tsx
<Box my={{ base: 4, md: 6, lg: 8 }}>
  {/* Content */}
</Box>
```

---

## Utility Classes

### Visibility
```css
.hide-mobile    /* Hide on mobile (max-width: 767px) */
.hide-tablet    /* Hide on tablet (768px - 1279px) */
.hide-desktop   /* Hide on desktop (1280px+) */
.show-mobile    /* Show only on mobile */
```

### Layout Patterns
```css
.split-layout       /* Flex column on mobile, row on desktop */
.sidebar-layout     /* Sidebar on desktop, stacked on mobile */
.grid-auto          /* 1 col → 2 col → 3 col */
.grid-2             /* 1 col → 2 col */
.grid-3             /* 1 col → 2 col → 3 col */
.flex-col-mobile    /* Column on mobile, row on desktop */
.flex-wrap-mobile   /* Wrap on mobile */
```

### Spacing
```css
.p-responsive       /* Responsive padding */
.gap-responsive     /* Responsive gap */
```

### Text
```css
.text-h1            /* Responsive h1 */
.text-h2            /* Responsive h2 */
.text-h3            /* Responsive h3 */
.text-body          /* Responsive body */
.text-sm            /* Responsive small */
.text-center        /* Center text */
.text-left          /* Left align */
.text-right         /* Right align */
.truncate           /* Truncate text */
.line-clamp-2       /* Clamp to 2 lines */
.line-clamp-3       /* Clamp to 3 lines */
```

### Flex
```css
.flex-center        /* Center flex items */
.flex-between       /* Space-between */
```

### Sizing
```css
.w-full             /* Width 100% */
.h-full             /* Height 100% */
.min-h-screen       /* Min height 100vh */
```

### Overflow
```css
.overflow-hidden    /* Hide overflow */
.overflow-auto      /* Auto overflow */
```

---

## Animations

### Fade Animations
```css
.fade-in            /* Fade in */
.fade-in-up         /* Fade in from bottom */
.fade-in-down       /* Fade in from top */
```

### Slide Animations
```css
.slide-in-left      /* Slide in from left */
.slide-in-right     /* Slide in from right */
```

### Scale Animation
```css
.scale-in           /* Scale in */
```

### Transition Classes
```css
.transition-smooth  /* 250ms transition */
.transition-fast    /* 150ms transition */
.transition-slow    /* 350ms transition */
```

---

## Responsive Button Sizing

### Mobile
```tsx
size="sm"
fontSize="xs"
minH="44px"
width="full"
```

### Tablet
```tsx
size="md"
fontSize="sm"
minH="44px"
width="auto"
```

### Desktop
```tsx
size="md"
fontSize="sm"
minH="44px"
width="auto"
```

---

## Responsive Input Sizing

### All Devices
```tsx
minH="44px"
fontSize="16px"  // Prevents zoom on iOS
padding="8px 12px"
```

---

## Grid Responsive Columns

### 3-Column Grid
```tsx
templateColumns={{
  base: "1fr",           // Mobile: 1 column
  md: "repeat(2, 1fr)",  // Tablet: 2 columns
  lg: "repeat(3, 1fr)",  // Desktop: 3 columns
}}
```

### 2-Column Grid
```tsx
templateColumns={{
  base: "1fr",           // Mobile: 1 column
  md: "repeat(2, 1fr)",  // Tablet+: 2 columns
}}
```

---

## Responsive Spacing

### Padding
```tsx
p={{ base: 4, md: 6, lg: 8 }}
px={{ base: 4, md: 6 }}
py={{ base: 4, md: 6, lg: 8 }}
```

### Margin
```tsx
m={{ base: 4, md: 6, lg: 8 }}
mx={{ base: 4, md: 6 }}
my={{ base: 4, md: 6, lg: 8 }}
```

### Gap
```tsx
gap={{ base: 4, md: 6, lg: 8 }}
```

---

## Responsive Font Sizes

### Heading
```tsx
fontSize={{ base: "20px", md: "24px", lg: "28px" }}
```

### Body
```tsx
fontSize={{ base: "14px", md: "15px", lg: "16px" }}
```

### Small
```tsx
fontSize={{ base: "12px", md: "13px", lg: "14px" }}
```

---

## Hover Effects

### Card Hover
```tsx
_hover={{
  borderColor: "purple.300",
  shadow: "lg",
  transform: "translateY(-4px)",
}}
```

### Button Hover
```tsx
_hover={{
  opacity: 0.85,
  transform: "translateY(-2px)",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
}}
```

### Gallery Item Hover
```tsx
_hover={{
  transform: "scale(1.05)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
}}
```

---

## Focus States

### Input Focus
```tsx
_focus={{
  outline: "none",
  borderColor: "blue.500",
  boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
}}
```

### Button Focus
```tsx
_focus={{
  outline: "2px solid currentColor",
  outlineOffset: "2px",
}}
```

---

## Empty States

### No Pages
```tsx
<Box textAlign="center" py={16} px={4}>
  <Heading size="md" mb={2}>No pages yet</Heading>
  <Text color="gray.600" mb={6}>Create your first page to get started 🚀</Text>
  <Button colorScheme="purple" onClick={handleCreate}>Create First Page</Button>
</Box>
```

### No Features
```tsx
{content.features.items.length === 0 && (
  <Box textAlign="center" py={8}>
    <Text color="gray.500">No features added yet</Text>
  </Box>
)}
```

### No Gallery Images
```tsx
{content.gallery.images.length === 0 && (
  <Box textAlign="center" py={8}>
    <Text color="gray.500">No gallery images added yet</Text>
  </Box>
)}
```

---

## Error States

### Form Error
```tsx
{submitError && (
  <Text color="red.500" fontSize="sm">
    {submitError}
  </Text>
)}
```

### API Error
```tsx
{error && (
  <Box bg="red.50" p={4} borderRadius="md" border="1px solid" borderColor="red.200">
    <Text color="red.700">{error}</Text>
  </Box>
)}
```

---

## Loading States

### Spinner
```tsx
<Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
  <Spinner size="lg" color="purple.500" thickness="4px" />
</Box>
```

### Skeleton
```tsx
<Box className="skeleton" h="100px" borderRadius="md" />
```

### Button Loading
```tsx
<Button loading={isLoading} disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

---

## Best Practices

1. **Mobile-First**: Start with mobile styles, then add desktop styles
2. **Touch Targets**: Minimum 44px for all interactive elements
3. **Spacing**: Use consistent spacing scale (4px, 8px, 16px, 24px, etc.)
4. **Typography**: Scale fonts appropriately for each breakpoint
5. **Transitions**: Use 250ms for smooth animations
6. **Accessibility**: Always include focus states and keyboard navigation
7. **Performance**: Lazy load images and optimize CSS
8. **Testing**: Test on real devices, not just browser DevTools

---

## Files to Reference

- `responsive-enhanced.css` - Main responsive CSS system
- `theme.css` - Theme and responsive overrides
- `responsive.css` - Additional responsive utilities
- `App.tsx` - Import responsive CSS
- `dashboard.tsx` - Dashboard responsive implementation
- `PageEditor.tsx` - Editor responsive implementation
- `LivePreview.tsx` - Preview responsive implementation
- `SectionEditors.tsx` - Section editors responsive implementation
