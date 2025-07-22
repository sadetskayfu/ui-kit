export function ownerDocument(node: Element | null) {
    return node?.ownerDocument || document
}