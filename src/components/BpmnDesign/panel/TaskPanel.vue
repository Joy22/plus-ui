<template>
  <div>
    <el-form ref="formRef" size="small" :model="formData" :rules="formRules" label-width="90px">
      <el-collapse>
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
            <el-form-item v-if="showConfig.auditUserType" prop="auditUserType" label="人员类型">
              <el-select v-model="formData.auditUserType">
                <el-option v-for="item in AuditUserTypeSelect" :key="item.id" :value="item.value" :label="item.label"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="formData.auditUserType === AuditUserTypeEnum.USER && showConfig.users" style="">
              <el-badge :value="formData.users.length" :max="99">
                <el-button type="primary" @click="openUserSelect">选择人员</el-button>
                <UserSelect ref="userSelectRef" v-model="formData.users"></UserSelect>
              </el-badge>
            </el-form-item>
            <el-form-item v-if="formData.auditUserType === AuditUserTypeEnum.ROLE && showConfig.roles" style="">
              <el-badge :value="formData.roles.length" :max="99">
                <el-button type="primary" @click="openUserSelect">选择角色</el-button>
                <RoleSelect ref="userSelectRef" v-model="formData.roles"></RoleSelect>
              </el-badge>
            </el-form-item>
            <el-form-item v-if="formData.auditUserType === AuditUserTypeEnum.SPECIFY && showConfig.specifyDesc" style="">
              <el-radio-group v-model="formData.specifyDesc" class="ml-4">
                <el-radio v-for="item in SpecifyDesc" :key="item.id" :label="item.value" size="large">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="showConfig.multipleUserAuditType" prop="multipleUserAuditType" label="多人审批方式">
              <el-radio-group v-model="formData.multipleUserAuditType" class="ml-4 block-radio">
                <el-radio v-for="item in MultipleUserAuditType" :key="item.id" :label="item.value" size="large">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="showConfig.dueDate" prop="dueDate" label="到期时间">
              <!--              <el-date-picker v-model="formData.dueDate" type="datetime" @change="dueDateChange" />-->
              <el-input v-model="formData.dueDate" @click="openDueDate"></el-input>
              <DueDate ref="dueDateRef" v-model="formData.dueDate"></DueDate>
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
  </div>
</template>
<script setup lang="ts">
import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
import usePanel from '@/components/BpmnDesign/hooks/usePanel';
import UserSelect from '@/components/UserSelect';
import DueDate from '@/components/BpmnDesign/panel/property/DueDate.vue';
import { Element, Modeler } from 'bpmn';
import { TaskPanel } from 'bpmnDesign';
import { AuditUserTypeEnum, MultipleUserAuditTypeEnum, SpecifyDescEnum } from '@/enums/bpmn/IndexEnums';
import { BellFilled, Checked, InfoFilled } from '@element-plus/icons-vue';

interface PropType {
  modeler: Modeler;
  element: Element;
}
const props = withDefaults(defineProps<PropType>(), {});
const { nameChange, idChange, showConfig, updateProperties } = usePanel({
  modeler: props.modeler,
  element: toRaw(props.element)
});
const { parse, formData } = useParseElement<TaskPanel>({
  modeler: props.modeler,
  element: toRaw(props.element),
  initData: {
    id: '',
    name: '',
    users: [],
    roles: [],
    dueDate: '',
    multipleUserAuditType: MultipleUserAuditTypeEnum.SERIAL,
    auditUserType: AuditUserTypeEnum.USER,
    specifyDesc: SpecifyDescEnum.SPECIFY_SINGLE
  }
});

const userSelectRef = ref<InstanceType<typeof UserSelect>>();
const dueDateRef = ref<InstanceType<typeof DueDate>>();
const openUserSelect = () => {
  userSelectRef.value.open();
};
const openDueDate = () => {
  dueDateRef.value.openDialog();
};

const syncChange = (newVal) => {
  updateProperties({ 'flowable:async': newVal });
};

const dueDateChange = (newVal) => {
  console.log(newVal);
  updateProperties({ 'flowable:dueDate': newVal });
};

watch(
  () => formData.value.auditUserType,
  (val, oldVal) => {
    formData.value.users = [];
  }
);
watch(
  () => formData.value.users,
  (newVal: Record<string, any>[]) => {
    updateProperties({ 'flowable:candidateGroups': undefined });
    if (newVal.length === 1) {
      const user = newVal[0];
      const userId = user.userId;
      updateProperties({ 'flowable:assignee': userId });
      updateProperties({ 'flowable:candidateUsers': undefined });
      // 删除会签属性
    } else if (newVal.length > 1) {
      // 获取userId 用逗号,隔开
      const userIds = newVal.map((item) => item.userId).join(',');
      updateProperties({ 'flowable:candidateUsers': userIds });
      updateProperties({ 'flowable:assignee': undefined });
    } else {
      updateProperties({ 'flowable:candidateUsers': undefined });
      updateProperties({ 'flowable:assignee': undefined });
    }
  },
  { deep: true }
);

const formRules = ref<ElFormRules>({
  id: [{ required: true, message: '请输入', trigger: 'blur' }],
  name: [{ required: true, message: '请输入', trigger: 'blur' }]
});

const AuditUserTypeSelect = [
  { id: 'b9cdf970-dd91-47c0-819f-42a7010ca2a6', label: '指定人员', value: 'user' },
  { id: '3f7ccbcd-c464-4602-bb9d-e96649d10585', label: '角色', value: 'role' },
  { id: 'c49065e0-7f2d-4c09-aedb-ab2d47d9a454', label: '发起人自己', value: 'yourself' },
  { id: '6ef40a03-7e9a-4898-89b2-c88fe9064542', label: '发起人指定', value: 'specify' }
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
