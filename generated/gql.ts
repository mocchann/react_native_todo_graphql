/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment CreateTodoFragment on CreateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n": typeof types.CreateTodoFragmentFragmentDoc,
    "\n  fragment HeaderFragment on Query {\n    todoCount\n  }\n": typeof types.HeaderFragmentFragmentDoc,
    "\n  mutation SignOutUser($input: SignOutInput!) {\n    signOut(input: $input) {\n      success\n    }\n  }\n": typeof types.SignOutUserDocument,
    "\n  mutation SignInUser($input: SignInInput!) {\n    signIn(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n": typeof types.SignInUserDocument,
    "\n  mutation SignUpUser($input: SignUpInput!) {\n    signUp(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n": typeof types.SignUpUserDocument,
    "\n  fragment TodosFragment on Query {\n    todos {\n      id\n      title\n      content\n    }\n  }\n": typeof types.TodosFragmentFragmentDoc,
    "\n  query Todos {\n    ...TodosFragment\n    ...HeaderFragment\n  }\n": typeof types.TodosDocument,
    "\n  mutation CreateTodo($input: CreateTodoInput!) {\n    createTodo(input: $input) {\n      ...CreateTodoFragment\n    }\n  }\n": typeof types.CreateTodoDocument,
    "\n  mutation UpdateTodo($input: UpdateTodoInput!) {\n    updateTodo(input: $input) {\n      ...UpdateTodoFragment\n    }\n  }\n": typeof types.UpdateTodoDocument,
    "\n  mutation DeleteTodo($input: DeleteTodoInput!) {\n    deleteTodo(input: $input) {\n      ...DeleteTodoFragment\n    }\n  }\n": typeof types.DeleteTodoDocument,
    "\n  fragment UpdateTodoFragment on UpdateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n": typeof types.UpdateTodoFragmentFragmentDoc,
    "\n  fragment DeleteTodoFragment on DeleteTodoPayload {\n    errors\n    todo {\n      id\n    }\n  }\n": typeof types.DeleteTodoFragmentFragmentDoc,
};
const documents: Documents = {
    "\n  fragment CreateTodoFragment on CreateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n": types.CreateTodoFragmentFragmentDoc,
    "\n  fragment HeaderFragment on Query {\n    todoCount\n  }\n": types.HeaderFragmentFragmentDoc,
    "\n  mutation SignOutUser($input: SignOutInput!) {\n    signOut(input: $input) {\n      success\n    }\n  }\n": types.SignOutUserDocument,
    "\n  mutation SignInUser($input: SignInInput!) {\n    signIn(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n": types.SignInUserDocument,
    "\n  mutation SignUpUser($input: SignUpInput!) {\n    signUp(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n": types.SignUpUserDocument,
    "\n  fragment TodosFragment on Query {\n    todos {\n      id\n      title\n      content\n    }\n  }\n": types.TodosFragmentFragmentDoc,
    "\n  query Todos {\n    ...TodosFragment\n    ...HeaderFragment\n  }\n": types.TodosDocument,
    "\n  mutation CreateTodo($input: CreateTodoInput!) {\n    createTodo(input: $input) {\n      ...CreateTodoFragment\n    }\n  }\n": types.CreateTodoDocument,
    "\n  mutation UpdateTodo($input: UpdateTodoInput!) {\n    updateTodo(input: $input) {\n      ...UpdateTodoFragment\n    }\n  }\n": types.UpdateTodoDocument,
    "\n  mutation DeleteTodo($input: DeleteTodoInput!) {\n    deleteTodo(input: $input) {\n      ...DeleteTodoFragment\n    }\n  }\n": types.DeleteTodoDocument,
    "\n  fragment UpdateTodoFragment on UpdateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n": types.UpdateTodoFragmentFragmentDoc,
    "\n  fragment DeleteTodoFragment on DeleteTodoPayload {\n    errors\n    todo {\n      id\n    }\n  }\n": types.DeleteTodoFragmentFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CreateTodoFragment on CreateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n"): (typeof documents)["\n  fragment CreateTodoFragment on CreateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HeaderFragment on Query {\n    todoCount\n  }\n"): (typeof documents)["\n  fragment HeaderFragment on Query {\n    todoCount\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignOutUser($input: SignOutInput!) {\n    signOut(input: $input) {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation SignOutUser($input: SignOutInput!) {\n    signOut(input: $input) {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignInUser($input: SignInInput!) {\n    signIn(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignInUser($input: SignInInput!) {\n    signIn(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignUpUser($input: SignUpInput!) {\n    signUp(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SignUpUser($input: SignUpInput!) {\n    signUp(input: $input) {\n      user {\n        id\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TodosFragment on Query {\n    todos {\n      id\n      title\n      content\n    }\n  }\n"): (typeof documents)["\n  fragment TodosFragment on Query {\n    todos {\n      id\n      title\n      content\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Todos {\n    ...TodosFragment\n    ...HeaderFragment\n  }\n"): (typeof documents)["\n  query Todos {\n    ...TodosFragment\n    ...HeaderFragment\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTodo($input: CreateTodoInput!) {\n    createTodo(input: $input) {\n      ...CreateTodoFragment\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTodo($input: CreateTodoInput!) {\n    createTodo(input: $input) {\n      ...CreateTodoFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTodo($input: UpdateTodoInput!) {\n    updateTodo(input: $input) {\n      ...UpdateTodoFragment\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTodo($input: UpdateTodoInput!) {\n    updateTodo(input: $input) {\n      ...UpdateTodoFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTodo($input: DeleteTodoInput!) {\n    deleteTodo(input: $input) {\n      ...DeleteTodoFragment\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTodo($input: DeleteTodoInput!) {\n    deleteTodo(input: $input) {\n      ...DeleteTodoFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UpdateTodoFragment on UpdateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n"): (typeof documents)["\n  fragment UpdateTodoFragment on UpdateTodoPayload {\n    errors\n    todo {\n      id\n      title\n      content\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment DeleteTodoFragment on DeleteTodoPayload {\n    errors\n    todo {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment DeleteTodoFragment on DeleteTodoPayload {\n    errors\n    todo {\n      id\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;