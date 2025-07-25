/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuthRequestPasswordResetRouteImport } from './routes/auth/requestPasswordReset'
import { Route as AuthAuthRouteImport } from './routes/auth/_auth'
import { Route as ProtectedAuthRouteImport } from './routes/_protected/_auth'
import { Route as AuthAuthRegisterRouteImport } from './routes/auth/_auth.register'
import { Route as AuthAuthLoginRouteImport } from './routes/auth/_auth.login'
import { Route as ProtectedAuthPromptRouteImport } from './routes/_protected/_auth.prompt'
import { Route as ProtectedAuthDashboardRouteImport } from './routes/_protected/_auth.dashboard'

const AuthRouteImport = createFileRoute('/auth')()

const AuthRoute = AuthRouteImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthRequestPasswordResetRoute =
  AuthRequestPasswordResetRouteImport.update({
    id: '/requestPasswordReset',
    path: '/requestPasswordReset',
    getParentRoute: () => AuthRoute,
  } as any)
const AuthAuthRoute = AuthAuthRouteImport.update({
  id: '/_auth',
  getParentRoute: () => AuthRoute,
} as any)
const ProtectedAuthRoute = ProtectedAuthRouteImport.update({
  id: '/_protected/_auth',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthAuthRegisterRoute = AuthAuthRegisterRouteImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => AuthAuthRoute,
} as any)
const AuthAuthLoginRoute = AuthAuthLoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => AuthAuthRoute,
} as any)
const ProtectedAuthPromptRoute = ProtectedAuthPromptRouteImport.update({
  id: '/prompt',
  path: '/prompt',
  getParentRoute: () => ProtectedAuthRoute,
} as any)
const ProtectedAuthDashboardRoute = ProtectedAuthDashboardRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => ProtectedAuthRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/auth': typeof AuthAuthRouteWithChildren
  '/auth/requestPasswordReset': typeof AuthRequestPasswordResetRoute
  '/dashboard': typeof ProtectedAuthDashboardRoute
  '/prompt': typeof ProtectedAuthPromptRoute
  '/auth/login': typeof AuthAuthLoginRoute
  '/auth/register': typeof AuthAuthRegisterRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/auth': typeof AuthAuthRouteWithChildren
  '/auth/requestPasswordReset': typeof AuthRequestPasswordResetRoute
  '/dashboard': typeof ProtectedAuthDashboardRoute
  '/prompt': typeof ProtectedAuthPromptRoute
  '/auth/login': typeof AuthAuthLoginRoute
  '/auth/register': typeof AuthAuthRegisterRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/_protected/_auth': typeof ProtectedAuthRouteWithChildren
  '/auth': typeof AuthRouteWithChildren
  '/auth/_auth': typeof AuthAuthRouteWithChildren
  '/auth/requestPasswordReset': typeof AuthRequestPasswordResetRoute
  '/_protected/_auth/dashboard': typeof ProtectedAuthDashboardRoute
  '/_protected/_auth/prompt': typeof ProtectedAuthPromptRoute
  '/auth/_auth/login': typeof AuthAuthLoginRoute
  '/auth/_auth/register': typeof AuthAuthRegisterRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/auth'
    | '/auth/requestPasswordReset'
    | '/dashboard'
    | '/prompt'
    | '/auth/login'
    | '/auth/register'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/auth'
    | '/auth/requestPasswordReset'
    | '/dashboard'
    | '/prompt'
    | '/auth/login'
    | '/auth/register'
  id:
    | '__root__'
    | '/'
    | '/_protected/_auth'
    | '/auth'
    | '/auth/_auth'
    | '/auth/requestPasswordReset'
    | '/_protected/_auth/dashboard'
    | '/_protected/_auth/prompt'
    | '/auth/_auth/login'
    | '/auth/_auth/register'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ProtectedAuthRoute: typeof ProtectedAuthRouteWithChildren
  AuthRoute: typeof AuthRouteWithChildren
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/requestPasswordReset': {
      id: '/auth/requestPasswordReset'
      path: '/requestPasswordReset'
      fullPath: '/auth/requestPasswordReset'
      preLoaderRoute: typeof AuthRequestPasswordResetRouteImport
      parentRoute: typeof AuthRoute
    }
    '/auth/_auth': {
      id: '/auth/_auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthAuthRouteImport
      parentRoute: typeof AuthRoute
    }
    '/_protected/_auth': {
      id: '/_protected/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof ProtectedAuthRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/_auth/register': {
      id: '/auth/_auth/register'
      path: '/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof AuthAuthRegisterRouteImport
      parentRoute: typeof AuthAuthRoute
    }
    '/auth/_auth/login': {
      id: '/auth/_auth/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthAuthLoginRouteImport
      parentRoute: typeof AuthAuthRoute
    }
    '/_protected/_auth/prompt': {
      id: '/_protected/_auth/prompt'
      path: '/prompt'
      fullPath: '/prompt'
      preLoaderRoute: typeof ProtectedAuthPromptRouteImport
      parentRoute: typeof ProtectedAuthRoute
    }
    '/_protected/_auth/dashboard': {
      id: '/_protected/_auth/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof ProtectedAuthDashboardRouteImport
      parentRoute: typeof ProtectedAuthRoute
    }
  }
}

interface ProtectedAuthRouteChildren {
  ProtectedAuthDashboardRoute: typeof ProtectedAuthDashboardRoute
  ProtectedAuthPromptRoute: typeof ProtectedAuthPromptRoute
}

const ProtectedAuthRouteChildren: ProtectedAuthRouteChildren = {
  ProtectedAuthDashboardRoute: ProtectedAuthDashboardRoute,
  ProtectedAuthPromptRoute: ProtectedAuthPromptRoute,
}

const ProtectedAuthRouteWithChildren = ProtectedAuthRoute._addFileChildren(
  ProtectedAuthRouteChildren,
)

interface AuthAuthRouteChildren {
  AuthAuthLoginRoute: typeof AuthAuthLoginRoute
  AuthAuthRegisterRoute: typeof AuthAuthRegisterRoute
}

const AuthAuthRouteChildren: AuthAuthRouteChildren = {
  AuthAuthLoginRoute: AuthAuthLoginRoute,
  AuthAuthRegisterRoute: AuthAuthRegisterRoute,
}

const AuthAuthRouteWithChildren = AuthAuthRoute._addFileChildren(
  AuthAuthRouteChildren,
)

interface AuthRouteChildren {
  AuthAuthRoute: typeof AuthAuthRouteWithChildren
  AuthRequestPasswordResetRoute: typeof AuthRequestPasswordResetRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthAuthRoute: AuthAuthRouteWithChildren,
  AuthRequestPasswordResetRoute: AuthRequestPasswordResetRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ProtectedAuthRoute: ProtectedAuthRouteWithChildren,
  AuthRoute: AuthRouteWithChildren,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
