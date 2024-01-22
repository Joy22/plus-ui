<template>
  <div ref="propertyPanel" class="property-panel">
    <div v-if="nodeName">{{ nodeName }}</div>
    <el-divider />
    <component :is="component" v-if="element" :element="element" :modeler="modeler" :users="users" :groups="groups" />
  </div>
</template>
<script setup lang="ts" name="PropertyPanel">
import { NodeName } from './assets/lang/zh';
import TaskPanel from './panel/TaskPanel.vue';
import ProcessPanel from './panel/ProcessPanel.vue';
import StartEndPanel from './panel/StartEndPanel.vue';
import GatewayPanel from './panel/GatewayPanel.vue';
import SequenceFlowPanel from './panel/SequenceFlowPanel.vue';
import { Modeler, Modeling, Element } from 'bpmn';
interface propsType {
  users: Array<any>;
  groups: Array<any>;
  modeler: Modeler;
}
const props = withDefaults(defineProps<propsType>(), {});

const element = ref<Element>();

const startEndType = ['bpmn:IntermediateThrowEvent', 'bpmn:StartEvent', 'bpmn:EndEvent'];
const taskType = [
  'bpmn:UserTask',
  'bpmn:Task',
  'bpmn:SendTask',
  'bpmn:ReceiveTask',
  'bpmn:ManualTask',
  'bpmn:BusinessRuleTask',
  'bpmn:ServiceTask',
  'bpmn:ScriptTask'
];
const sequenceType = ['bpmn:SequenceFlow'];
const gatewayType = ['bpmn:InclusiveGateway', 'bpmn:ExclusiveGateway', 'bpmn:ParallelGateway', 'bpmn:EventBasedGateway'];
const processType = ['bpmn:Process'];

const component = computed(() => {
  if (!element.value) return null;
  const type = element.value.type;
  if (startEndType.includes(type)) return StartEndPanel;
  if (taskType.includes(type)) return TaskPanel;
  if (sequenceType.includes(type)) return SequenceFlowPanel;
  if (gatewayType.includes(type)) return GatewayPanel;
  if (processType.includes(type)) return ProcessPanel;
  return console.error('no ' + type + ' type panel');
});

const nodeName = computed(() => {
  if (element.value) {
    const bizObj = element.value.businessObject;
    const type = bizObj?.eventDefinitions && bizObj?.eventDefinitions.length > 0 ? bizObj.eventDefinitions[0].$type : bizObj.$type;
    return NodeName[type] || type;
  }
});

const handleModeler = () => {
  props.modeler.on('root.added', (e: any) => {
    if (e.element.type === 'bpmn:Process') {
      element.value = null;
      nextTick(() => {
        element.value = e.element;
        // const modeling = props.modeler.get<Modeling>('modeling');
        // modeling.setColor(e.element.children, {
        //   fill: 'green'
        // });
      });
    }
  });
  props.modeler.on('element.click', (e: any) => {
    if (e.element.type === 'bpmn:Process') {
      element.value = e.element;
    }
  });
  props.modeler.on('selection.changed', (e: any) => {
    // 先给null为了让vue刷新
    element.value = null;
    const newElement = e.newSelection[0];
    if (newElement) {
      nextTick(() => {
        element.value = newElement;
      });
    }
  });
};

onMounted(() => {
  handleModeler();
});
</script>

<style scoped lang="scss">
.el-divider {
  margin-top: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
}
</style>
