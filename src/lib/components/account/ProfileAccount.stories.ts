import type { Meta, StoryObj } from "@storybook/sveltekit";

import ProfileAccount from "./ProfileAccount.svelte";

const meta = {
  title: "Account/ProfileAccount",
  component: ProfileAccount,
  parameters: {
    layout: "padded",
  },
  args: {
    redirectTo: "/fr/actualites",
  },
} satisfies Meta<typeof ProfileAccount>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Complete: Story = {
  args: {
    user: {
      email: "selam@example.com",
      emailVerified: "2026-09-07T10:00:00.000Z",
      firstName: "Selam",
      lastName: "Bekele",
      name: "Selam Bekele",
      birthDate: "1994-05-14T00:00:00.000Z",
      address: "Addis Ababa",
      username: "selam",
      image: "",
      avatar: "classic",
      role: "USER",
    },
    missingFields: [],
  },
};

export const Incomplete: Story = {
  args: {
    user: {
      email: "new-user@example.com",
      emailVerified: "2026-09-07T10:00:00.000Z",
      firstName: null,
      lastName: null,
      name: null,
      birthDate: null,
      address: null,
      username: null,
      image: null,
      avatar: null,
      role: "USER",
    },
    missingFields: [
      { key: "firstName", label: "First name" },
      { key: "lastName", label: "Last name" },
      { key: "birthDate", label: "Birth date" },
      { key: "username", label: "Username" },
      { key: "avatar", label: "Avatar" },
    ],
  },
};
