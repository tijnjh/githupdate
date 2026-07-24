import type { Release, Repo } from '../types'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  OverlayDrawer,
  Text,
  Tooltip,
} from '@fluentui/react-components'
import {
  Code20Regular,
  Dismiss24Regular,
  Open20Regular,
} from '@fluentui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useMemo, useState } from 'react'
import { parseTag } from '../lib/tags'

interface ReleaseCardProps {
  release: Release
  meta: Repo
  showAllReleasesLink?: boolean
}

function relativeDate(date: string): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }
  catch {
    return date
  }
}

export function ReleaseCard({ release, meta, showAllReleasesLink = false }: ReleaseCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const parsedTag = parseTag(release.tag)
  const version = parsedTag?.version ?? release.tag
  const isPreview = parsedTag?.version.includes('-') || release.prerelease
  const releaseType = parsedTag?.releaseType
  const badgeColor = isPreview
    ? 'warning'
    : releaseType === 'major'
      ? 'brand'
      : releaseType === 'minor'
        ? 'informative'
        : 'subtle'

  const releaseBody = useMemo(() => {
    const html = release.markdown ? marked.parse(release.markdown, { async: false }) : release.html
    return DOMPurify.sanitize(html)
  }, [release.html, release.markdown])

  const githubUrl = `https://github.com/${encodeURIComponent(meta.owner)}/${encodeURIComponent(meta.name)}/releases/tag/${encodeURIComponent(release.tag)}`
  const releaseDetails = [
    release.name,
    relativeDate(release.publishedAt),
    release.author ? `by ${release.author}` : undefined,
  ].filter(Boolean).join(' · ')

  const summary = (
    <CardHeader
      className="release-card-header"
      image={<Code20Regular aria-hidden="true" />}
      header={(
        <Text weight="semibold" truncate wrap={false}>
          {meta.owner}
          /
          {meta.name}
        </Text>
      )}
      description={(
        <Text size={200} truncate wrap={false}>
          {releaseDetails}
        </Text>
      )}
      action={(
        <Badge
          className="release-version-badge"
          color={badgeColor}
          appearance={isPreview ? 'tint' : 'filled'}
          title={version}
        >
          <span className="release-version-label">{version}</span>
        </Badge>
      )}
    />
  )

  return (
    <>
      <Card
        appearance="filled-alternative"
        size="small"
        role="button"
        aria-label={`View ${meta.owner}/${meta.name} ${release.tag} release notes`}
        onClick={() => setDrawerOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setDrawerOpen(true)
          }
        }}
      >
        {summary}
      </Card>

      <OverlayDrawer
        className="release-drawer"
        position="end"
        size="medium"
        modalType="modal"
        open={drawerOpen}
        onOpenChange={(_, data) => setDrawerOpen(data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={(
              <Tooltip content="Close" relationship="label">
                <Button
                  appearance="subtle"
                  icon={<Dismiss24Regular />}
                  onClick={() => setDrawerOpen(false)}
                />
              </Tooltip>
            )}
          >
            {meta.owner}
            /
            {meta.name}
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody>
          <Card className="drawer-summary" appearance="outline" size="small">
            {summary}
          </Card>
          {/* eslint-disable-next-line react/dom-no-dangerously-set-innerhtml -- releaseBody is sanitized with DOMPurify. */}
          <div className="release-notes" dangerouslySetInnerHTML={{ __html: releaseBody }} />
        </DrawerBody>

        <DrawerFooter>
          <Button
            as="a"
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            appearance="primary"
            icon={<Open20Regular />}
          >
            GitHub
          </Button>

          {showAllReleasesLink
            ? (
                <Button
                  icon={<Code20Regular />}
                  onClick={() => {
                    setDrawerOpen(false)
                    void navigate({
                      to: '/$owner/$name',
                      params: { owner: meta.owner, name: meta.name },
                    })
                  }}
                >
                  All releases
                </Button>
              )
            : null}
        </DrawerFooter>
      </OverlayDrawer>
    </>
  )
}
