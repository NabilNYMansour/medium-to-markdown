"use client";

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { ActionIcon, Button, Container, Flex, TextInput, useComputedColorScheme } from '@mantine/core';
import classes from "./MarkdownRenderer.module.css"
import { useEffect, useState } from 'react';
import { IconClearAll, IconSend2 } from '@tabler/icons-react';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { EditorSkeleton } from './skeletons/Skeletons';
import { IconClipboard, IconCheck } from '@tabler/icons-react';
import { AiFillGithub } from "react-icons/ai";


const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <EditorSkeleton /> // Loading component (like Suspense skeleton)
  }
);

const MarkdownActions = (
  { markdown, setMarkdown, copied, setCopied, fullscreen, setFullscreen, isPhone }: {
    markdown: string, setMarkdown: (value: string) => void,
    copied: boolean, setCopied: (value: boolean) => void,
    fullscreen: boolean, setFullscreen: (value: boolean) => void,
    isPhone: boolean | undefined
  }
) => {
  const disabled = markdown.length === 0;
  return (
    <Flex gap={10} mb={10}>
      {isPhone ?
        <>
          <ActionIcon
            size='lg' variant='filled'
            color={copied ? 'green' : 'blue'}
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(markdown);
            }}
            disabled={disabled}>
            {copied ? <IconCheck stroke={2} /> : <IconClipboard stroke={2} />}
          </ActionIcon>
          <ActionIcon
            size='lg' variant='default'
            onClick={() => setMarkdown('')}
            disabled={disabled}>
            <IconClearAll stroke={2} />
          </ActionIcon>
        </>
        :
        <>
          <Button
            size='xs' variant='filled'
            color={copied ? 'green' : 'blue'}
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(markdown);
            }}
            disabled={disabled}
            leftSection={copied ? <IconCheck stroke={2} /> : <IconClipboard stroke={2} />}>
            {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
          </Button>
          <Button
            size='xs' variant='default'
            onClick={() => setMarkdown('')}
            disabled={disabled}
            leftSection={<IconClearAll stroke={2} />}>
            Clear Markdown
          </Button>
        </>
      }
    </Flex>
  );
}

export default function MarkdownRenderer({ toMarkdownAction }: { toMarkdownAction: (url: string) => Promise<string> }) {
  const [url, setUrl] = useState("https://medium.com/@nabilnymansour/cone-marching-in-three-js-6d54eac17ad4");

  const [markdown, setMarkdown] = useState('');
  const [debouncedMarkdown] = useDebouncedValue(markdown, 200);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [loading, setLoading] = useState(false);

  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isPhone = useMediaQuery('(max-width: 56.25em)');

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    setCopied(false);
  }, [markdown, url, loading]);

  return (
    <Flex justify='flex-start' direction="column" align="center" w="100%">
      <form
        action={async () => {
          const content = await toMarkdownAction(url);
          setLoading(false);
          setMarkdown(content);
        }}
        onSubmit={() => setLoading(true)}>
        <Flex justify='center' align="center" miw="50vw" p={25} gap={25} direction="column">
          <TextInput
            w="100%" variant='subtle' size='xl'
            placeholder="Enter a medium article url"
            value={url} type='url'
            onChange={(event) => setUrl(event.currentTarget.value)}
            className={classes.input}
            rightSection={
              <ActionIcon
                size='xl' type="submit" variant='filled'
                loading={loading}>
                <IconSend2 stroke={1.5} />
              </ActionIcon>
            }
          />
        </Flex>
      </form>
      <Container size="xl" w="100%">
        <div className={classes.markdownWrapper}>
          <MarkdownActions
            markdown={debouncedMarkdown} setMarkdown={setMarkdown}
            copied={copied} setCopied={setCopied}
            fullscreen={fullscreen} setFullscreen={setFullscreen}
            isPhone={isPhone} />
          <MarkdownEditor
            className={classes.markdownEditor}
            height='60vh'
            toolbarsFilter={(tool: any) => tool?.name === 'preview'}
            value={debouncedMarkdown} onChange={(value) => setMarkdown(value)}
            visible enableScroll previewWidth={isPhone ? "100%" : "50%"} />
        </div>
      </Container>
    </Flex>
  );
}
