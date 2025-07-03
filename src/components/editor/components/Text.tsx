import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';

export const Text = ({
  text,
  fontSize = 16,
  textAlign = 'left',
  fontWeight = 'normal',
  color = '#000000',
  margin = '0',
  className = '',
}: {
  text: string;
  fontSize?: number;
  textAlign?: string;
  fontWeight?: string;
  color?: string;
  margin?: string;
  className?: string;
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (selected) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [selected]);

  return (
    <div
      ref={(ref) => connect(drag(ref as HTMLElement))}
      className={`text-component ${selected ? 'selected' : ''} ${className}`}
      style={{ margin }}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
        tagName="p"
        style={{
          fontSize: `${fontSize}px`,
          textAlign: textAlign as any,
          fontWeight,
          color,
          padding: '0',
          margin: '0',
          outline: 'none',
        }}
      />
    </div>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    fontSize,
    textAlign,
    fontWeight,
    color,
    margin,
  } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
    margin: node.data.props.margin,
  }));

  return (
    <div className="text-settings">
      <div className="form-group">
        <label>Tamanho da Fonte</label>
        <input
          type="range"
          value={fontSize}
          min={10}
          max={80}
          onChange={(e) => setProp((props: any) => (props.fontSize = parseInt(e.target.value)))}
        />
        <div>{fontSize}px</div>
      </div>
      <div className="form-group">
        <label>Alinhamento</label>
        <select
          value={textAlign}
          onChange={(e) => setProp((props: any) => (props.textAlign = e.target.value))}
        >
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
          <option value="justify">Justificado</option>
        </select>
      </div>
      <div className="form-group">
        <label>Peso da Fonte</label>
        <select
          value={fontWeight}
          onChange={(e) => setProp((props: any) => (props.fontWeight = e.target.value))}
        >
          <option value="normal">Normal</option>
          <option value="bold">Negrito</option>
          <option value="lighter">Leve</option>
        </select>
      </div>
      <div className="form-group">
        <label>Cor</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setProp((props: any) => (props.color = e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Margem</label>
        <input
          type="text"
          value={margin}
          onChange={(e) => setProp((props: any) => (props.margin = e.target.value))}
          placeholder="0px 0px 0px 0px"
        />
      </div>
    </div>
  );
};

Text.craft = {
  props: {
    text: 'Texto editável',
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'normal',
    color: '#000000',
    margin: '0',
  },
  related: {
    settings: TextSettings,
  },
  displayName: 'Texto',
};
