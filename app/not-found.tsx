import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './error.module.css';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>¯\_(ツ)_/¯</Title>
        <Text size="lg" ta="center" className={classes.description}>
          I don&apos;t know what you&apos;re looking for.
        </Text>
        <Group justify="center">
          <Link key="Home" href="/" className={classes.link}>
            <Button
              variant="white"
              size="md"
            >
              Back to Home
            </Button>
          </Link>
        </Group>
      </Container>
    </div>
  );
}