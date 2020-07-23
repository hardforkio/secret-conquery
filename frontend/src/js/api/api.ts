import { apiUrl } from "../environment";

import type {
  DatasetIdT,
  QueryIdT,
  ConceptIdT,
  GetFrontendConfigResponseT,
  GetConceptsResponseT,
  GetConceptResponseT,
  PostQueriesResponseT,
  GetQueryResponseT,
  GetStoredQueriesResponseT,
  GetStoredQueryResponseT,
  PostConceptResolveResponseT,
  PostFilterResolveResponseT,
  PostFilterSuggestionsResponseT,
  GetFormQueriesResponseT,
  GetMeResponseT,
  PostLoginResponseT,
  PostFormConfigsResponseT,
  GetFormConfigsResponseT,
  GetFormConfigResponseT
} from "./types";

import fetchJson, { fetchJsonUnauthorized } from "./fetchJson";
import { transformQueryToApi } from "./apiHelper";
import { transformFormQueryToApi } from "./apiExternalFormsHelper";
import type {
  FormConfigT,
  BaseFormConfigT
} from "js/external-forms/form-configs/reducer";

const PROTECTED_PREFIX = "/api";

function getProtectedUrl(url: string) {
  return apiUrl() + PROTECTED_PREFIX + url;
}

export function getFrontendConfig(): Promise<GetFrontendConfigResponseT> {
  return fetchJson(getProtectedUrl("/config/frontend"));
}

export function getDatasets() {
  return fetchJson(getProtectedUrl(`/datasets`));
}

export const getConcepts = (
  datasetId: DatasetIdT
): Promise<GetConceptsResponseT> => {
  return fetchJson(getProtectedUrl(`/datasets/${datasetId}/concepts`));
};

export const getConcept = (
  datasetId: DatasetIdT,
  conceptId: ConceptIdT
): Promise<GetConceptResponseT> => {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/concepts/${conceptId}`)
  );
};

// Same signature as postFormQueries
export function postQueries(
  datasetId: DatasetIdT,
  query: Record<string, any>,
  queryType: string
): Promise<PostQueriesResponseT> {
  // Transform into backend-compatible format
  const data = transformQueryToApi(query, queryType);

  return fetchJson(getProtectedUrl(`/datasets/${datasetId}/queries`), {
    method: "POST",
    data
  });
}

// Same signature as postQueries, plus a form query transformator
export function postFormQueries(
  datasetId: DatasetIdT,
  query: { form: string; formName: string },
  // @ts-ignore
  queryType: string,
  version: any,
  formQueryTransformation: Function
): Promise<PostQueriesResponseT> {
  // Transform into backend-compatible format
  const data = transformFormQueryToApi(query, version, formQueryTransformation);

  return fetchJson(getProtectedUrl(`/datasets/${datasetId}/queries`), {
    method: "POST",
    data
  });
}

export function deleteQuery(
  datasetId: DatasetIdT,
  queryId: QueryIdT
): Promise<null> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/queries/${queryId}`),
    {
      method: "DELETE"
    }
  );
}

export function getQuery(
  datasetId: DatasetIdT,
  queryId: QueryIdT
): Promise<GetQueryResponseT> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/queries/${queryId}`)
  );
}

export function getForms(
  datasetId: DatasetIdT
): Promise<GetFormQueriesResponseT> {
  return fetchJson(getProtectedUrl(`/datasets/${datasetId}/form-queries`));
}

export function getStoredQueries(
  datasetId: DatasetIdT
): Promise<GetStoredQueriesResponseT> {
  return fetchJson(getProtectedUrl(`/datasets/${datasetId}/stored-queries`));
}

export function getStoredQuery(
  datasetId: DatasetIdT,
  queryId: QueryIdT
): Promise<GetStoredQueryResponseT> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/stored-queries/${queryId}`)
  );
}

export function deleteStoredQuery(
  datasetId: DatasetIdT,
  queryId: QueryIdT
): Promise<null> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/stored-queries/${queryId}`),
    {
      method: "DELETE"
    }
  );
}

export function patchStoredQuery(
  datasetId: DatasetIdT,
  queryId: QueryIdT,
  attributes: Record<string, any>
): Promise<null> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/stored-queries/${queryId}`),
    {
      method: "PATCH",
      data: attributes
    }
  );
}

export function postPrefixForSuggestions(
  datasetId: DatasetIdT,
  conceptId: string,
  tableId: string,
  filterId: string,
  text: string
): Promise<PostFilterSuggestionsResponseT> {
  return fetchJson(
    getProtectedUrl(
      `/datasets/${datasetId}/concepts/${conceptId}/tables/${tableId}/filters/${filterId}/autocomplete`
    ),
    {
      method: "POST",
      data: { text }
    }
  );
}

export function postConceptsListToResolve(
  datasetId: DatasetIdT,
  conceptId: string,
  concepts: string[]
): Promise<PostConceptResolveResponseT> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/concepts/${conceptId}/resolve`),
    {
      method: "POST",
      data: { concepts }
    }
  );
}

export function postFilterValuesResolve(
  datasetId: DatasetIdT,
  conceptId: string,
  tableId: string,
  filterId: string,
  values: string[]
): Promise<PostFilterResolveResponseT> {
  return fetchJson(
    getProtectedUrl(
      `/datasets/${datasetId}/concepts/${conceptId}/tables/${tableId}/filters/${filterId}/resolve`
    ),
    {
      method: "POST",
      data: { values }
    }
  );
}

export function getMe(): Promise<GetMeResponseT> {
  return fetchJson(getProtectedUrl(`/me`));
}

export function postLogin(
  user: string,
  password: string
): Promise<PostLoginResponseT> {
  return fetchJsonUnauthorized(apiUrl() + "/auth", {
    method: "POST",
    data: {
      user,
      password
    }
  });
}

export function postFormConfig(
  datasetId: DatasetIdT,
  data: BaseFormConfigT
): Promise<PostFormConfigsResponseT> {
  return fetchJson(getProtectedUrl(`/datasets/${datasetId}/form-configs`), {
    method: "POST",
    data
  });
}

export function getFormConfig(
  datasetId: DatasetIdT,
  formConfigId: string
): Promise<GetFormConfigResponseT> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/form-configs/${formConfigId}`)
  );
}

export function patchFormConfig(
  datasetId: DatasetIdT,
  formConfigId: string,
  data: Partial<FormConfigT>
): Promise<PostFormConfigsResponseT> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/form-configs/${formConfigId}`),
    {
      method: "PATCH",
      data
    }
  );
}

export function getFormConfigs(
  datasetId: DatasetIdT
): Promise<GetFormConfigsResponseT> {
  return fetchJson(getProtectedUrl(`/datasets/${datasetId}/form-configs`));
}

export function deleteFormConfig(
  datasetId: DatasetIdT,
  formConfigId: string
): Promise<null> {
  return fetchJson(
    getProtectedUrl(`/datasets/${datasetId}/form-configs/${formConfigId}`),
    {
      method: "DELETE"
    }
  );
}
