package com.bakdata.conquery.models.concepts.filters.specific;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.apache.commons.lang3.ArrayUtils;

import com.bakdata.conquery.io.cps.CPSType;
import com.bakdata.conquery.io.jackson.serializer.NsIdRef;
import com.bakdata.conquery.io.jackson.serializer.NsIdRefCollection;
import com.bakdata.conquery.models.api.description.FEFilter;
import com.bakdata.conquery.models.api.description.FEFilterType;
import com.bakdata.conquery.models.common.Range;
import com.bakdata.conquery.models.concepts.filters.Filter;
import com.bakdata.conquery.models.datasets.Column;
import com.bakdata.conquery.models.query.filter.RangeFilterNode;
import com.bakdata.conquery.models.query.queryplan.aggregators.DistinctValuesWrapperAggregator;
import com.bakdata.conquery.models.query.queryplan.aggregators.MultiDistinctValuesWrapperAggregator;
import com.bakdata.conquery.models.query.queryplan.aggregators.specific.CountAggregator;
import com.bakdata.conquery.models.query.queryplan.filter.FilterNode;

import lombok.Getter;
import lombok.Setter;

/**
 * This filter represents a select in the front end. This means that the user can select one or more values from a list of values.
 */
@Getter
@Setter
@CPSType(id = "COUNT", base = Filter.class)
public class CountFilter extends Filter<Range.LongRange> {

	@Valid
	@NotNull
	@Getter @Setter @NsIdRef
	private Column column;

	private boolean distinct;

	@Valid
	@Getter @Setter @NsIdRefCollection
	private Column[] distinctByColumn;


	@Override
	public void configureFrontend(FEFilter f) {
		f.setType(FEFilterType.INTEGER_RANGE);
		f.setMin(1);
	}
	

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public FilterNode createAggregator(Range.LongRange value) {
		if (distinct) {
			if (ArrayUtils.isEmpty(distinctByColumn) || distinctByColumn.length < 2) {
				return new RangeFilterNode(
					value,
					new DistinctValuesWrapperAggregator(
							new CountAggregator(getColumn()),
							ArrayUtils.isEmpty(getDistinctByColumn()) ?
								getColumn()
								:
								getDistinctByColumn()[0]
					)
				);
			}
			else {
				return new RangeFilterNode(value, new MultiDistinctValuesWrapperAggregator(new CountAggregator(getColumn()), getDistinctByColumn()));
			}
		}
		else {
			return new RangeFilterNode(value, new CountAggregator(getColumn()));
		}
	}

	@Override
	public Column[] getRequiredColumns() {
		return new Column[] { getColumn(), (distinct && !ArrayUtils.isEmpty(distinctByColumn)) ? distinctByColumn[0] : null };
	}
}
