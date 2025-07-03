import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Button } from '@/components/ui';
import { Text } from './components/Text';
import { Container } from './components/Container';
import { Card } from './components/Card';
import { Image } from './components/Image';
import { Navigation } from './components/Navigation';
import { Logo } from './components/Logo';
import { RenderNode } from './RenderNode';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';

export const CraftEditor = ({ data, onChange }: { data?: any; onChange?: (data: any) => void }) => {
  const [editorState, setEditorState] = React.useState(data || {});

  const handleStateChange = (state: any) => {
    setEditorState(state);
    if (onChange) {
      onChange(state);
    }
  };

  return (
    <div className="craft-editor">
      <Editor
        resolver={{
          Text,
          Container,
          Card,
          Image,
          Navigation,
          Logo,
        }}
        onNodesChange={handleStateChange}
        enabled={true}
        indicator={{
          success: '#4CAF50',
          error: '#FF5252',
        }}
      >
        <div className="flex h-full min-h-[70vh]">
          <div className="w-64 bg-gray-100 border-r p-4">
            <Sidebar />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b p-4">
              <Toolbar />
            </div>
            <div className="flex-1 p-4 bg-gray-50">
              <Frame>
                {!data ? (
                  <Element
                    canvas
                    is={Container}
                    background="#ffffff"
                    padding={20}
                    className="min-h-[500px]"
                  >
                    <Text text="Arraste componentes aqui para começar" />
                  </Element>
                ) : null}
              </Frame>
            </div>
          </div>
        </div>
      </Editor>
    </div>
  );
};
