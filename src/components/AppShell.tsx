import { Button, Text, Tooltip } from '@fluentui/react-components'
import {
  Navigation24Regular,
  WeatherMoon24Regular,
  WeatherSunny24Regular,
} from '@fluentui/react-icons'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { colorSchemeAtom, sidebarOpenAtom } from '../state/atoms'
import { AppSidebar } from './AppSidebar'

export function AppShell() {
  const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom)
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const pathname = useRouterState({ select: state => state.location.pathname })
  const pathSegments = pathname.split('/').filter(Boolean).map(decodeURIComponent)
  const pageTitle = pathSegments.length >= 2
    ? `${pathSegments[0]}/${pathSegments[1]}`
    : 'Latest releases'

  return (
    <div className="app-shell">
      <button
        type="button"
        className={`sidebar-scrim ${sidebarOpen ? 'sidebar-scrim-visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close navigation"
        aria-hidden={!sidebarOpen}
        tabIndex={sidebarOpen ? 0 : -1}
      />

      <aside className={`app-sidebar ${sidebarOpen ? 'app-sidebar-open' : ''}`}>
        <AppSidebar />
      </aside>

      <div className="app-main">
        <header className="topbar">
          <Tooltip content="Open navigation" relationship="label">
            <Button
              className="menu-button"
              appearance="subtle"
              icon={<Navigation24Regular />}
              onClick={() => setSidebarOpen(true)}
            />
          </Tooltip>

          <Text
            as="h1"
            className="topbar-title"
            size={400}
            weight="semibold"
            truncate
            wrap={false}
          >
            {pageTitle}
          </Text>

          <Tooltip
            content={`Use ${colorScheme === 'dark' ? 'light' : 'dark'} theme`}
            relationship="label"
          >
            <Button
              appearance="subtle"
              icon={colorScheme === 'dark' ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
              onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
            />
          </Tooltip>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
