<template>
  <div class="containers">
    <el-dialog ref="flowDialogRef" v-model="dialog.visible" width="100%" fullscreen :title="dialog.title">
      <div class="app-containers">
        <el-container class="h-full">
          <el-container style="align-items: stretch">
            <el-header>
              <div class="process-toolbar">
                <el-space wrap :size="10">
                  <el-button size="small" type="primary">保 存</el-button>
                  <el-dropdown size="small">
                    <el-button size="small" type="primary"> 预 览 </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item icon="Document" @click="previewXML">XML预览</el-dropdown-item>
                        <el-dropdown-item icon="View" @click="previewSVG"> SVG预览</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>

                  <el-dropdown size="small">
                    <el-button size="small" type="primary"> 下 载 </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item icon="Download" @click="downloadXML">下载XML</el-dropdown-item>
                        <el-dropdown-item icon="Download" @click="downloadSVG"> 下载SVG</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <el-upload ref="xmlUploadRef" action="" style="display: none" />
                  <el-tooltip effect="dark" content="加载xml" placement="bottom">
                    <el-button size="small" icon="FolderOpened" @click="loadXML" />
                  </el-tooltip>
                  <el-tooltip effect="dark" content="新建" placement="bottom">
                    <el-button size="small" icon="CirclePlus" @click="newDiagram" />
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
                    <highlightjs :code="xmlStr" language="XML" />
                  </el-dialog>

                  <el-dialog v-model="perviewSVGShow" title="SVG预览" width="80%">
                    <div style="text-align: center" v-html="svgData" />
                  </el-dialog>
                </el-space>
              </div>
            </el-header>
            <div ref="canvas" class="canvas" />
          </el-container>
          <div :class="{ 'process-panel': true, 'hide': panelFlag }">
            <div class="process-panel-bar" @click="panelFlag = !panelFlag">
              <div class="open-bar">
                <el-link type="default" :underline="false">
                  <svg-icon class-name="open-bar" :icon-class="panelFlag ? 'caret-back' : 'caret-forward'"></svg-icon>
                </el-link>
              </div>
            </div>

            <div v-show="!panelFlag" v-if="bpmnModeler" class="panel-content">
              <PropertyPanel :modeler="bpmnModeler" :users="users" :groups="groups" />
            </div>
          </div>
        </el-container>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="BpmnDesign">
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import { Canvas, ElementRegistry, Modeler } from 'bpmn';
import PropertyPanel from './PropertyPanel.vue';
import BpmnModeler from 'bpmn-js/lib/Modeler.js';
import diagramXML from '@/components/BpmnDesign/assets/defaultXML';
import flowableModdle from '@/components/BpmnDesign/assets/moddle/flowable';
import Modules from './assets/module/index';
import useModelerStore from '@/store/modules/modeler';

const modelerStore = useModelerStore();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const dialog = reactive({
  visible: true,
  title: '编辑流程'
});

const panelFlag = ref(false);

const xmlUploadRef = ref<ElUploadInstance>();

const canvas = ref<HTMLDivElement>();
const panel = ref<HTMLDivElement>();

const bpmnModeler = ref<Modeler>();
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
      bindTo: window // 或者window，注意与外部表单的键盘监听事件是否冲突
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
  if (modelerStore.getModeler()) {
    // 清除旧 modeler
    modelerStore.getModeler().destroy();
    modelerStore.setModeler(undefined);
  }
  modelerStore.setModeler(bpmnModeler.value);
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
const newDiagram = async () => {
  await proxy?.$modal.confirm('是否确认新建');
  initDiagram();
};
/**
 * 初始化
 */
const initDiagram = () => {
  bpmnModeler.value.importXML(diagramXML);
};

/**
 * 自适应屏幕
 */
const fitViewport = () => {
  zoom.value = bpmnModeler.value.get<Canvas>('canvas').zoom('fit-viewport');
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
    const { svg } = await bpmnModeler.value.saveSVG();
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
    const { svg } = await bpmnModeler.value.saveSVG();
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

<style lang="scss" scoped>
.containers {
  .app-containers {
    width: 100%;
    height: 100%;
    .canvas {
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+');
    }
    .el-header {
      height: 35px;
      padding: 0;
    }

    .process-panel {
      transition: width 0.25s ease-in;
      .process-panel-bar {
        width: 34px;
        height: 40px;
        .open-bar {
          width: 34px;
          line-height: 40px;
        }
      }
      // 收起面板样式
      &.hide {
        width: 34px;
        overflow: hidden;
        padding: 0;
        .process-panel-bar {
          width: 34px;
          height: 100%;
          box-sizing: border-box;
          display: block;
          text-align: left;
          line-height: 34px;
        }
        .process-panel-bar:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }

  :deep(.el-dialog .el-dialog__body) {
    max-height: 100% !important;
    height: calc(100vh - 50px);
  }

  .process-toolbar {
    pre {
      margin: 0;
      height: 100%;
      max-height: calc(80vh - 32px);
      overflow-x: hidden;
      overflow-y: auto;
      :deep(.hljs) {
        word-break: break-word;
        white-space: pre-wrap;
        padding: 0.5em;
      }
    }
  }
}
.open-bar {
  font-size: 20px;
  cursor: pointer;
  text-align: center;
}
.process-panel {
  box-sizing: border-box;
  padding: 0 8px 0 8px;
  border-left: 1px solid #eeeeee;
  box-shadow: #cccccc 0 0 8px;
  max-height: 100%;
  width: 480px;
  :deep(.el-collapse) {
    height: calc(100vh - 162px);
    overflow: auto;
  }
}
</style>
