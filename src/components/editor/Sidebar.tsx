import React from 'react';
import { useEditor } from '@craftjs/core';
import { Button } from '@/components/ui';
import { Text } from './components/Text';
import { Container } from './components/Container';
import { Card } from './components/Card';
import { Image } from './components/Image';
import { Navigation } from './components/Navigation';
import { Logo } from './components/Logo';

export const Sidebar = () => {
  const { connectors } = useEditor();

  return (
    <div className="sidebar">
      <h3 className="text-lg font-medium mb-4">Componentes</h3>
      <div className="space-y-2">
        <div
          ref={(ref) => connectors.create(ref as HTMLElement, <Text text="Texto editável" />)}
          className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-sm">Texto</span>
          </div>
        </div>

        <div
          ref={(ref) =>
            connectors.create(
              ref as HTMLElement,
              <Container padding={20} background="#ffffff">
                <Text text="Container" />
              </Container>
            )
          }
          className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-sm">Container</span>
          </div>
        </div>

        <div
          ref={(ref) =>
            connectors.create(
              ref as HTMLElement,
              <Card padding={20} background="#ffffff" borderRadius={4}>
                <Text text="Card" />
              </Card>
            )
          }
          className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-sm">Card</span>
          </div>
        </div>

        <div
          ref={(ref) => connectors.create(ref as HTMLElement, <Image />)}
          className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-sm">Imagem</span>
          </div>
        </div>

        <div
          ref={(ref) => connectors.create(ref as HTMLElement, <Navigation />)}
          className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-sm">Menu de Navegação</span>
          </div>
        </div>

        <div
          ref={(ref) => connectors.create(ref as HTMLElement, <Logo />)}
          className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <span className="text-sm">Logo</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Modelos</h3>
        <div className="space-y-2">
          <div
            ref={(ref) =>
              connectors.create(
                ref as HTMLElement,
                <Container padding={0} background="transparent" className="flex items-center justify-between p-4">
                  <Logo />
                  <Navigation />
                </Container>
              )
            }
            className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-sm">Cabeçalho Simples</span>
            </div>
          </div>

          <div
            ref={(ref) =>
              connectors.create(
                ref as HTMLElement,
                <Container padding={20} background="#f5f5f5" className="flex flex-col items-center p-8">
                  <Text text="© 2025 Blog. Todos os direitos reservados." />
                  <Navigation />
                </Container>
              )
            }
            className="bg-white p-2 border rounded cursor-move hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-sm">Rodapé Simples</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
