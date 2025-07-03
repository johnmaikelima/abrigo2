'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { HeroSectionEditor } from './section-editors/hero-section-editor';
import { PageRenderer } from './page-sections/page-renderer';

interface Section {
  type: string;
  style?: string; // Estilo da seção (default, carousel, etc)
  title?: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
  images?: string[]; // Array de URLs de imagens para o carrossel
  items?: any[];
  order?: number;
}

interface SectionEditorProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');
  const [sectionsJson, setSectionsJson] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [localSections, setLocalSections] = useState<Section[]>([]);

  // Inicializar o editor com as seções existentes
  useEffect(() => {
    setLocalSections(sections);
    setSectionsJson(JSON.stringify(sections, null, 2));
  }, [sections]);

  // Atualizar o JSON quando as seções são alteradas visualmente
  const handleSectionUpdate = (index: number, updatedSection: Section) => {
    const newSections = [...localSections];
    newSections[index] = updatedSection;
    setLocalSections(newSections);
    setSectionsJson(JSON.stringify(newSections, null, 2));
    onChange(newSections);
  };

  // Atualizar as seções quando o JSON é alterado
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSectionsJson(e.target.value);
    try {
      const parsedSections = JSON.parse(e.target.value);
      setLocalSections(parsedSections);
      setJsonError('');
      onChange(parsedSections);
    } catch (err) {
      setJsonError('JSON inválido. Corrija o formato antes de salvar.');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Editor de Seções</CardTitle>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'visual' | 'json')}>
            <TabsList>
              <TabsTrigger value="visual">
                <Eye className="h-4 w-4 mr-2" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="json">
                <Code className="h-4 w-4 mr-2" />
                JSON
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'visual' ? (
          <div className="space-y-6">
            {localSections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma seção encontrada. Adicione seções usando o editor JSON.</p>
              </div>
            ) : (
              localSections.map((section, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  {section.type === 'hero' && (
                    <HeroSectionEditor 
                      section={section} 
                      onUpdate={(updatedSection) => handleSectionUpdate(index, updatedSection)} 
                    />
                  )}
                  
                  {section.type !== 'hero' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Seção: {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          Editor visual não disponível para este tipo de seção. Use o editor JSON.
                        </p>
                        <div className="border rounded-md p-4">
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(section, null, 2)}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))
            )}
            
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-2">Prévia</h3>
              <div className="border rounded-md p-4 bg-white">
                <PageRenderer sections={localSections} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea
              value={sectionsJson}
              onChange={handleJsonChange}
              rows={15}
              className="font-mono text-sm"
            />
            {jsonError && (
              <p className="text-sm text-destructive">{jsonError}</p>
            )}
            {!jsonError && (
              <p className="text-sm text-muted-foreground">
                Edite o JSON diretamente. Alterações são aplicadas automaticamente.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
