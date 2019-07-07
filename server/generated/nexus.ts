/**
 * This file was automatically generated by GraphQL Nexus
 * Do not make changes to this file directly
 */






declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  DomainCreateOneWithoutPagesInput: { // input type
    connect?: NexusGenInputs['DomainWhereUniqueInput'] | null; // DomainWhereUniqueInput
    create?: NexusGenInputs['DomainCreateWithoutPagesInput'] | null; // DomainCreateWithoutPagesInput
  }
  DomainCreateWithoutPagesInput: { // input type
    id?: string | null; // ID
    name: string; // String!
  }
  DomainWhereInput: { // input type
    AND?: NexusGenInputs['DomainWhereInput'][] | null; // [DomainWhereInput!]
    id?: string | null; // ID
    id_contains?: string | null; // ID
    id_ends_with?: string | null; // ID
    id_gt?: string | null; // ID
    id_gte?: string | null; // ID
    id_in?: string[] | null; // [ID!]
    id_lt?: string | null; // ID
    id_lte?: string | null; // ID
    id_not?: string | null; // ID
    id_not_contains?: string | null; // ID
    id_not_ends_with?: string | null; // ID
    id_not_in?: string[] | null; // [ID!]
    id_not_starts_with?: string | null; // ID
    id_starts_with?: string | null; // ID
    name?: string | null; // String
    name_contains?: string | null; // String
    name_ends_with?: string | null; // String
    name_gt?: string | null; // String
    name_gte?: string | null; // String
    name_in?: string[] | null; // [String!]
    name_lt?: string | null; // String
    name_lte?: string | null; // String
    name_not?: string | null; // String
    name_not_contains?: string | null; // String
    name_not_ends_with?: string | null; // String
    name_not_in?: string[] | null; // [String!]
    name_not_starts_with?: string | null; // String
    name_starts_with?: string | null; // String
    pages_some?: NexusGenInputs['PageWhereInput'] | null; // PageWhereInput
  }
  DomainWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
  PageCreateInput: { // input type
    domain?: NexusGenInputs['DomainCreateOneWithoutPagesInput'] | null; // DomainCreateOneWithoutPagesInput
    id?: string | null; // ID
    name: string; // String!
  }
  PageWhereInput: { // input type
    AND?: NexusGenInputs['PageWhereInput'][] | null; // [PageWhereInput!]
    domain?: NexusGenInputs['DomainWhereInput'] | null; // DomainWhereInput
    id?: string | null; // ID
    id_contains?: string | null; // ID
    id_ends_with?: string | null; // ID
    id_gt?: string | null; // ID
    id_gte?: string | null; // ID
    id_in?: string[] | null; // [ID!]
    id_lt?: string | null; // ID
    id_lte?: string | null; // ID
    id_not?: string | null; // ID
    id_not_contains?: string | null; // ID
    id_not_ends_with?: string | null; // ID
    id_not_in?: string[] | null; // [ID!]
    id_not_starts_with?: string | null; // ID
    id_starts_with?: string | null; // ID
    name?: string | null; // String
    name_contains?: string | null; // String
    name_ends_with?: string | null; // String
    name_gt?: string | null; // String
    name_gte?: string | null; // String
    name_in?: string[] | null; // [String!]
    name_lt?: string | null; // String
    name_lte?: string | null; // String
    name_not?: string | null; // String
    name_not_contains?: string | null; // String
    name_not_ends_with?: string | null; // String
    name_not_in?: string[] | null; // [String!]
    name_not_starts_with?: string | null; // String
    name_starts_with?: string | null; // String
  }
  PageWhereUniqueInput: { // input type
    id?: string | null; // ID
  }
}

export interface NexusGenEnums {
  PageOrderByInput: "id_ASC" | "id_DESC" | "name_ASC" | "name_DESC"
}

export interface NexusGenRootTypes {
  Domain: { // root type
    id: string; // ID!
    name: string; // String!
  }
  Mutation: {};
  Page: { // root type
    id: string; // ID!
    name: string; // String!
  }
  Query: {};
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  DomainCreateOneWithoutPagesInput: NexusGenInputs['DomainCreateOneWithoutPagesInput'];
  DomainCreateWithoutPagesInput: NexusGenInputs['DomainCreateWithoutPagesInput'];
  DomainWhereInput: NexusGenInputs['DomainWhereInput'];
  DomainWhereUniqueInput: NexusGenInputs['DomainWhereUniqueInput'];
  PageCreateInput: NexusGenInputs['PageCreateInput'];
  PageWhereInput: NexusGenInputs['PageWhereInput'];
  PageWhereUniqueInput: NexusGenInputs['PageWhereUniqueInput'];
  PageOrderByInput: NexusGenEnums['PageOrderByInput'];
}

export interface NexusGenFieldTypes {
  Domain: { // field return type
    id: string; // ID!
    name: string; // String!
    pages: NexusGenRootTypes['Page'][] | null; // [Page!]
  }
  Mutation: { // field return type
    createPage: NexusGenRootTypes['Page']; // Page!
  }
  Page: { // field return type
    domain: NexusGenRootTypes['Domain'] | null; // Domain
    id: string; // ID!
    name: string; // String!
  }
  Query: { // field return type
    domain: NexusGenRootTypes['Domain'] | null; // Domain
    page: NexusGenRootTypes['Page'] | null; // Page
    pages: NexusGenRootTypes['Page'][]; // [Page!]!
  }
}

export interface NexusGenArgTypes {
  Domain: {
    pages: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenEnums['PageOrderByInput'] | null; // PageOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['PageWhereInput'] | null; // PageWhereInput
    }
  }
  Mutation: {
    createPage: { // args
      data: NexusGenInputs['PageCreateInput']; // PageCreateInput!
    }
  }
  Query: {
    domain: { // args
      where: NexusGenInputs['DomainWhereUniqueInput']; // DomainWhereUniqueInput!
    }
    page: { // args
      where: NexusGenInputs['PageWhereUniqueInput']; // PageWhereUniqueInput!
    }
    pages: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      orderBy?: NexusGenEnums['PageOrderByInput'] | null; // PageOrderByInput
      skip?: number | null; // Int
      where?: NexusGenInputs['PageWhereInput'] | null; // PageWhereInput
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Domain" | "Mutation" | "Page" | "Query";

export type NexusGenInputNames = "DomainCreateOneWithoutPagesInput" | "DomainCreateWithoutPagesInput" | "DomainWhereInput" | "DomainWhereUniqueInput" | "PageCreateInput" | "PageWhereInput" | "PageWhereUniqueInput";

export type NexusGenEnumNames = "PageOrderByInput";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}