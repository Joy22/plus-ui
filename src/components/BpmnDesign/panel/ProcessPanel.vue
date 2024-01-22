<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="流程标识" prop="id">
        <el-input v-model="formData.id" @change="idChange"></el-input>
      </el-form-item>
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="formData.name" @change="nameChange"></el-input>
      </el-form-item>
      <el-form-item label="执行监听器" style="margin-bottom: 0"> </el-form-item>
      <ExecutionListener :modeler="modeler" :element="element"></ExecutionListener>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import ExecutionListener from './property/ExecutionListener.vue';
import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
import usePanel from '@/components/BpmnDesign/hooks/usePanel';
import { Modeler, Element } from 'bpmn';
import { ProcessPanel } from 'bpmnDesign';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

interface PropType {
  modeler: Modeler;
  element: Element;
  categorys?: any[];
}
const props = withDefaults(defineProps<PropType>(), {
  categorys: () => []
});

const { parse, formData } = useParseElement<ProcessPanel>({
  modeler: props.modeler,
  element: toRaw(props.element)
});
const { idChange, nameChange, documentationChange } = usePanel({
  modeler: props.modeler,
  element: toRaw(props.element)
});

// const formData = ref<ProcessPanel>({
//   processCategory: '',
//   id: '',
//   name: '',
//   documentation: ''
// });

const formRules = ref<ElFormRules>({
  id: [{ required: true, message: '请输入', trigger: 'blur' }],
  name: [{ required: true, message: '请输入', trigger: 'blur' }]
});
</script>

<style scoped lang="scss"></style>
