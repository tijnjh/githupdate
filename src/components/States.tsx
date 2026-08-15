import {
  Button,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Text,
  Title2,
} from '@fluentui/react-components'
import { ArrowLeft20Regular, ErrorCircle24Regular } from '@fluentui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { getErrorMessage } from '../lib/errors'

export function RoutePending() {
  return (
    <div className="center-state" role="status">
      <Spinner size="large" label="Loading releases" />
    </div>
  )
}

export function ErrorState({ error }: { error: unknown }) {
  return (
    <MessageBar intent="error" layout="multiline">
      <MessageBarBody>
        <MessageBarTitle>Couldn’t load releases</MessageBarTitle>
        {getErrorMessage(error)}
      </MessageBarBody>
    </MessageBar>
  )
}

export function RouteError({ error }: { error: Error }) {
  const navigate = useNavigate()

  return (
    <div className="center-state">
      <ErrorCircle24Regular className="state-icon" />
      <Title2>That request didn’t work</Title2>
      <Text>{getErrorMessage(error)}</Text>
      <Button
        icon={<ArrowLeft20Regular />}
        onClick={() => void navigate({ to: '/' })}
      >
        Back to latest releases
      </Button>
    </div>
  )
}

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="center-state">
      <Title2>Page not found</Title2>
      <Text>The page you requested doesn’t exist.</Text>
      <Button appearance="primary" onClick={() => void navigate({ to: '/' })}>
        Go home
      </Button>
    </div>
  )
}
