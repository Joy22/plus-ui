// 扩展左侧选择面板
import CustomPalette from './Palette';
// 扩展节点右键
import CustomContextPad from './ContextPad';
// 扩展渲染
import CustomRenderer from './Renderer';
// 翻译模块
import TranslationModule from './Translate';
import { ModuleDeclaration } from 'didi';

const Module: ModuleDeclaration[] = [CustomPalette, CustomContextPad, TranslationModule, CustomRenderer];
export default Module;
