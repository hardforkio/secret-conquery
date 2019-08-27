package com.bakdata.conquery.models.config;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

import com.univocity.parsers.csv.CsvFormat;
import com.univocity.parsers.csv.CsvParserSettings;
import com.univocity.parsers.csv.CsvWriterSettings;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Wither;

@Getter @Setter @Wither @AllArgsConstructor @NoArgsConstructor
public class CSVConfig {
	private char escape = '\\';
	private char comment = '\0';
	private char delimeter = ',';
	@Length(min=1, max=2) @NotNull
	private String lineSeparator = "\n";
	private char quote = '"';
	@NotNull
	private Charset encoding = StandardCharsets.UTF_8;
	private boolean skipHeader = true;
	
	public CsvParserSettings createCsvParserSettings() {
		CsvParserSettings settings = new CsvParserSettings();
		settings.setFormat(createCsvFormat());
		return settings;
	}
	
	public CsvWriterSettings createCsvWriterSettings() {
		CsvWriterSettings settings = new CsvWriterSettings();
		settings.setFormat(createCsvFormat());
		return settings;
	}

	public CsvFormat createCsvFormat() {
		CsvFormat format = new CsvFormat();
		format.setQuoteEscape(getEscape());
		format.setCharToEscapeQuoteEscaping(getEscape());
		format.setComment(getComment());
		format.setDelimiter(getDelimeter());
		format.setLineSeparator(getLineSeparator());
		format.setQuote(getQuote());
		return format;
	}
}