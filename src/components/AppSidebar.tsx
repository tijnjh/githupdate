import { Avatar, Button, Caption1, Field, Input, MessageBar, MessageBarBody, Spinner, Text, Tooltip } from '@fluentui/react-components'
import { ArrowClockwise20Regular, Dismiss24Regular, Home24Regular, Search20Regular, Star24Filled } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '../lib/errors'
import { starredReposQuery } from '../lib/queries'
import { sidebarOpenAtom, starredReposAtom, userAtom } from '../state/atoms'

export function AppSidebar() {
  const [user, setUser] = useAtom(userAtom)
  const [repositories, setRepositories] = useAtom(starredReposAtom)
  const setSidebarOpen = useSetAtom(sidebarOpenAtom)
  const [filter, setFilter] = useState('')
  const normalizedUser = user.trim()

  const starredQuery = useQuery({
    ...starredReposQuery(normalizedUser),
    enabled: false,
  })

  useEffect(() => {
    if (starredQuery.data) {
      setRepositories(starredQuery.data)
    }
  }, [setRepositories, starredQuery.data])

  const filteredRepositories = useMemo(() => {
    const normalizedFilter = filter.trim().toLocaleLowerCase()
    if (!normalizedFilter) {
      return repositories
    }

    return repositories.filter(repo =>
      `${repo.owner}/${repo.name}`
        .toLocaleLowerCase()
        .includes(normalizedFilter),
    )
  }, [filter, repositories])

  const closeSidebar = () => setSidebarOpen(false)
  const loadStarredRepositories = () => {
    if (!normalizedUser || starredQuery.isFetching) {
      return
    }
    void starredQuery.refetch()
  }

  return (
    <div className="sidebar-content">
      <div className="sidebar-brand">
        <div className="brand-mark" aria-hidden="true">
          <Star24Filled />
        </div>
        <div>
          <Text size={500} weight="semibold">
            Githupdate
          </Text>
        </div>
        <Tooltip content="Close navigation" relationship="label">
          <Button
            className="sidebar-close"
            appearance="subtle"
            icon={<Dismiss24Regular />}
            onClick={closeSidebar}
          />
        </Tooltip>
      </div>

      <nav className="primary-nav" aria-label="Primary navigation">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: 'nav-link nav-link-active' }}
          inactiveProps={{ className: 'nav-link' }}
          onClick={closeSidebar}
        >
          <Home24Regular />
          <span>Latest releases</span>
        </Link>
      </nav>

      <div className="sidebar-controls">
        <Field label="GitHub user">
          <Input
            value={user}
            onChange={(_, data) => {
              setUser(data.value)
              if (!data.value.trim()) {
                setRepositories([])
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                loadStarredRepositories()
              }
            }}
            contentBefore={<Avatar name={user || 'GitHub user'} size={20} />}
            contentAfter={(
              <Tooltip content="Load starred repositories" relationship="label">
                <Button
                  type="button"
                  size="small"
                  appearance="subtle"
                  icon={<ArrowClockwise20Regular />}
                  disabled={!normalizedUser || starredQuery.isFetching}
                  onClick={loadStarredRepositories}
                  aria-label="Load starred repositories"
                />
              </Tooltip>
            )}
            placeholder="octocat"
            aria-label="GitHub username"
          />
        </Field>

        <Field label="Filter repositories">
          <Input
            type="search"
            value={filter}
            onChange={(_, data) => setFilter(data.value)}
            contentBefore={<Search20Regular />}
            placeholder="Owner or repository"
            aria-label="Filter starred repositories"
          />
        </Field>
      </div>

      {starredQuery.isFetching
        ? (
            <div
              className="repo-loading"
              role="status"
              aria-label="Loading repositories"
            >
              <Spinner size="tiny" />
            </div>
          )
        : null}

      {starredQuery.isError
        ? (
            <MessageBar intent="error" className="sidebar-message">
              <MessageBarBody>{getErrorMessage(starredQuery.error)}</MessageBarBody>
            </MessageBar>
          )
        : null}

      <div className="repository-heading">
        <Caption1>Repositories</Caption1>
      </div>

      <nav className="repository-nav" aria-label="Starred repositories">
        {filteredRepositories.map(({ owner, name }) => (
          <Link
            key={`${owner}/${name}`}
            to="/$owner/$name"
            params={{ owner, name }}
            activeProps={{ className: 'repo-link repo-link-active' }}
            inactiveProps={{ className: 'repo-link' }}
            onClick={closeSidebar}
          >
            <span className="repo-owner">{owner}</span>
            <span className="repo-name">{name}</span>
          </Link>
        ))}

        {!starredQuery.isFetching
          && repositories.length > 0
          && filteredRepositories.length === 0
          ? (
              <Text className="sidebar-empty" size={200}>
                No matches
              </Text>
            )
          : null}
      </nav>
    </div>
  )
}
