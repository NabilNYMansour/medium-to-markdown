"use client";

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { ActionIcon, Button, Container, Flex, TextInput, useComputedColorScheme } from '@mantine/core';
import classes from "./MarkdownRenderer.module.css"
import { useEffect, useState } from 'react';
import { IconBulb, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { EditorSkeleton } from './skeletons/Skeletons';
import { IconClipboard, IconCheck } from '@tabler/icons-react';


const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <EditorSkeleton /> // Loading component (like Suspense skeleton)
  }
);

const UrlSearchForm = (
  { url, setUrl, toMarkdownAction, setMarkdown, setError, error, setLoading, loading, clearUrl }:
    {
      url: string, setUrl: (value: string) => void,
      toMarkdownAction: (url: string) => Promise<{ error: boolean, markdown: string }>,
      setMarkdown: (value: string) => void,
      setError: (value: { error: boolean, errorMsg: string }) => void,
      error: { error: boolean, errorMsg: string }, loading: boolean,
      setLoading: (value: boolean) => void,
      clearUrl: () => void
    }
) => {
  return (
    <form
      action={async () => {
        const content = await toMarkdownAction(url);
        setLoading(false);
        if (content.error) {
          setError({ error: true, errorMsg: content.markdown });
          return;
        }
        setError({ error: false, errorMsg: "" });
        setMarkdown(content.markdown);
      }}
      onSubmit={() => setLoading(true)}>
      <Flex justify='center' align="center" miw="50vw" p={25} gap={25} direction="column">
        <TextInput
          classNames={{ error: classes.error }}
          w="100%" variant='default' size='xl'
          placeholder="Enter a medium article url"
          value={url} type='url'
          onChange={(event) => setUrl(event.currentTarget.value)}
          className={classes.input}
          leftSection={
            <ActionIcon
              size='xl' type="submit" variant='default'
              loading={loading}>
              <IconSearch stroke={1.5} />
            </ActionIcon>
          }
          rightSection={
            <ActionIcon
              radius="xl"
              size='xl' variant='subtle'
              onClick={clearUrl}>
              <IconX stroke={1.5} />
            </ActionIcon>
          }
          error={error.error ? error.errorMsg : false}
        />
      </Flex>
    </form>
  );
}

const MarkdownActions = (
  { markdown, setMarkdown, copied, setCopied, setUrl, isPhone }: {
    markdown: string, setMarkdown: (value: string) => void,
    copied: boolean, setCopied: (value: boolean) => void,
    setUrl: (value: string) => void, isPhone: boolean | undefined
  }
) => {
  const copy = () => {
    setCopied(true);
    navigator.clipboard.writeText(markdown);
  }
  return (
    <Flex gap={10} mb={10} align="flex-end">
      {isPhone ?
        <>
          <ActionIcon
            onClick={copy}
            size='lg' variant='filled'
            color={copied ? 'green' : 'blue'}
            disabled={markdown.length === 0}>
            {copied ? <IconCheck stroke={2} /> : <IconClipboard stroke={2} />}
          </ActionIcon>
          <ActionIcon
            size='lg' variant='default'
            onClick={() => setMarkdown('')}
            disabled={markdown.length === 0}>
            <IconTrash stroke={2} />
          </ActionIcon>
        </>
        :
        <>
          <Button
            onClick={copy}
            size='xs' variant='filled'
            color={copied ? 'green' : 'blue'}
            disabled={markdown.length === 0}
            leftSection={copied ? <IconCheck stroke={2} /> : <IconClipboard stroke={2} />}>
            {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
          </Button>
          <Button
            size='xs' variant='default'
            onClick={() => setMarkdown('')}
            disabled={markdown.length === 0}
            leftSection={<IconTrash stroke={2} />}>
            Clear Markdown
          </Button>
        </>
      }
      <ActionIcon
        ml="auto" color='yellow'
        size='lg' variant='filled'
        onClick={() => setUrl("https://medium.com/@nabilnymansour/cone-marching-in-three-js-6d54eac17ad4")}>
        <IconBulb stroke={2} />
      </ActionIcon>
    </Flex>
  );
}

export default function MarkdownRenderer({ toMarkdownAction }:
  {
    toMarkdownAction: (url: string) => Promise<{ error: boolean, markdown: string }>
  }
) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState({ error: false, errorMsg: "" });
  const [markdown, setMarkdown] = useState('');
  const [debouncedMarkdown] = useDebouncedValue(markdown, 200);
  const [copied, setCopied] = useState(false);

  const [loading, setLoading] = useState(false);

  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isPhone = useMediaQuery('(max-width: 56.25em)');

  const clearUrl = () => {
    setUrl("");
    setError({ error: false, errorMsg: "" });
  }

  useEffect(() => {
    const savedMarkdown = localStorage.getItem("markdown");
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }

    const savedUrl = localStorage.getItem("url");
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-mode', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (copied) {
      setCopied(false);
    }
  }, [markdown, url, loading]);

  useEffect(() => {
    localStorage.setItem("markdown", debouncedMarkdown);
  }, [debouncedMarkdown]);

  useEffect(() => {
    if (error.error){
      setError({ error: false, errorMsg: "" });
    }
    localStorage.setItem("url", url);
  }, [url]);

  return (
    <Flex justify='flex-start' direction="column" align="center" w="100%">
      <UrlSearchForm
        url={url} setUrl={setUrl}
        toMarkdownAction={toMarkdownAction}
        setMarkdown={setMarkdown}
        setError={setError} error={error}
        loading={loading} setLoading={setLoading}
        clearUrl={clearUrl} />
      <Container size="xl" w="100%">
        <div className={classes.markdownWrapper}>
          <MarkdownActions
            markdown={debouncedMarkdown} setMarkdown={setMarkdown}
            copied={copied} setCopied={setCopied} setUrl={setUrl}
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
