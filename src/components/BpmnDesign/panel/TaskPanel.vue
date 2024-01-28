<template>
  <div>
    <el-form ref="formRef" size="default" :model="formData" :rules="formRules" label-width="100px">
      <el-collapse v-model="currentCollapseItem">
        <el-collapse-item name="1">
          <template #title>
            <div class="collapse__title">
              <el-icon>
                <InfoFilled />
              </el-icon>
              常规
            </div>
          </template>
          <div>
            <el-form-item prop="id" label="节点 ID">
              <el-input v-model="formData.id" @change="idChange"> </el-input>
            </el-form-item>
            <el-form-item prop="name" label="节点名称">
              <el-input v-model="formData.name" @change="nameChange"> </el-input>
            </el-form-item>
            <el-form-item v-if="showConfig.skipExpression" prop="skipExpression" label="跳过表达式">
              <el-input v-model="formData.skipExpression"> </el-input>
            </el-form-item>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <div class="collapse__title">
              <el-icon>
                <Checked />
              </el-icon>
              任务
            </div>
          </template>
          <div>
            <el-form-item v-if="showConfig.async" prop="sync" label="是否异步">
              <el-switch v-model="formData.async" inline-prompt active-text="是" inactive-text="否" @change="syncChange" />
            </el-form-item>

            <el-tabs tab-position="left" class="demo-tabs" @tab-click="taskTabClick">
              <el-tab-pane label="身份存储">
                <el-form-item label="分配人员">
                  <el-input v-model="formData.userName" disabled>
                    <template #append>
                      <el-button icon="Search" size="small" type="primary" @click="openSingleUserSelect" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="候选人员">
                  <el-badge :value="selectUserLength" :max="99">
                    <el-button size="small" type="primary" @click="openUserSelect">选择人员</el-button>
                  </el-badge>
                </el-form-item>
                <el-form-item label="候选组">
                  <el-badge :value="selectRoleLength" :max="99">
                    <el-button size="small" type="primary" @click="openRoleSelect">选择组</el-button>
                  </el-badge>
                </el-form-item>
              </el-tab-pane>

              <el-tab-pane label="固定值">
                <el-form-item prop="auditUserType" label="分配类型">
                  <el-select v-model="formData.allocationType">
                    <el-option v-for="item in AllocationTypeSelect" :key="item.id" :value="item.value" :label="item.label"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="formData.allocationType === AllocationTypeEnum.USER" label="分配人员">
                  <el-input v-model="formData.userName">
                    <template #append>
                      <el-button icon="Search" size="small" type="primary" @click="proxy.$modal.msgWarning('开发中。。。。。。')" />
                    </template>
                  </el-input>
                </el-form-item>
                <div v-if="formData.allocationType === AllocationTypeEnum.CANDIDATE">
                  <el-form-item label="候选人员">
                    <el-badge :value="selectUserLength" :max="99">
                      <el-button size="small" type="primary" @click="openUserSelect">选择人员</el-button>
                    </el-badge>
                  </el-form-item>
                  <el-form-item label="候选组">
                    <el-badge :value="selectRoleLength" :max="99">
                      <el-button size="small" type="primary" @click="openRoleSelect">选择组</el-button>
                    </el-badge>
                  </el-form-item>
                </div>
                <el-form-item v-if="formData.allocationType === AllocationTypeEnum.SPECIFY && showConfig.specifyDesc" style="">
                  <el-radio-group v-model="formData.specifyDesc" class="ml-4">
                    <el-radio v-for="item in SpecifyDesc" :key="item.id" :label="item.value" size="large">{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>

            <el-form-item v-if="showConfig.multipleUserAuditType" prop="multipleUserAuditType" label="多人审批方式">
              <el-radio-group v-model="formData.multipleUserAuditType" class="ml-4 block-radio">
                <el-radio v-for="item in MultipleUserAuditType" :key="item.id" :label="item.value" size="large">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="showConfig.dueDate" prop="dueDate" label="到期时间">
              <el-input v-model="formData.dueDate" @click="openDueDate"></el-input>
            </el-form-item>
            <el-form-item v-if="showConfig.priority" prop="priority" label="优先级">
              <el-input-number v-model="formData.priority" :min="0"> </el-input-number>
            </el-form-item>
          </div>
        </el-collapse-item>

        <el-collapse-item v-if="showConfig.taskListener" name="3">
          <template #title>
            <div class="collapse__title">
              <el-icon>
                <BellFilled />
              </el-icon>
              任务监听器
            </div>
          </template>
          <div>
            <TaskListener v-if="showConfig.taskListener" :modeler="modeler" :element="element"></TaskListener>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="showConfig.executionListener" name="4">
          <template #title>
            <div class="collapse__title">
              <el-icon>
                <BellFilled />
              </el-icon>
              执行监听器
            </div>
          </template>
          <div>
            <ExecutionListener v-if="showConfig.executionListener" :modeler="modeler" :element="element"></ExecutionListener>
          </div>
        </el-collapse-item>
        <el-form-item v-if="showConfig.isForCompensation" prop="isForCompensation" label="是否为补偿">
          <el-switch v-model="formData.isForCompensation" inline-prompt active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item v-if="showConfig.triggerServiceTask" prop="triggerServiceTask" label="服务任务可触发">
          <el-switch v-model="formData.triggerServiceTask" inline-prompt active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item v-if="showConfig.autoStoreVariables" prop="autoStoreVariables" label="自动存储变量">
          <el-switch v-model="formData.autoStoreVariables" inline-prompt active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item v-if="showConfig.ruleVariablesInput" prop="skipExpression" label="输入变量">
          <el-input v-model="formData.ruleVariablesInput"> </el-input>
        </el-form-item>
        <el-form-item v-if="showConfig.exclude" prop="exclude" label="排除">
          <el-switch v-model="formData.exclude" inline-prompt active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item v-if="showConfig.class" prop="class" label="类">
          <el-input v-model="formData.class"> </el-input>
        </el-form-item>
      </el-collapse>
    </el-form>
    <UserSelect ref="userSelectRef" :data="formData.candidateUsers" @confirm-call-back="userSelectCallBack"></UserSelect>
    <UserSelect ref="singleUserSelectRef" :data="formData.assignee" :multiple="false" @confirm-call-back="singleUserSelectCallBack"></UserSelect>
    <RoleSelect ref="roleSelectRef" v-model="formData.roles"></RoleSelect>
    <DueDate ref="dueDateRef" v-model="formData.dueDate"></DueDate>
  </div>
</template>
<script setup lang="ts">
import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
import usePanel from '@/components/BpmnDesign/hooks/usePanel';
import UserSelect from '@/components/UserSelect';
import RoleSelect from '@/components/RoleSelect';
import DueDate from '@/components/BpmnDesign/panel/property/DueDate.vue';
import { Element, Moddle, Modeler, Modeling } from 'bpmn';
import { TaskPanel } from 'bpmnDesign';
import { AllocationTypeEnum, MultipleUserAuditTypeEnum, SpecifyDescEnum } from '@/enums/bpmn/IndexEnums';
import { BellFilled, Checked, InfoFilled } from '@element-plus/icons-vue';
import { UserVO } from '@/api/system/user/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

interface PropType {
  modeler: Modeler;
  element: Element;
}
const props = withDefaults(defineProps<PropType>(), {});
const { nameChange, idChange, showConfig, updateProperties, createModdleElement } = usePanel({
  modeler: props.modeler,
  element: toRaw(props.element)
});
const { parse, formData } = useParseElement<TaskPanel>({
  modeler: props.modeler,
  element: toRaw(props.element),
  initData: {
    id: '',
    name: '',
    dueDate: '',
    multipleUserAuditType: MultipleUserAuditTypeEnum.SERIAL,
    allocationType: AllocationTypeEnum.USER,
    specifyDesc: SpecifyDescEnum.SPECIFY_SINGLE
  }
});

const currentCollapseItem = ref(['1', '2']);
const userSelectRef = ref<InstanceType<typeof UserSelect>>();
const singleUserSelectRef = ref<InstanceType<typeof UserSelect>>();
const roleSelectRef = ref<InstanceType<typeof RoleSelect>>();
const dueDateRef = ref<InstanceType<typeof DueDate>>();

const isMultiple = ref(true);
const openUserSelect = () => {
  userSelectRef.value.open();
};
const openSingleUserSelect = () => {
  singleUserSelectRef.value.open();
};
const openRoleSelect = () => {
  roleSelectRef.value.open();
};
const openDueDate = () => {
  dueDateRef.value.openDialog();
};

const singleUserSelectCallBack = (data: UserVO[]) => {
  const modeling = props.modeler.get<Modeling>('modeling');
  if (data.length !== 0) {
    const user = data[0];
    formData.value.userName = user.userName;
    const userId = user.userId;
    updateProperties({ 'flowable:assignee': userId });
    let extensionElements = props.element.businessObject.get('extensionElements');
    if (!extensionElements) {
      extensionElements = createModdleElement('bpmn:ExtensionElements', {}, props.element.businessObject);
      modeling.updateModdleProperties(toRaw(props.element), toRaw(props.element.businessObject), { extensionElements });
    }
    let propertiesElements;
    if (!extensionElements.values) {
      propertiesElements = createModdleElement('flowable:properties', {}, extensionElements);
      modeling.updateModdleProperties(toRaw(props.element), extensionElements, {
        values: [...extensionElements.get('values'), propertiesElements]
      });
    } else {
      propertiesElements = extensionElements.values.find((item) => item.$type === 'flowable:properties');
    }

    let userNameProperty;
    if (propertiesElements.values) {
      userNameProperty = propertiesElements.values.find((item) => {
        if (item['name'] === 'userName') {
          return true;
        }
        return false;
      });
      userNameProperty['name'] = 'userName';
      userNameProperty['value'] = user.userName;
    } else {
      userNameProperty = createModdleElement('flowable:property', { name: 'userName', value: user.userName }, propertiesElements);
      modeling.updateModdleProperties(toRaw(props.element), propertiesElements, {
        values: [...propertiesElements.get('values'), userNameProperty]
      });
    }
  } else {
    updateProperties({ 'flowable:assignee': undefined });
  }
};
const userSelectCallBack = (data: UserVO[]) => {
  if (data?.length !== 0) {
    // 获取userId 用逗号,隔开
    const userIds = data.map((item) => item.userId).join(',');
    updateProperties({ 'flowable:candidateUsers': userIds });
    formData.value.candidateUsers = userIds;
  } else {
    updateProperties({ 'flowable:candidateUsers': undefined });
    formData.value.candidateUsers = undefined;
  }
};

const taskTabClick = (e) => {
  formData.value.roles = [];
};

const syncChange = (newVal) => {
  updateProperties({ 'flowable:async': newVal });
};
const selectUserLength = computed(() => {
  if (formData.value.candidateUsers) {
    return formData.value.candidateUsers.split(',').length;
  } else {
    return 0;
  }
});
const selectRoleLength = computed(() => {
  if (formData.value.roles) {
    return formData.value.roles.length;
  } else {
    return 0;
  }
});
watch(
  () => formData.value.roles,
  (newVal: Record<string, any>[]) => {
    if (newVal?.length > 0) {
      // 获取userId 用逗号,隔开
      const roleIds = newVal.map((item) => item.roleId).join(',');
      updateProperties({ 'flowable:candidateGroups': roleIds });
    } else {
      updateProperties({ 'flowable:candidateGroups': undefined });
    }
  },
  { deep: true }
);
watch(
  () => formData.value.async,
  (newVal: boolean) => {
    if (newVal) {
      updateProperties({ 'flowable:async': true });
    } else {
      updateProperties({ 'flowable:async': undefined });
    }
  }
);
watch(
  () => formData.value.skipExpression,
  (newVal: string) => {
    if (newVal) {
      updateProperties({ 'flowable:skipExpression': newVal });
    } else {
      updateProperties({ 'flowable:skipExpression': undefined });
    }
  }
);
watch(
  () => formData.value.priority,
  (newVal: number) => {
    if (newVal) {
      updateProperties({ 'flowable:priority': newVal });
    } else {
      updateProperties({ 'flowable:priority': undefined });
    }
  }
);
watch(
  () => formData.value.dueDate,
  (newVal: string) => {
    if (newVal) {
      updateProperties({ 'flowable:dueDate': newVal });
    } else {
      updateProperties({ 'flowable:dueDate': undefined });
    }
  }
);

const formRules = ref<ElFormRules>({
  id: [{ required: true, message: '请输入', trigger: 'blur' }],
  name: [{ required: true, message: '请输入', trigger: 'blur' }]
});

const AllocationTypeSelect = [
  { id: 'b9cdf970-dd91-47c0-819f-42a7010ca2a6', label: '指定人员', value: AllocationTypeEnum.USER },
  { id: '3f7ccbcd-c464-4602-bb9d-e96649d10585', label: '候选人员', value: AllocationTypeEnum.CANDIDATE },
  { id: 'c49065e0-7f2d-4c09-aedb-ab2d47d9a454', label: '发起人自己', value: AllocationTypeEnum.YOURSELF },
  { id: '6ef40a03-7e9a-4898-89b2-c88fe9064542', label: '发起人指定', value: AllocationTypeEnum.SPECIFY }
];
const SpecifyDesc = [
  { id: 'fa253b34-4335-458c-b1bc-b039e2a2b7a6', label: '指定一个人', value: 'specifySingle' },
  { id: '7365ff54-2e05-4312-9bfb-0b8edd779c5b', label: '指定多个人', value: 'specifyMultiple' }
];

const MultipleUserAuditType = [
  { id: 'b5acea7c-b7e5-46b0-8778-390db091bdab', label: '串行（每人依次审批）', value: 'serial' },
  { id: 'b4f0c683-1ccc-43c4-8380-e1b998986caf', label: '并行（所有人审批通过）', value: 'parallel' },
  { id: '373d4b81-a0d1-4eb8-8685-0d2fb1b468e2', label: '或签（任意一人审批通过）', value: 'orSign' }
];
</script>

<style lang="scss" scoped>
.block-radio {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
}
</style>
