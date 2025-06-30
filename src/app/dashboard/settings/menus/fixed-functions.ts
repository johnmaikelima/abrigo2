// Mover item para cima
const moveItemUp = (menuIndex: number, itemIndex: number) => {
  if (itemIndex === 0) return;
  
  setSettings(prev => {
    const updatedMenus = [...prev.menus];
    const menuItems = [...updatedMenus[menuIndex].items];
    
    // Trocar os itens de posição no array
    const temp = menuItems[itemIndex];
    menuItems[itemIndex] = menuItems[itemIndex - 1];
    menuItems[itemIndex - 1] = temp;
    
    // Atualizar as ordens para corresponder às novas posições
    menuItems.forEach((item, idx) => {
      item.order = idx;
    });
    
    console.log('Menu após mover para cima:', JSON.stringify(menuItems));
    
    updatedMenus[menuIndex] = {
      ...updatedMenus[menuIndex],
      items: menuItems
    };
    
    return {
      ...prev,
      menus: updatedMenus
    };
  });
};

// Mover item para baixo
const moveItemDown = (menuIndex: number, itemIndex: number) => {
  const menuItems = settings.menus[menuIndex].items;
  if (itemIndex === menuItems.length - 1) return;
  
  setSettings(prev => {
    const updatedMenus = [...prev.menus];
    const menuItems = [...updatedMenus[menuIndex].items];
    
    // Trocar os itens de posição no array
    const temp = menuItems[itemIndex];
    menuItems[itemIndex] = menuItems[itemIndex + 1];
    menuItems[itemIndex + 1] = temp;
    
    // Atualizar as ordens para corresponder às novas posições
    menuItems.forEach((item, idx) => {
      item.order = idx;
    });
    
    console.log('Menu após mover para baixo:', JSON.stringify(menuItems));
    
    updatedMenus[menuIndex] = {
      ...updatedMenus[menuIndex],
      items: menuItems
    };
    
    return {
      ...prev,
      menus: updatedMenus
    };
  });
};

// Função saveSettings modificada para garantir que a ordem seja preservada
const saveSettings = async () => {
  try {
    setIsSaving(true);
    
    console.log('Salvando configurações...');
    console.log('Menus antes de salvar:', settings.menus);
    
    // Garantir que todos os itens tenham ordens sequenciais antes de salvar
    const updatedSettings = {
      ...settings,
      menus: settings.menus.map(menu => ({
        ...menu,
        items: [...menu.items].map((item, idx) => ({
          ...item,
          order: idx  // Garantir que a ordem seja sequencial
        }))
      }))
    };
    
    console.log('Menus ordenados para salvar:', updatedSettings.menus);
    
    const response = await fetch('/api/settings/blog', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ menus: updatedSettings.menus })
    });
    
    const data = await response.json();
    console.log('Resposta da API após salvar:', data);
    
    if (data.success) {
      toast.success('Configurações de menus salvas com sucesso!');
      
      // Recarregar as configurações para garantir que temos os dados mais recentes
      console.log('Recarregando configurações após salvar...');
      await fetchSettings();
    } else {
      toast.error('Erro ao salvar configurações');
      console.error('Erro retornado pela API:', data.error || 'Erro desconhecido');
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    toast.error('Erro ao salvar configurações');
  } finally {
    setIsSaving(false);
  }
};
