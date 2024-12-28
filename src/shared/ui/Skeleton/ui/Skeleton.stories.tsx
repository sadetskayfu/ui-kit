import { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "shared/Skeleton",
  component: Skeleton,
  args: {
    variant: 'rounded',
  },
}

export default meta;

type Story = StoryObj<typeof Skeleton>

export const Circular: Story = {
    args: {
        variant: 'circular',
        height: '40px',
        width: '40px',
    }
};

export const Rectangular: Story = {
    args: {
        variant: 'rectangular',
        height: '40px',
        width: '200px',
    }
};


