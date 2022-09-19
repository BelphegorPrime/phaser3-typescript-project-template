import { gql, OperationVariables, TypedDocumentNode } from "@apollo/client";
import { BaseDeck } from "../generated/graphql";
import BasicCard from "../graphql/BasicCard";
import Api from "../models/api";

const query = gql`
  query baseDecks {
    baseDecks {
      id
      name
      baseDeckCards {
        id
        amount
        baseCard ${BasicCard}
      }
    }
  }
` as TypedDocumentNode<{ baseDecks: BaseDeck[] }, OperationVariables>;

const getDecks = async (): Promise<{ baseDecks: BaseDeck[] }> => {
  const request = await Api.client.query<{ baseDecks: BaseDeck[] }>({ query });
  return request.data;
};
export default getDecks;
