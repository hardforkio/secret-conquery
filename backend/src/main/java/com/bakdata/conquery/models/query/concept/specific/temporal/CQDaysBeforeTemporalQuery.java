package com.bakdata.conquery.models.query.concept.specific.temporal;

import com.bakdata.conquery.io.cps.CPSType;
import com.bakdata.conquery.models.common.Range;
import com.bakdata.conquery.models.query.QueryPlanContext;
import com.bakdata.conquery.models.query.QueryResolveContext;
import com.bakdata.conquery.models.query.concept.CQElement;
import com.bakdata.conquery.models.query.queryplan.QPNode;
import com.bakdata.conquery.models.query.queryplan.QueryPlan;
import com.bakdata.conquery.models.query.queryplan.specific.temporal.DaysBeforePrecedenceMatcher;
import com.bakdata.conquery.models.query.queryplan.specific.temporal.TemporalQueryNode;

import lombok.Getter;

/**
 * Creates a query that will contain all entities where {@code preceding} contains events that happened {@code days} before the events of {@code index}. And the time where this has happened.
 */
@CPSType(id = "DAYS_BEFORE", base = CQElement.class)
public class CQDaysBeforeTemporalQuery extends CQAbstractTemporalQuery {

	@Getter
	private Range.IntegerRange days;

	public CQDaysBeforeTemporalQuery(CQElement index, CQElement preceding, TemporalSampler sampler, Range.IntegerRange days) {
		super(index, preceding, sampler);
		this.days = days;
	}

	@Override
	public QPNode createQueryPlan(QueryPlanContext registry, QueryPlan plan) {
		QueryPlan indexPlan = QueryPlan.create();
		indexPlan.setRoot(index.createQueryPlan(registry, plan));

		QueryPlan precedingPlan = QueryPlan.create();
		precedingPlan.setRoot(preceding.createQueryPlan(registry, plan));

		return new TemporalQueryNode(indexPlan, precedingPlan, getSampler(), new DaysBeforePrecedenceMatcher(days), plan.getIncluded());
	}
	
	@Override
	public CQDaysBeforeTemporalQuery resolve(QueryResolveContext context) {
		return new CQDaysBeforeTemporalQuery(index.resolve(context), preceding.resolve(context), sampler, days);
	}
}