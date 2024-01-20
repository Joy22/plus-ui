<template>
  <div>
    <el-dialog
      :model-value="visible"
      title="任务监听器"
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      append-to-body
    >
      <vxe-toolbar>
        <template #buttons>
          <el-button icon="Plus" @click="insertRow">新增</el-button>
        </template>
      </vxe-toolbar>
      <vxe-table
        ref="tableRef"
        height="300px"
        border
        show-overflow
        keep-source
        :data="tableData"
        :edit-rules="tableRules"
        :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
      >
        <vxe-column type="seq" width="40"></vxe-column>
        <vxe-column field="event" title="事件" :edit-render="{}">
          <template #default="slotParams">
            <span>{{ eventSelect.find((e) => e.value === slotParams.row.event)?.label }}</span>
          </template>
          <template #edit="slotParams">
            <vxe-select v-model="slotParams.row.event">
              <vxe-option v-for="item in eventSelect" :key="item.id" :value="item.value" :label="item.label"></vxe-option>
            </vxe-select>
          </template>
        </vxe-column>
        <vxe-column field="type" title="类型" :edit-render="{}">
          <template #default="slotParams">
            <span>{{ typeSelect.find((e) => e.value === slotParams.row.type)?.label }}</span>
          </template>
          <template #edit="slotParams">
            <vxe-select v-model="slotParams.row.type">
              <vxe-option v-for="item in typeSelect" :key="item.id" :value="item.value" :label="item.label"></vxe-option>
            </vxe-select>
          </template>
        </vxe-column>

        <vxe-column field="className" title="Java 类名" :edit-render="{}">
          <template #edit="slotParams">
            <vxe-input v-model="slotParams.row.className" type="text"></vxe-input>
          </template>
        </vxe-column>
        <vxe-column title="参数" width="100" show-overflow align="center">
          <template #default="slotParams">
            <el-badge :value="slotParams.row.params ? slotParams.row.params.length : 0" type="primary">
              <el-button size="small" @click="configParam(slotParams.rowIndex)">配置</el-button>
            </el-badge>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100" show-overflow align="center">
          <template #default="slotParams">
            <el-tooltip content="删除" placement="top">
              <el-button link type="danger" icon="Delete" @click="removeRow(slotParams.row)"></el-button>
            </el-tooltip>
          </template>
        </vxe-column>
      </vxe-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <ListenerParam v-if="showParamDialog" v-model:visible="showParamDialog" v-model="tableData[currentIndex].params" />
  </div>
</template>
<script setup lang="ts">
import ListenerParam from './ListenerParam.vue';
import showConfig from '../../assets/showConfig';
import { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { TaskListenerVO } from 'bpmnDesign';

const emit = defineEmits(['close']);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

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

const visible = ref(false);
const tableRef = ref<VxeTableInstance<TaskListenerVO>>();
const currentIndex = ref(0);
const tableData = ref<TaskListenerVO[]>([]);
const showParamDialog = ref(false);
const tableRules = ref<VxeTablePropTypes.EditRules>({
  event: [{ required: true, message: '请选择', trigger: 'blur' }],
  type: [{ required: true, message: '请选择', trigger: 'blur' }],
  name: [{ required: true, message: '请输入', trigger: 'blur' }],
  className: [{ required: true, message: '请输入', trigger: 'blur' }]
});
const typeSelect = [
  { id: '742fdeb7-23b4-416b-ac66-cd4ec8b901b7', label: '类', value: 'class' },
  { id: '660c9c46-8fae-4bae-91a0-0335420019dc', label: '表达式', value: 'expression' },
  { id: '4b8135ab-6bc3-4a0f-80be-22f58bc6c5fd', label: '委托表达式', value: 'delegateExpression' }
];
const eventSelect = [
  { id: 'e6e0a51a-2d5d-4dc4-b847-b5c14f43a6ab', label: 'create', value: 'create' },
  { id: '6da97c1e-15fc-4445-8943-75d09f49778e', label: 'assignment', value: 'assignment' },
  { id: '6a2cbcec-e026-4f11-bef7-fff0b5c871e2', label: 'complete', value: 'complete' },
  { id: '68801972-85f1-482f-bd86-1fad015c26ed', label: 'delete', value: 'delete' }
];

const configParam = (i: number) => {
  currentIndex.value = i;
  showParamDialog.value = true;
};
const insertRow = async () => {
  const $table = tableRef.value;
  if ($table) {
    tableData.value.push({
      className: '',
      type: '',
      name: '',
      event: '',
      params: []
    });
    const { row: newRow } = await $table.insertAt({}, -1);
    // 插入一条数据并触发校验
    await $table.validate(newRow);
  }
};

const removeRow = async (row: TaskListenerVO) => {
  await proxy?.$modal.confirm('您确定要删除该数据?');
  const $table = tableRef.value;
  if ($table) {
    await $table.remove(row);
  }
};
const submitForm = async () => {
  const $table = tableRef.value;
  if ($table) {
    const errMap = await $table.validate(true);
    if (errMap) {
      proxy.$modal.msgError('校验不通过');
    } else {
      updateElement();
      visible.value = false;
      emit('close', tableData.value.length);
    }
  }
};

const open = () => (visible.value = true);
const updateElement = () => {
  if (tableData.value.length) {
    let extensionElements = props.element.businessObject.get('extensionElements');
    if (!extensionElements) {
      extensionElements = props.modeler.get('moddle').create('bpmn:ExtensionElements');
    }
    // 清除旧值
    extensionElements.values = extensionElements.values?.filter((item) => item.$type !== 'flowable:TaskListener') ?? [];
    tableData.value.forEach((item) => {
      const taskListener = props.modeler.get('moddle').create('flowable:TaskListener');
      taskListener['event'] = item.event;
      taskListener[item.type] = item.className;
      if (item.params && item.params.length) {
        item.params.forEach((field) => {
          const fieldElement = props.modeler.get('moddle').create('flowable:Field');
          fieldElement['name'] = field.name;
          fieldElement[field.type] = field.value;
          // 注意：flowable.json 中定义的string和expression类为小写，不然会和原生的String类冲突，此处为hack
          // const valueElement = this.modeler.get('moddle').create(`flowable:${field.type}`, { body: field.value })
          // fieldElement[field.type] = valueElement
          taskListener.get('fields').push(fieldElement);
        });
      }
      extensionElements.get('values').push(taskListener);
    });
    updateProperties({ extensionElements: extensionElements });
  } else {
    const extensionElements = props.element.businessObject[`extensionElements`];
    if (extensionElements) {
      extensionElements.values = extensionElements.values?.filter((item) => item.$type !== 'flowable:TaskListener') ?? [];
    }
  }
};

const updateProperties = (properties: any) => {
  const modeling = props.modeler.get('modeling');
  modeling.updateProperties(toRaw(props.element), properties);
};
defineExpose({
  open
});
</script>

<style scoped lang="scss">
.el-badge {
  :deep(.el-badge__content) {
    top: 10px;
  }
}
</style>
