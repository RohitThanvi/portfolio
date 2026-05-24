import React, { useRef, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function EditableText({ path, tag: Tag = 'span', className = '', style = {} }) {
  const { editMode, siteData, updateNestedData } = useAdmin();
  const ref = useRef(null);

  // Get nested value by dot-path
  const getValue = () => {
    const parts = path.split('.');
    let val = siteData;
    for (const p of parts) val = val?.[p];
    return val ?? '';
  };

  useEffect(() => {
    if (ref.current) ref.current.textContent = getValue();
  }, [siteData, path]);

  if (!editMode) {
    return <Tag className={className} style={style}>{getValue()}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      className={`${className} editable-field`}
      style={{ ...style, minWidth: '2em', display: 'inline-block' }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => updateNestedData(path, e.currentTarget.textContent)}
      title={`Edit: ${path}`}
    />
  );
}
