<template>
  <div>
    <el-form ref="formRef" v-model="formData" label-width="80px">
      <el-form-item prop="id" label="节点 id">
        <el-input v-model="formData.id" placeholder="请输入"> </el-input>
      </el-form-item>
      <el-form-item label="任务监听器" style="margin-bottom: 0"> </el-form-item>
      <TaskListener :modeler="modeler" :element="element"></TaskListener>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import showConfig from '@/components/BpmnDesign/assets/showConfig';
import TaskListener from './property/TaskListener.vue';
import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
import { ProcessPanel } from 'bpmnDesign';

interface PropType {
  modeler: any;
  element: any;
  categorys?: any[];
}
const props = withDefaults(defineProps<PropType>(), {
  categorys: () => []
});
const { parse, formData } = useParseElement<ProcessPanel>({
  modeler: props.modeler,
  element: toRaw(props.element)
});
</script>

<style lang="scss" scoped></style>
