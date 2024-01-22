<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item prop="id" label="节点 ID">
        <el-input v-model="formData.id" @change="idChange"> </el-input>
      </el-form-item>
      <el-form-item prop="name" label="节点名称">
        <el-input v-model="formData.name" @change="nameChange"> </el-input>
      </el-form-item>
      <el-form-item label="执行监听器" style="margin-bottom: 0"> </el-form-item>
      <ExecutionListener :modeler="modeler" :element="element"></ExecutionListener>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
import usePanel from '@/components/BpmnDesign/hooks/usePanel';
import { Modeler, Element } from 'bpmn';
import { GatewayPanel } from 'bpmnDesign';

interface PropType {
  modeler: Modeler;
  element: Element;
  categorys?: any[];
}
const props = withDefaults(defineProps<PropType>(), {
  categorys: () => []
});
const { nameChange, idChange } = usePanel({
  modeler: props.modeler,
  element: toRaw(props.element)
});
const { parse, formData } = useParseElement<GatewayPanel>({
  modeler: props.modeler,
  element: toRaw(props.element)
});

const formRules = ref<ElFormRules>({
  processCategory: [{ required: true, message: '请选择', trigger: 'blur' }],
  id: [{ required: true, message: '请输入', trigger: 'blur' }],
  name: [{ required: true, message: '请输入', trigger: 'blur' }]
});
</script>

<style lang="scss" scoped></style>
