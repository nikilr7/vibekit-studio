export interface HeroSection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface FeaturesSection {
  items: Feature[];
}

export interface GallerySection {
  images: string[];
}

export interface ContactSection {
  enabled: boolean;
  fields: {
    name: boolean;
    email: boolean;
    message: boolean;
  };
}

export interface PageContent {
  hero: HeroSection;
  features: FeaturesSection;
  gallery: GallerySection;
  contact: ContactSection;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: PageContent;
  theme: string;
  status: "draft" | "published";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PAGE_CONTENT: PageContent = {
  hero: {
    title: "Your Page Title",
    subtitle: "Create something amazing with VibeKit Studio",
    buttonText: "Get Started",
    buttonUrl: "#features",
  },
  features: {
    items: [
      {
        title: "Fast",
        description: "Lightning-quick performance optimized for speed",
      },
      {
        title: "Reliable",
        description: "Built to last with enterprise-grade stability",
      },
      {
        title: "Modern",
        description: "Latest design trends and technologies",
      },
      {
        title: "Responsive",
        description: "Perfect on mobile, tablet, and desktop",
      },
      {
        title: "Secure",
        description: "Industry-standard security and encryption",
      },
      {
        title: "Scalable",
        description: "Grows with your business needs",
      },
    ],
  },
  gallery: {
    images: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&h=500&fit=crop",
    ],
  },
  contact: {
    enabled: true,
    fields: {
      name: true,
      email: true,
      message: true,
    },
  },
};
