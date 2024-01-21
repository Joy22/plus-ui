// 扩展左侧选择面板
import EnhancementPaletteProvider from './Palette';
// 扩展节点右键
import EnhancementContextPad from './ContextPad';
// 翻译模块
import TranslationModule from './Translate';

import { ModuleDeclaration } from 'didi';
const Module: ModuleDeclaration[] = [EnhancementPaletteProvider, EnhancementContextPad, TranslationModule];
export default Module;
