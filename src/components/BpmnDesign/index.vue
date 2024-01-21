<template>
  <el-dialog ref="flowDialogRef" v-model="dialog.visible" :title="dialog.title" width="95%" append-to-body @close="closeDialog">
    <div class="app-containers">
      <el-header style="border-bottom: 1px solid rgb(218 218 218); height: auto">
        <div style="display: flex; padding: 10px 0; justify-content: space-between">
          <div>
            <el-upload ref="xmlUploadRef" action="" style="display: none" />
            <el-tooltip effect="dark" content="加载xml" placement="bottom">
              <el-button size="small" icon="FolderOpened" @click="loadXML" />
            </el-tooltip>
            <el-tooltip effect="dark" content="新建" placement="bottom">
              <el-button size="small" icon="CirclePlus" @click="initDiagram" />
            </el-tooltip>
            <el-tooltip effect="dark" content="自适应屏幕" placement="bottom">
              <el-button size="small" icon="Rank" @click="fitViewport" />
            </el-tooltip>
            <el-tooltip effect="dark" content="放大" placement="bottom">
              <el-button size="small" icon="ZoomIn" @click="zoomViewport(true)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="缩小" placement="bottom">
              <el-button size="small" icon="ZoomOut" @click="zoomViewport(false)" />
            </el-tooltip>
            <el-tooltip effect="dark" content="后退" placement="bottom">
              <el-button size="small" icon="Back" @click="bpmnModeler.get('commandStack').undo()" />
            </el-tooltip>
            <el-tooltip effect="dark" content="前进" placement="bottom">
              <el-button size="small" icon="Right" @click="bpmnModeler.get('commandStack').redo()" />
            </el-tooltip>

            <el-dialog v-model="perviewXMLShow" title="XML预览" width="80%">
              <highlightjs :code="xmlStr" language="html" />
            </el-dialog>

            <el-dialog v-model="perviewSVGShow" title="XML预览" width="80%">
              <div style="text-align: center" v-html="svgData" />
            </el-dialog>
          </div>
          <div>
            <el-button size="small" icon="Document" @click="previewXML">XML预览</el-button>
            <el-button size="small" icon="View" @click="previewSVG">SVG预览</el-button>
            <el-button size="small" icon="Download" @click="downloadXML">XML</el-button>
            <el-button size="small" icon="Download" @click="downloadSVG">SVG</el-button>
            <el-button size="small" type="primary">保 存</el-button>
          </div>
        </div>
      </el-header>

      <el-container style="height: 100%">
        <el-container style="align-items: stretch">
          <el-main style="padding: 0">
            <div ref="canvas" class="canvas" />
          </el-main>
          <el-scrollbar height="650px">
            <el-aside style="width: 400px; min-height: 650px; background-color: #f0f2f5">
              <PropertyPanel v-if="bpmnModeler" :modeler="bpmnModeler" :users="users" :groups="groups" :categorys="categorys" />
            </el-aside>
          </el-scrollbar>
        </el-container>
      </el-container>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup name="BpmnDesign">
import PropertyPanel from './PropertyPanel.vue';
import BpmnModeler from 'bpmn-js/lib/Modeler.js';
import diagramXML from '@/components/BpmnDesign/assets/defaultXML';
import flowableModdle from '@/components/BpmnDesign/assets/moddle/flowable';
import Modules from './assets/module/index';
import useModelerStore from '@/store/modules/modeler';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const dialog = reactive({
  visible: true,
  title: '流程设计器'
});

const xmlUploadRef = ref<ElUploadInstance>();

const canvas = ref<HTMLDivElement>();
const panel = ref<HTMLDivElement>();

const bpmnModeler = ref();
const zoom = ref(1);

const perviewXMLShow = ref(false);
const perviewSVGShow = ref(false);
const xmlStr = ref('');
const svgData = ref('');

const users = [
  { name: '张三', id: 'zhangsan' },
  { name: '李四', id: 'lisi' },
  { name: '王五', id: 'wangwu' }
];
const groups = [
  { name: 'web组', id: 'web' },
  { name: 'java组', id: 'java' },
  { name: 'python组', id: 'python' }
];
const categorys = [
  { label: 'OA', id: 'oa', value: 'id' },
  { label: '财务', id: 'finance', value: 'finance' }
];

onMounted(() => {
  nextTick(() => {
    initCanvas();
    initDiagram();
    handleModeler();
    initModel();
  });
});

/**
 * 从文件加载xml
 */
const loadXML = () => {
  xmlUploadRef.value.$el.querySelector('input').click();
};

/**
 * 初始化Canvas
 */
const initCanvas = () => {
  bpmnModeler.value = new BpmnModeler({
    container: canvas.value,
    // 键盘
    keyboard: {
      bindTo: document // 或者window，注意与外部表单的键盘监听事件是否冲突
    },
    propertiesPanel: {
      parent: panel.value
    },
    additionalModules: Modules,
    moddleExtensions: {
      flowable: flowableModdle
    }
  });
};

/**
 * 初始化Model
 */
const initModel = () => {
  let store = useModelerStore();
  if (store.getModeler()) {
    // 清除旧 modeler
    store.getModeler().destroy();
    store.setModeler(undefined);
  }
  store.setModeler(bpmnModeler.value);
};

/**
 * 关闭用户弹窗
 */
const closeDialog = () => {
  dialog.visible = false;
};

