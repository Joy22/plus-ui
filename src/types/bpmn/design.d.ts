declare module 'bpmnDesign' {
  import { AuditUserTypeEnum, SpecifyDescEnum, MultipleUserAuditTypeEnum } from '@/enums/bpmn/IndexEnums';

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

  interface BasePanel {
    id: string;
    name: string;
  }
  export interface ProcessPanel extends BasePanel {
    processCategory: string;
  }

  export interface TaskPanel extends BasePanel {
    processCategory: string;
    auditUserType: AuditUserTypeEnum;
    specifyDesc: SpecifyDescEnum;
    multipleUserAuditType: MultipleUserAuditTypeEnum;
    users: string[];

    assignee: string;
    candidateUsers: string;
    candidateGroups: string;
  }

  export interface StartEndPanel extends BasePanel {}
  export interface GatewayPanel extends BasePanel {}
  export interface SequenceFlowPanel extends BasePanel {
    conditionExpression: string;
    skipExpression: string;
  }
}
