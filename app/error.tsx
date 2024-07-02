'use client';

import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './error.module.css';

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Oops... </Title>
        <Text size="lg" ta="center" className={classes.description}>
          Something went wrong. Don&apos;t worry, it&apos;s not from your end.
          <br />
          Try refreshing the page.
        </Text>
        <Group justify="center">
          <Button variant='white'
            size="md"
            onClick={
              () => reset()
            }>
            Refresh the page
          </Button>
        </Group>
      </Container>
    </div>
  );
}