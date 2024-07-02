import { Text } from '@mantine/core';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <div className={classes.footer}>
      <Text fz="xs" lh="md">
        © {new Date().getFullYear()} Nabil Mansour
      </Text>
    </div>
  );
}