package com.bakdata.conquery.models.auth;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import com.bakdata.conquery.io.xodus.MasterMetaStorage;
import com.bakdata.conquery.models.auth.basic.BasicAuthRealm;
import com.bakdata.conquery.models.auth.entities.User;
import com.bakdata.conquery.models.auth.permissions.WildcardPermission;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * Container class for holding information about initial users.
 */
@Getter
public class ProtoUser {

	private String label;
	@NotEmpty
	private String name;

	/**
	 * String permissions in the form of
	 * {@link org.apache.shiro.authz.permission.WildcardPermission}, that the user
	 * should hold after initialization.
	 */
	private Set<String> permissions = Collections.emptySet();

	/**
	 * These are passed to realms that are able to manage users (implementing
	 * {@link UserManageable}, such as {@link BasicAuthRealm}).
	 */
	private List<CredentialType> credentials = Collections.emptyList();
	
	@JsonIgnore
	private User user = null;

	private User getUser() {
		if(user != null) {
			return user;
		}
		if (label == null) {
			label = name;
		}
		user = new User(name, label);
		return user;
	}

	public void registerForAuthorization(MasterMetaStorage storage) {
		User user = this.getUser();
		// Possibly overriding a user
		storage.updateUser(user);
		for (String sPermission : permissions) {
			user.addPermission(storage, new WildcardPermission(sPermission));
		}
	}
	
	public void registerForAuthentication(UserManageable userManager) {
		userManager.addUser(getUser(), credentials, true);
	}
}
