export interface Tag {
  id: number;
  name: string;
  mallId: number;
  type?: any; // 'tienda_relacionada', 'producto'
  languageId?: number; // 1 - Español, 2 - Inglés, 3 - Portugués
  tagTypeId?: number;
}
