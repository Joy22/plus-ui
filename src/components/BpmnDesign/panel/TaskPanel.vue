<template>
  <div>
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item prop="id" label="节点 ID">
        <el-input v-model="formData.id" @change="idChange"> </el-input>
      </el-form-item>
      <el-form-item prop="name" label="节点名称">
        <el-input v-model="formData.name" @change="nameChange"> </el-input>
      </el-form-item>
      <el-form-item prop="auditUserType" label="人员类型">
        <el-select v-model="formData.auditUserType">
          <el-option v-for="item in AuditUserTypeSelect" :key="item.id" :value="item.value" :label="item.label"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.auditUserType === AuditUserTypeEnum.USER" style="">
        <el-button type="primary" @click="openUserSelect">选择人员</el-button>
      </el-form-item>
      <el-form-item v-if="formData.auditUserType === AuditUserTypeEnum.SPECIFY" style="">
        <el-radio-group v-model="formData.specifyDesc" class="ml-4">
          <el-radio v-for="item in SpecifyDesc" :key="item.id" :label="item.value" size="large">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="多人审批方式">
        <el-radio-group v-model="formData.multipleUserAuditType" class="ml-4 block-radio">
          <el-radio v-for="item in MultipleUserAuditType" :key="item.id" :label="item.value" size="large">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="执行监听器" style="margin-bottom: 0"> </el-form-item>
      <ExecutionListener :modeler="modeler" :element="element"></ExecutionListener>
      <el-form-item label="任务监听器" style="margin-bottom: 0"> </el-form-item>
      <TaskListener :modeler="modeler" :element="element"></TaskListener>
    </el-form>

    <UserSelect ref="userSelectRef" v-model="formData.users"></UserSelect>
  </div>
</template>
<script setup lang="ts">
import useParseElement from '@/components/BpmnDesign/hooks/useParseElement';
import usePanel from '@/components/BpmnDesign/hooks/usePanel';
import UserSelect from '@/components/UserSelect';
import { Element, Modeler } from 'bpmn';
import { TaskPanel } from 'bpmnDesign';
import { AuditUserTypeEnum, MultipleUserAuditTypeEnum } from '@/enums/bpmn/IndexEnums';

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
const { parse, formData } = useParseElement<TaskPanel>({
  modeler: props.modeler,
  element: toRaw(props.element),
  initData: {
    multipleUserAuditType: MultipleUserAuditTypeEnum.SERIAL,
    auditUserType: AuditUserTypeEnum.USER,
    users: []
  } as any
});

const userSelectRef = ref<InstanceType<typeof UserSelect>>();

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

const openUserSelect = () => {
  userSelectRef.value.open();
};
</script>

<style lang="scss" scoped>
.block-radio {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
}
</style>
