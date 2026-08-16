import type { Meta, StoryObj } from "@storybook/sveltekit";

import HomeHero from "./HomeHero.svelte";

const meta = {
  title: "Home/HomeHero",
  component: HomeHero,
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Les meilleures vidéos éthiopiennes, sélectionnées.",
    highlightedWord: "sélectionnées.",
    eyebrow:
      "Découvrez des vidéos éthiopiennes d'actualité, musique, drama, comédie, culture et diaspora depuis YouTube.",
    primaryLabel: "Dernières vidéos",
    primaryHref: "/fr/dernieres-videos",
    secondaryLabel: "Musique",
    secondaryHref: "/fr/categories/music",
  },
} satisfies Meta<typeof HomeHero>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
