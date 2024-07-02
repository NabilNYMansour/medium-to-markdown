"use client";

import { useEffect, useRef, useState } from 'react';
import { ActionIcon, Container, Flex } from '@mantine/core';
import { ThemeToggle } from '../components/ThemeToggle';
import classes from './Header.module.css';
import { useHover, useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import { AiFillGithub } from 'react-icons/ai';

export function Header() {
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const [checkHeader, setCheckHeader] = useState(true);
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');
  const prevScrollVal = useRef(0);

  const developerHover = useHover();
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
    transition: "transform ease 0.1s"
  };

  const fadeOut = {
    opacity: 0,
    transition: "opacity ease 0.1s"
  };

  const fadeIn = {
    opacity: 1,
    transition: "opacity ease 0.5s",
    transitionDelay: "1s"
  };

  useEffect(() => {
    setScrollDir("up");
  }, [headerHover.hovered]);

  return (
    <header>
      <div ref={headerHover.ref} className={classes.rootHeader}>
        <div className={classes.header} style={slideUp} >
          <Container size="xl" className={classes.inner}>
            <h1 style={developerHover.hovered && isPhone ? fadeOut : fadeIn} className={classes.appTitle}>
              Medium to Markdown
            </h1>

            <div className={classes.headerActions}>
              <div className={classes.developerContainer} ref={developerHover.ref}>
                <a className={classes.button} href="https://nabilmansour.com" target='_blank'>
                  <span className={classes.icon}>
                    <Image style={{ borderRadius: "500px" }} src="/tree.ico" alt="Nabil Mansour" width={25} height={25} />
                  </span>
                  <span className={classes.text}>Developer</span>
                </a>
              </div>
              <ActionIcon variant='default' size="xl" color='red'>
                <AiFillGithub size="2em" />
              </ActionIcon>
              <ThemeToggle />
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
