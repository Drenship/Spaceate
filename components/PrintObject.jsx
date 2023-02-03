import React from 'react';

const PrintObject = ({ title, content }) => {
  const formattedContent = JSON.stringify(content, null, 2);
  return (
    <div className="text-left mockup-code">
      <pre data-prefix="$" className="text-warning">{ title ?? "Voire l'object"}</pre>
      <pre data-prefix=">" className="text-success">{formattedContent}</pre>
    </div>
  )
};

export default PrintObject;