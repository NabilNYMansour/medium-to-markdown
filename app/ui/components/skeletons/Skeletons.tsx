import {
  Card,
} from '@mantine/core';
import classes from './Skeletons.module.css';
import cx from 'clsx';

export function EditorSkeleton() {
  const effect = classes.shimmerEffect;
  return (
    <Card withBorder m={0} p={0}>
      <div className={cx(effect, classes.toolbar)} />
      <div className={classes.main}>
        <div className={classes.editor}>
          <div className={cx(effect, classes.code)} />
        </div>
        <div className={classes.preview} />
      </div>
    </Card>
  );
}