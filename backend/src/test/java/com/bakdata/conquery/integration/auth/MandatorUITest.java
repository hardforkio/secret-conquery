package com.bakdata.conquery.integration.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;

import javax.ws.rs.core.Response;

import com.bakdata.conquery.integration.IConqueryTest;
import com.bakdata.conquery.io.cps.CPSType;
import com.bakdata.conquery.io.xodus.MasterMetaStorage;
import com.bakdata.conquery.models.auth.permissions.Ability;
import com.bakdata.conquery.models.auth.permissions.ConqueryPermission;
import com.bakdata.conquery.models.auth.permissions.DatasetPermission;
import com.bakdata.conquery.models.auth.subjects.Mandator;
import com.bakdata.conquery.models.auth.subjects.User;
import com.bakdata.conquery.models.exceptions.JSONException;
import com.bakdata.conquery.models.identifiable.ids.specific.DatasetId;
import com.bakdata.conquery.models.identifiable.ids.specific.MandatorId;
import com.bakdata.conquery.models.identifiable.ids.specific.UserId;
import com.bakdata.conquery.util.support.TestConquery;

/**
 * Tests the mandator UI interface. Before the request is done, a mandator, a
 * user and a permission is created and stored. Then the request response is
 * tested against the created entities.
 *
 */
@CPSType(base = IConqueryTest.class, id = "HTTP_MANDATOR")
public class MandatorUITest implements IConqueryTest {

	private TestConquery conquery;

	private MasterMetaStorage storage;
	private Mandator mandator = new Mandator("testMandatorName", "testMandatorLabel");
	private MandatorId mandatorId = mandator.getId();
	private User user = new User("testUser@test.de", "testUserName");
	private UserId userId = user.getId();
	private ConqueryPermission permission = new DatasetPermission(null, Ability.READ.AS_SET, new DatasetId("testDatasetId"));

	@Override
	public void init(TestConquery conquery) {
		this.conquery = conquery;

		storage = conquery.getSupport().getStandaloneCommand().getMaster().getStorage();
		try {
			storage.addMandator(mandator);
			storage.addUser(user);
			// override permission object, because it might have changed by the subject
			// owning the permission
			permission = mandator.addPermission(storage, permission);
			user.addMandator(storage, mandator);
		}
		catch (JSONException e) {
			fail("Failed when adding to storage.",e);
		}
	}

	@Override
	public void execute() {
		Response response = conquery
			.getClient()
			.target(String.format("http://localhost:%d/admin/mandators/%s", conquery.getDropwizard().getAdminPort(), mandatorId.toString()))
			.request()
			.get();

		assertThat(response.getStatus()).isEqualTo(200);
		assertThat(response.readEntity(String.class))
			// check permission
			.contains(permission.getClass().getSimpleName(), permission.getTarget().toString())
			.containsSubsequence((Iterable<String>) () -> permission.getAbilities().stream().map(Enum::name).iterator())
			// check user
			.contains(user.getLabel());

	}

	@Override
	public void finish() {
		storage.removeMandator(mandatorId);
		storage.removeUser(userId);
		storage.removePermission(permission.getId());
	}

}
