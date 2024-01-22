import { ModuleDeclaration } from 'didi';
import CustomPaletteProvider from './CustomPaletteProvider';

const CustomPalette: ModuleDeclaration = {
  __init__: ['CustomPaletteProvider'],
  CustomPaletteProvider: ['type', CustomPaletteProvider]
};

export default CustomPalette;
