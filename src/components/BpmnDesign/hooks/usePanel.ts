import { Ref } from 'vue';
import showConfig from '@/components/BpmnDesign/assets/showConfig';

interface Options {
  modeler: any;
  element: any;
}

export default (ops: Options) => {
  const { modeler, element } = ops;

  const elementType = computed(() => {
    const bizObj = element.businessObject;
    return bizObj.eventDefinitions ? bizObj.eventDefinitions[0].$type : bizObj.$type;
  });

  const config = computed(() => showConfig[elementType.value] || {});

  const updateProperties = (properties: any) => {
    const modeling = modeler.get('modeling');
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
  const documentationChange = (newVal: string) => {
    if (newVal) {
      const documentationElement = modeler.get('moddle').create('bpmn:Documentation', { text: newVal });
      updateProperties({ documentation: [documentationElement] });
    } else {
      const elements = element.businessObject;
      delete elements.documentation;
      updateProperties({ process: elements });
    }
  };

  return {
    elementType,
    showConfig: config,

    updateProperties,
    idChange,
    nameChange,
    documentationChange
  };
};
