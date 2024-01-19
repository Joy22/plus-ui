function generateRandomValue() {
  // 生成一个随机数
  const randomValue = Math.random().toString(36).slice(2, 12);
  return `Process_${randomValue}`;
}

const cartage: string = 'default';
export default `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_0hf6suk" targetNamespace="${cartage}" exporter="Camunda Modeler" exporterVersion="5.11.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.19.0">
  <bpmn:process id="${generateRandomValue()}" isExecutable="true">
    <bpmn:startEvent id="start_event" name="开始事件">
      <bpmn:outgoing>Flow_1uqf1ep</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="Activity_0w38duu">
      <bpmn:incoming>Flow_1uqf1ep</bpmn:incoming>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_1uqf1ep" sourceRef="start_event" targetRef="Activity_0w38duu" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${generateRandomValue()}">
      <bpmndi:BPMNShape id="Event_02vig7e_di" bpmnElement="start_event">
        <dc:Bounds x="242" y="172" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="240" y="215" width="44" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0w38duu_di" bpmnElement="Activity_0w38duu">
        <dc:Bounds x="330" y="150" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1uqf1ep_di" bpmnElement="Flow_1uqf1ep">
        <di:waypoint x="278" y="190" />
        <di:waypoint x="330" y="190" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;
