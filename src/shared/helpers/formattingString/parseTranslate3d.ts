export const parseTranslate3d = (str: string, axis: 'x' | 'y' = 'x'): number | null => {
    const values = str.match(/-?\d+\.?\d*(?:px|rem)?/g);

    if (!values) return null;
    
    const cleanValues = values.map((value) => {
      const numStr = value.replace(/px|rem/g, '');

      return parseFloat(numStr);
    });
  
    switch(axis.toLowerCase()) {
      case 'x':
        return cleanValues[1];
      case 'y':
        return cleanValues[2];
      default:
        return null;
    }
  }