package com.bakdata.conquery.models.auth;

import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import com.bakdata.conquery.io.xodus.MasterMetaStorage;
import com.bakdata.conquery.models.auth.entities.Group;
import com.bakdata.conquery.models.auth.entities.PermissionOwner;
import com.bakdata.conquery.models.auth.entities.Role;
import com.bakdata.conquery.models.auth.entities.RoleOwner;
import com.bakdata.conquery.models.auth.entities.User;
import com.bakdata.conquery.models.auth.permissions.Ability;
import com.bakdata.conquery.models.auth.permissions.ConqueryPermission;
import com.bakdata.conquery.models.auth.permissions.DatasetPermission;
import com.bakdata.conquery.models.auth.permissions.QueryPermission;
import com.bakdata.conquery.models.datasets.Dataset;
import com.bakdata.conquery.models.execution.ManagedExecution;
import com.bakdata.conquery.models.identifiable.ids.NamespacedId;
import com.bakdata.conquery.models.identifiable.ids.specific.DatasetId;
import com.bakdata.conquery.models.identifiable.ids.specific.ManagedExecutionId;
import com.bakdata.conquery.models.identifiable.ids.specific.PermissionOwnerId;
import com.bakdata.conquery.models.identifiable.ids.specific.RoleId;
import com.bakdata.conquery.models.identifiable.ids.specific.UserId;
import com.bakdata.conquery.models.query.ManagedQuery;
import com.bakdata.conquery.models.query.Visitable;
import com.bakdata.conquery.util.QueryUtils.NamespacedIdCollector;
import com.google.common.collect.ArrayListMultimap;
import com.google.common.collect.Multimap;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authz.Permission;

/**
 * Helper for easier and cleaner authorization.
 *
 */
@Slf4j
public class AuthorizationHelper {
	
	// Dataset Instances
	/**
	 * Helper function for authorizing an ability on a dataset.
	 * @param user The subject that needs authorization.
	 * @param dataset The id of the object that needs to be checked.
	 * @param ability The kind of ability that is checked.
	 */
	public static void authorize(@NonNull User user, @NonNull DatasetId dataset, @NonNull Ability ability) {
		authorize(user, dataset, EnumSet.of(ability));
	}
	
	/**
	 * Helper function for authorizing an ability on a dataset.
	 * @param user The subject that needs authorization.
	 * @param dataset The id of the object that needs to be checked.
	 * @param ability The kind of ability that is checked.
	 */
	public static void authorize(@NonNull User user, @NonNull DatasetId dataset, @NonNull EnumSet<Ability> abilities) {
		user.checkPermission(DatasetPermission.onInstance(abilities, dataset));
	}
	
	// Query Instances
	/**
	 * Helper function for authorizing an ability on a query.
	 * @param user The subject that needs authorization.
	 * @param query The id of the object that needs to be checked.
	 * @param ability The kind of ability that is checked.
	 */
	public static void authorize(@NonNull User user, @NonNull ManagedExecutionId query, @NonNull Ability ability) {
		authorize(user, query, EnumSet.of(ability));
	}
	
	/**
	 * Helper function for authorizing an ability on a query.
	 * @param user The subject that needs authorization.
	 * @param query The id of the object that needs to be checked.
	 * @param ability The kind of ability that is checked.
	 */
	public static void authorize(@NonNull User user, @NonNull ManagedExecutionId query, @NonNull EnumSet<Ability> abilities) {
		user.checkPermission(QueryPermission.onInstance(abilities, query));
	}
	
	/**
	 * Helper function for authorizing an ability on a query.
	 * @param user The subject that needs authorization.
	 * @param query The object that needs to be checked.
	 * @param ability The kind of ability that is checked.
	 */
	public static void authorize(@NonNull User user, @NonNull ManagedQuery query, @NonNull Ability ability) {
		authorize(user, query.getId(), EnumSet.of(ability));
	}
	
	/**
	 * Helper function for authorizing an ability on a query.
	 * @param user The subject that needs authorization.
	 * @param query The object that needs to be checked.
	 * @param ability The kind of ability that is checked.
	 */
	public static void authorize(@NonNull User user, @NonNull ManagedQuery query, @NonNull EnumSet<Ability> abilities) {
		user.checkPermission(QueryPermission.onInstance(abilities, query.getId()));
	}
	
	/**
	 * Helper function for authorizing an ability on a query.
	 * @param user The subject that needs authorization.
	 * @param query The object that needs to be checked.
	 * @param ability The kind of ability that is checked.
	 */
	public static void authorize(@NonNull User user, @NonNull ConqueryPermission toBeChecked) {
		user.checkPermission(toBeChecked);
	}
	
	/**
	 * Utility function to add a permission to a subject (e.g {@link User}).
	 * @param owner The subject to own the new permission.
	 * @param permission The permission to add.
	 * @param storage A storage where the permission are added for persistence.
	 */
	public static void addPermission(@NonNull PermissionOwner<?> owner, @NonNull ConqueryPermission permission, @NonNull MasterMetaStorage storage) {
		owner.addPermission(storage, permission);
	}
	
	/**
	 * Utility function to remove a permission from a subject (e.g {@link User}).
	 * @param owner The subject to own the new permission.
	 * @param permission The permission to remove.
	 * @param storage A storage where the permission is removed from.
	 */
	public static void removePermission(@NonNull PermissionOwner<?> owner, @NonNull Permission permission, @NonNull MasterMetaStorage storage) {
		owner.removePermission(storage, permission);
	}
	
