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

  return {
    elementType,
    showConfig: config,

    updateProperties
  };
};
