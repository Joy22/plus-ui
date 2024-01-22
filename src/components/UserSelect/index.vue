<template>
  <div>
    <el-dialog v-model="userDialog.visible.value" :title="userDialog.title.value" width="80%" append-to-body>
      <div class="p-2">
        <el-row :gutter="20">
          <!-- 部门树 -->
          <el-col :lg="4" :xs="24" style="">
            <el-card shadow="hover">
              <el-input v-model="deptName" placeholder="请输入部门名称" prefix-icon="Search" clearable />
              <el-tree
                ref="deptTreeRef"
                class="mt-2"
                node-key="id"
                :data="deptOptions"
                :props="{ label: 'label', children: 'children' }"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                highlight-current
                default-expand-all
                @node-click="handleNodeClick"
              />
            </el-card>
          </el-col>
          <el-col :lg="20" :xs="24">
            <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
              <div v-show="showSearch" class="mb-[10px]">
                <el-card shadow="hover">
                  <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="用户名称" prop="userName">
                      <el-input
                        v-model="queryParams.userName"
                        placeholder="请输入用户名称"
                        clearable
                        style="width: 240px"
                        @keyup.enter="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phonenumber">
                      <el-input
                        v-model="queryParams.phonenumber"
                        placeholder="请输入手机号码"
                        clearable
                        style="width: 240px"
                        @keyup.enter="handleQuery"
                      />
                    </el-form-item>

                    <el-form-item label="状态" prop="status">
                      <el-select v-model="queryParams.status" placeholder="用户状态" clearable style="width: 240px">
                        <el-option v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" style="width: 308px">
                      <el-date-picker
                        v-model="dateRange"
                        value-format="YYYY-MM-DD"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                      <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>
            </transition>

            <el-card shadow="hover">
              <template #header>
                <el-row :gutter="10">
                  <el-col :span="1.5">
                    <el-button type="primary" plain icon="Plus">新增</el-button>
                  </el-col>
                  <right-toolbar v-model:showSearch="showSearch" :columns="columns" :search="true" @query-table="getList"></right-toolbar>
                </el-row>
              </template>

              <vxe-table
                ref="tableRef"
                height="500px"
                border
                show-overflow
                :data="userList"
                :loading="loading"
                :row-config="{ keyField: 'userId' }"
                :checkbox-config="{ reserve: true, checkRowKeys: modelValue }"
                highlight-current-row
              >
                <vxe-column type="checkbox" width="50" align="center" />
                <vxe-column v-if="columns[0].visible" key="userId" title="用户编号" align="center" field="userId" />
                <vxe-column v-if="columns[1].visible" key="userName" title="用户名称" align="center" field="userName" :show-overflow-tooltip="true" />
                <vxe-column v-if="columns[2].visible" key="nickName" title="用户昵称" align="center" field="nickName" :show-overflow-tooltip="true" />
                <vxe-column v-if="columns[3].visible" key="deptName" title="部门" align="center" field="deptName" :show-overflow-tooltip="true" />
                <vxe-column v-if="columns[4].visible" key="phonenumber" title="手机号码" align="center" field="phonenumber" width="120" />
                <vxe-column v-if="columns[5].visible" key="status" title="状态" align="center">
                  <template #default="scope">
                    <dict-tag :options="sys_normal_disable" :value="scope.row.status"></dict-tag>
                  </template>
                </vxe-column>

                <vxe-column v-if="columns[6].visible" title="创建时间" align="center" width="160">
                  <template #default="scope">
                    <span>{{ scope.row.createTime }}</span>
                  </template>
                </vxe-column>
              </vxe-table>

              <pagination
                v-show="total > 0"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                :total="total"
                @pagination="getList"
              />
            </el-card>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <el-button @click="userDialog.closeDialog">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import api from '@/api/system/user';
import { UserQuery, UserVO } from '@/api/system/user/types';
import { DeptVO } from '@/api/system/dept/types';
import { globalHeaders } from '@/utils/request';
import useDialog from '@/hooks/useDialog';
import { VxeTableInstance } from 'vxe-table';

interface PropType {
  modelValue: string[];
}
const prop = defineProps<PropType>();
const emit = defineEmits(['update:modelValue']);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_normal_disable } = toRefs<any>(proxy?.useDict('sys_normal_disable'));

const userList = ref<UserVO[]>();
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const dateRange = ref<[DateModelType, DateModelType]>(['', '']);
const deptName = ref('');
const deptOptions = ref<DeptVO[]>([]);

// 列显隐信息
const columns = ref<FieldOption[]>([
  { key: 0, label: `用户编号`, visible: false, children: [] },
  { key: 1, label: `用户名称`, visible: true, children: [] },
  { key: 2, label: `用户昵称`, visible: true, children: [] },
  { key: 3, label: `部门`, visible: true, children: [] },
  { key: 4, label: `手机号码`, visible: true, children: [] },
  { key: 5, label: `状态`, visible: true, children: [] },
  { key: 6, label: `创建时间`, visible: true, children: [] }
]);

const deptTreeRef = ref<ElTreeInstance>();
const queryFormRef = ref<ElFormInstance>();
const tableRef = ref<VxeTableInstance<UserVO>>();

const userDialog = useDialog({
  title: '用户选择'
});

const queryParams = ref<UserQuery>({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  phonenumber: '',
  status: '',
  deptId: '',
  roleId: ''
});

/** 通过条件过滤节点  */
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watchEffect(
  () => {
    deptTreeRef.value?.filter(deptName.value);
  },
  {
    flush: 'post' // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

const confirm = () => {
  const $table = tableRef.value;
  if ($table) {
    // 获取当前列表选中行
    const checkboxRecords = $table.getCheckboxRecords();
    // 获取其他列表选中行
    const checkboxReserveRecords = $table.getCheckboxReserveRecords();
    const data: UserVO[] = [...checkboxRecords, ...checkboxReserveRecords];
    const userIds = data.map((item) => item.userId);
    emit('update:modelValue', userIds);
    userDialog.closeDialog();
  }
};

/** 查询部门下拉树结构 */
const getTreeSelect = async () => {
  const res = await api.deptTreeSelect();
  deptOptions.value = res.data;
};

/** 查询用户列表 */
const getList = async () => {
  loading.value = true;
  const res = await api.listUser(proxy?.addDateRange(queryParams.value, dateRange.value));
  loading.value = false;
  userList.value = res.rows;
  total.value = res.total;
};

/** 节点单击事件 */
const handleNodeClick = (data: DeptVO) => {
  queryParams.value.deptId = data.id;
  handleQuery();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  dateRange.value = ['', ''];
  queryFormRef.value?.resetFields();
  queryParams.value.pageNum = 1;
  queryParams.value.deptId = undefined;
  deptTreeRef.value?.setCurrentKey(undefined);
  handleQuery();
};

onMounted(() => {
  getTreeSelect(); // 初始化部门数据
  getList(); // 初始化列表数据
});

defineExpose({
  open: userDialog.openDialog,
  close: userDialog.closeDialog
});
</script>

<style lang="scss" scoped></style>
