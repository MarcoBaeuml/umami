import { hasPermission } from '@/lib/auth';
import { PERMISSIONS } from '@/lib/constants';
import type { Auth } from '@/lib/types';
import { getHook, getTeamUser, getWebsite } from '@/queries/prisma';

export async function canViewHook({ user }: Auth, hookId: string) {
  if (!user) {
    return false;
  }

  if (user.isAdmin) {
    return true;
  }

  const hook = await getHook(hookId);

  if (!hook) {
    return false;
  }

  return canViewWebsiteHooks({ user } as Auth, hook.websiteId);
}

export async function canViewWebsiteHooks({ user }: Auth, websiteId: string) {
  if (!user) {
    return false;
  }

  if (user.isAdmin) {
    return true;
  }

  const website = await getWebsite(websiteId);

  if (!website) {
    return false;
  }

  if (website.userId) {
    return user.id === website.userId;
  }

  if (website.teamId) {
    const teamUser = await getTeamUser(website.teamId, user.id);

    return !!teamUser;
  }

  return false;
}

export async function canCreateHook({ user }: Auth, websiteId: string) {
  if (!user) {
    return false;
  }

  if (user.isAdmin) {
    return true;
  }

  const website = await getWebsite(websiteId);

  if (!website) {
    return false;
  }

  if (website.userId) {
    return user.id === website.userId;
  }

  if (website.teamId) {
    const teamUser = await getTeamUser(website.teamId, user.id);

    return teamUser && hasPermission(teamUser.role, PERMISSIONS.websiteUpdate);
  }

  return false;
}

export async function canUpdateHook({ user }: Auth, hookId: string) {
  if (!user) {
    return false;
  }

  if (user.isAdmin) {
    return true;
  }

  const hook = await getHook(hookId);

  if (!hook) {
    return false;
  }

  const website = await getWebsite(hook.websiteId);

  if (!website) {
    return false;
  }

  if (website.userId) {
    return user.id === website.userId;
  }

  if (website.teamId) {
    const teamUser = await getTeamUser(website.teamId, user.id);

    return teamUser && hasPermission(teamUser.role, PERMISSIONS.websiteUpdate);
  }

  return false;
}

export async function canDeleteHook({ user }: Auth, hookId: string) {
  return canUpdateHook({ user } as Auth, hookId);
}
