import { useResize } from '@libs/hooks';
import React, { useEffect, useRef, ReactNode, useState } from 'react';

interface AutoHeightParentProps {
  children: ReactNode;
}

const AutoHeightParent: React.FC<AutoHeightParentProps> = ({ children }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [resize, setResize] = useState<any>();

  useEffect(() => {
    if (parentRef.current) {
      let totalChildHeight = 0;

      Array.from(parentRef.current.children).forEach((child) => {
        totalChildHeight += child.clientHeight;
      });

      parentRef.current.style.height = `${totalChildHeight}px`;
    }
  }, [parentRef, children, resize]);

  useResize(
    () => setResize(Date.now())
  )

  return <div ref={parentRef}>{children}</div>;
};

export default AutoHeightParent;
