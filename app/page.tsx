import getMediumMD from "@/lib/utils.js";
import MarkdownRenderer from './ui/components/MarkdownRenderer';
import { Badge, Container, Flex } from "@mantine/core";
import { SiGithub, SiNextdotjs } from "react-icons/si";
import classes from './globals.module.css';
import Link from "next/link";
import BuyMeCoffee from "./ui/components/BuyMeCoffee";
import { DEVELOPER_URL, GITHUB_URL } from "./ui/components/Constants";

const toMarkdownAction = async (url: string) => {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return await getMediumMD(url) as { error: boolean, markdown: string };
};

export default function HomePage() {
  return <Flex direction="column" justify="center" w="100%">
    <MarkdownRenderer toMarkdownAction={toMarkdownAction} />
    <Container size="lg">
      <h2>How does this work?</h2>
      <p>
        This is a simple web app that converts a <b>Medium</b> article to <b>Markdown</b>. Just paste the URL of the article you want to convert and click the "send" button. The app will fetch the article, convert it to Markdown, and display it for you to copy.
      </p>
      <h2>Why?</h2>
      <div>
        I wanted to convert some of my Medium articles to Markdown so I could publish them on
        my <Link className={classes.link} href={`${DEVELOPER_URL}/articles`}>personal website</Link>.
        I couldn't find a tool that did this in an easy way, so I built one myself.
      </div>
      <h2>How?</h2>
      <div style={{ lineHeight: "190%" }}>
        This app uses <Badge size="lg" color="black" leftSection={<SiNextdotjs />}>Next.js</Badge> for the frontend
        and <a className={classes.link}
          href="https://github.com/mixmark-io/turndown" target="_blank" rel="noopener noreferrer">
          Turndown
        </a> for the conversion from HTML to Markdown. You can also find the code for it by clicking
        the <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={classes.link}
        > <Badge size="lg" color="gray" leftSection={<SiGithub />}>GITHUB</Badge></a> link in the header.
      </div>
      <h2>Any Issues?</h2>
      <div>
        iframes and other embedded content are not supported. Instead you will see
        <code>[other]&lt;caption&gt;[\other]</code> in its place in the Markdown output.
      </div>
      <h2>Can I support you?</h2>
      <div>
        Sure! You can support me by sharing this tool with your friends or by contributing to the codebase on GitHub.
        And if anything, you can always
      </div>
      <BuyMeCoffee />
    </Container>
  </Flex>
}
