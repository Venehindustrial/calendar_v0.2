import React from 'react';
import { Box, Text, Anchor } from 'grommet';

const Footer = () => (
  <Box tag="footer" justify="between" direction="row" pad="medium">
    <Text color="text">
      This site is powered by&nbsp;
      <Anchor href="https://www.gatsbyjs.com/" target='_blank' rel='noreferrer noopener'>Gatsby</Anchor>
    </Text>
    <Text color="text">
      Adapted by&nbsp;
      <Anchor href="http://www.venehsoftw.xyz/" target='_blank' rel='noreferrer noopener'>VeneHsoftw</Anchor>
    </Text>
  </Box>
);

export default Footer;
