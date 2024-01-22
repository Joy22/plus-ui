import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  select as svgSelect,
  selectAll as svgSelectAll,
  clone as svgClone,
  clear as svgClear,
  remove as svgRemove
} from 'tiny-svg';
import logo from '@/assets/logo/logo.png';
import { Shape } from 'diagram-js/lib/model/Types';

const HIGH_PRIORITY = 1500;
export default class CustomRenderer extends BaseRenderer {
  bpmnRenderer: BaseRenderer;
  modeling: any;
  constructor(eventBus, bpmnRenderer, modeling) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
    this.modeling = modeling;
  }
  canRender(element: Shape) {
    // ignore labels
    return !element.labelTarget;
  }

  /**
   * 自定义节点图形
   * @param {*} parentNode 当前元素的svgNode
   * @param {*} element
   * @returns
   */
  drawShape(parentNode, element: Shape) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    const { type, width, height } = element;
    // 开始 填充绿色
    if (type === 'bpmn:StartEvent') {
      svgAttr(shape, { fill: 'green' });
      return shape;
    }
    return shape;
  }

  getShapePath(shape) {
    return this.bpmnRenderer.getShapePath(shape);
  }
}
