import { Container, Flex } from "@mantine/core";
import classes from "./BuyMeCoffee.module.css";

const BuyMeCoffee = () => {
  return (
    <Flex w="100%" justify="center" ta="center" p={10}>
      <a className={classes.coffee} href="https://buymeacoffee.com/nabilmansour" target="_blank">
        <h1 className={classes.coffeeInner}>
          ☕️ Buy me coffee ツ
        </h1>
      </a>
    </Flex>
  );
};

export default BuyMeCoffee;