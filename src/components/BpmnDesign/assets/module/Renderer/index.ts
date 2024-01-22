import CustomRenderer from './CustomRenderer';
import { ModuleDeclaration } from 'didi';

const customRenderer: ModuleDeclaration = {
  __init__: ['customRenderer'],
  customRenderer: ['type', CustomRenderer]
};

export default customRenderer;
