import { Container } from "@mantine/core";
import classes from "./BuyMeCoffee.module.css";

const BuyMeCoffee = () => {
  return (
    <Container size="md" ta="center">
      <h3>If you enjoyed this article and would like to support me, consider to</h3>
      <a className={classes.coffee} href="https://buymeacoffee.com/nabilmansour" target="_blank">
        <h1 className={classes.coffeeInner}>
          ☕️ Buy me coffee ツ
        </h1>
      </a>
    </Container>
  );
};

export default BuyMeCoffee;