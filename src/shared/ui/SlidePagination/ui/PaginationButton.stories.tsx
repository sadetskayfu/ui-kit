import { Meta, StoryObj } from "@storybook/react";
import { PaginationButton } from "./PaginationButton";
import { useState } from "react";

const meta: Meta<typeof PaginationButton> = {
  title: "shared/PaginationButton",
  component: PaginationButton,
  args: {
    variant: 'dot'
  },
}

export default meta;

type Story = StoryObj<typeof PaginationButton>

const PaginationButtonWrapper = (args: any) => {

    const [isActive, setIsActive] = useState<boolean>(false)

    const handleToggle = () => {
        setIsActive((prev) => !prev)
    }

    return (
        <>
            <PaginationButton onClick={handleToggle} isActive={isActive} {...args}/>
        </>
    )
}

export const Default: Story = {
    render: (args) => PaginationButtonWrapper(args)
};





