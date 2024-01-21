<template>
  <div>
    <el-form ref="formRef" v-model="formData" label-width="80px">
      <el-form-item prop="id" label="节点 id">
        <el-input v-model="formData.id" placeholder="请输入"> </el-input>
      </el-form-item>
      <el-form-item label="任务监听器">
        <el-badge :value="taskListenerCount">
          <el-button @click="taskListenerRef.openDialog()">编辑</el-button>
        </el-badge>
      </el-form-item>
    </el-form>

    <TaskListener ref="taskListenerRef" :modeler="modeler" :element="element" @close="refreshTaskListener"></TaskListener>
  </div>
</template>
<script setup lang="ts" name="TaskPanel">
import showConfig from '@/components/BpmnDesign/assets/showConfig';
import TaskListener from './property/TaskListener.vue';

interface PropType {
  modeler: any;
  element: any;
  categorys?: any[];
}
const props = withDefaults(defineProps<PropType>(), {
  categorys: () => []
});

const elementType = computed(() => {
  const bizObj = props.element.businessObject;
  return bizObj.eventDefinitions ? bizObj.eventDefinitions[0].$type : bizObj.$type;
});
const config = computed(() => showConfig[elementType.value] || {});
const taskListenerRef = ref<InstanceType<typeof TaskListener>>();
const taskListenerCount = ref(0);
const formData = ref({});

const refreshTaskListener = (count?: number) => {
  if (count) {
    taskListenerCount.value = count;
  } else {
    taskListenerCount.value =
      props.element.businessObject.extensionElements?.values?.filter((item) => item.$type === 'flowable:TaskListener').length ?? 0;
  }
};
</script>

<style lang="scss" scoped></style>
