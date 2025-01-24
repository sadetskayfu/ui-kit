import { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@/shared/ui/IconButton";
import { Alert } from "./Alert";
import { Heart, XMark } from "@/shared/assets/icons";

const meta: Meta<typeof Alert> = {
  title: "shared/Alert",
  component: Alert,
  args: {
    variant: "filled",
    severity: 'info',
    borderRadius: 'medium',
  },
}

export default meta;

type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {
    children: <p>Default alert</p>
  }
};

export const WithTitle: Story = {
  args: {
    title: 'Title',
    children: <p>Alert with title</p>
  }
};

export const WithAction: Story = {
  args: {
    Action: <IconButton size="small-xx" color="custom-color" variant="clear"><XMark /></IconButton>,
    children: <p>Alert with action button</p>
  }
};

export const WithIcon: Story = {
  args: {
    Icon: <Heart size="small"/>,
    children: <p>Alert with icon</p>
  }
};
