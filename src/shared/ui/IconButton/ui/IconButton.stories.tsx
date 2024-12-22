import { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";
import { Icon } from "@/shared/ui/Icon";

const meta: Meta<typeof IconButton> = {
  title: "shared/IconButton",
  component: IconButton,
  args: {
    children: <Icon variant="bell" />,
    variant: "filled",
    color: "primary",
    size: "medium",
  },
  argTypes: {
    onClick: { action: "clicked" },
  }
}

export default meta;
type Story = StoryObj<typeof IconButton>

export const Default: Story = {

};

export const Disabled: Story = {
  args: {
    disabled: true,
  }
};

export const LinkButton: Story = {
  args: {
    isLink: true,
    to: '/example'
  }
};

export const ExternalLinkButton: Story = {
  args: {
    isExternalLink: true,
    to: "https://example.com",
  }
};
