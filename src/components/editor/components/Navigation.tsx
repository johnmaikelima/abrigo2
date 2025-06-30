import React from 'react';
import { useNode } from '@craftjs/core';

type MenuItem = {
  id: string;
  label: string;
  url: string;
};

export const Navigation = ({
  items = [
    { id: '1', label: 'Início', url: '/' },
    { id: '2', label: 'Blog', url: '/blog' },
    { id: '3', label: 'Sobre', url: '/sobre' },
    { id: '4', label: 'Contato', url: '/contato' },
  ],
  orientation = 'horizontal',
  textColor = '#333333',
  hoverColor = '#1e88e5',
  fontSize = 16,
  gap = 20,
  className = '',
}: {
  items?: MenuItem[];
  orientation?: 'horizontal' | 'vertical';
  textColor?: string;
  hoverColor?: string;
  fontSize?: number;
  gap?: number;
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
      className={`navigation-component ${selected ? 'selected' : ''} ${className}`}
      style={{
        position: 'relative',
        border: selected ? '1px dashed #1e88e5' : 'none',
      }}
    >
      <nav>
        <ul
          style={{
            display: 'flex',
            flexDirection: orientation === 'horizontal' ? 'row' : 'column',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            gap: `${gap}px`,
          }}
        >
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                style={{
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = hoverColor;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = textColor;
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const NavigationSettings = () => {
  const {
    actions: { setProp },
    items,
    orientation,
    textColor,
    hoverColor,
    fontSize,
    gap,
  } = useNode((node) => ({
    items: node.data.props.items,
    orientation: node.data.props.orientation,
    textColor: node.data.props.textColor,
    hoverColor: node.data.props.hoverColor,
    fontSize: node.data.props.fontSize,
    gap: node.data.props.gap,
  }));

  const [newItemLabel, setNewItemLabel] = React.useState('');
  const [newItemUrl, setNewItemUrl] = React.useState('');

  const addItem = () => {
    if (newItemLabel && newItemUrl) {
      const newItem = {
        id: `${items.length + 1}`,
        label: newItemLabel,
        url: newItemUrl,
      };
      setProp((props: any) => props.items.push(newItem));
      setNewItemLabel('');
      setNewItemUrl('');
    }
  };

  const removeItem = (id: string) => {
    setProp((props: any) => {
      props.items = props.items.filter((item: MenuItem) => item.id !== id);
    });
  };

  return (
    <div className="navigation-settings">
      <div className="form-group">
        <label>Orientação</label>
        <select
          value={orientation}
          onChange={(e) => setProp((props: any) => (props.orientation = e.target.value))}
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>
      <div className="form-group">
        <label>Cor do Texto</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setProp((props: any) => (props.textColor = e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Cor ao Passar o Mouse</label>
        <input
          type="color"
          value={hoverColor}
          onChange={(e) => setProp((props: any) => (props.hoverColor = e.target.value))}
        />
      </div>
      <div className="form-group">
        <label>Tamanho da Fonte</label>
        <input
          type="range"
          value={fontSize}
          min={10}
          max={30}
          onChange={(e) => setProp((props: any) => (props.fontSize = parseInt(e.target.value)))}
        />
        <div>{fontSize}px</div>
      </div>
      <div className="form-group">
        <label>Espaçamento</label>
        <input
          type="range"
          value={gap}
          min={0}
          max={50}
          onChange={(e) => setProp((props: any) => (props.gap = parseInt(e.target.value)))}
        />
        <div>{gap}px</div>
      </div>
      <div className="form-group">
        <h4>Itens do Menu</h4>
        <ul className="menu-items-list">
          {items.map((item: MenuItem) => (
            <li key={item.id} className="menu-item">
              <span>
                {item.label} - {item.url}
              </span>
              <button onClick={() => removeItem(item.id)}>Remover</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group">
        <h4>Adicionar Item</h4>
        <input
          type="text"
          value={newItemLabel}
          onChange={(e) => setNewItemLabel(e.target.value)}
          placeholder="Nome do item"
        />
        <input
          type="text"
          value={newItemUrl}
          onChange={(e) => setNewItemUrl(e.target.value)}
          placeholder="URL (ex: /contato)"
        />
        <button onClick={addItem}>Adicionar</button>
      </div>
    </div>
  );
};

Navigation.craft = {
  props: {
    items: [
      { id: '1', label: 'Início', url: '/' },
      { id: '2', label: 'Blog', url: '/blog' },
      { id: '3', label: 'Sobre', url: '/sobre' },
      { id: '4', label: 'Contato', url: '/contato' },
    ],
    orientation: 'horizontal',
    textColor: '#333333',
    hoverColor: '#1e88e5',
    fontSize: 16,
    gap: 20,
  },
  related: {
    settings: NavigationSettings,
  },
  displayName: 'Menu de Navegação',
};
