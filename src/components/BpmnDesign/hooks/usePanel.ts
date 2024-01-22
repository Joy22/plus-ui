import showConfig from '@/components/BpmnDesign/assets/showConfig';
import { Moddle, Modeler, Modeling, Element } from 'bpmn';
interface Options {
  modeler: Modeler;
  element: Element;
}

export default (ops: Options) => {
  const { modeler, element } = ops;

  const elementType = computed(() => {
    const bizObj = element.businessObject;
    return bizObj.eventDefinitions ? bizObj.eventDefinitions[0].$type : bizObj.$type;
  });

  const config = computed(() => showConfig[elementType.value] || {});

  const updateProperties = (properties: any) => {
    const modeling = modeler.get<Modeling>('modeling');
    modeling.updateProperties(element, properties);
  };

  const idChange = (newVal: string) => {
    if (newVal) {
      updateProperties({ id: newVal });
    }
  };
  const nameChange = (newVal: string) => {
    if (newVal) {
      updateProperties({ name: newVal });
    }
  };

  return {
    elementType,
    showConfig: config,

    updateProperties,
    idChange,
    nameChange
  };
};
