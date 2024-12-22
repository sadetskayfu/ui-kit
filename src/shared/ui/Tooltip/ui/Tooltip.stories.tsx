import { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "@/shared/ui/Button";

const meta: Meta<typeof Tooltip> = {
  title: "shared/Tooltip",
  component: Tooltip,
  args: {
    children: <Button>Hover me</Button>,
    Content: <p>Tooltip text tooltip text tooltip text</p>,
    position: 'top',
    disabledClick: true,
  },
}

export default meta;
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {

};

export const ClickableTooltip: Story = {
    args: {
        clickableTooltip: true,
    }
};

export const OpenOnClick: Story = {
    args: {
        clickableTooltip: true,
        disabledHover: true,
        disabledTouch: true,
        disabledClick: false,
    }
};

export const FollowCursor: Story = {
    args: {
        followCursor: true,
    }
};



