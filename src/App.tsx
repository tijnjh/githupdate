import { FluentProvider, teamsDarkTheme, webLightTheme } from '@fluentui/react-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { router } from './router'
import { colorSchemeAtom } from './state/atoms'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  const colorScheme = useAtomValue(colorSchemeAtom)

  return (
    <FluentProvider
      theme={colorScheme === 'dark' ? teamsDarkTheme : webLightTheme}
      applyStylesToPortals={false}
      className="fluent-root"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ queryClient }} />
      </QueryClientProvider>
    </FluentProvider>
  )
}
