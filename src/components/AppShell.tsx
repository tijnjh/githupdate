import { Button, Text, Tooltip } from '@fluentui/react-components'
import {
  Navigation24Regular,
  WeatherMoon24Regular,
  WeatherSunny24Regular,
} from '@fluentui/react-icons'
import { Outlet } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { colorSchemeAtom, sidebarOpenAtom } from '../state/atoms'
import { AppSidebar } from './AppSidebar'

export function AppShell() {
  const [colorScheme, setColorScheme] = useAtom(colorSchemeAtom)
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

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

          <div className="topbar-title">
            <Text size={400} weight="semibold">
              Releases
            </Text>
          </div>

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
