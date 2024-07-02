"use client";

import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Container, Flex } from '@mantine/core';
import { ThemeToggle } from '../components/ThemeToggle';
import classes from './Header.module.css';
import { useHover, useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import { AiFillGithub } from 'react-icons/ai';
import { DEVELOPER_URL, GITHUB_URL } from '../components/Constants';

const DeveloperAction =
  () => (<ActionIcon
    component="a"
    href={DEVELOPER_URL}
    target='_blank'
    color='#5a586f'
    variant='filled' size="xl">
    <Image style={{ borderRadius: "500px" }} src="/tree.ico" alt="Nabil Mansour" width={30} height={30} />
  </ActionIcon>);

const GitHubAction =
  () => (<ActionIcon
    component="a"
    href={GITHUB_URL}
    target='_blank'
    variant='default' size="xl">
    <AiFillGithub size="2em" />
  </ActionIcon>);

export function Header() {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [checkHeader, setCheckHeader] = useState(true);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const prevScrollVal = useRef(0);

  const isPhone = useMediaQuery('(max-width: 56.25em)');

  const headerHover = useHover();

  const handleScroll = () => {
    if (window.scrollY < 350) {
      setHeaderVisible(true);
    }

    if (window.scrollY < prevScrollVal.current || window.scrollY < 350) {
      setScrollDir('up');
    } else {
      setScrollDir('down');
    }
    if (Math.abs(window.scrollY - prevScrollVal.current) > 300) {
      prevScrollVal.current = window.scrollY;
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const intervalID = setTimeout(() => {
      if (scrollDir === 'down') {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setCheckHeader(!checkHeader);
    }, 200);
    return () => clearInterval(intervalID);
  }, [checkHeader, scrollDir]);

  const slideUp = {
    transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
    transition: "transform ease 0.25s"
  };

  useEffect(() => {
    setScrollDir("up");
  }, [headerHover.hovered]);

  return (
    <header>
      <div ref={headerHover.ref} className={classes.rootHeader}>
        <div className={classes.header} style={slideUp} >
          <Container size="xl" className={classes.inner}>
            <h1 className={classes.appTitle}>
              <Image src="/favicon.ico" alt="Nabil Mansour" width={48} height={48} />
              {!isPhone && "Medium to Markdown"}
            </h1>
            <div className={classes.headerActions}>
              <DeveloperAction />
              <GitHubAction />
              <ThemeToggle />
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
