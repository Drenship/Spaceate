import React from 'react';

type Props = {
  content: object;
};

const PrintObject = ({ content }: Props) => {
  const formattedContent: string = JSON.stringify(content, null, 2);
  return (
    <div className="text-left mockup-code">
      <pre data-prefix=">" className="text-warning">{formattedContent}</pre>
    </div>
  )
};

export default PrintObject;