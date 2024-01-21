declare module 'bpmnDesign' {
  export interface ParamVO {
    type: string;
    name: string;
    value: string;
  }

  export interface TaskListenerVO {
    event: string;
    type: string;
    name: string;
    className: string;
    params: ParamVO[];
  }

  export interface ExecutionListenerVO {
    event: string;
    type: string;
    className: string;
    params: ParamVO[];
  }

  export interface ProcessPanel {
    processCategory: string;
    id: string;
    name: string;
    documentation: string;
  }
}
