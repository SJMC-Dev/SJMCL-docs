import { theme } from "@chakra-ui/react";
import { Navbar } from "nextra-theme-docs";

export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      typesetting: 'article',
      timestamp: false,
      toc: false
    }
  },
  docs: {
    title: 'Docs',
    type: 'page'
  },
  dev: {
    title: 'Developer',
    type: 'page'
  },
  blog: {
    title: 'Blog',
    type: 'page',
    theme: {
      typesetting: 'article',
      toc: false
    }
  },
  about: {
    title: 'About',
    type: 'page',
    theme: {
      typesetting: 'article'
    }
  },
  community: {
    title: 'Community',
    type: 'page',
    theme: {
      typesetting: 'article',
      timestamp: false,
      toc: false
    }
  },
  download: {
    title: 'Download',
    type: 'page',
  }
}