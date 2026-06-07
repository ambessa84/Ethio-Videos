import type { Meta, StoryObj } from "@storybook/sveltekit";

import VideoCard from "./VideoCard.svelte";

const meta = {
  title: "Components/VideoCard",
  component: VideoCard,
  args: {
    lang: "en",
    video: {
      slug: "ethiopian-tigrigna-music-demo",
      localizedSlug: "ethiopian-tigrigna-music-demo",
      title: "New Ethiopian Tigrigna Music 2026",
      localizedTitle: "New Ethiopian Tigrigna Music 2026",
      thumbnailUrl: "/placeholder-video.svg",
      viewCount: 128450,
      channel: {
        title: "Ambessa Music",
        slug: "ambessa-music",
      },
      category: {
        name: "Music",
        slug: "music",
      },
    },
  },
} satisfies Meta<typeof VideoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FrenchMetadata: Story = {
  args: {
    lang: "fr",
    video: {
      slug: "ethiopian-tigrigna-music-demo",
      localizedSlug: "reprise-tigrigna-ethiopienne-demo",
      title: "New Ethiopian Tigrigna Music 2026",
      localizedTitle: "Reprise tigrigna ethiopienne 2026",
      thumbnailUrl: "/placeholder-video.svg",
      viewCount: 98210,
      channel: {
        title: "Ambessa Music",
        slug: "ambessa-music",
      },
      category: {
        name: "Musique",
        slug: "musique",
      },
    },
  },
};
