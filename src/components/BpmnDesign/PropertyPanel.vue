<template>
  <div ref="propertyPanel" class="property-panel">
    <div v-if="nodeName" class="node-name">{{ nodeName }}</div>
    <component :is="component" v-if="element" :element="element" :modeler="modeler" :users="users" :groups="groups" :categorys="categorys" />
  </div>
</template>
<script setup lang="ts" name="PropertyPanel">
import { NodeName } from '@/components/BpmnDesign/assets/lang/zh';

interface propsType {
  users: Array<any>;
  groups: Array<any>;
  categorys: Array<any>;
  modeler: any;
}
const props = withDefaults(defineProps<propsType>(), {});

const element = ref<any>();

const form = reactive({
  id: '',
  name: '',
  color: null
});

const roles = ref([
  { value: 'manager', label: '经理' },
  { value: 'personnel', label: '人事' },
  { value: 'charge', label: '主管' }
]);

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
  if (startEndType.includes(type)) return 'startEndPanel';
  if (taskType.includes(type)) return 'taskPanel';
  if (sequenceType.includes(type)) return 'sequenceFlowPanel';
  if (gatewayType.includes(type)) return 'gatewayPanel';
  if (processType.includes(type)) return 'processPanel';
  return console.error('no ' + type + ' type panel');
});

const nodeName = computed(() => {
  if (element.value) {
    const bizObj = element.value.businessObject;
    const type = bizObj?.eventDefinitions ? bizObj.eventDefinitions[0].$type : bizObj.$type;
    return NodeName[type] || type;
  }
});

const handleModeler = () => {
  props.modeler.on('root.added', (e) => {
    if (e.element.type === 'bpmn:Process') {
      element.value = null;
      nextTick(() => {
        element.value = e.element;
      });
    }
  });
  props.modeler.on('element.click', (e) => {
    const { element } = e;
    if (element.type === 'bpmn:Process') {
      element.value = element;
    }
  });
  props.modeler.on('selection.changed', (e) => {
    element.value = null;
    const newElement = e.newSelection[0];
    if (newElement) {
      nextTick(() => {
        element.value = e.element;
      });
    }
  });
};

onMounted(() => {
  handleModeler();
});
</script>
