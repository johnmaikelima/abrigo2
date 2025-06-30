import React from 'react';
import { useNode } from '@craftjs/core';

export const Image = ({
  src = 'https://via.placeholder.com/300x200',
  alt = 'Imagem',
  width = '100%',
  height = 'auto',
  borderRadius = 0,
  className = '',
}: {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: number;
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
      className={`image-component ${selected ? 'selected' : ''} ${className}`}
      style={{
        position: 'relative',
        border: selected ? '1px dashed #1e88e5' : 'none',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width,
          height,
          borderRadius: `${borderRadius}px`,
          display: 'block',
        }}
      />
    </div>
  );
};

const ImageSettings = () => {
  const {
    actions: { setProp },
    src,
    alt,
    width,
    height,
    borderRadius,
  } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="image-settings">
      <div className="form-group">
        <label>URL da Imagem</label>
        <input
          type="text"
          value={src}
          onChange={(e) => setProp((props: any) => (props.src = e.target.value))}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>
      <div className="form-group">
        <label>Texto Alternativo</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => setProp((props: any) => (props.alt = e.target.value))}
          placeholder="Descrição da imagem"
        />
      </div>
      <div className="form-group">
        <label>Largura</label>
        <input
          type="text"
          value={width}
          onChange={(e) => setProp((props: any) => (props.width = e.target.value))}
          placeholder="100%, 300px, etc."
        />
      </div>
      <div className="form-group">
        <label>Altura</label>
        <input
          type="text"
          value={height}
          onChange={(e) => setProp((props: any) => (props.height = e.target.value))}
          placeholder="auto, 200px, etc."
        />
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
    </div>
  );
};

Image.craft = {
  props: {
    src: 'https://via.placeholder.com/300x200',
    alt: 'Imagem',
    width: '100%',
    height: 'auto',
    borderRadius: 0,
  },
  related: {
    settings: ImageSettings,
  },
  displayName: 'Imagem',
};
