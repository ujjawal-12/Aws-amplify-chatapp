import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ChattyMetaData = {
  readOnlyFields: 'updatedAt';
}

export declare class Chatty {
  readonly id: string;
  readonly user: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Chatty, ChattyMetaData>);
  static copyOf(source: Chatty, mutator: (draft: MutableModel<Chatty, ChattyMetaData>) => MutableModel<Chatty, ChattyMetaData> | void): Chatty;
}