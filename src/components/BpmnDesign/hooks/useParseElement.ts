import { Ref } from 'vue';
import { Element, Modeler } from 'bpmn';

interface Options {
  modeler: Modeler;
  element: Element;
}

interface Data {
  id: string;
}

export default <T extends Data>(ops: Options) => {
  const { modeler, element } = ops;

  const formData = ref<any>({});
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
    if ('documentation' in result) {
      let str = '';
      result.documentation.forEach((item: any) => {
        str += item.text;
      });
      result.documentation = str;
    }
    formData.value = result;
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
