/**
 * Utilitários para trabalhar com objetos do MongoDB
 */

/**
 * Converte objetos do MongoDB em objetos JavaScript simples
 * Resolve o problema: "Only plain objects can be passed to Client Components from Server Components"
 * 
 * @param obj Objeto ou array de objetos do MongoDB para serializar
 * @returns Objeto ou array serializado
 */
export function serializeMongoDBObject(obj: any): any {
  // Se for null ou undefined, retorna como está
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Se for um array, serializa cada item
  if (Array.isArray(obj)) {
    return obj.map(item => serializeMongoDBObject(item));
  }
  
  // Se for um objeto Date, converte para string ISO
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // Se for um objeto Buffer (como _id), converte para string
  if (obj && typeof obj === 'object' && obj.constructor && obj.constructor.name === 'ObjectID') {
    return obj.toString();
  }
  
  // Se for um objeto simples, serializa cada propriedade
  if (obj && typeof obj === 'object' && !Buffer.isBuffer(obj)) {
    const serialized: Record<string, any> = {};
    
    // Converte _id especificamente se existir
    if (obj._id) {
      serialized._id = obj._id.toString ? obj._id.toString() : obj._id;
    }
    
    // Serializa todas as outras propriedades
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && key !== '_id') {
        serialized[key] = serializeMongoDBObject(obj[key]);
      }
    }
    
    return serialized;
  }
  
  // Para outros tipos de dados, retorna como está
  return obj;
}
