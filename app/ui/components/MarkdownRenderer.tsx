"use client";

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { ActionIcon, Button, Container, Flex, Modal, Text, TextInput, Tooltip, useComputedColorScheme } from '@mantine/core';
import classes from "./MarkdownRenderer.module.css"
import { useEffect, useState } from 'react';
import { IconBulb, IconDownload, IconRefresh, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { useDebouncedValue, useDisclosure, useMediaQuery } from '@mantine/hooks';
import { EditorSkeleton } from './skeletons/Skeletons';
import { IconClipboard, IconCheck } from '@tabler/icons-react';
import { INIT_MARKDOWN } from './Constants';


const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <EditorSkeleton /> // Loading component (like Suspense skeleton)
  }
);

function UrlSearchForm({ url, setUrl, toMarkdownAction, setMarkdown, setError, error, setLoading, loading, clearUrl }: {
  url: string, setUrl: (value: string) => void,
  toMarkdownAction: (url: string) => Promise<{ error: boolean, markdown: string }>,
  setMarkdown: (value: string) => void,
  setError: (value: { error: boolean, errorMsg: string }) => void,
  error: { error: boolean, errorMsg: string }, loading: boolean,
  setLoading: (value: boolean) => void,
  clearUrl: () => void
}) {
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
            <Tooltip withArrow openDelay={750} offset={5}
              label={<Text fz="xs" lh="md">Search</Text>}>
              <ActionIcon
                size='xl' type="submit" variant='default'
                loading={loading}>
                <IconSearch stroke={1.5} />
              </ActionIcon>
            </Tooltip>}
          rightSection={
            <Tooltip withArrow openDelay={750} offset={5}
              label={<Text fz="xs" lh="md">Clear URL</Text>}>
              <ActionIcon
                radius="xl"
                size='xl' variant='subtle'
                onClick={clearUrl}>
                <IconX stroke={1.5} />
              </ActionIcon>
            </Tooltip>}
          error={error.error ? error.errorMsg : false}
        />
      </Flex>
    </form>
  );
}

const downloadMarkdown = (markdown: string) => {
  const fileName = "medium.md";
  const blob = new Blob([markdown], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function MarkdownActions({ markdown, setMarkdown, copied, setCopied, setUrl, openReset, isPhone }: {
  markdown: string, setMarkdown: (value: string) => void,
  copied: boolean, setCopied: (value: boolean) => void,
  setUrl: (value: string) => void, openReset: () => void, isPhone: boolean | undefined
}) {
  const copy = () => {
    setCopied(true);
    navigator.clipboard.writeText(markdown);
  }

  const disabled = markdown.length === 0;

  const copyProps = {
    onClick: copy,
    variant: 'filled',
    color: copied ? 'green' : 'blue',
    disabled: disabled,
  };

  const copyIcon = copied ? <IconCheck size="1.5em" stroke={2} /> : <IconClipboard size="1.5em" stroke={2} />;
  const copyText = copied ? "Copied to Clipboard" : "Copy to Clipboard";

  const downloadProps = {
    onClick: () => downloadMarkdown(markdown),
    disabled: disabled,
  }

  const clearProps = {
    variant: 'default',
    onClick: () => setMarkdown(''),
    disabled: disabled,
  }

  return (
    <Flex gap={10} mb={10} align="flex-end">
      {isPhone ?
        <>
          <Tooltip withArrow openDelay={750}
            label={<Text fz="xs" lh="md">Copy Markdown</Text>}>
            <ActionIcon size='lg' {...copyProps}>
              {copyIcon}
            </ActionIcon>
          </Tooltip>

          <Tooltip withArrow openDelay={750}
            label={<Text fz="xs" lh="md">Download Markdown</Text>}>
            <ActionIcon size='lg'{...downloadProps}>
              <IconDownload size="1.5em" stroke={2} />
            </ActionIcon>
          </Tooltip>

          <Tooltip withArrow openDelay={750}
            label={<Text fz="xs" lh="md">Clear Markdown</Text>}>
            <ActionIcon size='lg'{...clearProps}>
              <IconTrash size="1.5em" stroke={2} />
            </ActionIcon>
          </Tooltip>
        </>
        :
        <>
          <Button size='xs' {...copyProps} leftSection={copyIcon}>
            {copyText}
          </Button>
          <Button size='xs' {...downloadProps} leftSection={<IconDownload size="1.5em" stroke={2} />}>
            Download Markdown
          </Button>
          <Button size='xs'{...clearProps} leftSection={<IconTrash size="1.5em" stroke={2} />}>
            Clear Markdown
          </Button>
        </>
      }

      <Tooltip withArrow openDelay={750}
        label={<Text fz="xs" lh="md">Example URL</Text>}>
        <ActionIcon
          ml="auto" color='yellow'
          size='lg' variant='filled'
          onClick={() => setUrl("https://medium.com/@nabilnymansour/cone-marching-in-three-js-6d54eac17ad4")}>
          <IconBulb stroke={2} />
        </ActionIcon>
      </Tooltip>

      <Tooltip withArrow openDelay={750}
        label={<Text fz="xs" lh="md">Reset Scene</Text>}>
        <ActionIcon
          color='red'
          size='lg' variant='filled'
          onClick={openReset}>
          <IconRefresh stroke={2} />
        </ActionIcon>
      </Tooltip>

    </Flex >
  );
}

export default function MarkdownRenderer({ toMarkdownAction }: {
  toMarkdownAction: (url: string) => Promise<{ error: boolean, markdown: string }>
}) {
  const [firstRender, setFirstRender] = useState(true);
  const [url, setUrl] = useState("");
  const [error, setError] = useState({ error: false, errorMsg: "" });
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const [debouncedMarkdown] = useDebouncedValue(markdown, 200);
  const [copied, setCopied] = useState(false);

  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isPhone = useMediaQuery('(max-width: 56.25em)');

  const [resetIsOpen, resetActions] = useDisclosure(false);

  useEffect(() => {
  }, [firstRender])

  useEffect(() => {
    const savedMarkdown = localStorage.getItem("markdown");
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }

    const savedUrl = localStorage.getItem("url");
    if (savedUrl) {
      setUrl(savedUrl);
    }

    const hasRenderedBefore = localStorage.getItem("hasRenderedBefore");
    if (!hasRenderedBefore) {
      localStorage.setItem("hasRenderedBefore", "true");
      setMarkdown(INIT_MARKDOWN);
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
    if (error.error) {
      setError({ error: false, errorMsg: "" });
    }
    localStorage.setItem("url", url);
  }, [url]);

  const clearUrl = () => {
    setUrl("");
    setError({ error: false, errorMsg: "" });
  }

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
            openReset={resetActions.open} isPhone={isPhone} />
          <MarkdownEditor
            className={classes.markdownEditor}
            height='60vh'
            toolbarsFilter={(tool: any) => tool?.name === 'preview'}
            value={debouncedMarkdown} onChange={(value) => setMarkdown(value)}
            visible enableScroll previewWidth={isPhone ? "100%" : "50%"} />
        </div>
      </Container>

      <Modal ta="center" opened={resetIsOpen} onClose={resetActions.close}
        title={<b>Reset Markdown?</b>} centered>
        Clear the markdown content and the url?
        <Flex justify="center" mt={20} gap={10}>
          <Button color="red" variant="filled"
            onClick={() => {
              setMarkdown("");
              setUrl("");
              setError({ error: false, errorMsg: "" });
              resetActions.close();
            }}>
            Reset
          </Button>
          <Button onClick={resetActions.close} variant="light">Cancel</Button>
        </Flex>
      </Modal>
    </Flex>
  );
}