/**
 * 新建
 */
const initDiagram = () => {
  bpmnModeler.value.importXML(diagramXML);
};

/**
 * 自适应屏幕
 */
const fitViewport = () => {
  zoom.value = bpmnModeler.value.get('canvas').zoom('fit-viewport');
  const bbox = (document.querySelector('.app-containers .viewport') as SVGGElement).getBBox();
  const currentViewBox = bpmnModeler.value.get('canvas').viewbox();
  const elementMid = {
    x: bbox.x + bbox.width / 2 - 65,
    y: bbox.y + bbox.height / 2
  };
  bpmnModeler.value.get('canvas').viewbox({
    x: elementMid.x - currentViewBox.width / 2,
    y: elementMid.y - currentViewBox.height / 2,
    width: currentViewBox.width,
    height: currentViewBox.height
  });
  zoom.value = (bbox.width / currentViewBox.width) * 1.8;
};
/**
 * 放大或者缩小
 * @param zoomIn true 放大 | false 缩小
 */
const zoomViewport = (zoomIn = true) => {
  zoom.value = bpmnModeler.value.get('canvas').zoom();
  zoom.value += zoomIn ? 0.1 : -0.1;
  bpmnModeler.value.get('canvas').zoom(zoom.value);
};

/**
 * 下载XML
 */
const downloadXML = async () => {
  try {
    const { xml } = await bpmnModeler.value.saveXML({ format: true });
    downloadFile(`${getProcessElement().name}.bpmn20.xml`, xml, 'application/xml');
  } catch (e) {
    proxy?.$modal.msgError(e);
  }
};

/**
 * 下载SVG
 */
const downloadSVG = async () => {
  try {
    const { svg } = await bpmnModeler.value.saveSVG({ format: true });
    downloadFile(getProcessElement().name, svg, 'image/svg+xml');
  } catch (e) {
    proxy?.$modal.msgError(e);
  }
};

/**
 * XML预览
 */
const previewXML = async () => {
  try {
    const { xml } = await bpmnModeler.value.saveXML({ format: true });
    xmlStr.value = xml;
    perviewXMLShow.value = true;
  } catch (e) {
    proxy?.$modal.msgError(e);
  }
};

/**
 * SVG预览
 */
const previewSVG = async () => {
  try {
    const { svg } = await bpmnModeler.value.saveSVG({ format: true });
    svgData.value = svg;
    perviewSVGShow.value = true;
  } catch (e) {
    proxy?.$modal.msgError(e);
  }
};

const curNodeInfo = reactive({
  curType: '', // 任务类型 用户任务
  curNode: '',
  expValue: '' //多用户和部门角色实现
});

watch(curNodeInfo, (newValue, oldValue) => {
  // 在 curNodeInfo 对象发生变化后执行相应逻辑
  // 这里调用 addEventPlant 函数来添加事件监听器
  if (curNodeInfo.curNode != '') {
    addEventPlant();
  }
});

const handleModeler = () => {
  bpmnModeler.value.on('element.click', (e: { element: any }) => {
    // 用户任务触发
    if ('bpmn:UserTask' === e.element.type) {
      curNodeInfo['curNode'] = e.element.id;
      curNodeInfo['curType'] = e.element.type;
    } else {
      // 事件改变的时候清空
      curNodeInfo['curType'] = '';
      curNodeInfo['expValue'] = '';
    }
  });
};

function addEventPlant() {
  //  let assigneeDiv =  bpmnPanel.value.querySelector('[data-group-id="group-CamundaPlatform__UserAssignment"]') as HTMLDivElement;
  //
  let assigneeDiv = document.querySelector('[data-group-id="group-CamundaPlatform__UserAssignment"]') as HTMLDivElement;
  if (assigneeDiv) {
    assigneeDiv.addEventListener('click', function (e) {
      let assigneeUser = assigneeDiv.getElementsByClassName('bio-properties-panel-input')[0] as HTMLButtonElement;
      assigneeUser.setAttribute('placeholder', '双击选择用户');
      // dblclick 双击事件
      assigneeUser.addEventListener('dblclick', onFormThreeClick);
    });
  }
}

const onFormThreeClick = () => {
  proxy?.$modal.alert('选择了用户');
};

const downloadFile = (fileName: string, data: any, type: string) => {
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(new Blob([data], { type: type }));
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

const getProcessElement = () => {
  const rootElements = bpmnModeler.value?.getDefinitions().rootElements;
  for (let i = 0; i < rootElements.length; i++) {
    if (rootElements[i].$type === 'bpmn:Process') return rootElements[i];
  }
};
</script>

<style lang="scss">
/*左边工具栏以及编辑节点的样式*/
//@import 'bpmn-js/dist/assets/bpmn-js.css';
@import 'bpmn-js/dist/assets/diagram-js.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

.view-mode {
  .el-header,
  .el-aside,
  .djs-palette,
  .bjs-powered-by {
    display: none;
  }
  .el-loading-mask {
    background-color: initial;
  }
  .el-loading-spinner {
    display: none;
  }
}
.app-containers {
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+');
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 300px;
  }
  .load {
    margin-right: 10px;
  }
  .el-form-item__label {
    font-size: 13px;
  }
}

.el-overlay {
  .el-overlay-dialog {
    .el-dialog {
      .el-dialog__body {
        padding-top: 0 !important;
      }
    }
  }
}
</style>