	public static List<Group> getGroupsOf(@NonNull User user, @NonNull MasterMetaStorage storage){
		List<Group> userGroups = new ArrayList<>();
		for (Group group : storage.getAllGroups()) {
			if(group.containsMember(user)) {
				userGroups.add(group);
			}
		}
		return userGroups;
	}
	

	
	/**
	 * Returns a list of the effective permissions. These are the permissions of the owner and
	 * the permission of the roles it inherits.
	 * @return Owned and inherited permissions.
	 */
	public static Set<ConqueryPermission> getEffectiveUserPermissions(UserId userId, MasterMetaStorage storage) {
		User user = Objects.requireNonNull(
			storage.getUser(userId),
			() -> String.format("User with id %s was not found", userId));
		Set<ConqueryPermission> permissions = new HashSet<>(user.getPermissions());
		for (Role role : user.getRoles()) {
			permissions.addAll(role.getPermissions());
		}
		
		for (Group group : storage.getAllGroups()) {
			if(group.containsMember(user)) {
				// Get Permissions of the group
				permissions.addAll(group.getPermissions());
				// And all of all roles a group holds
				group.getRoles().forEach(r -> permissions.addAll(r.getPermissions()));
			}
		}
		return permissions;
	}
	
	/**
	 * Returns a list of the effective permissions. These are the permissions of the owner and
	 * the permission of the roles it inherits. The query can be filtered by the Permission domain.
	 * @return Owned and inherited permissions.
	 */
	public static Multimap<String, ConqueryPermission> getEffectiveUserPermissions(UserId userId, List<String> domainSpecifier, MasterMetaStorage storage) {
		Set<ConqueryPermission> permissions = getEffectiveUserPermissions(userId, storage);
		Multimap<String, ConqueryPermission> mappedPerms = ArrayListMultimap.create();
		for(ConqueryPermission perm : permissions) {
			Set<String> domains = perm.getDomains();
			if(!Collections.disjoint(domainSpecifier, perm.getDomains())) {
				for(String domain : domains) {
					mappedPerms.put(domain, perm);
				}
			}
		}
		return mappedPerms;
	}
	

	
	public static <P extends PermissionOwner<?> & RoleOwner> void addRoleTo(@ NonNull MasterMetaStorage storage, @NonNull PermissionOwnerId<P> ownerId, @NonNull RoleId roleId) {
		Role role = Objects.requireNonNull(roleId.getPermissionOwner(storage), "supplied Role was not found in the storage.");
		P owner = Objects.requireNonNull(ownerId.getPermissionOwner(storage), "supplied RoleOwner was not found in the storage.");

		owner.addRole(storage, role);
		log.trace("Added role {} to {}", role, owner);
	}
	
	public static <P extends PermissionOwner<?> & RoleOwner> void deleteRoleFrom(@ NonNull MasterMetaStorage storage, @NonNull PermissionOwnerId<P> ownerId, @NonNull RoleId roleId) {
		Role role = Objects.requireNonNull(roleId.getPermissionOwner(storage), "supplied Role was not found in the storage.");
		P owner = Objects.requireNonNull(ownerId.getPermissionOwner(storage), "supplied RoleOwner was not found in the storage.");
		
		owner.removeRole(storage,role);
		
		log.trace("Deleted role {} from {}", role, owner);
	}

	public static void deleteRole(MasterMetaStorage storage, RoleId roleId) {
		log.info("Deleting mandator: {}", roleId);
		Role role = storage.getRole(roleId);
		for (User user : storage.getAllUsers()) {
			user.removeRole(storage, role);
		}
		for (Group group : storage.getAllGroups()) {
			group.removeRole(storage, role);
		}
		storage.removeRole(roleId);
	}
	


	public static List<User> getUsersByRole(MasterMetaStorage storage, Role role) {
		return storage.getAllUsers().stream().filter(u -> u.getRoles().contains(role)).collect(Collectors.toList());
	}

	public static List<Group> getGroupsByRole(MasterMetaStorage storage, Role role) {
		return storage.getAllGroups().stream().filter(g -> g.getRoles().contains(role)).collect(Collectors.toList());
	}

	/**
	 * Checks if an execution is allowed to be downloaded by a user.
	 * This checks all used {@link DatasetId}s for the {@link Ability.DOWNLOAD} on the user.
	 */
	public static void authorizeDownloadDatasets(@NonNull User user, @NonNull ManagedExecution exec) {
		List<Permission> perms = exec.getUsedNamespacedIds().stream()
			.map(NamespacedId::getDataset)
			.distinct()
			.map(d -> DatasetPermission.onInstance(Ability.DOWNLOAD, d))
			.map(Permission.class::cast)
			.collect(Collectors.toList());
		user.checkPermissions(perms);
	}
	
	/**
	 * Checks if a {@link Visitable} has only references to {@link Dataset}s a user is allowed to read.
	 * This checks all used {@link DatasetId}s for the {@link Ability.READ} on the user.
	 */
	public static void authorizeReadDatasets(@NonNull User user, @NonNull Visitable visitable) {
		NamespacedIdCollector collector = new NamespacedIdCollector();
		visitable.visit(collector);
		List<Permission> perms = collector.getIds().stream()
			.map(NamespacedId::getDataset)
			.distinct()
			.map(d -> DatasetPermission.onInstance(Ability.READ, d))
			.map(Permission.class::cast)
			.collect(Collectors.toList());
		user.checkPermissions(perms);
	}
}
