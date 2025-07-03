/**
 * Função utilitária para serializar objetos MongoDB e outros objetos complexos
 * para objetos JavaScript simples que podem ser passados para componentes cliente
 */
export function serializeData(data: any): any {
  // Se for null ou undefined, retorna como está
  if (data === null || data === undefined) {
    return data;
  }
  
  // Se for um array, serializa cada item
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item));
  }
  
  // Se for um objeto
  if (typeof data === 'object') {
    // Se for um objeto Date, converte para string ISO
    if (data instanceof Date) {
      return data.toISOString();
    }
    
    // Para objetos Buffer (comuns em IDs do MongoDB)
    if (Buffer.isBuffer(data)) {
      return data.toString('hex');
    }
    
    // Se o objeto tiver um método toJSON (como ObjectId do MongoDB)
    if (data.toJSON && typeof data.toJSON === 'function') {
      return data.toString();
    }
    
    // Para objetos regulares, serializa cada propriedade
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = serializeData(data[key]);
      }
    }
    return result;
  }
  
  // Para tipos primitivos, retorna como está
  return data;
}
