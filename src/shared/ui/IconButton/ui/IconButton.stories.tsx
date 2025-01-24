import { Meta, StoryObj } from "@storybook/react";
import IconButton from "./IconButton";
import { Bell } from "@/shared/assets/icons";

const meta: Meta<typeof IconButton> = {
  title: "shared/IconButton",
  component: IconButton,
  args: {
    children: <Bell />,
    variant: "filled",
    color: "primary",
    size: "medium",
    borderRadius: 'circular',
    disabled: false,
  },
  argTypes: {
    onClick: { action: "clicked" },
  }
}

export default meta;

type Story = StoryObj<typeof IconButton>

export const Default: Story = {

};

export const LinkButton: Story = {
  args: {
    to: '/example'
  }
};

export const ExternalLinkButton: Story = {
  args: {
    href: "https://example.com",
  }
};
