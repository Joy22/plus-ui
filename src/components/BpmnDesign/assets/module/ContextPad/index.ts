import { ModuleDeclaration } from 'didi';
import CustomContextPadProvider from './CustomContextPadProvider';

const CustomContextPad: ModuleDeclaration = {
  __init__: ['customContextPadProvider'],
  customContextPadProvider: ['type', CustomContextPadProvider]
};

export default CustomContextPad;
