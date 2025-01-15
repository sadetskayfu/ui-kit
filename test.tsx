import { forwardRef, useRef } from "react"

const Parent = () => {
    const child2Ref = useRef<HTMLDivElement | null>(null)
    
    return (
        <Child1 child2Ref={child2Ref}/>
    )
}

const Child1 = ({child2Ref}: {child2Ref: React.Ref<HTMLDivElement>}) => {
    return (
        <Child2 ref={child2Ref}/>
    )
}

const Child2 = forwardRef((props, ref: React.ForwardedRef<HTMLDivElement>) => {
    
    return <div ref={ref}>I am child 2</div>
})