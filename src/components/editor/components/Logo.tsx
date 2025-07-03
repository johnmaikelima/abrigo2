import React from 'react';
import { useNode } from '@craftjs/core';

export const Logo = ({
  src = 'https://via.placeholder.com/150x50?text=Logo',
  alt = 'Logo',
  width = '150px',
  height = 'auto',
  linkTo = '/',
  className = '',
}: {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  linkTo?: string;
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
      className={`logo-component ${selected ? 'selected' : ''} ${className}`}
      style={{
        position: 'relative',
        border: selected ? '1px dashed #1e88e5' : 'none',
      }}
    >
      <a href={linkTo} style={{ display: 'inline-block' }}>
        <img
          src={src}
          alt={alt}
          style={{
            width,
            height,
            display: 'block',
          }}
        />
      </a>
    </div>
  );
};

const LogoSettings = () => {
  const {
    actions: { setProp },
    src,
    alt,
    width,
    height,
    linkTo,
  } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
    linkTo: node.data.props.linkTo,
  }));

  return (
    <div className="logo-settings">
      <div className="form-group">
        <label>URL da Imagem do Logo</label>
        <input
          type="text"
          value={src}
          onChange={(e) => setProp((props: any) => (props.src = e.target.value))}
          placeholder="https://exemplo.com/logo.png"
        />
      </div>
      <div className="form-group">
        <label>Texto Alternativo</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => setProp((props: any) => (props.alt = e.target.value))}
          placeholder="Nome da empresa"
        />
      </div>
      <div className="form-group">
        <label>Largura</label>
        <input
          type="text"
          value={width}
          onChange={(e) => setProp((props: any) => (props.width = e.target.value))}
          placeholder="150px, 100%, etc."
        />
      </div>
      <div className="form-group">
        <label>Altura</label>
        <input
          type="text"
          value={height}
          onChange={(e) => setProp((props: any) => (props.height = e.target.value))}
          placeholder="auto, 50px, etc."
        />
      </div>
      <div className="form-group">
        <label>Link</label>
        <input
          type="text"
          value={linkTo}
          onChange={(e) => setProp((props: any) => (props.linkTo = e.target.value))}
          placeholder="/"
        />
      </div>
    </div>
  );
};

Logo.craft = {
  props: {
    src: 'https://via.placeholder.com/150x50?text=Logo',
    alt: 'Logo',
    width: '150px',
    height: 'auto',
    linkTo: '/',
  },
  related: {
    settings: LogoSettings,
  },
  displayName: 'Logo',
};
