interface Options {
  modeler: any;
  element: any;
}
export default <T>(ops: Options) => {
  const { modeler, element } = ops;

  const formData = ref<T>();

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

  return {
    parse,
    formData
  };
};
