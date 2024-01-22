import { Ref } from 'vue';
import { Element, Modeler } from 'bpmn';

interface Options<T> {
  modeler: Modeler;
  element: Element;
  initData: T;
}

interface Data {
  id: string;
}

export default <T extends Data>(ops: Options<T>) => {
  const { modeler, element, initData } = ops;

  const formData = ref<T>(initData);

  const parse = () => {
    const result = {
      ...element.businessObject,
      ...element.businessObject.$attrs
    };

    // 移除flowable前缀，格式化数组
    for (const key in result) {
      if (key.indexOf('flowable:') === 0) {
        const newKey = key.replace('flowable:', '');
        result[newKey] = result[key];
        delete result[key];
      }
    }
    formData.value = { ...formData.value, ...result };
    return formData;
  };

  onBeforeMount(() => {
    parse();
  });

  return {
    parse,
    formData: formData as Ref<T>
  };
};
