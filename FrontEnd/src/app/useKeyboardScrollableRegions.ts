import { useEffect, type RefObject } from 'react';

export function useKeyboardScrollableRegions(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const makeReachable = () => {
      root.querySelectorAll<HTMLElement>('.table-wrap').forEach((region) => {
        if (!region.hasAttribute('tabindex')) region.tabIndex = 0;
      });
    };

    makeReachable();
    const observer = new MutationObserver(makeReachable);
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [rootRef]);
}
