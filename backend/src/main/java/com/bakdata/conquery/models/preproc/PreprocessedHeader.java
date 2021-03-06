package com.bakdata.conquery.models.preproc;

import com.bakdata.conquery.models.common.daterange.CDateRange;
import com.bakdata.conquery.models.datasets.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PreprocessedHeader {
	private int validityHash;
	private String name;
	private String table;
	private long rows;
	private long groups;
	private CDateRange eventRange;
	private PPColumn primaryColumn;
	private PPColumn[] columns;
	private String suffix;

	/**
	 * Verify that the supplied table matches the preprocessed' data in shape.
	 */
	public boolean matches(Table table) {
		if(!table.getPrimaryColumn().matches(getPrimaryColumn())) {
			return false;
		}

		if(table.getColumns().length != getColumns().length) {
			return false;
		}

		for(int i = 0; i < table.getColumns().length; i++) {
			if(!table.getColumns()[i].matches(getColumns()[i])) {
				return false;
			}
		}
		return true;
	}
}
