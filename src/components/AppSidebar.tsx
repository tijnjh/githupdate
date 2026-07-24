import { Avatar, Button, Field, Input, MessageBar, MessageBarBody, Nav, NavItem, NavSectionHeader, Spinner, Text, Tooltip } from '@fluentui/react-components'
import { ArrowClockwise20Regular, Dismiss24Regular, Home20Regular, Search20Regular } from '@fluentui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { getErrorMessage } from '../lib/errors'
import { starredReposQuery } from '../lib/queries'
import { sidebarOpenAtom, starredReposAtom, userAtom } from '../state/atoms'

export function AppSidebar() {
  const [user, setUser] = useAtom(userAtom)
  const [repositories, setRepositories] = useAtom(starredReposAtom)
  const setSidebarOpen = useSetAtom(sidebarOpenAtom)
  const [filter, setFilter] = useState('')
  const normalizedUser = user.trim()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: state => state.location.pathname })

  const starredQuery = useQuery({
    ...starredReposQuery(normalizedUser),
    enabled: false,
  })

  useEffect(() => {
    if (starredQuery.data) {
      setRepositories(starredQuery.data)
    }
  }, [setRepositories, starredQuery.data])

  const normalizedFilter = filter.trim().toLocaleLowerCase()
  const filteredRepositories = normalizedFilter
    ? repositories.filter(repo =>
        `${repo.owner}/${repo.name}`
          .toLocaleLowerCase()
          .includes(normalizedFilter),
      )
    : repositories

  const closeSidebar = () => setSidebarOpen(false)
  const loadStarredRepositories = () => {
    if (!normalizedUser || starredQuery.isFetching) {
      return
    }
    void starredQuery.refetch()
  }

  return (
    <div className="sidebar-content">
      <Tooltip content="Close navigation" relationship="label">
        <Button
          className="sidebar-close"
          appearance="subtle"
          icon={<Dismiss24Regular />}
          onClick={closeSidebar}
        />
      </Tooltip>

      <Nav
        density="small"
        selectedValue={pathname === '/' ? '/' : ''}
        aria-label="Primary navigation"
      >
        <NavItem
          href="/"
          value="/"
          icon={<Home20Regular />}
          onClick={(event) => {
            event.preventDefault()
            closeSidebar()
            void navigate({ to: '/' })
          }}
        >
          Latest releases
        </NavItem>
      </Nav>

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

      <Nav
        className="repository-nav"
        density="small"
        selectedValue={pathname}
        aria-label="Starred repositories"
      >
        <NavSectionHeader>Repositories</NavSectionHeader>

        {filteredRepositories.map(({ owner, name }) => (
          <NavItem
            key={`${owner}/${name}`}
            href={`/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`}
            value={`/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`}
            title={`${owner}/${name}`}
            onClick={(event) => {
              event.preventDefault()
              closeSidebar()
              void navigate({
                to: '/$owner/$name',
                params: { owner, name },
              })
            }}
          >
            <Text className="repository-name" size={200} truncate wrap={false}>
              {owner}
              /
              {name}
            </Text>
          </NavItem>
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
      </Nav>
    </div>
  )
}
