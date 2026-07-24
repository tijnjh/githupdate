import type { Release, Repo } from '../types'
import {
  Badge,
  Button,
  Card,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  OverlayDrawer,
  Text,
  Tooltip,
} from '@fluentui/react-components'
import {
  ArrowRight16Regular,
  Calendar20Regular,
  Code20Regular,
  Dismiss24Regular,
  Open20Regular,
  Person20Regular,
} from '@fluentui/react-icons'
import { Link } from '@tanstack/react-router'
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
  const parsedTag = parseTag(release.tag)
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

  const summary = (
    <div className="release-summary">
      <div className="release-repository">
        <Text weight="semibold">{meta.owner}</Text>
        <ArrowRight16Regular aria-hidden="true" />
        <Text weight="semibold">{meta.name}</Text>
      </div>

      <div className="release-title-row">
        <Badge color={badgeColor} appearance={isPreview ? 'tint' : 'filled'}>
          {parsedTag?.version ?? release.tag}
        </Badge>
        {release.name
          ? (
              <Text className="release-name" weight="semibold">
                {release.name}
              </Text>
            )
          : null}
      </div>

      <div className="release-meta">
        <span>
          <Calendar20Regular aria-hidden="true" />
          {relativeDate(release.publishedAt)}
        </span>
        {release.author
          ? (
              <span>
                <Person20Regular aria-hidden="true" />
                {release.author}
              </span>
            )
          : null}
      </div>
    </div>
  )

  return (
    <>
      <button type="button" className="release-card-trigger" onClick={() => setDrawerOpen(true)}>
        <Card className="release-card" appearance="filled-alternative">
          {summary}
        </Card>
      </button>

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
          <div className="drawer-summary">{summary}</div>
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
                <Link
                  to="/$owner/$name"
                  params={{ owner: meta.owner, name: meta.name }}
                  className="fluent-link-button"
                  onClick={() => setDrawerOpen(false)}
                >
                  <Code20Regular />
                  All releases
                </Link>
              )
            : null}
        </DrawerFooter>
      </OverlayDrawer>
    </>
  )
}
