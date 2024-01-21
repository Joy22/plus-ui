/************************************** 核心 Moddle 声明 *****************************************/
declare module 'moddle' {
  type UriOrPrefix = {
    uri?: string;
    prefix?: string;
  };

  export class Element {
    $instanceOf: typeof Moddle.prototype.hasType;

    get(name: string): ReturnType<typeof Properties.prototype.get>;

    set(name: string, value: any): ReturnType<typeof Properties.prototype.set>;
  }

  export class ModdleElement extends Element {
    static $model: Moddle;
    static $descriptor: Descriptor;
    readonly $type: string;
    $attrs: object | {};

    [field: string]: any;

    $parent: any;

    constructor(attrs: object);

    static hasType(element: ModdleElement, type?: string): boolean;
  }

  export class Factory {
    model: Moddle;
    properties: Properties;

    constructor(model: Moddle, properties: Properties);

    createType(descriptor: Descriptor): ModdleElement;
  }

  export type BuiltinsKeys = 'String' | 'Boolean' | 'Integer' | 'Real' | 'Element';
  export type TypeConverters = {
    [T in Exclude<BuiltinsKeys, 'Element'>]: (s: string) => string | boolean | number;
  };
  export type coerceType = <T extends Exclude<BuiltinsKeys, 'Element'>>(type: T, value: string) => ReturnType<TypeConverters[T]>;

  export function isBuiltIn(type: BuiltinsKeys): boolean;

  export function isSimple(type: Exclude<BuiltinsKeys, 'Element'>): boolean;

  type ParsedName = {
    name: string;
    prefix: string;
    localName: string;
  };

  export function parseName(name: string, defaultPrefix?: string): ParsedName;

  // DescriptorBuilder
  type Property = {
    ns: ParsedName;
    name: ParsedName['name'];
    isId?: boolean;
    isBody?: boolean;
  };
  type DescriptorType = {
    name: string;
    properties: Property[];
    superClass?: string[];
    extends?: string[];
    meta?: object | {};
  };
  type Descriptor = {
    ns: ParsedName;
    name: ParsedName['name'];
    allTypes: DescriptorType[];
    allTypesByName: Record<string, DescriptorType[]>;
    properties: Property[];
    propertiesByName: Record<string, Property[]>;

    bodyProperty?: Property;
    idProperty?: Property;
  };

  export class DescriptorBuilder implements Descriptor {
    ns: ParsedName;
    name: ParsedName['name'];
    allTypes: DescriptorType[];
    allTypesByName: Record<string, DescriptorType[]>;
    properties: Property[];
    propertiesByName: Record<string, Property[]>;
    bodyProperty?: Property;
    idProperty?: Property;

    constructor(nameNs: ParsedName);

    build(): Descriptor;

    addProperty(p: Property, idx?: number, validate?: boolean): void;

    replaceProperty(oldProperty: Property, newProperty: Property, replace?: boolean): void | never;

    redefineProperty(p: Property, targetPropertyName: `${string}#${string}`, replace?: boolean): void | never;

    addNamedProperty(p: Property, validate?: boolean): void | never;

    removeNamedProperty(p: Property): void;

    setBodyProperty(p: Property, validate?: boolean): void | never;

    setIdProperty(p: Property, validate?: boolean): void | never;

    assertNotDefined(p: Property, name?: string): void | never;

    hasProperty(name: string): Property | undefined;

    addTrait(t: DescriptorType, inherited: boolean): void;
  }

  // Registry
  export interface Package {
    name: string;
    prefix: string;
    types: DescriptorType[];
  }

  export class Registry {
    packageMap: Record<string, Package>;
    typeMap: Record<string, DescriptorType>;
    packages: Package[];
    properties: Properties;

    constructor(packages: Package[], properties: Properties);

    getPackage(uriOrPrefix: UriOrPrefix): Package;

    getPackages(): Package[];

    registerPackage(pkg: Package): number;

    registerType(type: DescriptorType, pkg: Package): void;

    mapTypes(nsName: object, iterator: Function, trait?: boolean);

    getEffectiveDescriptor(name: string): DescriptorBuilder;

    definePackage(target: Descriptor, pkg: Package): void;
  }

  export class Properties {
    model: Moddle;

    constructor(model: Moddle);

    set(target: ModdleElement, name: string, value: any): void;

    get(target: ModdleElement, name: string): any;

    define(target: ModdleElement, name: string, options: PropertyDescriptor): void;

    defineDescriptor(target: Omit<ModdleElement, '$descriptor'>, descriptor: Descriptor): void;

    defineModel(target: Omit<ModdleElement, '$model'>, model: ModdleElement): void;
  }

  export class Moddle {
    properties: Properties;
    factory: Factory;
    registry: Registry;
    typeCache: Record<string, ModdleElement>;

    getPackage: typeof Registry.prototype.getPackage;

    getPackages: typeof Registry.prototype.getPackages;

    constructor(packages: Package[]);

    create(type: Descriptor | string, attrs?: any): ModdleElement;

    getType(type: string | Descriptor): DescriptorBuilder;

    createAny(name: string, nsUri: string, properties?: Properties): void;

    getElementDescriptor(element: ModdleElement): Descriptor;

    hasType(element: ModdleElement | string, type?: string): boolean;

    getPropertyDescriptor(element: ModdleElement, property: Property): Descriptor;

    getTypeDescriptor(type: string): Descriptor;
  }

  export type isBuiltInType = typeof isBuiltIn;
  export type isSimpleType = typeof isSimple;
  export type parseNameNS = typeof parseName;
}
