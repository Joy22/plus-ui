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
}
