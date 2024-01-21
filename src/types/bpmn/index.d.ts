declare module 'bpmn' {
  import { Moddle as moddle } from 'moddle';
  import type modeler from 'bpmn-js/lib/Modeler';
  import type modeling from 'bpmn-js/lib/features/modeling/Modeling';
  import type canvas from 'diagram-js/lib/core/Canvas';
  import type elementRegistry from 'diagram-js/lib/core/ElementRegistry';

  export type Modeler = modeler;
  export type Modeling = modeling;
  export type Canvas = canvas;
  export type ElementRegistry = elementRegistry;
  export type Moddle = moddle;
}
