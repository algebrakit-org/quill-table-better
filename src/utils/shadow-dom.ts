/**
 * Shadow DOM utilities for quill-table-better
 * Provides context-aware DOM operations that work within Shadow DOM boundaries
 */

/**
 * Get the appropriate document context for DOM operations
 * @param element - Reference element to determine document context
 * @returns Document or ShadowRoot that should be used for DOM operations
 */
export function getDocumentContext(element?: Element | Node): Document {
  if (!element) return document;
  
  // Get the owner document from the element
  if (element.ownerDocument) {
    return element.ownerDocument;
  }
  
  // Fallback to global document
  return document;
}

/**
 * Get the root node for queries and event handling
 * Returns the Shadow Root if element is within Shadow DOM, otherwise document
 * @param element - Reference element to determine root context
 * @returns Document or ShadowRoot for scoped operations
 */
export function getRootContext(element?: Element | Node): Document | ShadowRoot {
  if (!element) return document;
  
  // Find the root node (document or shadow root)
  let root = element.getRootNode?.() || document;
  
  // Ensure we have a proper Document or ShadowRoot
  if (root instanceof ShadowRoot || root instanceof Document) {
    return root;
  }
  
  return document;
}

/**
 * Create an element using the appropriate document context
 * @param tagName - HTML tag name
 * @param contextElement - Reference element for document context
 * @returns Created element
 */
export function createElement(tagName: string, contextElement?: Element | Node): HTMLElement {
  const doc = getDocumentContext(contextElement);
  return doc.createElement(tagName);
}

/**
 * Create a document fragment using the appropriate document context
 * @param contextElement - Reference element for document context
 * @returns Created document fragment
 */
export function createDocumentFragment(contextElement?: Element | Node): DocumentFragment {
  const doc = getDocumentContext(contextElement);
  return doc.createDocumentFragment();
}

/**
 * Query selector within the appropriate scope (document or shadow root)
 * @param selector - CSS selector
 * @param contextElement - Reference element for scope context
 * @returns Found element or null
 */
export function querySelector(selector: string, contextElement?: Element | Node): Element | null {
  const root = getRootContext(contextElement);
  return (root as any).querySelector(selector);
}

/**
 * Query selector all within the appropriate scope (document or shadow root)
 * @param selector - CSS selector
 * @param contextElement - Reference element for scope context
 * @returns NodeList of found elements
 */
export function querySelectorAll(selector: string, contextElement?: Element | Node): NodeListOf<Element> {
  const root = getRootContext(contextElement);
  return (root as any).querySelectorAll(selector);
}

/**
 * Add event listener to the appropriate scope (document or shadow root)
 * @param type - Event type
 * @param listener - Event listener function
 * @param contextElement - Reference element for scope context
 * @param options - Event listener options
 * @returns Function to remove the event listener
 */
export function addEventListener(
  type: string, 
  listener: EventListener, 
  contextElement?: Element | Node,
  options?: boolean | AddEventListenerOptions
): () => void {
  const root = getRootContext(contextElement);
  const target = (root as any) as EventTarget;
  
  target.addEventListener(type, listener, options);
  
  return () => {
    target.removeEventListener(type, listener, options);
  };
}

/**
 * Get viewport dimensions from the appropriate context
 * @param contextElement - Reference element for context
 * @returns Object with viewport width and height
 */
export function getViewportDimensions(contextElement?: Element | Node): { width: number; height: number } {
  const root = getRootContext(contextElement);
  
  if (root === document) {
    // Regular document context
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  } else {
    // Shadow DOM context - use the host element dimensions
    const shadowRoot = root as ShadowRoot;
    const host = shadowRoot.host as HTMLElement;
    return {
      width: host.clientWidth || window.innerWidth,
      height: host.clientHeight || window.innerHeight
    };
  }
}

/**
 * Get selection from the appropriate context
 * @param contextElement - Reference element for context
 * @returns Selection object or null
 */
export function getSelection(contextElement?: Element | Node): Selection | null {
  const root = getRootContext(contextElement);
  
  if ((root as any).getSelection) {
    return (root as any).getSelection();
  }
  
  // Fallback to window selection
  return window.getSelection();
}

/**
 * Check if an element is within a Shadow DOM
 * @param element - Element to check
 * @returns True if element is within Shadow DOM
 */
export function isInShadowDOM(element: Element | Node): boolean {
  const root = element.getRootNode?.();
  return root instanceof ShadowRoot;
}