package com.bakdata.conquery.apiv1;

import static com.bakdata.conquery.apiv1.ResourceConstants.DATASET;
import static com.bakdata.conquery.apiv1.ResourceConstants.QUERY;
import static com.bakdata.conquery.models.auth.AuthorizationHelper.authorize;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.security.PermitAll;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response.Status;

import com.bakdata.conquery.io.xodus.MasterMetaStorage;
import com.bakdata.conquery.models.auth.permissions.Ability;
import com.bakdata.conquery.models.auth.permissions.QueryPermission;
import com.bakdata.conquery.models.auth.subjects.User;
import com.bakdata.conquery.models.datasets.Dataset;
import com.bakdata.conquery.models.exceptions.JSONException;
import com.bakdata.conquery.models.execution.ExecutionStatus;
import com.bakdata.conquery.models.execution.ManagedExecution;
import com.bakdata.conquery.models.identifiable.ids.specific.DatasetId;
import com.bakdata.conquery.models.identifiable.ids.specific.ManagedExecutionId;
import com.bakdata.conquery.models.query.ManagedQuery;
import com.bakdata.conquery.models.worker.Namespaces;
import com.bakdata.conquery.util.ResourceUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.collect.Iterators;

import io.dropwizard.auth.Auth;
import io.dropwizard.jersey.PATCH;

@Path("datasets/{" + DATASET + "}/stored-queries")
@Consumes(AdditionalMediaTypes.JSON)
@Produces(AdditionalMediaTypes.JSON)

public class StoredQueriesResource {

	private final StoredQueriesProcessor processor;
	private final ResourceUtil dsUtil;

	public StoredQueriesResource(Namespaces namespaces) {
		this.processor = new StoredQueriesProcessor(namespaces);
		this.dsUtil = new ResourceUtil(namespaces);
	}

	@GET
	public List<ExecutionStatus> getAllQueries(@Auth User user, @PathParam(DATASET) DatasetId datasetId, @Context HttpServletRequest req) {
		authorize(user, datasetId, Ability.READ);

		return processor.getAllQueries(dsUtil.getDataset(datasetId), req)
			.filter(status -> user.isPermitted(new QueryPermission(user.getId(), Ability.READ.asSet(), status.getId())))
			.collect(Collectors.toList());
	}

	@GET
	@Path("{" + QUERY + "}")
	public ExecutionStatus getQueryWithSource(@Auth User user, @PathParam(DATASET) DatasetId datasetId, @PathParam(QUERY) ManagedExecutionId queryId) {
		Dataset dataset = dsUtil.getDataset(datasetId);
		authorize(user, datasetId, Ability.READ);
		authorize(user, queryId, Ability.READ);

		ExecutionStatus status = processor.getQueryWithSource(dataset, queryId);
		if(status == null) {
			throw new WebApplicationException("Unknown query "+queryId, Status.NOT_FOUND);
		}
		return status;
	}

	@PATCH
	@Path("{" + QUERY + "}")
	public ExecutionStatus patchQuery(@Auth User user, @PathParam(DATASET) DatasetId datasetId, @PathParam(QUERY) ManagedExecutionId queryId, JsonNode patch) throws JSONException {
		authorize(user, datasetId, Ability.READ);

		Dataset dataset = dsUtil.getDataset(datasetId);

		MasterMetaStorage storage = processor.getNamespaces().get(dataset.getId()).getStorage().getMetaStorage();
		ManagedExecution exec = storage.getExecution(queryId);
		if(!(exec instanceof ManagedQuery)) {
			throw new IllegalArgumentException(queryId+" is not a patchable query");
		}
		ManagedQuery query = (ManagedQuery) exec;
		if (patch.has("tags")) {
			String[] newTags = Iterators.toArray(Iterators.transform(patch.get("tags").elements(), n -> n.asText(null)), String.class);
			processor.tagQuery(storage, user, query, newTags);
		} else if (patch.has("label")) {
			processor.updateQueryLabel(storage, user, query, patch.get("label").textValue());
		} else if (patch.has("shared")) {
			processor.shareQuery(storage, user, query, patch.get("shared").asBoolean());
		}
		
		return getQueryWithSource(user, datasetId, queryId);
	}

	@DELETE
	@Path("{" + QUERY + "}")
	public void deleteQuery(@Auth User user, @PathParam(DATASET) DatasetId datasetId, @PathParam(QUERY) ManagedExecutionId queryId) {

		authorize(user, datasetId, Ability.READ);
		authorize(user, queryId, Ability.DELETE);

		processor.deleteQuery(dsUtil.getDataset(datasetId), dsUtil.getManagedQuery(datasetId, queryId));
	}
}
