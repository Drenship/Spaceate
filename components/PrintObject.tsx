import React from 'react';

type Props = {
  title: string;
  content: any
}

const PrintObject = ({ title, content }: Props) => {
  const formattedContent = JSON.stringify(content, null, 2);
  return (
    <div className="text-left mockup-code">
      <pre data-prefix="$" className="text-warning">{ title ?? "Voire l'object"}</pre>
      <pre data-prefix=">" className="text-success">{formattedContent}</pre>
    </div>
  )
};

PrintObject.defaultProps = {
  title: "Object details",
  content: {}
}

export default PrintObject;
