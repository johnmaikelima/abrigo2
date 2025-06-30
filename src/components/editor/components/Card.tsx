import React from 'react';
import { useNode } from '@craftjs/core';

export const Card = ({
  children,
  background = '#ffffff',
  padding = 20,
  borderRadius = 4,
  shadow = '0 2px 4px rgba(0,0,0,0.1)',
  className = '',
}: {
  children?: React.ReactNode;
  background?: string;
  padding?: number;
  borderRadius?: number;
  shadow?: string;
  className?: string;
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => connect(drag(ref as HTMLElement))}
      className={`card-component ${selected ? 'selected' : ''} ${className}`}
      style={{
        background,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        boxShadow: shadow,
        position: 'relative',
        border: selected ? '1px dashed #1e88e5' : 'none',
      }}
    >
      {children}
    </div>
  );
};

const CardSettings = () => {
  const {
    actions: { setProp },
    background,
    padding,
    borderRadius,
    shadow,
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
    borderRadius: node.data.props.borderRadius,
    shadow: node.data.props.shadow,
  }));

  return (
    <div className="card-settings">
      <div className="form-group">
        <label>Cor de Fundo</label>
        <input
          type="color"
          value={background}
          onChange={(e) => setProp((props: any) => (props.background = e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Padding</label>
        <input
          type="range"
          value={padding}
          min={0}
          max={100}
          onChange={(e) => setProp((props: any) => (props.padding = parseInt(e.target.value)))}
        />
        <div>{padding}px</div>
      </div>
      <div className="form-group">
        <label>Raio da Borda</label>
        <input
          type="range"
          value={borderRadius}
          min={0}
          max={50}
          onChange={(e) => setProp((props: any) => (props.borderRadius = parseInt(e.target.value)))}
        />
        <div>{borderRadius}px</div>
      </div>
      <div className="form-group">
        <label>Sombra</label>
        <select
          value={shadow}
          onChange={(e) => setProp((props: any) => (props.shadow = e.target.value))}
        >
          <option value="none">Nenhuma</option>
          <option value="0 2px 4px rgba(0,0,0,0.1)">Leve</option>
          <option value="0 4px 8px rgba(0,0,0,0.2)">Média</option>
          <option value="0 8px 16px rgba(0,0,0,0.3)">Forte</option>
        </select>
      </div>
    </div>
  );
};

Card.craft = {
  props: {
    background: '#ffffff',
    padding: 20,
    borderRadius: 4,
    shadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  related: {
    settings: CardSettings,
  },
  displayName: 'Card',
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};
