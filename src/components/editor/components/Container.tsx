import React from 'react';
import { useNode } from '@craftjs/core';

export const Container = ({
  children,
  background = '#ffffff',
  padding = 20,
  className = '',
}: {
  children?: React.ReactNode;
  background?: string;
  padding?: number;
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
      className={`container-component ${selected ? 'selected' : ''} ${className}`}
      style={{
        background,
        padding: `${padding}px`,
        position: 'relative',
        border: selected ? '1px dashed #1e88e5' : 'none',
      }}
    >
      {children}
    </div>
  );
};

const ContainerSettings = () => {
  const {
    actions: { setProp },
    background,
    padding,
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div className="container-settings">
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
    </div>
  );
};

Container.craft = {
  props: {
    background: '#ffffff',
    padding: 20,
  },
  related: {
    settings: ContainerSettings,
  },
  displayName: 'Container',
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};
