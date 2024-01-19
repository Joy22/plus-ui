import type { Moddle } from 'moddle';
import type Modeler from 'bpmn-js/lib/Modeler';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type Canvas from 'diagram-js/lib/core/Canvas';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';

type ModelerStore = {
  modeler: Modeler | undefined;
  moddle: Moddle | undefined;
  modeling: Modeling | undefined;
  canvas: Canvas | undefined;
  elementRegistry: ElementRegistry | undefined;
  bpmnModel: Modeler | undefined;
  // 流程定义根节点信息
  procDefId: string | undefined;
  procDefName: string | undefined;
};

const defaultState: ModelerStore = {
  modeler: undefined,
  moddle: undefined,
  modeling: undefined,
  canvas: undefined,
  elementRegistry: undefined,
  bpmnModel: undefined,
  procDefId: undefined,
  procDefName: undefined
};
export const useModelerStore = defineStore('modeler', () => {
  const modeler = ref(defaultState.modeler);
  const moddle = ref(defaultState.moddle);
  const modeling = ref(defaultState.modeling);
  const canvas = ref(defaultState.canvas);
  const elementRegistry = ref(defaultState.elementRegistry);
  const bpmnModel = ref(defaultState.bpmnModel);
  const procDefId = ref(defaultState.procDefId);
  const procDefName = ref(defaultState.procDefName);

  const getModeler = (): Modeler => modeler.value;
  const getModdle = () => moddle.value;
  const getModeling = (): Modeling | undefined => modeling.value;
  const getCanvas = (): Canvas | undefined => canvas.value;
  const getElRegistry = (): ElementRegistry | undefined => elementRegistry.value;
  const getProcDefId = (): string | undefined => procDefId.value;
  const getProcDefName = (): string | undefined => procDefName.value;

  // 设置根节点
  const setModeler = (modelers: Modeler | undefined) => {
    if (modelers) {
      bpmnModel.value = modelers;
      modeler.value = modelers;
      modeling.value = modelers.get('modeling');
      moddle.value = modelers.get('moddle');
      canvas.value = modelers.get('canvas');
      elementRegistry.value = modelers.get('elementRegistry');
    } else {
      modeling.value = moddle.value = canvas.value = elementRegistry.value = bpmnModel.value = undefined;
    }
  };
  // 设置流程定义根节点信息
  const setProcDef = (modeler: any | undefined) => {
    procDefId.value = modeler.get('canvas').getRootElement().businessObject.get('id');
    procDefName.value = modeler.get('canvas').getRootElement().businessObject.get('name');
  };

  return {
    getModeler,
    getModdle,
    getModeling,
    getCanvas,
    getElRegistry,
    getProcDefId,
    getProcDefName,
    setModeler,
    setProcDef
  };
});
export default useModelerStore;
