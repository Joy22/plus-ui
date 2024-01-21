<template>
  <div>
    <el-form ref="formRef" v-model="formData" label-width="80px">
      <el-form-item prop="id" label="节点 ID">
        <el-input v-model="formData.id"> </el-input>
      </el-form-item>
      <el-form-item prop="name" label="节点名称">
        <el-input v-model="formData.name"> </el-input>
      </el-form-item>
      <el-form-item prop="documentation" label="节点描述">
        <el-input v-model="formData.documentation"> </el-input>
      </el-form-item>
      <el-form-item prop="userType" label="人员类型">
        <el-input v-model="formData.userType"> </el-input>
      </el-form-item>
      <el-form-item label="执行监听器" style="margin-bottom: 0"> </el-form-item>
      <ExecutionListener :modeler="modeler" :element="element"></ExecutionListener>
      <el-form-item label="任务监听器" style="margin-bottom: 0"> </el-form-item>
      <TaskListener :modeler="modeler" :element="element"></TaskListener>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
import { TaskPanel } from 'bpmnDesign';

interface PropType {
  modeler: any;
  element: any;
  categorys?: any[];
}
const props = withDefaults(defineProps<PropType>(), {
  categorys: () => []
});
const { parse, formData } = useParseElement<TaskPanel>({
  modeler: props.modeler,
  element: toRaw(props.element)
});
</script>

<style lang="scss" scoped></style>
