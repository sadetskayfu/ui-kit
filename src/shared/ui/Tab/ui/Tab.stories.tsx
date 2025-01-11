import { Meta, StoryObj } from "@storybook/react";
import { Tab } from "./Tab";
import { House } from "@/shared/assets/icons";

const meta: Meta<typeof Tab> = {
  title: "shared/Tab",
  component: Tab,
  args: {
    disabled: false,
    fullWidth: false,
    iconPosition: 'left',
    size: 'medium',
    variant: 'filled',
    value: 'tab',
    tabIndex: 0,
  },
  argTypes: {
    onClick: { action: "clicked" },
  }
}

export default meta;

type Story = StoryObj<typeof Tab>

export const DefaultTab: Story = {
  args: {
    label: 'Default tab',
  }
};

export const ActiveTab: Story = {
    args: {
        label: 'Active tab',
        selectedValue: 'tab'
    }
}

export const TabWithIcon: Story = {
    args: {
        Icon: <House />,
        label: 'Tab with icon'
    }
};

export const IconTab: Story = {
    args: {
        Icon: <House />,
        "aria-label": 'Icon tab'
    }
}
